
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getTeamsForEvent, getTeamMembers } from "@/lib/firebase/firestore";
import { createTeamAction, joinTeamAction, leaveTeamAction } from "@/lib/actions/team-actions";
import { Loader2, LogOut, User, UserPlus } from "lucide-react";
import type { User as UserType, Team } from '@/lib/types';
import { useEffect, useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";


export function MyTeamCard({ userId, eventId, onTeamUpdate, onTeamChange }: { userId: string, eventId: string, onTeamUpdate: (team: Team | null) => void, onTeamChange: () => void }) {
  const [loading, setLoading] = useState(true);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<UserType[]>([]);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [isCreateTeamOpen, setCreateTeamOpen] = useState(false);
  const [isJoinTeamOpen, setJoinTeamOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  async function fetchTeamData() {
    if (!userId || !eventId) return;

    setLoading(true);
    
    const allEventTeams = await getTeamsForEvent(eventId);
    const userTeam = allEventTeams.find(t => t.memberIds.includes(userId));
    
    setAvailableTeams(allEventTeams);

    if (userTeam) {
      setMyTeam(userTeam);
      onTeamUpdate(userTeam);
      const members = await getTeamMembers(userTeam.id);
      setTeamMembers(members);
    } else {
      setMyTeam(null);
      onTeamUpdate(null);
      setTeamMembers([]);
    }
    
    setLoading(false);
  }

  useEffect(() => {
    fetchTeamData();
  }, [userId, eventId]);

  const handleCreateTeam = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const teamName = formData.get('teamName') as string;

    startTransition(async () => {
      const { success, error } = await createTeamAction(teamName, userId, eventId);
      if (success) {
        toast({ title: "Team created successfully!" });
        onTeamChange();
        setCreateTeamOpen(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: error });
      }
    });
  }

  const handleLeaveTeam = () => {
    if (!myTeam) return;
    startTransition(async () => {
       const { success, error } = await leaveTeamAction(userId, myTeam.id, eventId);
       if (success) {
        toast({ title: "You have left the team." });
        onTeamChange();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: error });
      }
    })
  }

  const handleJoinTeam = (teamId: string) => {
    startTransition(async () => {
      const { success, error } = await joinTeamAction(userId, teamId, eventId);
      if (success) {
        toast({ title: "Successfully joined team!" });
        onTeamChange();
        setJoinTeamOpen(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: error });
      }
    });
  }
  
  if (loading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Team</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
            </CardContent>
        </Card>
    )
  }

  if (!myTeam) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Team</CardTitle>
          <CardDescription>You are not currently part of a team for this event.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-2">
          {/* Create Team Dialog */}
          <Dialog open={isCreateTeamOpen} onOpenChange={setCreateTeamOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Create a Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new team</DialogTitle>
                <DialogDescription>
                  Choose a name for your team to get started.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTeam}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teamName" className="text-right">
                      Team Name
                    </Label>
                    <Input
                      id="teamName"
                      name="teamName"
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Create Team
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Join Team Dialog */}
          <Dialog open={isJoinTeamOpen} onOpenChange={setJoinTeamOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">Join a Team</Button>
            </DialogTrigger>
            <DialogContent>
                 <DialogHeader>
                    <DialogTitle>Join an existing team</DialogTitle>
                    <DialogDescription>
                        Browse available teams and click to join.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72">
                    <div className="space-y-2">
                        {availableTeams.length > 0 ? availableTeams.map(team => (
                            <div key={team.id} className="flex items-center justify-between p-2 border rounded-md">
                                <div>
                                    <p className="font-semibold">{team.name}</p>
                                    <p className="text-sm text-muted-foreground">{team.memberIds.length} member(s)</p>
                                </div>
                                <Button size="sm" onClick={() => handleJoinTeam(team.id)} disabled={isPending || team.memberIds.includes(userId)}>
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Join'}
                                </Button>
                            </div>
                        )) : <p className="text-sm text-center text-muted-foreground py-4">No teams have been created for this event yet.</p>}
                    </div>
                </ScrollArea>
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{myTeam.name}</CardTitle>
        <CardDescription>Your team for this event.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Members</h3>
          <div className="space-y-3">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatarUrl} data-ai-hint="person" />
                  <AvatarFallback><User/></AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{member.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {member.skills.map(skill => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button className="flex-1" variant="outline" disabled>
            <UserPlus className="mr-2 h-4 w-4" /> Invite Member
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon" onClick={handleLeaveTeam} disabled={isPending}>
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <LogOut className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Leave Team</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
