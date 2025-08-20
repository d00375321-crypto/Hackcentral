
'use client';

import { AnnouncementsCard } from '@/components/dashboard/announcements-card';
import { MyTeamCard } from '@/components/dashboard/my-team-card';
import { ProjectSubmissionCard } from '@/components/dashboard/project-submission-card';
import { useAuth } from '@/hooks/use-auth';
import type { Team, UpcomingHackathon } from '@/lib/types';
import { getHackathonDetails } from '@/lib/firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JoinEventButton } from '@/components/events/join-event-button';
import { useRouter } from 'next/navigation';

export default function EventDashboardPage({ params }: { params: { eventId: string } }) {
  const { user, loading } = useAuth();
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [event, setEvent] = useState<UpcomingHackathon | null>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const { eventId } = params;
  const router = useRouter();

  const fetchEventAndTeamData = async () => {
    if (eventId) {
      setEventLoading(true);
      const eventDetails = await getHackathonDetails(eventId as string);
      setEvent(eventDetails);
      setEventLoading(false);
    }
  };

  useEffect(() => {
    fetchEventAndTeamData();
  }, [eventId]);

  const onTeamOrEventUpdate = () => {
    // This function will be called by child components to trigger a refresh
    fetchEventAndTeamData();
    router.refresh(); // Tells Next.js to re-fetch server components
  }

  const isUserAttendee = event && user ? event.attendees.some(a => a.uid === user.uid) : false;

  if (loading || eventLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Participant Dashboard</h1>
        <p>Please log in to see your dashboard.</p>
      </div>
    );
  }
  
  if (!event) {
     return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-semibold">Event Not Found</h1>
        <p>This event could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <Card className="overflow-hidden">
            <Image
                alt={event.name}
                className="aspect-[3/1] w-full object-cover"
                height="300"
                src={event.imageUrl}
                width="900"
                data-ai-hint="hackathon event banner"
              />
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle className="text-3xl">{event.name}</CardTitle>
                    <p className="text-muted-foreground pt-2">{event.date} &bull; {event.location}</p>
                </div>
                 <JoinEventButton eventId={event.id} attendees={event.attendees} onEventJoined={onTeamOrEventUpdate} />
            </CardHeader>
        </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {user && isUserAttendee && (
          <>
            <MyTeamCard userId={user.uid} eventId={eventId} onTeamUpdate={setCurrentTeam} onTeamChange={onTeamOrEventUpdate} />
            <ProjectSubmissionCard team={currentTeam} eventId={eventId}/>
          </>
        )}
      </div>
      <div className="grid grid-cols-1">
        <AnnouncementsCard />
      </div>
    </div>
  );
}
