
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { addEventAction } from "@/lib/actions/manage-events";
import { getUpcomingHackathons } from "@/lib/firebase/firestore";
import type { UpcomingHackathon } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

export function ManageEventsCard() {
    const [events, setEvents] = useState<UpcomingHackathon[]>([]);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        async function fetchEvents() {
            const upcoming = await getUpcomingHackathons();
            setEvents(upcoming);
        }
        fetchEvents();
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        startTransition(async () => {
            const result = await addEventAction(formData);
            if (result.success && result.data) {
                setEvents(prevEvents => [...prevEvents, result.data as UpcomingHackathon]);
                toast({
                    title: 'Event Added',
                    description: `Successfully added "${result.data.name}".`,
                });
                setIsDialogOpen(false);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: result.error,
                });
            }
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Events</CardTitle>
                    <CardDescription>Add, edit, or remove upcoming hackathons.</CardDescription>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Add New Event</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the new hackathon event.
                        </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" name="name" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">Date</Label>
                                <Input id="date" name="date" className="col-span-3" placeholder="e.g., December 1-3, 2024" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="location" className="text-right">Location</Label>
                                <Input id="location" name="location" className="col-span-3" placeholder="e.g., Online" required />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                                <Input id="imageUrl" name="imageUrl" className="col-span-3" defaultValue="https://placehold.co/400x225.png" required />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="tags" className="text-right">Tags</Label>
                                <Input id="tags" name="tags" className="col-span-3" placeholder="e.g., AI, Web, Mobile" required />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Adding..." : "Add Event"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.map((event) => (
                    <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.location}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
