'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/Sidebar';
import { projects, tasks, users } from '@/lib/dummyData';
import { 
  ArrowLeft, 
  Plus, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  FileText,
  MoreVertical,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';

type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

interface AIInsight {
  id: string;
  content: string;
  type: 'pro-tip' | 'risk-alert' | 'suggestion';
  taskId?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Find the project (in real app, fetch from API)
  const project = projects.find(p => p.id === projectId) || projects[0];
  const projectTasks = tasks.filter(t => t.projectId === projectId);

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

  const priorityColors = {
    'low': 'default',
    'medium': 'primary',
    'high': 'warning',
  } as const;

  const stats = {
    total: projectTasks.length,
    completed: projectTasks.filter(t => t.status === 'done').length,
    inProgress: projectTasks.filter(t => t.status === 'in-progress').length,
    atRisk: projectTasks.filter(t => t.priority === 'high' && t.status !== 'done').length,
  };

  const handleGenerateAIInsights = async () => {
    setIsGeneratingInsights(true);
    setShowAIInsights(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingInsights(false);
  };

  const handleAddTask = () => {
    setShowTaskModal(true);
  };

  const handleTaskCreated = (newTask: typeof tasks[0]) => {
    // In real app, this would update state or refetch from API
    console.log('New task created:', newTask);
    setShowTaskModal(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header 
          title={project.name} 
          subtitle={project.description}
        />
        
        <main className="p-8">
          {/* Back Button & Actions */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary"
                size="sm"
                onClick={handleGenerateAIInsights}
                disabled={isGeneratingInsights}
              >
                <Sparkles className={cn(
                  "w-4 h-4 mr-2",
                  isGeneratingInsights ? "animate-pulse" : ""
                )} />
                {isGeneratingInsights ? 'Analyzing...' : 'AI Insights'}
              </Button>
              <Button 
                variant="primary"
                size="sm"
                onClick={handleAddTask}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card variant="default">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-lg bg-surface-container-high text-on-surface">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-display-md font-display font-semibold text-on-surface">
                    {stats.total}
                  </p>
                  <p className="text-label-md text-on-surface-variant">Total Tasks</p>
                </div>
              </CardContent>
            </Card>
            <Card variant="default">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-lg bg-primary-container/20 text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-display-md font-display font-semibold text-on-surface">
                    {stats.inProgress}
                  </p>
                  <p className="text-label-md text-on-surface-variant">In Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card variant="default">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-lg bg-success/20 text-success">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-display-md font-display font-semibold text-on-surface">
                    {stats.completed}
                  </p>
                  <p className="text-label-md text-on-surface-variant">Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card variant="default">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-lg bg-warning/20 text-warning">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-display-md font-display font-semibold text-on-surface">
                    {stats.atRisk}
                  </p>
                  <p className="text-label-md text-on-surface-variant">At Risk</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Tasks List */}
            <div className="col-span-2">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Project Tasks</CardTitle>
                  <CardDescription>
                    Track and manage all tasks in this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projectTasks.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 mx-auto text-on-surface-variant/30 mb-4" />
                        <h3 className="text-body-lg font-medium text-on-surface mb-2">
                          No tasks yet
                        </h3>
                        <p className="text-body-sm text-on-surface-variant mb-4">
                          Get started by creating your first task
                        </p>
                        <Button variant="primary" onClick={handleAddTask}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Task
                        </Button>
                      </div>
                    ) : (
                      projectTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className="flex items-center justify-between p-4 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/10 hover:border-outline-variant/20"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              statusColors[task.status]
                            )} />
                            <div className="flex-1">
                              <h4 className="font-medium text-on-surface mb-1">
                                {task.title}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {task.dueDate}
                                </span>
                                {task.assignee && (
                                  <Avatar user={task.assignee} size="sm" />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={priorityColors[task.priority]}
                              size="sm"
                            >
                              {task.priority}
                            </Badge>
                            <div className={cn(
                              "px-3 py-1 rounded-md text-label-sm",
                              statusColors[task.status]
                            )}>
                              {statusLabels[task.status]}
                            </div>
                            <button className="text-on-surface-variant hover:text-on-surface">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Info & AI Insights */}
            <div className="col-span-1 space-y-6">
              {/* Team Members */}
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                  <CardDescription>Project collaborators</CardDescription>
                </CardHeader>
                <CardContent>
                  <AvatarGroup users={project.members} size="md" />
                </CardContent>
              </Card>

              {/* AI Insights Panel */}
              {showAIInsights && (
                <Card variant="cognitive">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-tertiary" />
                      AI Insights
                    </CardTitle>
                    <CardDescription>
                      Smart recommendations for your project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-surface-container/50 border border-outline-variant/10">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-tertiary/20">
                          <Sparkles className="w-4 h-4 text-tertiary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-body-sm font-semibold text-on-surface mb-1">
                            Recommended Tasks to Commit
                          </h4>
                          <p className="text-body-sm text-on-surface-variant mb-3">
                            Based on project patterns and team capacity, consider adding these tasks:
                          </p>
                          <ul className="space-y-2">
                            <li className="text-body-sm text-on-surface flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-primary" />
                              User testing for checkout flow
                            </li>
                            <li className="text-body-sm text-on-surface flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-primary" />
                              Performance optimization review
                            </li>
                            <li className="text-body-sm text-on-surface flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-primary" />
                              Mobile responsive adjustments
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-surface-container/50 border border-outline-variant/10">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-warning/20">
                          <AlertCircle className="w-4 h-4 text-warning" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-body-sm font-semibold text-on-surface mb-1">
                            Risk Alert
                          </h4>
                          <p className="text-body-sm text-on-surface-variant">
                            You have {stats.atRisk} high-priority tasks that are not yet completed. 
                            Consider reallocating resources or adjusting timelines.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-surface-container/50 border border-outline-variant/10">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-primary/20">
                          <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-body-sm font-semibold text-on-surface mb-1">
                            Pro-Tip
                          </h4>
                          <p className="text-body-sm text-on-surface-variant">
                            Your team completes 40% more tasks when they're broken into smaller subtasks. 
                            Consider splitting larger tasks.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Metadata */}
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-label-sm text-on-surface-variant mb-1">Created</p>
                    <p className="text-body-sm text-on-surface">{project.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant mb-1">Last Updated</p>
                    <p className="text-body-sm text-on-surface">{project.updatedAt}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Add Task Modal would go here - simplified version below */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card variant="default" className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>Create a new task for this project</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleTaskCreated({
                  id: Date.now().toString(),
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  status: 'todo',
                  priority: formData.get('priority') as 'low' | 'medium' | 'high',
                  dueDate: formData.get('dueDate') as string,
                  projectId: project.id,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-body-md font-medium text-on-surface mb-2">
                      Task Title *
                    </label>
                    <input
                      name="title"
                      type="text"
                      required
                      className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter task title"
                    />
                  </div>
                  <div>
                    <label className="block text-body-md font-medium text-on-surface mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Describe the task"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-body-md font-medium text-on-surface mb-2">
                        Priority
                      </label>
                      <select
                        name="priority"
                        defaultValue="medium"
                        className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-body-md font-medium text-on-surface mb-2">
                        Due Date
                      </label>
                      <input
                        name="dueDate"
                        type="date"
                        required
                        className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => setShowTaskModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Create Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
