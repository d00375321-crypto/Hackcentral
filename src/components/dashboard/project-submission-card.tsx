
'use client';

import { useState, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Github, Upload, Video, Loader2, CheckCircle2 } from "lucide-react";
import { submitProjectAction } from '@/lib/actions/project-submission';
import { useToast } from '@/hooks/use-toast';
import type { PlagiarismDetectionOutput } from '@/ai/flows/plagiarism-detection';
import type { Team } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

export function ProjectSubmissionCard({ team, eventId }: { team: Team | null, eventId: string }) {
  const [isPending, startTransition] = useTransition();
  const [plagiarismResult, setPlagiarismResult] = useState<PlagiarismDetectionOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!team) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be in a team to submit a project.',
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    
    setPlagiarismResult(null);

    startTransition(async () => {
      const result = await submitProjectAction(formData, team.id, eventId);
      if (result.success && result.data) {
        setPlagiarismResult(result.data);
        toast({
          title: 'Project Submitted Successfully',
          description: `Plagiarism check complete. Similarity score: ${Math.round(result.data.similarityScore * 100)}%`,
        });
        // You might want to refresh team data here to get the projectId
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    });
  };

  if (!team) {
     return (
        <Card>
          <CardHeader>
            <CardTitle>Project Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Team Found</AlertTitle>
              <AlertDescription>
                You must create or join a team before you can submit a project for this event.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
    )
  }

  if (team.projectId) {
     return (
        <Card>
          <CardHeader>
            <CardTitle>Project Submission</CardTitle>
          </CardHeader>
          <CardContent>
             <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Project Submitted</AlertTitle>
              <AlertDescription>
                Your team has already submitted a project for this event.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
    )
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Submission</CardTitle>
        <CardDescription>Submit your project for judging. A plagiarism check will be run automatically.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input id="projectName" name="projectName" placeholder="AI-Powered Health Assistant" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Description</Label>
            <Textarea id="projectDescription" name="projectDescription" placeholder="Describe your amazing project..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub Repository</Label>
            <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="githubUrl" name="githubUrl" className="pl-10" placeholder="https://github.com/..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video Demo</Label>
             <div className="relative">
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="videoUrl" name="videoUrl" className="pl-10" placeholder="https://youtube.com/..." />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="document">Documentation</Label>
            <Input id="document" name="document" type="file" />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
               <>
                <Upload className="mr-2 h-4 w-4" /> Submit Project
               </>
            )}
          </Button>
        </form>
         {plagiarismResult && (
          <div className="mt-4 space-y-2 rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Plagiarism Check Complete</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Similarity Score: <span className="font-bold">{Math.round(plagiarismResult.similarityScore * 100)}%</span>
            </p>
            {plagiarismResult.isPlagiarismDetected && plagiarismResult.flaggedProjectIndices.length > 0 && (
                <p className="text-sm text-destructive">
                    Potential similarity found with {plagiarismResult.flaggedProjectIndices.length} other project(s).
                </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
