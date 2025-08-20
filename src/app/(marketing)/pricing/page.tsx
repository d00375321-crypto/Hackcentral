import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Pricing</h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that's right for your hackathon.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 md:px-6">
            <Card>
                <CardHeader>
                    <CardTitle>Community</CardTitle>
                    <CardDescription>For small, local hackathons.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-4xl font-bold">Free</div>
                     <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 50 participants</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic features</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Community support</li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Get Started</Button>
                </CardFooter>
            </Card>
             <Card className="border-primary">
                <CardHeader>
                    <CardTitle>Pro</CardTitle>
                    <CardDescription>For larger hackathons and universities.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-4xl font-bold">$99/mo</div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 500 participants</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> All features included</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority support</li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Choose Plan</Button>
                </CardFooter>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <CardDescription>For large-scale corporate hackathons.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-4xl font-bold">Custom</div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited participants</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Dedicated support and SLA</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Custom branding</li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Contact Us</Button>
                </CardFooter>
            </Card>
        </div>
      </section>
    </main>
  );
}
