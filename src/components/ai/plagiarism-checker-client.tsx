'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { checkPlagiarismAction } from '@/lib/actions/plagiarism-detection';
import type { PlagiarismDetectionOutput } from '@/ai/flows/plagiarism-detection';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2, FileSearch, Loader2 } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Project } from '@/lib/types';

export function PlagiarismCheckerClient() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PlagiarismDetectionOutput | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you would fetch this from your server/API
    // For the plagiarism checker, we get it via a server action, so this is illustrative
    // of how you might fetch data on the client.
    async function fetchProjects() {
        // This is a placeholder, in the real implementation the action fetches the projects.
        // To avoid fetching all projects on client load, we rely on the server action.
    }
    fetchProjects();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submissionText = formData.get('submissionText') as string;

    setResult(null);

    startTransition(async () => {
      const { success, data, error } = await checkPlagiarismAction(submissionText);
      if (success && data) {
        setResult(data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error,
        });
      }
    });
  };
  
  const similarityPercentage = result ? Math.round(result.similarityScore * 100) : 0;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="submissionText">Submission Text</Label>
          <Textarea
            id="submissionText"
            name="submissionText"
            placeholder="Paste the project's description, README, or other relevant text here..."
            required
            rows={10}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSearch className="mr-2 h-4 w-4" />}
          Check for Plagiarism
        </Button>
      </form>

      {isPending && (
        <div className="space-y-4">
          <p>Analyzing text...</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 rounded-lg border bg-card p-4">
          <h3 className="font-semibold">Analysis Complete</h3>
          
          <div className={`flex items-center gap-2 p-3 rounded-md ${result.isPlagiarismDetected ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600'}`}>
            {result.isPlagiarismDetected ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            <span className="font-medium">
              {result.isPlagiarismDetected ? 'Potential Plagiarism Detected' : 'No Significant Similarity Found'}
            </span>
          </div>

          <div>
            <Label>Highest Similarity Score</Label>
            <div className="flex items-center gap-4 mt-1">
                <Progress value={similarityPercentage} className="w-[60%]" />
                <span className="font-bold text-lg">{similarityPercentage}%</span>
            </div>
          </div>

          {result.isPlagiarismDetected && result.flaggedProjectIndices.length > 0 && projects.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Similar Projects:</h4>
              <div className="grid gap-3">
                {result.flaggedProjectIndices.map(index => {
                  const project = projects[index];
                  if (!project) return null;
                  return (
                    <Card key={project.id}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{project.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
