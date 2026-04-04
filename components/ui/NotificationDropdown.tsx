'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Check, CheckCheck, X, Clock, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Notification } from '@/types';
import { notifications as dummyNotifications } from '@/lib/dummyData';
import { cn } from '@/lib/utils';

interface NotificationDropdownProps {
  notifications?: Notification[];
}

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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function NotificationDropdown({ notifications = dummyNotifications }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = localNotifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setLocalNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setLocalNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-md transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 flex items-center justify-center bg-error text-white text-label-sm rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-surface-container-low border border-outline-variant/15 rounded-lg shadow-ambient-lg overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/15">
            <h3 className="font-display font-semibold text-on-surface">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-label-sm text-primary hover:text-primary-fixed transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {localNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                <Bell className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-body-md">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/10">
                {localNotifications.map((notification) => {
                  const Icon = typeIcons[notification.type];
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'group relative px-4 py-3 transition-all hover:bg-surface-container',
                        !notification.read && 'bg-surface-container-high/50'
                      )}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', typeColors[notification.type])}>
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {notification.link ? (
                            <Link
                              href={notification.link}
                              onClick={() => markAsRead(notification.id)}
                              className="block"
                            >
                              <h4 className="font-medium text-on-surface text-body-sm truncate">
                                {notification.title}
                              </h4>
                              <p className="text-label-sm text-on-surface-variant line-clamp-2 mt-0.5">
                                {notification.message}
                              </p>
                            </Link>
                          ) : (
                            <>
                              <h4 className="font-medium text-on-surface text-body-sm truncate">
                                {notification.title}
                              </h4>
                              <p className="text-label-sm text-on-surface-variant line-clamp-2 mt-0.5">
                                {notification.message}
                              </p>
                            </>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-on-surface-variant/60" />
                            <span className="text-label-sm text-on-surface-variant/60">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-on-surface-variant hover:text-success transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => dismissNotification(notification.id)}
                            className="p-1 text-on-surface-variant hover:text-error transition-colors"
                            title="Dismiss"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {localNotifications.length > 0 && (
            <div className="border-t border-outline-variant/15 px-4 py-2.5">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-label-sm text-primary hover:text-primary-fixed transition-colors"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
