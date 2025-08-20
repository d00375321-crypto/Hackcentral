
'use server';

import { doc, runTransaction, setDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase/config';
import type { Team } from '@/lib/types';


export async function createTeamAction(teamName: string, userId: string, eventId: string): Promise<{success: boolean, error?: string}> {
    if (!teamName || !userId || !eventId) {
        return { success: false, error: "Team name, user ID, and event ID are required."};
    }
    try {
        const newTeamRef = doc(collection(db, "teams"));
        await setDoc(newTeamRef, {
            name: teamName,
            memberIds: [userId],
            eventId: eventId,
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

export async function leaveTeamAction(userId: string, teamId: string, eventId: string): Promise<{success: boolean, error?: string}> {
     if (!userId || !teamId || !eventId) {
        return { success: false, error: "User ID, team ID, and event ID are required."};
    }
    const teamRef = doc(db, 'teams', teamId);
    try {
        await runTransaction(db, async (transaction) => {
            const teamDoc = await transaction.get(teamRef);
            if (!teamDoc.exists()) {
                throw new Error("Team does not exist!");
            }
            const teamData = teamDoc.data() as Team;
            const updatedMemberIds = teamData.memberIds.filter(id => id !== userId);

            if (updatedMemberIds.length === 0) {
                transaction.delete(teamRef);
            } else {
                transaction.update(teamRef, { memberIds: updatedMemberIds });
            }
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


export async function joinTeamAction(userId: string, teamId: string, eventId: string): Promise<{success: boolean, error?: string}> {
     if (!userId || !teamId || !eventId) {
        return { success: false, error: "User ID, team ID, and event ID are required."};
    }
    const teamRef = doc(db, "teams", teamId);
    try {
        await updateDoc(teamRef, { memberIds: arrayUnion(userId) });
        revalidatePath(`/participant/events/${eventId}`);
        revalidatePath('/participant/my-events');
        revalidatePath('/participant');
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return { success: false, error: errorMessage };
    }
}
