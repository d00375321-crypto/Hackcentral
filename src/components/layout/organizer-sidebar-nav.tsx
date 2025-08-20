
'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Shield,
  FileSearch,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    group: 'Dashboard',
    items: [
       {
        href: '/organizer',
        label: 'Organizer',
        icon: Shield,
      },
      {
        href: '/plagiarism-checker',
        label: 'Plagiarism Checker',
        icon: FileSearch,
      },
    ],
  },
];

export function OrganizerSidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </div>
    </div>
  );
}
