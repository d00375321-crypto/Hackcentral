import AuthGuard from '@/components/auth/auth-guard';
import Header from '@/components/layout/header';
import { OrganizerSidebarNav } from '@/components/layout/organizer-sidebar-nav';
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <OrganizerSidebarNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <Header />
            <main className="flex-1">
               <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8">
                  {children}
              </div>
            </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
