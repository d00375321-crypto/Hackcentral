// scripts/seed.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, writeBatch } = require('firebase/firestore');

// IMPORTANT: Replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBLG4s69ohujjHn4ykECw5zranEvdq3ynw",
  authDomain: "hackcentral.firebaseapp.com",
  projectId: "hackcentral",
  storageBucket: "hackcentral.firebasestorage.app",
  messagingSenderId: "1076524616681",
  appId: "1:1076524616681:web:8abd4f1516428fc50f9978"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const users = [
  { id: 'user-1', name: 'Alex Johnson', avatarUrl: 'https://placehold.co/100x100.png', skills: ['React', 'Node.js', 'UI/UX Design'], teamId: 'team-1' },
  { id: 'user-2', name: 'Brenda Smith', avatarUrl: 'https://placehold.co/100x100.png', skills: ['Python', 'Machine Learning', 'Data Analysis'], teamId: 'team-1' },
  { id: 'user-3', name: 'Charlie Brown', avatarUrl: 'https://placehold.co/100x100.png', skills: ['Project Management', 'Agile', 'Scrum'], teamId: 'team-1' },
  { id: 'user-4', name: 'Diana Prince', avatarUrl: 'https://placehold.co/100x100.png', skills: ['Vue.js', 'Firebase', 'Go'], teamId: 'team-2' },
  { id: 'user-5', name: 'Ethan Hunt', avatarUrl: 'https://placehold.co/100x100.png', skills: ['Angular', 'Java', 'Spring Boot'], teamId: 'team-2' },
  { id: 'user-6', name: 'Fiona Glenanne', avatarUrl: 'https://placehold.co/100x100.png', skills: ['DevOps', 'Kubernetes', 'AWS'], teamId: 'team-3' },
  { id: 'user-7', name: 'George Constanza', avatarUrl: 'https://placehold.co/100x100.png', skills: ['Swift', 'iOS Development', 'Objective-C'], teamId: 'team-4' },
  { id: 'user-8', name: 'Hannah Montana', avatarUrl: 'https://placehold.co/100x100.png', skills: ['Android', 'Kotlin', 'Jetpack Compose'], teamId: 'team-4' },
];

const teams = [
  { id: 'team-1', name: 'AI Innovators', memberIds: ['user-1', 'user-2', 'user-3'], projectId: 'project-1' },
  { id: 'team-2', name: 'Cloud Crew', memberIds: ['user-4', 'user-5'] },
  { id: 'team-3', name: 'DevOps Dynamos', memberIds: ['user-6'] },
  { id: 'team-4', name: 'Mobile Mavericks', memberIds: ['user-7', 'user-8'] },
];

const projects = [
  {
    id: 'project-1',
    name: 'AI-Powered Health Assistant',
    description: 'A mobile app that uses machine learning to provide personalized health recommendations based on user data. It tracks fitness, nutrition, and sleep patterns to offer actionable insights.',
    githubUrl: 'https://github.com/example/health-assistant',
    videoUrl: 'https://youtube.com/watch?v=example1',
    documentUrl: '/docs/health-assistant.pdf',
    submittedAt: '2024-07-20T10:00:00Z',
  },
   {
    id: 'project-2',
    name: 'Eco-Friendly Route Planner',
    description: 'A web application that calculates the most environmentally friendly route for travel, considering factors like carbon emissions, public transport options, and bike-friendly paths.',
    githubUrl: 'https://github.com/example/eco-planner',
    videoUrl: 'https://youtube.com/watch?v=example2',
    documentUrl: '/docs/eco-planner.pdf',
    submittedAt: '2024-07-20T11:30:00Z',
  },
];

const announcements = [
  { id: 'ann-1', title: 'Welcome to HackCentral!', content: 'We are thrilled to have you here. Let the hacking begin! Check out the event details and start forming your teams.', author: 'Admin', createdAt: '2024-07-19T09:00:00Z' },
  { id: 'ann-2', title: 'Opening Ceremony starting soon', content: 'Join us in the main hall or on the live stream for the opening ceremony at 10 AM.', author: 'Admin', createdAt: '2024-07-19T09:45:00Z' },
  { id: 'ann-3', title: 'Reminder: Project Submissions Deadline', content: 'All projects must be submitted by 5 PM today. Good luck to all teams!', author: 'Admin', createdAt: '2024-07-20T13:00:00Z' },
];

const eventDetails = {
  theme: 'Innovate for the Future',
  tracks: ['AI & Machine Learning', 'Health & Wellness', 'Sustainability', 'FinTech'],
  rules: '1. Teams must be between 2-4 members. 2. All code must be written during the event. 3. Be respectful to everyone.',
  timeline: 'Day 1: Kick-off & Hacking. Day 2: Hacking & Submission. Day 3: Judging & Awards.',
  prizes: '1st Place: $5000, 2nd Place: $2500, 3rd Place: $1000',
  sponsors: ['InnovateCorp', 'FutureTech', 'EcoSolutions'],
};

const upcomingHackathons = [
    {
        id: "event-1",
        name: "AI for Good Global Hackathon",
        date: "October 26-28, 2024",
        location: "Online",
        imageUrl: "https://placehold.co/400x225.png",
        tags: ["AI", "Social Good", "Global"],
        attendees: [
            { uid: "user-a", name: "Alice", avatarUrl: "https://placehold.co/100x100.png" },
            { uid: "user-b", name: "Bob", avatarUrl: "https://placehold.co/100x100.png" },
        ]
    },
    {
        id: "event-2",
        name: "FinTech Innovators Challenge",
        date: "November 1-3, 2024",
        location: "New York, NY",
        imageUrl: "https://placehold.co/400x225.png",
        tags: ["FinTech", "Blockchain", "Web3"],
         attendees: [
            { uid: "user-c", name: "Charlie", avatarUrl: "https://placehold.co/100x100.png" },
            { uid: "user-d", name: "Dana", avatarUrl: "https://placehold.co/100x100.png" },
        ]
    },
    {
        id: "event-3",
        name: "Sustainable Future Hack",
        date: "November 15-17, 2024",
        location: "San Francisco, CA",
        imageUrl: "https://placehold.co/400x225.png",
        tags: ["Sustainability", "GreenTech", "IoT"],
         attendees: [
            { uid: "user-e", name: "Eve", avatarUrl: "https://placehold.co/100x100.png" },
        ]
    },
];

async function seedCollection(collectionName, data) {
    const batch = writeBatch(db);
    console.log(`Seeding ${collectionName}...`);
    data.forEach((item) => {
        const docRef = doc(db, collectionName, item.id.toString());
        batch.set(docRef, item);
    });
    await batch.commit();
    console.log(`${collectionName} seeded successfully.`);
}

async function seedSingleDoc(collectionName, docId, data) {
    console.log(`Seeding ${docId}...`);
    await setDoc(doc(db, collectionName, docId), data);
    console.log(`${docId} seeded successfully.`);
}


async function main() {
    try {
        await seedCollection('users', users);
        await seedCollection('teams', teams);
        await seedCollection('projects', projects);
        await seedCollection('announcements', announcements);
        await seedCollection('upcomingHackathons', upcomingHackathons);
        await seedSingleDoc('config', 'eventDetails', eventDetails);
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database: ", error);
        process.exit(1);
    }
}

main();
