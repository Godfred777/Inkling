'use client';

import React, { useState } from 'react';
import { useGroups } from '@/contexts/GroupContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, UserPlus, Trash2, AlertCircle } from 'lucide-react';
import { GroupRole } from '@/types';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

interface MemberManagementProps {
  groupId: string;
}

export function MemberManagement({ groupId }: MemberManagementProps) {
  const { groups, addMember, removeMember, changeMemberRole, loading } = useGroups();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<GroupRole>('Viewer');
  const [isAdding, setIsAdding] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableUsers, setAvailableUsers] = useState<Array<{ id: string; email: string; name: string | null }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const group = groups.find(g => g.id === groupId);
  
  // For now, treat all members as potential managers (can be enhanced with role-based checks)
  const isManager = group?.members.some(m => m.user.id === user?.id);

  const router = useRouter();

  // Fetch available users (not already in group) when search query changes
  React.useEffect(() => {
    const fetchAvailableUsers = async () => {
      if (!isAdding || !searchQuery.trim()) {
        setAvailableUsers([]);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        // Search profiles table for users matching the query
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('id, email, name')
          .or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
          .limit(10);

        if (fetchError) {
          throw fetchError;
        }

        // Filter out users who are already in the group
        const groupMemberIds = new Set(group?.members.map(m => m.user.id) || []);
        const filteredUsers = (data || []).filter(u => !groupMemberIds.has(u.id));

        setAvailableUsers(filteredUsers || []);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to search users');
        setAvailableUsers([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(() => {
      fetchAvailableUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isAdding, group?.members]);

  // If the current viewer is not a member, show a helpful message
  if (!isManager) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-start gap-3">
          <h3 className="text-lg font-semibold">Manage Members</h3>
          {!user ? (
            <div className="text-sm text-on-surface-variant">
              You must be signed in to manage members.
              <div className="mt-3">
                <Button size="sm" onClick={() => router.push('/login')}>Sign in</Button>
              </div>
            </div>
          ) : !group ? (
            <div className="text-sm text-on-surface-variant flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Group not found
            </div>
          ) : (
            <div className="text-sm text-on-surface-variant">
              You must be a group member to manage other members. Ask an owner to add you to the group.
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Available users are loaded via useEffect when searching
  const filteredUsers = availableUsers;

  const handleAddMember = async (userId: string) => {
    if (!user) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const member = {
        id: `m_${Date.now()}`,
        user: { id: userId, email: '' } as any,
        role: selectedRole,
        joinedAt: new Date().toISOString(),
      };

      await addMember(groupId, member, user.id);
      setIsAdding(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add member');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!user || !confirm('Are you sure you want to remove this member?')) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      await removeMember(groupId, memberId, user.id);
    } catch (err: any) {
      setError(err.message || 'Failed to remove member');
    } finally {
      setIsProcessing(false);
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
          Manage Members ({group?.members.length || 0})
        </h3>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => setIsAdding(true)}
          disabled={isProcessing}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error rounded-lg text-error text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-4 text-on-surface-variant">
          Loading members...
        </div>
      )}

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
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-sm text-on-surface-variant">Searching...</span>
              </div>
            ) : error && availableUsers.length === 0 ? (
              <p className="text-sm text-error text-center py-4">
                {error}
              </p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-4">
                {searchQuery ? 'No users found' : 'Type to search for users...'}
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
                    disabled={isProcessing}
                  >
                    Add
                  </Button>
                </div>
              ))
            )}
          </div>
          
          <p className="text-xs text-on-surface-variant mt-2">
            Note: User search functionality requires backend implementation
          </p>
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
              {!group.owners?.some(o => o.id === member.user.id) && (
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value as GroupRole)}
                  disabled={isProcessing}
                  className="px-2 py-1 text-sm bg-surface border border-outline-variant/20 rounded text-on-surface disabled:opacity-50"
                >
                  <option value="Editor">Editor</option>
                  <option value="Assignee">Assignee</option>
                  <option value="Viewer">Viewer</option>
                </select>
              )}

              {/* Remove Button (not for owners) */}
              {!group.owners?.some(o => o.id === member.user.id) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={isProcessing}
                  className="text-error hover:bg-error/10 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {group?.members.length === 0 && (
          <p className="text-sm text-on-surface-variant text-center py-4">
            No members in this group yet
          </p>
        )}
      </div>
    </Card>
  );
}
