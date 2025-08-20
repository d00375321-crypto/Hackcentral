import { PlagiarismCheckerClient } from '@/components/ai/plagiarism-checker-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PlagiarismCheckerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI Plagiarism Checker</h1>
      <Card>
        <CardHeader>
          <CardTitle>Check for Plagiarism</CardTitle>
          <CardDescription>
            Analyze a project's text against other submissions to detect potential plagiarism.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlagiarismCheckerClient />
        </CardContent>
      </Card>
    </div>
  );
}
