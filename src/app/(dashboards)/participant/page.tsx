
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { getJoinedEvents } from '@/lib/firebase/firestore';
import type { UpcomingHackathon } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, PartyPopper } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnnouncementsCard } from '@/components/dashboard/announcements-card';


export default function ParticipantPage() {
  const { user, loading: authLoading } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState<UpcomingHackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      async function fetchJoinedEvents() {
        // No need to set loading to true here, as it's already true by default
        const events = await getJoinedEvents(user.uid);
        setJoinedEvents(events);
        setLoading(false);
      }
      fetchJoinedEvents();
    } else if (!authLoading) {
      // If there's no user and auth is not loading, we can stop loading.
      setLoading(false);
    }
  }, [user, authLoading]);

  // Always show a loading state on the initial render and while fetching data.
  // This prevents the hydration mismatch.
  if (loading || authLoading) {
    return (
        <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Participant Dashboard</h1>
        <p>Please log in to see your dashboard.</p>
         <Button asChild>
            <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Dashboard</h1>
      </div>

      {joinedEvents.length === 0 ? (
         <div className="grid grid-cols-1">
         <div className="p-6 rounded-lg bg-card border flex flex-col items-center text-center">
            <PartyPopper className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Ready to hack?</h2>
            <p className="text-muted-foreground mb-4">Find your next challenge and start building something amazing.</p>
            <Button asChild>
                <Link href="/participant/events">
                    Browse Upcoming Events
                </Link>
            </Button>
        </div>
      </div>
      ) : (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">My Active Events</h2>
            <div className="grid gap-6 md:grid-cols-2">
            {joinedEvents.map((hackathon) => (
                <Card key={hackathon.id} className="h-full flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <Image
                    alt={hackathon.name}
                    className="aspect-[16/9] w-full object-cover"
                    height="225"
                    src={hackathon.imageUrl}
                    width="400"
                    data-ai-hint="hackathon event cover"
                />
                <CardHeader>
                    <CardTitle className="text-xl">{hackathon.name}</CardTitle>
                    <CardDescription>{hackathon.date} &bull; {hackathon.location}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2">
                        {hackathon.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
                    <div className="flex -space-x-2 overflow-hidden">
                        {hackathon.attendees.map((attendee, index) => (
                        <Avatar key={index}>
                            <AvatarImage src={attendee.avatarUrl} data-ai-hint="person"/>
                            <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        ))}
                    </div>
                    <Button asChild>
                    <Link href={`/participant/events/${hackathon.id}`}>
                        Go to Event <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    </Button>
                </CardFooter>
                </Card>
            ))}
            </div>
        </div>
      )}

      <div className="grid grid-cols-1">
        <AnnouncementsCard />
      </div>
    </div>
  );
}
