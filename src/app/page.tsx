import Link from "next/link";
import { ArrowRight, Users, UploadCloud, Trophy } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";


export default async function Home() {

  return (
    <>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto animate-fade-in-up">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                The Home for Hackathons
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Discover, join, and organize the best hackathons. All in one place.
              </p>
              <div className="mt-8 flex justify-center">
                  <LinkButton
                    href="/participant/events"
                    size="lg"
                  >
                    Find Your Next Event <ArrowRight className="ml-2 h-5 w-5" />
                  </LinkButton>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in-up [animation-delay:200ms]">
               <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why HackCentral?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The tools and community you need to succeed.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary h-16 w-16 mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Team Building</h3>
                <p className="text-muted-foreground">Find the perfect teammates with complementary skills using our intelligent matching algorithm.</p>
              </div>
               <div className="flex flex-col items-center text-center gap-2">
                <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary h-16 w-16 mb-4">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Streamlined Submissions</h3>
                <p className="text-muted-foreground">Easily submit your project, code, and video demos through our intuitive portal.</p>
              </div>
               <div className="flex flex-col items-center text-center gap-2">
                <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary h-16 w-16 mb-4">
                  <Trophy className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Organize with Ease</h3>
                <p className="text-muted-foreground">Manage announcements, judge submissions, and configure your event all in one place.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 HackCentral. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </>
  );
}
