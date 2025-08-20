
'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { updateEventDetailsAction } from "@/lib/actions/manage-events"
import type { EventDetails } from "@/lib/types"
import { Loader2, Save } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { getEventDetails } from "@/lib/firebase/firestore";


export function EventConfigForm() {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

   useEffect(() => {
    async function fetchDetails() {
      const details = await getEventDetails();
      setEventDetails(details);
      setLoading(false);
    }
    fetchDetails();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    startTransition(async () => {
      const result = await updateEventDetailsAction(formData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Event details have been updated.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    });
  }

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Event Configuration</CardTitle>
                <CardDescription>Update the details for the hackathon.</CardDescription>
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
        <Card>
            <CardHeader>
                <CardTitle>Event Configuration</CardTitle>
                <CardDescription>Update the details for the hackathon.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Event details not found. Please seed the database.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Configuration</CardTitle>
        <CardDescription>Update the details for the hackathon.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="theme">Theme</Label>
            <Input id="theme" name="theme" defaultValue={eventDetails.theme} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tracks">Tracks (comma-separated)</Label>
            <Input id="tracks" name="tracks" defaultValue={eventDetails.tracks.join(', ')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rules">Rules</Label>
            <Textarea id="rules" name="rules" defaultValue={eventDetails.rules} rows={4} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Textarea id="timeline" name="timeline" defaultValue={eventDetails.timeline} rows={3} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prizes">Prizes</Label>
            <Input id="prizes" name="prizes" defaultValue={eventDetails.prizes} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sponsors">Sponsors (comma-separated)</Label>
            <Input id="sponsors" name="sponsors" defaultValue={eventDetails.sponsors.join(', ')} />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
