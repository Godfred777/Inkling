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

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
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

// Authentication Types
export interface AuthSession {
  user: User & {
    preferences?: UserPreferences;
  };
  token: string;
  expiresAt: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  notifications: {
    email: boolean;
    push: boolean;
    taskUpdates: boolean;
    projectUpdates: boolean;
  };
  language: string;
  timezone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePreferences: (data: Partial<UserPreferences>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}
