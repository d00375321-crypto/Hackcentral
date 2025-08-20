'use server';

/**
 * @fileOverview AI-based project plagiarism/similarity detection flow.
 *
 * - plagiarismDetection - A function that handles the plagiarism detection process.
 * - PlagiarismDetectionInput - The input type for the plagiarismDetection function.
 * - PlagiarismDetectionOutput - The return type for the plagiarismDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlagiarismDetectionInputSchema = z.object({
  submissionText: z
    .string()
    .describe('The text content of the project submission.'),
  existingProjectTexts: z
    .array(z.string())
    .describe('An array of text contents from existing projects.'),
});
export type PlagiarismDetectionInput = z.infer<typeof PlagiarismDetectionInputSchema>;

const PlagiarismDetectionOutputSchema = z.object({
  isPlagiarismDetected: z
    .boolean()
    .describe('Whether plagiarism is detected in the submission.'),
  similarityScore: z
    .number()
    .describe(
      'A score (0-1) indicating the similarity between the submission and existing projects, with 1 being identical.'
    ),
  flaggedProjectIndices: z
    .array(z.number())
    .describe(
      'An array of indices indicating which existing projects the submission is similar to.'
    ),
});
export type PlagiarismDetectionOutput = z.infer<typeof PlagiarismDetectionOutputSchema>;

export async function plagiarismDetection(
  input: PlagiarismDetectionInput
): Promise<PlagiarismDetectionOutput> {
  return plagiarismDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'plagiarismDetectionPrompt',
  input: {schema: PlagiarismDetectionInputSchema},
  output: {schema: PlagiarismDetectionOutputSchema},
  prompt: `You are an AI plagiarism detection tool. Your task is to analyze a project submission and compare it against a set of existing projects to identify potential plagiarism.

Submission Text: {{{submissionText}}}

Existing Projects:
{{#each existingProjectTexts}}
Project {{@index}}: {{{this}}}
{{/each}}

Based on your analysis, determine:
1. isPlagiarismDetected: Whether the submission is substantially similar to any of the existing projects.
2. similarityScore: A score between 0 and 1 indicating the highest degree of similarity found, where 1 means identical.
3. flaggedProjectIndices: An array containing the indices of the existing projects that the submission is similar to.

Ensure your output is a JSON object that conforms to the following schema:
${JSON.stringify(PlagiarismDetectionOutputSchema.describe())}

Remember to evaluate similarity based on content, structure, and style.

Output: {
  "isPlagiarismDetected": ,
  "similarityScore": ,
  "flaggedProjectIndices":
}
`,
});

const plagiarismDetectionFlow = ai.defineFlow(
  {
    name: 'plagiarismDetectionFlow',
    inputSchema: PlagiarismDetectionInputSchema,
    outputSchema: PlagiarismDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
