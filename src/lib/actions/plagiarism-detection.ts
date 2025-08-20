'use server';

import { plagiarismDetection, PlagiarismDetectionInput, PlagiarismDetectionOutput } from '@/ai/flows/plagiarism-detection';
import { getProjects } from '@/lib/firebase/firestore';

interface ActionResult {
  success: boolean;
  data?: PlagiarismDetectionOutput;
  error?: string;
}

export async function checkPlagiarismAction(
  submissionText: string
): Promise<ActionResult> {
  if (!submissionText) {
      return { success: false, error: 'Submission text is required.' };
  }

  try {
    const projects = await getProjects();
    const existingProjectTexts = projects.map(p => `Project Name: ${p.name}\n\n${p.description}`);

    const input: PlagiarismDetectionInput = {
      submissionText,
      existingProjectTexts,
    };
    
    const result = await plagiarismDetection(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in plagiarismDetection action:', error);
    return { success: false, error: 'An unexpected error occurred while checking for plagiarism.' };
  }
}
