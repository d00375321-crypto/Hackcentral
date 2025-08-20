
'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Code, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { signOutUser } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        {user && <SidebarTrigger className="md:hidden" />}
        <Link href="/" className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <span className="font-bold hidden sm:inline-block">HackCentral</span>
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/features" className="text-muted-foreground transition-colors hover:text-foreground" prefetch={false}>
                Features
            </Link>
            <Link href="/pricing" className="text-muted-foreground transition-colors hover:text-foreground" prefetch={false}>
                Pricing
            </Link>
            <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground" prefetch={false}>
                About
            </Link>
        </nav>
        {!isClient || loading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar>
                  <AvatarImage
                    src={user.photoURL ?? "https://placehold.co/100x100.png"}
                    alt={user.displayName ?? "User avatar"}
                    data-ai-hint="person"
                  />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.displayName || 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/participant">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Participant</span>
                </Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/organizer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Organizer</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/judge">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Judge</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                 <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
             <Button asChild>
                <Link href="/login">Login</Link>
            </Button>
        )}
      </div>
    </header>
  );
}
