
'use client';

import { useAuth } from "@/hooks/use-auth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import type { Attendee } from "@/lib/types";
import { useTransition } from "react";
import { Loader2, PartyPopper, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { joinEventAction } from "@/lib/actions/event-actions";


interface JoinEventButtonProps {
    eventId: string;
    attendees: Attendee[];
    onEventJoined: () => void;
}

export function JoinEventButton({ eventId, attendees, onEventJoined }: JoinEventButtonProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    if (loading) {
        return <Button disabled>Loading...</Button>
    }

    if (!user) {
        return (
            <Button onClick={() => router.push('/login')}>
                Login to Join
            </Button>
        )
    }
    
    const isAlreadyJoined = attendees.some(a => a.uid === user.uid);

    const handleJoin = () => {
        if (!user) {
            router.push('/login');
            return;
        }

        startTransition(async () => {
           const { success, error } = await joinEventAction(eventId, {
                uid: user.uid,
                name: user.displayName || 'Anonymous',
                avatarUrl: user.photoURL || 'https://placehold.co/100x100.png'
            });

            if (success) {
                onEventJoined();
                toast({
                    title: "Success!",
                    description: "You have joined the event.",
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Error",
                    description: `Failed to join event: ${error}`,
                });
            }
        });
    }

    if (isAlreadyJoined) {
        return <Button disabled variant="secondary"><UserCheck className="mr-2 h-4 w-4"/> Joined</Button>
    }

    return (
        <Button onClick={handleJoin} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <PartyPopper className="mr-2 h-4 w-4" /> Join Event
        </Button>
    )
}
