'use client';

import React, { useState } from 'react';
import { useGroups } from '@/contexts/GroupContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, UserPlus, Trash2 } from 'lucide-react';
import { users } from '@/lib/dummyData';
import { GroupRole } from '@/types';

interface MemberManagementProps {
  groupId: string;
}

export function MemberManagement({ groupId }: MemberManagementProps) {
  const { groups, addMember, removeMember, changeMemberRole } = useGroups();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<GroupRole>('Viewer');
  const [isAdding, setIsAdding] = useState(false);

  const group = groups.find(g => g.id === groupId);
  
  // Only owners can manage members
  const isOwner = group?.owners.some(owner => owner.id === user?.id);

  const router = useRouter();

  // If the current viewer is not an owner, show a helpful message
  if (!isOwner) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-start gap-3">
          <h3 className="text-lg font-semibold">Manage Members</h3>
          {!user ? (
            <div className="text-sm text-on-surface-variant">
              You must be signed in as an owner to manage members.
              <div className="mt-3">
                <Button size="sm" onClick={() => router.push('/login')}>Sign in</Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-on-surface-variant">
              Only group owners can add or remove members. If you should have access, ask an owner to update your role.
            </div>
          )}
        </div>
      </Card>
    );
  }

  const availableUsers = users.filter(
    u => !group?.members.some(m => m.user.id === u.id)
  );

  const filteredUsers = availableUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = async (userId: string) => {
    const userToAdd = users.find(u => u.id === userId);
    if (!userToAdd) return;

    const member = {
      id: `m_${Date.now()}`,
      user: userToAdd,
      role: selectedRole,
      joinedAt: new Date().toISOString(),
    };

    await addMember(groupId, member);
    setIsAdding(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      await removeMember(groupId, memberId);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: GroupRole) => {
    await changeMemberRole(groupId, memberId, newRole);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Manage Members ({group?.members.length})
        </h3>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => setIsAdding(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Add Member Form */}
      {isAdding && (
        <div className="mb-6 p-4 bg-surface-container rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Add New Member</h4>
            <button
              onClick={() => setIsAdding(false)}
              className="text-on-surface-variant hover:text-on-surface"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant/20 rounded-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as GroupRole)}
              className="px-3 py-2 bg-surface border border-outline-variant/20 rounded-md text-on-surface"
            >
              <option value="Editor">Editor</option>
              <option value="Assignee">Assignee</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          {/* User List */}
          <div className="max-h-48 overflow-y-auto space-y-2">
            {filteredUsers.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-4">
                {searchQuery ? 'No users found' : 'Start typing to search users'}
              </p>
            ) : (
              filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg"
                >
                  <div>
                    <p className="font-medium text-on-surface">{user.name}</p>
                    <p className="text-xs text-on-surface-variant">{user.email}</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddMember(user.id)}
                  >
                    Add
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Current Members List */}
      <div className="space-y-3">
        {group?.members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-surface-container rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-semibold">
                {member.user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-on-surface">{member.user.name}</p>
                <p className="text-xs text-on-surface-variant">{member.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Role Badge for Owners */}
              {group.owners.some(o => o.id === member.user.id) && (
                <Badge variant="primary" size="sm">
                  Owner
                </Badge>
              )}

              {/* Role Selector (not for owners) */}
              {!group.owners.some(o => o.id === member.user.id) && (
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value as GroupRole)}
                  className="px-2 py-1 text-sm bg-surface border border-outline-variant/20 rounded text-on-surface"
                >
                  <option value="Editor">Editor</option>
                  <option value="Assignee">Assignee</option>
                  <option value="Viewer">Viewer</option>
                </select>
              )}

              {/* Remove Button (not for owners) */}
              {!group.owners.some(o => o.id === member.user.id) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-error hover:bg-error/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
