'use client';

import { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/Sidebar';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import { tasks } from '@/lib/dummyData';
import { Task } from '@/types';
import { List, LayoutGrid, Filter, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'board';
type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const statusColors = {
    'todo': 'bg-surface-container-high',
    'in-progress': 'bg-primary-container/20',
    'review': 'bg-warning/20',
    'done': 'bg-success/20',
  };

  const statusLabels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'review': 'Review',
    'done': 'Done',
  };

  if (viewMode === 'board') {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header 
            title="My Tasks" 
            subtitle="Manage and track your task progress"
          />
          
          <main className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setViewMode('board')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
              </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-4 gap-6">
              {(Object.keys(statusLabels) as TaskStatus[]).map((status) => {
                const statusTasks = tasks.filter(t => t.status === status);
                return (
                  <div key={status} className="space-y-3">
                    <div className={cn('px-4 py-2 rounded-lg', statusColors[status])}>
                      <h3 className="font-display font-semibold text-on-surface">
                        {statusLabels[status]}
                      </h3>
                      <p className="text-label-sm text-on-surface-variant">
                        {statusTasks.length} tasks
                      </p>
                    </div>
                    <div className="space-y-3">
                      {statusTasks.map((task) => (
                        <Card key={task.id} variant="default" className="cursor-pointer hover:shadow-ambient">
                          <CardContent onClick={() => setSelectedTask(task)}>
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-on-surface">{task.title}</h4>
                                <Badge 
                                  variant={task.priority === 'high' ? 'warning' : 'default'}
                                  size="sm"
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                              <p className="text-body-sm text-on-surface-variant line-clamp-2">
                                {task.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-label-sm text-on-surface-variant">
                                  Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                {task.assignee && (
                                  <Avatar user={task.assignee} size="sm" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
        {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
      </div>
    );
  }

  // List View
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header 
          title="My Tasks" 
          subtitle="Manage and track your task progress"
        />
        
        <main className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest rounded-md text-on-surface placeholder-on-surface-variant focus:outline-none input-focus-glow transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setViewMode('board')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>

          {/* Tasks List */}
          <Card variant="default">
            <CardContent className="p-0">
              <div className="divide-y divide-outline-variant/10">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => setSelectedTask(task)}
                    className="flex items-center gap-4 p-4 hover:bg-surface-container transition-all cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={task.status === 'done'}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-on-surface group-hover:text-primary transition-colors">
                        {task.title}
                      </h4>
                      <p className="text-body-sm text-on-surface-variant line-clamp-1">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        task.status === 'done' ? 'success' :
                        task.status === 'in-progress' ? 'primary' :
                        task.status === 'review' ? 'warning' : 'default'
                      }>
                        {task.status.replace('-', ' ')}
                      </Badge>
                      <span className="text-label-sm text-on-surface-variant">
                        Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {task.assignee && (
                        <Avatar user={task.assignee} size="sm" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
}
