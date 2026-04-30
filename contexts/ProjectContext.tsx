'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, ProjectContextType } from '@/types';
import {
  getProjectsByUser,
  getProjectsByGroupMembership,
  createProject as createProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
  getProjectById
} from '@/api/projects';
import { useAuth } from './AuthContext';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const PROJECTS_STORAGE_KEY = 'inkling_projects_v1';

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [userProjects, groupProjects] = await Promise.all([
        getProjectsByUser(),
        getProjectsByGroupMembership()
      ]);
      
      const allProjectIds = new Set();
      const transformedProjects: Project[] = [];

      if (userProjects) {
        userProjects.forEach((p: any) => {
          allProjectIds.add(p.id.toString());
          transformedProjects.push({
            id: p.id.toString(),
            name: p.name,
            description: p.description || '',
            createdAt: p.created_at || new Date().toISOString(),
            updatedAt: p.updated_at || new Date().toISOString(),
            members: [],
            taskCount: 0,
            groupId: p.group_id?.toString(),
          });
        });
      }

      if (groupProjects) {
        groupProjects.forEach((p: any) => {
          const projectId = p.id.toString();
          if (!allProjectIds.has(projectId)) {
            allProjectIds.add(projectId);
            transformedProjects.push({
              id: projectId,
              name: p.name,
              description: p.description || '',
              createdAt: p.created_at || new Date().toISOString(),
              updatedAt: p.updated_at || new Date().toISOString(),
              members: [],
              taskCount: 0,
              groupId: p.group_id?.toString(),
            });
          }
        });
      }

      setProjects(transformedProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

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
        members: [],
        taskCount: 0,
        groupId: p.groupId,
      };
      
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  }, []);

  const getProject = useCallback(async (id: string) => {
    try {
      const projectData = await getProjectById(id);
      const project: Project = {
        id: projectData.id.toString(),
        name: projectData.name,
        description: projectData.description || '',
        createdAt: projectData.created_at || new Date().toISOString(),
        updatedAt: projectData.updated_at || new Date().toISOString(),
        members: [],
        taskCount: 0,
        groupId: projectData.group_id?.toString(),
      };
      return project;
    } catch (err) {
      console.error('Error fetching project:', err);
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
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  }, []);

  const value: ProjectContextType = {
    projects,
    loading,
    error,
    refreshProjects: fetchProjects,
    createProject,
    getProject,
    updateProject,
    deleteProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
