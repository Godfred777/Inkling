import { Project, Task, User, Resource, AIInsight, Notification, Group, GroupMember } from '@/types';

// Dummy Users
export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Owner',
  },
  {
    id: '2',
    name: 'Dorcas Smith',
    email: 'dorcas@example.com',
    role: 'Editor',
  },
  {
    id: '3',
    name: 'Emanuel Johnson',
    email: 'emanuel@example.com',
    role: 'Editor',
  },
  {
    id: '4',
    name: 'Mohammed Ali',
    email: 'mohammed@example.com',
    role: 'Viewer',
  },
];

// Dummy Projects
export const projects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the customer-facing e-commerce platform with modern UI/UX',
    createdAt: '2024-03-15',
    updatedAt: '2024-04-02',
    members: users.slice(0, 3),
    taskCount: 24,
  },
  {
    id: '2',
    name: 'Marketing Campaign Q2',
    description: 'Q2 2024 digital marketing campaign across all channels',
    createdAt: '2024-03-20',
    updatedAt: '2024-04-01',
    members: [users[0], users[1]],
    taskCount: 18,
  },
  {
    id: '3',
    name: 'Mobile App Development',
    description: 'Native iOS and Android app development for customer engagement',
    createdAt: '2024-02-10',
    updatedAt: '2024-04-03',
    members: users,
    taskCount: 42,
  },
];

// Dummy Tasks
export const tasks: Task[] = [
  {
    id: '1',
    title: 'Design homepage mockups',
    description: 'Create high-fidelity mockups for the new homepage design including hero section, featured products, and footer',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-04-10',
    assignee: users[1],
    projectId: '1',
    createdAt: '2024-03-15',
    updatedAt: '2024-04-02',
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up JWT-based authentication with refresh tokens and social login providers',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-04-15',
    assignee: users[2],
    projectId: '1',
    createdAt: '2024-03-16',
    updatedAt: '2024-03-16',
  },
  {
    id: '3',
    title: 'Write product descriptions',
    description: 'Create compelling product descriptions for the top 50 products in the catalog',
    status: 'done',
    priority: 'medium',
    dueDate: '2024-03-30',
    assignee: users[1],
    projectId: '1',
    createdAt: '2024-03-18',
    updatedAt: '2024-03-29',
  },
  {
    id: '4',
    title: 'Set up analytics tracking',
    description: 'Implement Google Analytics 4 and custom event tracking for user behavior',
    status: 'review',
    priority: 'medium',
    dueDate: '2024-04-05',
    assignee: users[2],
    projectId: '1',
    createdAt: '2024-03-20',
    updatedAt: '2024-04-01',
  },
  {
    id: '5',
    title: 'Create social media assets',
    description: 'Design graphics and templates for Instagram, Facebook, and LinkedIn posts',
    status: 'in-progress',
    priority: 'low',
    dueDate: '2024-04-12',
    assignee: users[1],
    projectId: '2',
    createdAt: '2024-03-22',
    updatedAt: '2024-04-01',
  },
  {
    id: '6',
    title: 'API integration for payment gateway',
    description: 'Integrate Stripe payment gateway with support for multiple currencies',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-04-20',
    projectId: '1',
    createdAt: '2024-03-25',
    updatedAt: '2024-03-25',
  },
];

// Dummy Resources
export const resources: Resource[] = [
  {
    id: '1',
    title: 'SRS Document v2.0',
    type: 'document',
    url: '#',
    projectId: '1',
    uploadedBy: users[0],
    createdAt: '2024-03-15',
  },
  {
    id: '2',
    title: 'Q2 Marketing Strategy Deck',
    type: 'presentation',
    url: '#',
    projectId: '2',
    uploadedBy: users[1],
    createdAt: '2024-03-20',
  },
  {
    id: '3',
    title: 'Live Demo - Checkout Flow',
    type: 'demo',
    url: '#',
    projectId: '1',
    uploadedBy: users[2],
    createdAt: '2024-03-28',
  },
  {
    id: '4',
    title: 'Competitor Analysis Report',
    type: 'link',
    url: 'https://example.com/report',
    projectId: '2',
    uploadedBy: users[0],
    createdAt: '2024-03-22',
  },
];

