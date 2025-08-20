'use server';

import { teamFinder, TeamFinderInput, TeamFinderOutput } from '@/ai/flows/team-finder';
import { getUsers } from '@/lib/firebase/firestore';

interface ActionResult {
  success: boolean;
  data?: TeamFinderOutput;
  error?: string;
}

export async function findTeamMembersAction(
  projectDescription: string,
  existingTeamSkills: string[]
): Promise<ActionResult> {
  if (!projectDescription || !existingTeamSkills) {
      return { success: false, error: 'Project description and skills are required.' };
  }
  
  try {
    const users = await getUsers();
    const availableUserProfiles = users.map(u => ({ userId: u.id, skills: u.skills }));

    const input: TeamFinderInput = {
      projectDescription,
      existingTeamSkills,
      availableUserProfiles,
      numberOfSuggestions: 3,
    };
    const result = await teamFinder(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in teamFinder action:', error);
    return { success: false, error: 'An unexpected error occurred while finding team members.' };
  }
}
