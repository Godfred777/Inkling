"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Group, GroupContextType, GroupMember, GroupRole, Project, Task } from '@/types';
import { groups as initialGroups, projects as initialProjects, tasks as initialTasks } from '@/lib/dummyData';

const GroupContext = createContext<GroupContextType | undefined>(undefined);

const GROUPS_STORAGE_KEY = 'inkling_groups_v1';
const PROJECTS_STORAGE_KEY = 'inkling_projects_v1';
const TASKS_STORAGE_KEY = 'inkling_tasks_v1';
const MOCK_DELAY = 400;

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(GROUPS_STORAGE_KEY);
    if (stored) {
      try {
        setGroups(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored groups', e);
        setGroups(initialGroups);
      }
    } else {
      setGroups(initialGroups);
    }

    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (e) {
        console.error('Failed to parse stored projects', e);
        setProjects(initialProjects);
      }
    } else {
      setProjects(initialProjects);
    }

    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error('Failed to parse stored tasks', e);
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
  }, []);

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

  const createProject = useCallback(async (p: Partial<Project>) => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    const newProject: Project = {
      id: 'p_' + Date.now(),
      name: p.name || 'New Project',
      description: p.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: p.members || [],
      taskCount: 0,
      groupId: p.groupId,
    };
    setProjects(prev => [newProject, ...prev]);
    if (p.groupId) {
      setGroups(prev => prev.map(g => g.id === p.groupId ? { ...g, projectIds: [...g.projectIds, newProject.id], updatedAt: new Date().toISOString() } : g));
    }
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