// Dummy AI Insights
export const aiInsights: AIInsight[] = [
  {
    id: '1',
    taskId: '1',
    content: 'Consider using a grid-based layout system for better responsiveness. Figma components can speed up your workflow.',
    type: 'pro-tip',
    createdAt: '2024-04-02',
  },
  {
    id: '2',
    taskId: '2',
    content: 'Risk Alert: JWT implementation requires careful attention to token expiration and refresh logic. Consider using established libraries like jose or next-auth.',
    type: 'risk-alert',
    createdAt: '2024-04-01',
  },
  {
    id: '3',
    taskId: '4',
    content: 'Pro-Tip: Set up custom conversion events in GA4 before launch. This will make post-launch analysis much easier.',
    type: 'pro-tip',
    createdAt: '2024-04-01',
  },
];

// Dummy Notifications
export const notifications: Notification[] = [
  {
    id: '1',
    title: 'Task Assigned',
    message: 'Dorcas Smith assigned you "Design homepage mockups" in E-commerce Platform Redesign',
    type: 'info',
    read: false,
    createdAt: '2024-04-02T10:30:00',
    link: '/tasks',
  },
  {
    id: '2',
    title: 'Task Completed',
    message: '"Write product descriptions" has been marked as done by Dorcas Smith',
    type: 'success',
    read: false,
    createdAt: '2024-04-02T09:15:00',
    link: '/tasks',
  },
  {
    id: '3',
    title: 'Deadline Approaching',
    message: '"Implement user authentication" is due in 3 days',
    type: 'warning',
    read: false,
    createdAt: '2024-04-01T16:45:00',
    link: '/tasks',
  },
  {
    id: '4',
    title: 'New Comment',
    message: 'Emanuel Johnson commented on "Set up analytics tracking": "Looks great, just a few minor adjustments needed"',
    type: 'info',
    read: true,
    createdAt: '2024-04-01T14:20:00',
    link: '/tasks',
  },
  {
    id: '5',
    title: 'Project Update',
    message: 'Marketing Campaign Q2 has been updated with new assets and resources',
    type: 'info',
    read: true,
    createdAt: '2024-04-01T11:00:00',
    link: '/resources',
  },
  {
    id: '6',
    title: 'Build Failed',
    message: 'The latest deployment for E-commerce Platform Redesign encountered an error',
    type: 'error',
    read: true,
    createdAt: '2024-03-31T18:30:00',
    link: '/tasks',
  },
  {
    id: '7',
    title: 'Review Requested',
    message: 'Emanuel Johnson requested your review on "Set up analytics tracking"',
    type: 'warning',
    read: true,
    createdAt: '2024-03-31T10:00:00',
    link: '/tasks',
  },
  {
    id: '8',
    title: 'Welcome to Inkling!',
    message: 'Get started by exploring your dashboard and setting up your first project',
    type: 'success',
    read: true,
    createdAt: '2024-03-15T08:00:00',
  },
];

// Dummy Groups
export const groups: Group[] = [
  {
    id: 'g1',
    name: 'Frontend Team',
    description: 'Handles UI/UX and frontend engineering',
    owners: [users[0]],
    members: [
      {
        id: 'm1',
        user: users[0],
        role: 'Owner',
        joinedAt: '2024-03-01',
      },
      {
        id: 'm2',
        user: users[1],
        role: 'Editor',
        joinedAt: '2024-03-05',
      },
      {
        id: 'm3',
        user: users[3],
        role: 'Viewer',
        joinedAt: '2024-03-07',
      },
    ],
    projectIds: ['1', '3'],
    createdAt: '2024-03-01',
    updatedAt: '2024-04-02',
  },
  {
    id: 'g2',
    name: 'Marketing Squad',
    description: 'Marketing and content team',
    owners: [users[1]],
    members: [
      {
        id: 'm4',
        user: users[1],
        role: 'Owner',
        joinedAt: '2024-03-10',
      },
      {
        id: 'm5',
        user: users[2],
        role: 'Editor',
        joinedAt: '2024-03-12',
      },
    ],
    projectIds: ['2'],
    createdAt: '2024-03-10',
    updatedAt: '2024-04-01',
  },
];
