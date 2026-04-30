"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Group, GroupContextType, GroupMember, GroupRole, User } from '@/types';
import { 
  createNewGroup, 
  getGroupsWithUser, 
  getGroupById, 
  joinGroup, 
  leaveGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  getGroupMembers,
  updateExistingGroup,
  deleteGroup 
} from '@/api/groups';
import { useAuth } from './AuthContext';

const GroupContext = createContext<GroupContextType | undefined>(undefined);

const GROUPS_STORAGE_KEY = 'inkling_groups_v1';
const MOCK_DELAY = 400;

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    try {
        setLoading(true);
        setError(null);
        
        const groupsData = await getGroupsWithUser();
        
        const transformedGroups: Group[] = groupsData.map((g: any) => ({
          id: g.id.toString(),
          name: g.name,
          description: g.description || '',
          owners: [],
          members: g.group_members?.map((m: any) => ({
            id: m.id?.toString() || `m_${m.user_id}`,
            user: { id: m.user_id, email: m.users?.email, name: m.users?.name || 'User' } as User,
            role: m.role || 'Viewer',
            joinedAt: m.created_at || new Date().toISOString(),
          })) || [],
          projectIds: [],
          createdAt: g.created_at || new Date().toISOString(),
          updatedAt: g.updated_at || new Date().toISOString(),
        }));
        
        setGroups(transformedGroups);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to load data. Please try again.');
        setGroups([]);
      } finally {
        setLoading(false);
      }
  }, [user]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  }, [groups]);

  const createGroup = useCallback(async (g: Partial<Group>) => {
    try {
      const newGroupData = await createNewGroup(g.name || 'New Group', g.description);
      
      const newGroup: Group = {
        id: newGroupData.id.toString(),
        name: newGroupData.name,
        description: newGroupData.description || '',
        owners: [],
        members: [],
        projectIds: [],
        createdAt: newGroupData.createdAt || new Date().toISOString(),
        updatedAt: newGroupData.updated_at || new Date().toISOString(),
      };
      
      setGroups(prev => [newGroup, ...prev]);
      return newGroup;
    } catch (err) {
      console.error('Error creating group:', err);
      throw err;
    }
  }, []);

  const usersGroups = useCallback(async () => {
    try {
      const groupsData = await getGroupsWithUser();
      const transformedGroups: Group[] = groupsData.map((g: any) => ({
        id: g.id.toString(),
        name: g.name,
        description: g.description || '',
        owners: [],
        members: g.group_members?.map((m: any) => ({
          id: m.id?.toString() || `m_${m.user_id}`,
          user: {
            id: m.user_id,
            email: m.users?.email,
            name: m.users?.name || 'User',
          } as User,
          role: m.role || 'Viewer',
          joinedAt: m.created_at || new Date().toISOString(),
        })) || [],
        projectIds: [],
        createdAt: g.created_at || new Date().toISOString(),
        updatedAt: g.updated_at || new Date().toISOString(),
      }));
      setGroups(transformedGroups);
      return transformedGroups;
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups. Please try again.');
    }
  }, []);

  const groupById = useCallback(async (id: string) => {
    try {
      const groupData = await getGroupById(id);
      const group: Group = {
        id: groupData.id.toString(),
        name: groupData.name,
        description: groupData.description || '',
        owners: [],
        members: [],
        projectIds: [],
        createdAt: groupData.created_at || new Date().toISOString(),
        updatedAt: groupData.updated_at || new Date().toISOString(),
      };
      return group;
    } catch (err) {
      console.error('Error fetching group:', err);
      throw err;
    }
  }, []);

  const updateGroup = useCallback(async (id: string, data: Partial<Group>) => {
    try {
      const updatedData = await updateExistingGroup(id, data.name, data.description);
      
      let updated: Group | undefined;
      setGroups(prev => prev.map(g => {
        if (g.id !== id) return g;
        updated = {
          ...g,
          name: updatedData.name,
          description: updatedData.description || '',
          updatedAt: updatedData.updated_at || new Date().toISOString(),
        };
        return updated!;
      }));
      return updated as Group;
    } catch (err) {
      console.error('Error updating group:', err);
      throw err;
    }
  }, []);

  const deleteGroup = useCallback(async (id: string) => {
    try {
      await deleteGroup(id);
      setGroups(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error('Error deleting group:', err);
      throw err;
    }
  }, []);

  const addMember = useCallback(async (groupId: string, member: GroupMember, adminUserId: string) => {
    try {
      await addMemberToGroup(groupId, member.user.id, adminUserId);
      
      setGroups(prev => prev.map(g => {
        if (g.id !== groupId) return g;
        return { ...g, members: [...g.members, member], updatedAt: new Date().toISOString() };
      }));
    } catch (err) {
      console.error('Error adding member:', err);
      throw err;
    }
  }, []);

  const removeMember = useCallback(async (groupId: string, memberId: string, adminUserId: string) => {
    try {
      let memberUserId: string | undefined;
      setGroups(prev => {
        const group = prev.find(g => g.id === groupId);
        const member = group?.members.find(m => m.id === memberId);
        memberUserId = member?.user.id;
        return prev;
      });

      if (!memberUserId) {
        throw new Error('Member not found');
      }

      await removeMemberFromGroup(groupId, memberUserId, adminUserId);
      
      setGroups(prev => prev.map(g => {
        if (g.id !== groupId) return g;
        return { ...g, members: g.members.filter(m => m.id !== memberId), updatedAt: new Date().toISOString() };
      }));
    } catch (err) {
      console.error('Error removing member:', err);
      throw err;
    }
  }, []);

  const changeMemberRole = useCallback(async (groupId: string, memberId: string, role: GroupRole) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return { ...g, members: g.members.map(m => m.id === memberId ? { ...m, role } : m), updatedAt: new Date().toISOString() };
    }));
  }, []);

  const joinGroup = useCallback(async (groupId: string, userId: string) => {
    try {
      await joinGroup(groupId, userId);
      
      setGroups(prev => prev.map(g => {
        if (g.id !== groupId) return g;
        return { 
          ...g, 
          members: [
            ...g.members,
            {
              id: `m_${userId}`,
              user: { id: userId } as User,
              role: 'Viewer',
              joinedAt: new Date().toISOString(),
            }
          ],
          updatedAt: new Date().toISOString() 
        };
      }));
    } catch (err) {
      console.error('Error joining group:', err);
      throw err;
    }
  }, []);

  const leaveGroup = useCallback(async (groupId: string, userId: string) => {
    try {
      await leaveGroup(groupId, userId);
      
      setGroups(prev => prev.map(g => {
        if (g.id !== groupId) return g;
        return { 
          ...g, 
          members: g.members.filter(m => m.user.id !== userId),
          updatedAt: new Date().toISOString() 
        };
      }));
    } catch (err) {
      console.error('Error leaving group:', err);
      throw err;
    }
  }, []);

  const value: GroupContextType = {
    groups,
    projects: [],
    tasks: [],
    loading,
    error,
    refreshData: fetchGroups,
    createGroup,
    usersGroups,
    groupById,
    updateGroup,
    deleteGroup,
    addMember,
    removeMember,
    changeMemberRole,
    joinGroup,
    leaveGroup,
    createProject: async () => {
      throw new Error('createProject is now available in ProjectContext');
    },
    viewProjects: async () => {
      throw new Error('viewProjects is now available in ProjectContext');
    },
    updateProject: async () => {
      throw new Error('updateProject is now available in ProjectContext');
    },
    deleteProject: async () => {
      throw new Error('deleteProject is now available in ProjectContext');
    },
    createTask: async () => {
      throw new Error('createTask is now available in TaskContext');
    },
    updateTask: async () => {
      throw new Error('updateTask is now available in TaskContext');
    },
    deleteTask: async () => {
      throw new Error('deleteTask is now available in TaskContext');
    },
    respondToTask: async () => {
      throw new Error('respondToTask is now available in TaskContext');
    },
  };

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}

export function useGroups() {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error('useGroups must be used within GroupProvider');
  return ctx;
}

export default GroupProvider;
