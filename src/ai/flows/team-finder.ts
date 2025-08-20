// src/ai/flows/team-finder.ts
'use server';
/**
 * @fileOverview An AI-powered team finder that suggests team members with
 * complementary skills for a project, focusing on filling gaps in the existing
 * team's skillset.
 *
 * - teamFinder - A function that handles the team finding process.
 * - TeamFinderInput - The input type for the teamFinder function.
 * - TeamFinderOutput - The return type for the teamFinder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TeamFinderInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('The description of the project the team will be working on.'),
  existingTeamSkills: z
    .array(z.string())
    .describe(
      'A list of skills that the existing team members already possess.'
    ),
  availableUserProfiles: z
    .array(z.object({
      userId: z.string(),
      skills: z.array(z.string()),
    }))
    .describe(
      'A list of available user profiles, each containing a userId and a list of skills.'
    ),
  numberOfSuggestions: z
    .number()
    .default(3)
    .describe('The number of team member suggestions to provide.'),
});
export type TeamFinderInput = z.infer<typeof TeamFinderInputSchema>;

const TeamFinderOutputSchema = z.object({
  suggestedUserIds: z
    .array(z.string())
    .describe(
      'A list of user IDs that are suggested as team members, based on their skills complementing the existing team.'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief explanation of why each user was suggested, highlighting the skills they bring to the team.'
    ),
});
export type TeamFinderOutput = z.infer<typeof TeamFinderOutputSchema>;

export async function teamFinder(input: TeamFinderInput): Promise<TeamFinderOutput> {
  return teamFinderFlow(input);
}

const teamFinderPrompt = ai.definePrompt({
  name: 'teamFinderPrompt',
  input: {schema: TeamFinderInputSchema},
  output: {schema: TeamFinderOutputSchema},
  prompt: `You are an AI assistant designed to suggest team members with complementary skills for a given project.

Given the following project description:
{{projectDescription}}

And the existing team's skills:
{{#each existingTeamSkills}}- {{this}}\n{{/each}}

And a list of available user profiles:
{{#each availableUserProfiles}}- User ID: {{this.userId}}, Skills: {{#each this.skills}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}\n{{/each}}

Please suggest {{numberOfSuggestions}} user IDs that would best complement the existing team's skillset for this project. Explain your reasoning for each suggestion.

Output the user IDs in an array called suggestedUserIds and your reasoning in a string called reasoning.
`,
});

const teamFinderFlow = ai.defineFlow(
  {
    name: 'teamFinderFlow',
    inputSchema: TeamFinderInputSchema,
    outputSchema: TeamFinderOutputSchema,
  },
  async input => {
    const {output} = await teamFinderPrompt(input);
    return output!;
  }
);
