'use server';

/**
 * @fileOverview An AI agent that summarizes an API based on its OpenAPI specification.
 *
 * - summarizeApi - A function that handles the API summarization process.
 * - SummarizeApiInput - The input type for the summarizeApi function.
 * - SummarizeApiOutput - The return type for the summarizeApi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeApiInputSchema = z.object({
  apiSpecification: z
    .string()
    .describe('The OpenAPI specification of the API.'),
});
export type SummarizeApiInput = z.infer<typeof SummarizeApiInputSchema>;

const SummarizeApiOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the API.'),
});
export type SummarizeApiOutput = z.infer<typeof SummarizeApiOutputSchema>;

export async function summarizeApi(input: SummarizeApiInput): Promise<SummarizeApiOutput> {
  return summarizeApiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeApiPrompt',
  input: {schema: SummarizeApiInputSchema},
  output: {schema: SummarizeApiOutputSchema},
  prompt: `You are an expert API summarizer. You will be given the OpenAPI specification of an API and you will generate a concise summary of the API.

API Specification: {{{apiSpecification}}} `,
});

const summarizeApiFlow = ai.defineFlow(
  {
    name: 'summarizeApiFlow',
    inputSchema: SummarizeApiInputSchema,
    outputSchema: SummarizeApiOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
