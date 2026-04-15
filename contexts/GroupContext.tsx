"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Group, GroupContextType, GroupMember, GroupRole, Project, Task, User } from '@/types';
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
const PROJECTS_STORAGE_KEY = 'inkling_projects_v1';
const TASKS_STORAGE_KEY = 'inkling_tasks_v1';
const MOCK_DELAY = 400;

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch groups when user authenticates
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) {
        setGroups([]);
        setProjects([]);
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const groupsData = await getGroupsWithUser();
        
        // Transform Supabase data to app format
        const transformedGroups: Group[] = groupsData.map((g: any) => ({
          id: g.id.toString(),
          name: g.name,
          description: g.description || '',
          owners: [], // TODO: Get owners from group_members with role
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
        setError('Failed to load groups. Please try again.');
        // Fallback to empty state
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  useEffect(() => {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

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
      // Find the member to get their user ID
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

  const createProject = useCallback(async (p: Partial<Project>) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    const id = 'p_' + Date.now();

    // Determine members: prefer explicit members passed in, otherwise inherit group's members
    let projectMembers = p.members || [];

    if (p.groupId) {
      setGroups(prev => {
        const grp = prev.find(g => g.id === p.groupId);
        if (grp) {
          if (!projectMembers || projectMembers.length === 0) {
            projectMembers = grp.members.map(m => m.user);
          }
          return prev.map(g => g.id === p.groupId ? { ...g, projectIds: [...g.projectIds, id], updatedAt: new Date().toISOString() } : g);
        }
        return prev;
      });
    }

    const newProject: Project = {
      id,
      name: p.name || 'New Project',
      description: p.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: projectMembers,
      taskCount: 0,
      groupId: p.groupId,
    };

    setProjects(prev => [newProject, ...prev]);
    return newProject;
  }, []);

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    let updated: Project | undefined;
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      updated = { ...p, ...data, updatedAt: new Date().toISOString() };
      return updated!;
    }));
    return updated as Project;
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    setProjects(prev => prev.filter(p => p.id !== id));
    setGroups(prev => prev.map(g => ({ ...g, projectIds: g.projectIds.filter(pid => pid !== id), updatedAt: new Date().toISOString() })));
  }, []);

  const createTask = useCallback(async (t: Partial<Task>) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    const newTask: Task = {
      id: 't_' + Date.now(),
      title: t.title || 'New Task',
      description: t.description || '',
      status: t.status || 'todo',
      priority: t.priority || 'medium',
      dueDate: t.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      projectId: t.projectId || '',
      groupId: t.groupId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assigneeResponse: t.assignee ? 'pending' : undefined,
    };
    setTasks(prev => [newTask, ...prev]);
    if (t.projectId) {
      setProjects(prev => prev.map(p => p.id === t.projectId ? { ...p, taskCount: p.taskCount + 1, updatedAt: new Date().toISOString() } : p));
    }
    return newTask;
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    let updated: Task | undefined;
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      updated = { ...t, ...data, updatedAt: new Date().toISOString() };
      return updated!;
    }));
    return updated as Task;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    setTasks(prev => prev.filter(t => t.id !== id));
    setProjects(prev => prev.map(p => p.taskCount > 0 ? { ...p, taskCount: p.taskCount - 1, updatedAt: new Date().toISOString() } : p));
  }, []);

  const respondToTask = useCallback(async (taskId: string, response: 'accepted' | 'declined') => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assigneeResponse: response, status: response === 'accepted' ? 'in-progress' : t.status, updatedAt: new Date().toISOString() } : t));
  }, []);

  const value: GroupContextType = {
    groups,
    projects,
    tasks,
    loading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    addMember,
    removeMember,
    changeMemberRole,
    joinGroup,
    leaveGroup,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    updateTask,
    deleteTask,
    respondToTask,
  };

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}

export function useGroups() {
  const ctx = useContext(GroupContext);
  if (!ctx) throw new Error('useGroups must be used within GroupProvider');
  return ctx;
}

export default GroupProvider;
