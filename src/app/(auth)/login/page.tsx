
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Github } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { signInWithGoogle } from '@/lib/firebase/auth';

const GoogleIcon = () => (
    <svg className="h-4 w-4 mr-2" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.792C34.86 5.236 29.81 3 24 3C12.43 3 3 12.43 3 24s9.43 21 21 21s21-9.43 21-21c0-1.341-.138-2.65-.389-3.917z"></path>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.84-5.348C34.86 5.236 29.81 3 24 3c-5.81 0-10.86 2.236-14.802 5.801l-2.892-2.11z"></path>
      <path fill="#4CAF50" d="M24 45c5.81 0 10.86-2.236 14.802-5.801l-5.84-5.348C30.156 36.846 27.359 39 24 39c-5.04 0-9.345-3.108-11.124-7.489l-6.571 4.82C9.43 41.598 16.07 45 24 45z"></path>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.16-4.082 5.571l6.571 4.82C42.859 34.697 45 29.865 45 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
)

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/participant');
    }
  }, [user, loading, router]);


  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Failed to sign in with Google", error);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background p-4">Loading...</div>;
  }
  
  if (user) {
    return <div className="flex min-h-screen items-center justify-center bg-background p-4">Redirecting...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center space-y-2">
            <div className="flex justify-center items-center mb-2">
                <Code className="h-10 w-10 text-primary" />
            </div>
          <CardTitle className="text-3xl font-bold">Welcome to HackCentral</CardTitle>
          <CardDescription>The premier platform for hackathon enthusiasts.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid gap-4">
            <Button onClick={handleLogin} size="lg">
                <GoogleIcon /> Login with Google
            </Button>
             <Button variant="outline">
                <Github className="mr-2 h-4 w-4"/> Continue with Github
            </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
