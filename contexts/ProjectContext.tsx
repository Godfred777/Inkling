"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Project, Task } from '@/types';
import { projects as seedProjects, tasks as seedTasks } from '@/lib/dummyData';

type ProjectContextType = {
  projects: Project[];
  tasks: Task[];
  createProject: (p: Partial<Project>, groupId?: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  createTask: (t: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<Task | undefined>;
  deleteTask: (id: string) => Promise<void>;
  getTasksByProject: (projectId: string) => Task[];
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const PROJECTS_KEY = 'inkling_projects_v1';
const TASKS_KEY = 'inkling_tasks_v1';
const MOCK_DELAY = 300;

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const p = localStorage.getItem(PROJECTS_KEY);
    const t = localStorage.getItem(TASKS_KEY);
    if (p && t) {
      try {
        setProjects(JSON.parse(p));
        setTasks(JSON.parse(t));
        return;
      } catch (e) {
        console.error('Failed to parse stored projects/tasks', e);
      }
    }
    setProjects(seedProjects);
    setTasks(seedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const createProject = useCallback(async (p: Partial<Project>, groupId?: string) => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    const newProject: Project = {
      id: 'p_' + Date.now(),
      name: p.name || 'New Project',
      description: p.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: p.members || [],
      taskCount: 0,
    };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
  }, []);

  const createTask = useCallback(async (t: Partial<Task>) => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    const newTask: Task = {
      id: 't_' + Date.now(),
      title: t.title || 'New Task',
      description: t.description || '',
      status: t.status || 'todo',
      priority: t.priority || 'medium',
      dueDate: t.dueDate || new Date().toISOString(),
      assignee: t.assignee,
      projectId: t.projectId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setProjects((prev) => prev.map((p) => p.id === newTask.projectId ? { ...p, taskCount: (p.taskCount || 0) + 1 } : p));
    return newTask;
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    let updated: Task | undefined;
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      updated = { ...t, ...data, updatedAt: new Date().toISOString() };
      return updated!;
    }));
    return updated;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    const taskToDelete = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (taskToDelete) {
      setProjects((prev) => prev.map((p) => p.id === taskToDelete.projectId ? { ...p, taskCount: Math.max(0, (p.taskCount || 1) - 1) } : p));
    }
  }, [tasks]);

  const getTasksByProject = useCallback((projectId: string) => {
    return tasks.filter((t) => t.projectId === projectId);
  }, [tasks]);

  const value: ProjectContextType = {
    projects,
    tasks,
    createProject,
    deleteProject,
    createTask,
    updateTask,
    deleteTask,
    getTasksByProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider');
  return ctx;
}

export default ProjectProvider;
