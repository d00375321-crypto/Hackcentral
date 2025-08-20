
'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getEventDetails } from "@/lib/firebase/firestore";
import { Calendar, DollarSign, Flag, GanttChartSquare, Gem, Loader2, Scale } from "lucide-react";
import type { EventDetails } from "@/lib/types";
import { useEffect, useState } from "react";

const DetailItem = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <div className="text-muted-foreground">{icon}</div>
    <div>
      <p className="font-medium">{label}</p>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  </div>
);

export function EventDetailsCard() {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      const details = await getEventDetails();
      setEventDetails(details);
      setLoading(false);
    }
    fetchDetails();
  }, []);

  if (loading) {
     return (
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </CardContent>
        </Card>
     )
  }

  if (!eventDetails) {
    return (
         <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Event details could not be loaded.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
            <>
                <DetailItem icon={<Flag className="h-5 w-5" />} label="Theme">
                <p>{eventDetails.theme}</p>
                </DetailItem>
                <Separator />
                <DetailItem icon={<GanttChartSquare className="h-5 w-5" />} label="Tracks">
                    <div className="flex flex-wrap gap-1">
                        {eventDetails.tracks.map((track) => <Badge key={track} variant="secondary">{track}</Badge>)}
                    </div>
                </DetailItem>
                <Separator />
                <DetailItem icon={<Scale className="h-5 w-5" />} label="Rules">
                <p>{eventDetails.rules}</p>
                </DetailItem>
                <Separator />
                <DetailItem icon={<Calendar className="h-5 w-5" />} label="Timeline">
                <p>{eventDetails.timeline}</p>
                </DetailItem>
                <Separator />
                <DetailItem icon={<DollarSign className="h-5 w-5" />} label="Prizes">
                <p>{eventDetails.prizes}</p>
                </DetailItem>
                <Separator />
                <DetailItem icon={<Gem className="h-5 w-5" />} label="Sponsors">
                    <div className="flex flex-wrap gap-2">
                        {eventDetails.sponsors.map((sponsor) => <span key={sponsor} className="font-semibold">{sponsor}</span>)}
                    </div>
                </DetailItem>
            </>
      </CardContent>
    </Card>
  )
}
