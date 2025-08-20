
'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addAnnouncementAction } from "@/lib/actions/manage-announcements"
import { Loader2, Send } from "lucide-react"
import { useTransition } from "react"


export function ManageAnnouncementsCard() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    startTransition(async () => {
      const result = await addAnnouncementAction(formData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Announcement has been posted.",
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Announcements</CardTitle>
        <CardDescription>Post updates for all participants.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="announcement-title">Title</Label>
            <Input id="announcement-title" name="title" placeholder="Important Update" required/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="announcement-content">Content</Label>
            <Textarea id="announcement-content" name="content" placeholder="What's the news?" required/>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
             Post Announcement
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
