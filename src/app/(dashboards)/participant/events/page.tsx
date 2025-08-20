
import Link from "next/link";
import { Calendar, MapPin, Search, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getUpcomingHackathons } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";

export default async function EventsPage() {
  const upcomingHackathons = await getUpcomingHackathons();

  return (
    <div className="space-y-6">
       <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in-up [animation-delay:200ms]">
           <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Upcoming Hackathons</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore events from around the globe.
            </p>
          </div>
           <div className="w-full max-w-lg">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
               <Input placeholder="Search for events..." className="pl-10 h-12 text-lg" />
             </div>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingHackathons.map((hackathon) => (
            <Card key={hackathon.id} className="h-full flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 animate-fade-in-up" style={{animationDelay: `${200 + parseInt(hackathon.id.replace('event-','')) * 100}ms`}}>
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
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{hackathon.date}</span>
                </div>
                 <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{hackathon.location}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
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
                     {hackathon.attendees.length === 0 && (
                        <p className="text-xs text-muted-foreground">No one has joined yet.</p>
                    )}
                </div>
                <Button asChild>
                  <Link href={`/participant/events/${hackathon.id}`}>
                    View Event <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
    </div>
  );
}
