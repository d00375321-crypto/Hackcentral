
'use server';

import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase/config';
import type { Attendee } from '@/lib/types';

export async function joinEventAction(eventId: string, attendee: Attendee): Promise<{success: boolean, error?: string}> {
    if (!eventId || !attendee) {
        return { success: false, error: "Event ID and attendee information are required." };
    }
    const eventRef = doc(db, 'upcomingHackathons', eventId);
    try {
        await updateDoc(eventRef, {
            attendees: arrayUnion(attendee)
        });
        revalidatePath(`/participant/events/${eventId}`);
        revalidatePath('/participant/my-events');
        revalidatePath('/participant');
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return { success: false, error: errorMessage };
    }
}
