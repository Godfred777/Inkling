"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Group, GroupContextType, GroupMember, GroupRole } from '@/types';
import { groups as initialGroups } from '@/lib/dummyData';

const GroupContext = createContext<GroupContextType | undefined>(undefined);

const GROUPS_STORAGE_KEY = 'inkling_groups_v1';
const MOCK_DELAY = 400;

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(GROUPS_STORAGE_KEY);
    if (stored) {
      try {
        setGroups(JSON.parse(stored));
        return;
      } catch (e) {
        console.error('Failed to parse stored groups', e);
      }
    }

    // seed from dummy data
    setGroups(initialGroups);
  }, []);

  useEffect(() => {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  }, [groups]);

  const createGroup = useCallback(async (g: Partial<Group>) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    const newGroup: Group = {
      id: 'g_' + Date.now(),
      name: g.name || 'New Group',
      description: g.description || '',
      owners: g.owners || [],
      members: g.members || [],
      projectIds: g.projectIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGroups(prev => [newGroup, ...prev]);
    return newGroup;
  }, []);

  const updateGroup = useCallback(async (id: string, data: Partial<Group>) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    let updated: Group | undefined;
    setGroups(prev => prev.map(g => {
      if (g.id !== id) return g;
      updated = { ...g, ...data, updatedAt: new Date().toISOString() };
      return updated!;
    }));
    return updated as Group;
  }, []);

  const deleteGroup = useCallback(async (id: string) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    setGroups(prev => prev.filter(g => g.id !== id));
  }, []);

  const addMember = useCallback(async (groupId: string, member: GroupMember) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return { ...g, members: [...g.members, member], updatedAt: new Date().toISOString() };
    }));
  }, []);

  const removeMember = useCallback(async (groupId: string, memberId: string) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return { ...g, members: g.members.filter(m => m.id !== memberId), updatedAt: new Date().toISOString() };
    }));
  }, []);

  const changeMemberRole = useCallback(async (groupId: string, memberId: string, role: GroupRole) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return { ...g, members: g.members.map(m => m.id === memberId ? { ...m, role } : m), updatedAt: new Date().toISOString() };
    }));
  }, []);

  const joinGroup = useCallback(async (groupId: string) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    // joining is contextual (requires current user) — left as a stub for UI to call addMember
  }, []);

  const leaveGroup = useCallback(async (groupId: string) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    // leaving is contextual — left as a stub for UI
  }, []);

  const value: GroupContextType = {
    groups,
    createGroup,
    updateGroup,
    deleteGroup,
    addMember,
    removeMember,
    changeMemberRole,
    joinGroup,
    leaveGroup,
  };

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}

export function useGroups() {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error('useGroups must be used within GroupProvider');
  return ctx;
}

export default GroupProvider;
