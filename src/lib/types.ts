
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  skills: string[];
  teamId?: string; // This is deprecated and should not be the source of truth
}

export interface Team {
  id:string;
  name: string;
  memberIds: string[];
  projectId?: string;
  eventId: string; // A team is now always associated with an event
}

export interface Project {
  id: string;
  name: string;
  description: string;
  githubUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
  submittedAt: string;
  eventId: string; // A project is now always associated with an event
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface EventDetails {
  theme: string;
  tracks: string[];
  rules: string;
  timeline: string;
  prizes: string;
  sponsors: string[];
}

export interface Attendee {
    uid: string;
    name: string;
    avatarUrl: string;
}


export interface UpcomingHackathon {
    id: string;
    name: string;
    date: string;
    location: string;
    imageUrl: string;
    tags: string[];
    attendees: Attendee[];
}
