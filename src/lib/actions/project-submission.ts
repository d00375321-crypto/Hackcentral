
'use server';

import { plagiarismDetection, PlagiarismDetectionInput, PlagiarismDetectionOutput } from '@/ai/flows/plagiarism-detection';
import { getProjects } from '@/lib/firebase/firestore';
import type { Project } from '@/lib/types';
import { collection, addDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  success: boolean;
  data?: PlagiarismDetectionOutput;
  error?: string;
}

export async function submitProjectAction(
  formData: FormData,
  teamId: string,
  eventId: string,
): Promise<ActionResult> {
  const projectName = formData.get('projectName') as string;
  const projectDescription = formData.get('projectDescription') as string;
  const githubUrl = formData.get('githubUrl') as string;
  const videoUrl = formData.get('videoUrl') as string;

  if (!projectName || !projectDescription) {
      return { success: false, error: 'Project name and description are required.' };
  }
  if (!teamId || !eventId) {
      return { success: false, error: 'Team and Event information is missing.'}
  }
  
  const projects = await getProjects();
  const existingProjectTexts = projects.map(p => `Project Name: ${p.name}\\n\\n${p.description}`);

  try {
    const plagiarismInput: PlagiarismDetectionInput = {
      submissionText: `Project Name: ${projectName}\\n\\n${projectDescription}`,
      existingProjectTexts,
    };
    
    const plagiarismResult = await plagiarismDetection(plagiarismInput);

    const batch = writeBatch(db);

    const newProjectRef = doc(collection(db, 'projects'));
    const newProject: Omit<Project, 'id'> = {
        name: projectName,
        description: projectDescription,
        githubUrl,
        videoUrl,
        submittedAt: new Date().toISOString(),
        eventId: eventId,
    };
    batch.set(newProjectRef, newProject);

    const teamRef = doc(db, 'teams', teamId);
    batch.update(teamRef, { projectId: newProjectRef.id });

    await batch.commit();
    
    revalidatePath(`/participant/events/${eventId}`);

    return { success: true, data: plagiarismResult };

  } catch (error) {
    console.error('Error in submitProjectAction:', error);
    return { success: false, error: 'An unexpected error occurred during project submission.' };
  }
}
