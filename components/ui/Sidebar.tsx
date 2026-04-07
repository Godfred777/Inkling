'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  CheckSquare,
  FolderOpen,
  Plus,
  MessageSquare,
  Sparkles,
  Settings,
  FolderPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Projects', href: '/projects', icon: FolderPlus },
  { name: 'Resource Hub', href: '/resources', icon: FolderOpen },
  { name: 'AI Architect', href: '/architect', icon: MessageSquare, primary: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-secondary-fixed/30 border-r border-outline-variant/10">
      {/* User Profile Section */}
      <div className="p-6 border-b border-outline-variant/10">
        <div className="flex items-center gap-3 mb-4">
          <Avatar user={user ?? undefined} size="md" />
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-semibold text-on-surface truncate">
              {user?.name || 'Guest'}
            </h2>
            <p className="text-label-md text-on-surface-variant truncate">
              {user?.email || 'Not signed in'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <ThemeToggle />
        </div>
        <Link
          href="/settings"
          className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-md transition-all"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200',
                'text-body-md font-medium',
                item.primary
                  ? 'bg-primary-container text-on-primary-container hover:bg-primary hover:shadow-ambient'
                  : isActive
                  ? 'bg-surface-container-high text-on-surface'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
              {item.primary && (
                <Sparkles className="w-4 h-4 ml-auto opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* New Project Button */}
      <div className="absolute bottom-6 left-4 right-4">
        <Link href="/projects/new">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface-bright hover:bg-surface-container-highest text-on-surface rounded-md transition-all duration-200 font-medium">
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </Link>
      </div>
    </aside>
  );
}
