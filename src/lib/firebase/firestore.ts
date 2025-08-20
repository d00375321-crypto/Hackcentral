

import { collection, getDocs, doc, getDoc, query, where, updateDoc, arrayUnion, addDoc, writeBatch, deleteField, runTransaction, DocumentReference, setDoc, arrayRemove } from 'firebase/firestore';
import { db } from './config';
import type { User, Team, Project, Announcement, EventDetails, UpcomingHackathon, Attendee } from '../types';
import type { User as FirebaseUser } from 'firebase/auth';

// Generic fetch function
async function fetchData<T>(collectionName: string): Promise<(T & { id: string })[]> {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }));
}


// Generic fetch single document function
async function fetchDoc<T>(collectionName: string, docId: string): Promise<(T & { id: string }) | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
    }
    return null;
}

export const getUsers = () => fetchData<User>('users');
export const getUser = (userId: string) => fetchDoc<User>('users', userId);
export const getTeams = () => fetchData<Team>('teams');
export const getProjects = () => fetchData<Project>('projects');
export const getAnnouncements = () => fetchData<Announcement>('announcements');
export const getUpcomingHackathons = () => fetchData<UpcomingHackathon>('upcomingHackathons');
export const getHackathonDetails = (hackathonId: string) => fetchDoc<UpcomingHackathon>('upcomingHackathons', hackathonId);


export const getEventDetails = () => fetchDoc<EventDetails>('config', 'eventDetails');


export async function getTeamMembers(teamId: string): Promise<User[]> {
    if (!teamId) return [];
    
    const team = await getDoc(doc(db, 'teams', teamId));
    if (!team.exists()) return [];

    const memberIds = team.data().memberIds;
    if (!memberIds || memberIds.length === 0) return [];

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('__name__', 'in', memberIds));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}


export async function getProjectTeam(projectId: string): Promise<Team | null> {
    const teamsRef = collection(db, 'teams');
    const q = query(teamsRef, where('projectId', '==', projectId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Team;
    }
    return null;
}

export async function getTeamsForEvent(eventId: string): Promise<Team[]> {
    if (!eventId) return [];
    const teamsRef = collection(db, 'teams');
    const q = query(teamsRef, where('eventId', '==', eventId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
}

export async function getJoinedEvents(userId: string): Promise<UpcomingHackathon[]> {
    if (!userId) {
        return [];
    }
    const allHackathons = await getUpcomingHackathons();
    const joinedHackathons = allHackathons.filter(h => h.attendees.some(a => a.uid === userId));
    return joinedHackathons;
}

export async function getOrCreateUser(firebaseUser: FirebaseUser) {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const newUser: Omit<User, 'id' | 'teamId'> = {
            name: firebaseUser.displayName || 'Anonymous User',
            avatarUrl: firebaseUser.photoURL || `https://placehold.co/100x100.png`,
            skills: [], // Start with no skills
        };
        await setDoc(userRef, newUser);
    }
    
    return fetchDoc<User>('users', firebaseUser.uid);
}
