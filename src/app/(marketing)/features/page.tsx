import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FeaturesPage() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore the powerful features that make HackCentral the best choice for your next event.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container grid gap-6 px-4 md:px-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>AI Team Finder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our intelligent algorithm helps participants find the perfect teammates based on their skills and interests, ensuring a balanced and effective team.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project Submission Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A streamlined submission process allows teams to upload their projects, documentation, and demo videos with ease.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI Plagiarism Checker</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Maintain academic integrity with our built-in tool that scans submissions for originality.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Judging Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                An intuitive interface for judges to review submissions, score projects, and provide feedback.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
