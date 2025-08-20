

'use server';

import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import type { UpcomingHackathon } from "../types";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  data?: UpcomingHackathon;
  error?: string;
}

export async function addEventAction(
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get('name') as string;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim());

  if (!name || !date || !location || !imageUrl || !tags) {
      return { success: false, error: 'All fields are required.' };
  }

  try {
    const newEvent: Omit<UpcomingHackathon, 'id'> = {
        name,
        date,
        location,
        imageUrl,
        tags,
        attendees: [], // Start with no attendees
    };
    
    const docRef = await addDoc(collection(db, 'upcomingHackathons'), newEvent);

    const createdEvent: UpcomingHackathon = {
        id: docRef.id,
        ...newEvent
    }

    revalidatePath('/');
    revalidatePath('/organizer');
    revalidatePath('/participant/events');

    return { success: true, data: createdEvent };

  } catch (error) {
    console.error('Error in addEventAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to add event: ${errorMessage}` };
  }
}


export async function updateEventDetailsAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const eventDetailsRef = doc(db, 'config', 'eventDetails');

    const dataToUpdate = {
        theme: formData.get('theme') as string,
        tracks: (formData.get('tracks') as string).split(',').map(t => t.trim()),
        rules: formData.get('rules') as string,
        timeline: formData.get('timeline') as string,
        prizes: formData.get('prizes') as string,
        sponsors: (formData.get('sponsors') as string).split(',').map(s => s.trim()),
    };

    await updateDoc(eventDetailsRef, dataToUpdate);

    revalidatePath('/organizer');

    return { success: true };
  } catch (error) {
    console.error('Error in updateEventDetailsAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to update event details: ${errorMessage}` };
  }
}
