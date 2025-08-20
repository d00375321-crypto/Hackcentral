import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About HackCentral</h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our mission is to provide the best platform for hackathons, fostering innovation and collaboration.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
            <Card>
                <CardHeader>
                    <CardTitle>Our Story</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        HackCentral was born out of a passion for hackathons and a desire to make them more accessible and enjoyable for everyone. We believe that hackathons are a powerful way to learn, create, and connect with like-minded individuals. Our platform is designed to handle the logistics so that participants can focus on what they do best: building amazing things.
                    </p>
                </CardContent>
            </Card>
        </div>
      </section>
    </main>
  );
}
