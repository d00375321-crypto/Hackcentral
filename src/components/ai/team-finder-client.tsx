'use client';

import { useState, useTransition, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { findTeamMembersAction } from '@/lib/actions/team-finder';
import type { TeamFinderOutput } from '@/ai/flows/team-finder';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users } from 'lucide-react';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { getUsers } from '@/lib/firebase/firestore';


export function TeamFinderClient() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<TeamFinderOutput | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
      const allUsers = await getUsers();
      setUsers(allUsers);
    }
    fetchUsers();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const projectDescription = formData.get('projectDescription') as string;
    const existingTeamSkills = (formData.get('existingTeamSkills') as string)
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    setResult(null);

    startTransition(async () => {
      const { success, data, error } = await findTeamMembersAction(projectDescription, existingTeamSkills);
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

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="projectDescription">Project Description</Label>
          <Textarea
            id="projectDescription"
            name="projectDescription"
            placeholder="e.g., A web app for managing hackathon projects..."
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="existingTeamSkills">Existing Team Skills (comma-separated)</Label>
          <Input
            id="existingTeamSkills"
            name="existingTeamSkills"
            placeholder="e.g., React, Node.js"
            required
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
          Find Members
        </Button>
      </form>

      {isPending && (
        <div className="space-y-4">
          <p>Searching for candidates...</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 rounded-lg border bg-card p-4">
          <h3 className="font-semibold">Suggested Team Members</h3>
          <p className="text-sm text-muted-foreground">{result.reasoning}</p>
          <div className="space-y-3 pt-2">
            {result.suggestedUserIds.map(userId => {
              const user = users.find(u => u.id === userId);
              if (!user) return null;
              return (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded-md border">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} data-ai-hint="person" />
                    <AvatarFallback><Users /></AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.skills.map(skill => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
