import { TeamFinderClient } from '@/components/ai/team-finder-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeamFinderPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI Team Finder</h1>
      <Card>
        <CardHeader>
          <CardTitle>Find Your Dream Team</CardTitle>
          <CardDescription>
            Describe your project and your current team's skills. Our AI will suggest the best people to fill the gaps.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <TeamFinderClient />
        </CardContent>
      </Card>
    </div>
  );
}
