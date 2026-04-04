// Core Types for Inkling

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Owner' | 'Editor' | 'Viewer';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members: User[];
  taskCount: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee?: User;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'document' | 'presentation' | 'demo' | 'link';
  url: string;
  projectId: string;
  uploadedBy: User;
  createdAt: string;
}

export interface AIInsight {
  id: string;
  taskId?: string;
  content: string;
  type: 'pro-tip' | 'risk-alert' | 'suggestion';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface TaskBoard {
  todo: Task[];
  'in-progress': Task[];
  review: Task[];
  done: Task[];
}
