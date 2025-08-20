
'use client';

import { useEffect, useState } from 'react';
import { Bell, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnnouncements } from "@/lib/firebase/firestore";
import { formatDistanceToNow } from 'date-fns';
import type { Announcement } from '@/lib/types';

export function AnnouncementsCard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      const fetchedAnnouncements = await getAnnouncements();
      // sort by date descending
      fetchedAnnouncements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAnnouncements(fetchedAnnouncements);
      setLoading(false);
    }

    fetchAnnouncements();
  }, []);


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Announcements</CardTitle>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex items-center justify-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                  <Bell className="h-4 w-4 text-secondary-foreground" />
                </div>
                <div className="grid gap-1">
                  <p className="font-medium">{announcement.title}</p>
                  <p className="text-sm text-muted-foreground">{announcement.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })} by {announcement.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
