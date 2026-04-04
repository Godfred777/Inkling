'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { Header } from '@/components/ui/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { notifications as dummyNotifications } from '@/lib/dummyData';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';
import {
  Check,
  CheckCheck,
  Clock,
  AlertTriangle,
  AlertCircle,
  Info,
  Trash2,
  Filter,
} from 'lucide-react';

const typeIcons = {
  info: Info,
  success: Check,
  warning: AlertTriangle,
  error: AlertCircle,
};

const typeColors = {
  info: 'bg-primary-container/20 text-primary',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  error: 'bg-error/20 text-error',
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

type FilterType = 'all' | 'unread' | 'info' | 'success' | 'warning' | 'error';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [filter, setFilter] = useState<FilterType>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'info', label: 'Info' },
    { key: 'success', label: 'Success' },
    { key: 'warning', label: 'Warning' },
    { key: 'error', label: 'Error' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header
          title="Notifications"
          subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        />

        <main className="p-8">
          {/* Filters and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-on-surface-variant" />
              {filters.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-label-sm transition-all',
                    filter === f.key
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <Card variant="default">
            <CardContent className="p-0">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
                  <Info className="w-16 h-16 mb-4 opacity-30" />
                  <p className="text-body-lg">No notifications to display</p>
                  <p className="text-label-md mt-1">
                    {filter !== 'all' ? 'Try changing the filter' : 'You are all caught up!'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-outline-variant/10">
                  {filteredNotifications.map((notification) => {
                    const Icon = typeIcons[notification.type];
                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          'group relative px-6 py-4 transition-all hover:bg-surface-container',
                          !notification.read && 'bg-surface-container-high/50'
                        )}
                      >
                        <div className="flex gap-4">
                          {/* Icon */}
                          <div className={cn('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', typeColors[notification.type])}>
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className="font-medium text-on-surface">
                                  {notification.title}
                                </h4>
                                <p className="text-body-sm text-on-surface-variant mt-1">
                                  {notification.message}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1.5 text-on-surface-variant hover:text-success transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => dismissNotification(notification.id)}
                                  className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
                                  title="Dismiss"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="w-3.5 h-3.5 text-on-surface-variant/60" />
                              <span className="text-label-sm text-on-surface-variant/60">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
