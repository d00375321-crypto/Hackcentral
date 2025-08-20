import { ManageAnnouncementsCard } from '@/components/organizer/manage-announcements-card';
import { ManageSubmissionsCard } from '@/components/organizer/manage-submissions-card';
import { EventConfigForm } from '@/components/organizer/event-config-form';
import { ManageEventsCard } from '@/components/organizer/manage-events-card';

export default function OrganizerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Organizer Dashboard</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <EventConfigForm />
          <ManageEventsCard />
        </div>
        <div className="space-y-6">
          <ManageAnnouncementsCard />
          <ManageSubmissionsCard />
        </div>
      </div>
    </div>
  );
}
