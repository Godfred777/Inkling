'use client';

import Link from 'next/link';
import { Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-glass border-b border-outline-variant/15">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Title Section */}
        <div>
          <h1 className="font-display text-display-sm text-on-surface">
            {title}
          </h1>
          {subtitle && (
            <p className="text-body-sm text-on-surface-variant mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 bg-surface-container-lowest rounded-md text-on-surface placeholder-on-surface-variant focus:outline-none input-focus-glow transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-md transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-tertiary rounded-full" />
          </button>

          {/* Settings Link */}
          <Link
            href="/settings"
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-md transition-all"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* User Avatar */}
          <Avatar user={user} size="md" />
        </div>
      </div>
    </header>
  );
}
