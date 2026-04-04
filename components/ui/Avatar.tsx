import { cn, getInitials } from '@/lib/utils';
import { User } from '@/types';

const sizeClasses = {
  sm: 'w-6 h-6 text-label-sm',
  md: 'w-8 h-8 text-body-sm',
  lg: 'w-10 h-10 text-body-md',
};

interface AvatarProps {
  user?: User;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ user, name, size = 'md', className }: AvatarProps) {
  const displayName = name || user?.name || 'Unknown';

  return (
    <div
      className={cn(
        'rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-semibold',
        sizeClasses[size],
        className
      )}
      title={displayName}
    >
      {getInitials(displayName)}
    </div>
  );
}

interface AvatarGroupProps {
  users: User[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ users, max = 3, size = 'md' }: AvatarGroupProps) {
  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {displayUsers.map((user) => (
        <Avatar key={user.id} user={user} size={size} className="ring-2 ring-surface" />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-semibold ring-2 ring-surface',
            sizeClasses[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
