
'use server';

import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import type { Announcement } from "../types";
import { revalidatePath } from "next/cache";
import { auth } from "../firebase/config";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function addAnnouncementAction(
  formData: FormData
): Promise<ActionResult> {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !content) {
      return { success: false, error: 'Title and content are required.' };
  }

  // Note: In a real app, you'd get the author from the authenticated user session.
  // We'll use 'Admin' for now.
  const author = auth.currentUser?.displayName || 'Admin';

  try {
    const newAnnouncement: Omit<Announcement, 'id'> = {
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
    };
    
    await addDoc(collection(db, 'announcements'), newAnnouncement);
    
    revalidatePath('/participant');

    return { success: true };

  } catch (error) {
    console.error('Error in addAnnouncementAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to add announcement: ${errorMessage}` };
  }
}
