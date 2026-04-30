'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task, TaskContextType } from '@/types';
import {
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
  getTasksByProject,
  getTasksByUser,
  getTaskById,
  updateTaskStatus,
  assignTaskToUser
} from '@/api/tasks';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TASKS_STORAGE_KEY = 'inkling_tasks_v1';
const MOCK_DELAY = 400;

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasksByProject = useCallback(async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const tasksData = await getTasksByProject(projectId);
      
      const transformedTasks: Task[] = tasksData.map((t: any) => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description || '',
        status: t.status || 'todo',
        priority: t.priority || 'medium',
        dueDate: t.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: t.project_id?.toString() || '',
        groupId: t.group_id?.toString(),
        createdAt: t.created_at || new Date().toISOString(),
        updatedAt: t.updated_at || new Date().toISOString(),
        assigneeResponse: t.assignee_response || undefined,
      }));
      
      setTasks(transformedTasks);
      return transformedTasks;
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
      setTasks([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTasksByUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tasksData = await getTasksByUser();
      
      const transformedTasks: Task[] = tasksData.map((t: any) => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description || '',
        status: t.status || 'todo',
        priority: t.priority || 'medium',
        dueDate: t.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: t.project_id?.toString() || '',
        groupId: t.group_id?.toString(),
        createdAt: t.created_at || new Date().toISOString(),
        updatedAt: t.updated_at || new Date().toISOString(),
        assigneeResponse: t.assignee_response || undefined,
      }));
      
      setTasks(transformedTasks);
      return transformedTasks;
    } catch (err) {
      console.error('Error fetching user tasks:', err);
      setError('Failed to load tasks. Please try again.');
      setTasks([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTask = useCallback(async (id: string) => {
    try {
      const taskData = await getTaskById(id);
      const task: Task = {
        id: taskData.id.toString(),
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        dueDate: taskData.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: taskData.project_id?.toString() || '',
        groupId: taskData.group_id?.toString(),
        createdAt: taskData.created_at || new Date().toISOString(),
        updatedAt: taskData.updated_at || new Date().toISOString(),
        assigneeResponse: taskData.assignee_response || undefined,
      };
      return task;
    } catch (err) {
      console.error('Error fetching task:', err);
      throw err;
    }
  }, []);

  const createTask = useCallback(async (t: Partial<Task>) => {
    if (!t.projectId) {
      throw new Error('Project ID is required');
    }

    try {
      const newTaskData = await createTaskApi(
        t.projectId,
        t.title || 'New Task',
        t.description || '',
        t.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        t.priority || 'medium'
      );
      
      const newTask: Task = {
        id: newTaskData.id.toString(),
        title: newTaskData.title,
        description: newTaskData.description || '',
        status: newTaskData.status || 'todo',
        priority: newTaskData.priority || 'medium',
        dueDate: newTaskData.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: newTaskData.project_id?.toString() || '',
        groupId: t.groupId,
        createdAt: newTaskData.created_at || new Date().toISOString(),
        updatedAt: newTaskData.updated_at || new Date().toISOString(),
        assigneeResponse: newTaskData.assignee_response || undefined,
      };
      
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    try {
      const updates: { title?: string; description?: string; status?: string; priority?: string; dueDate?: string } = {};
      if (data.title) updates.title = data.title;
      if (data.description) updates.description = data.description;
      if (data.status) updates.status = data.status;
      if (data.priority) updates.priority = data.priority;
      if (data.dueDate) updates.dueDate = data.dueDate;

      const updatedData = await updateTaskApi(id, updates);
      
      let updated: Task | undefined;
      setTasks(prev => prev.map(t => {
        if (t.id !== id) return t;
        updated = {
          ...t,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return updated!;
      }));
      return updated as Task;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  }, []);

  const updateTaskStatus = useCallback(async (id: string, status: string) => {
    try {
      const updatedData = await updateTaskStatus(id, status);
      
      let updated: Task | undefined;
      setTasks(prev => prev.map(t => {
        if (t.id !== id) return t;
        updated = {
          ...t,
          status: updatedData.status,
          updatedAt: updatedData.updatedAt || new Date().toISOString(),
        };
        return updated!;
      }));
      return updated as Task;
    } catch (err) {
      console.error('Error updating task status:', err);
      throw err;
    }
  }, []);

  const assignTask = useCallback(async (taskId: string, assigneeId: string) => {
    try {
      const updatedData = await assignTaskToUser(taskId, assigneeId);
      
      setTasks(prev => prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          updatedAt: new Date().toISOString(),
        };
      }));
      return updatedData;
    } catch (err) {
      console.error('Error assigning task:', err);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await deleteTaskApi(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  }, []);

  const respondToTask = useCallback(async (taskId: string, response: 'accepted' | 'declined') => {
    await new Promise(r => setTimeout(r, MOCK_DELAY));
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            assigneeResponse: response, 
            status: response === 'accepted' ? 'in-progress' : t.status, 
            updatedAt: new Date().toISOString() 
          } 
        : t
    ));
  }, []);

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    fetchTasksByProject,
    fetchTasksByUser,
    getTask,
    createTask,
    updateTask,
    updateTaskStatus,
    assignTask,
    deleteTask,
    respondToTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
