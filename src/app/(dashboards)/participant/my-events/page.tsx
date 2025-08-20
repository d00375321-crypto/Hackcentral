
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getJoinedEvents } from '@/lib/firebase/firestore';
import type { UpcomingHackathon } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, ArrowRight } from 'lucide-react';

export default function MyEventsPage() {
  const { user, loading: authLoading } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState<UpcomingHackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      async function fetchJoinedEvents() {
        setLoading(true);
        const events = await getJoinedEvents(user.uid);
        setJoinedEvents(events);
        setLoading(false);
      }
      fetchJoinedEvents();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-semibold">My Events</h1>
        <p>Please log in to see the events you have joined.</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-semibold">My Events</h1>
         <Button asChild variant="outline">
            <Link href="/participant/events">
                <PlusCircle className="mr-2 h-4 w-4" /> Find More Events
            </Link>
         </Button>
      </div>
      {joinedEvents.length === 0 ? (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>No Events Joined</CardTitle>
            <CardDescription>You haven't joined any events yet. Find one to get started!</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/participant/events">
                <PlusCircle className="mr-2 h-4 w-4" /> Find Events
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {joinedEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>{event.date} - {event.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>You have successfully joined this event. You can now form a team and submit your project.</p>
                <div className="mt-4 flex gap-2">
                    <Button asChild>
                        <Link href={`/participant/events/${event.id}`}>
                            Go to Event Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
