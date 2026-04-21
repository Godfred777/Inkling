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
import {
  getProjectsByUser,
  getProjectsByGroupMembership,
  createProject as createProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
  getProjectById
} from '@/api/projects';

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

  // Fetch groups and projects when user authenticates
  useEffect(() => {
    const fetchGroupsAndProjects = async () => {
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
        
        const [groupsData, projectsData, groupProjectsData] = await Promise.all([
          getGroupsWithUser(),
          getProjectsByUser(),
          getProjectsByGroupMembership()
        ]);
        
        // Transform Supabase groups data to app format
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

        // Transform and merge projects data (user projects + group projects)
        const allProjectIds = new Set();
        const transformedProjects: Project[] = [];

        // Process user's created projects
        if (projectsData) {
          projectsData.forEach((p: any) => {
            allProjectIds.add(p.id.toString());
            transformedProjects.push({
              id: p.id.toString(),
              name: p.name,
              description: p.description || '',
              createdAt: p.created_at || new Date().toISOString(),
              updatedAt: p.updated_at || new Date().toISOString(),
              members: [], // Will be populated from group members if applicable
              taskCount: 0,
              groupId: p.group_id?.toString(),
            });
          });
        }

        // Process group membership projects (avoid duplicates)
        if (groupProjectsData) {
          groupProjectsData.forEach((p: any) => {
            const projectId = p.id.toString();
            if (!allProjectIds.has(projectId)) {
              allProjectIds.add(projectId);
              transformedProjects.push({
                id: projectId,
                name: p.name,
                description: p.description || '',
                createdAt: p.created_at || new Date().toISOString(),
                updatedAt: p.updated_at || new Date().toISOString(),
                members: [], // Will be populated from group members
                taskCount: 0,
                groupId: p.group_id?.toString(),
              });
            }
          });
        }

        setProjects(transformedProjects);
      } catch (err) {
        console.error('Error fetching groups and projects:', err);
        setError('Failed to load data. Please try again.');
        setGroups([]);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupsAndProjects();
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
    try {
      const newProjectData = await createProjectApi(
        p.name || 'New Project',
        p.description,
        p.groupId
      );
      
      const newProject: Project = {
        id: newProjectData.id.toString(),
        name: newProjectData.name,
        description: newProjectData.description || '',
        createdAt: newProjectData.created_at || new Date().toISOString(),
        updatedAt: newProjectData.updated_at || new Date().toISOString(),
        members: [], // Will be populated from group members if applicable
        taskCount: 0,
        groupId: p.groupId,
      };
      
      setProjects(prev => [newProject, ...prev]);
      
      // Update group's projectIds if this project belongs to a group
      if (p.groupId) {
        setGroups(prev => prev.map(g => 
          g.id === p.groupId 
            ? { ...g, projectIds: [...g.projectIds, newProject.id], updatedAt: new Date().toISOString() } 
            : g
        ));
      }
      
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    try {
      const updatedData = await updateProjectApi(
        id,
        data.name,
        data.description,
        data.groupId
      );
      
      let updated: Project | undefined;
      setProjects(prev => prev.map(p => {
        if (p.id !== id) return p;
        updated = {
          ...p,
          name: updatedData.name,
          description: updatedData.description || p.description,
          groupId: updatedData.group_id !== undefined ? updatedData.group_id?.toString() : p.groupId,
          updatedAt: updatedData.updated_at || new Date().toISOString(),
        };
        return updated!;
      }));
      return updated as Project;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await deleteProjectApi(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      setGroups(prev => prev.map(g => ({ 
        ...g, 
        projectIds: g.projectIds.filter(pid => pid !== id), 
        updatedAt: new Date().toISOString() 
      })));
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
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
