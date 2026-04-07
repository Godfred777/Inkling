import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/Sidebar';
import { projects, tasks, users } from '@/lib/dummyData';
import { TrendingUp, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Projects', value: projects.length, icon: TrendingUp, color: 'text-primary' },
    { label: 'Active Tasks', value: tasks.filter(t => t.status === 'in-progress').length, icon: Clock, color: 'text-tertiary' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'done').length, icon: CheckCircle, color: 'text-success' },
    { label: 'At Risk', value: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length, icon: AlertCircle, color: 'text-warning' },
  ];

  const recentTasks = tasks.slice(0, 4);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header 
          title="Dashboard" 
          subtitle="Welcome back! Here's what's happening with your projects."
        />
        

        <main className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} variant="default">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-surface-container-high ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-display-md font-display font-semibold text-on-surface">
                      {stat.value}
                    </p>
                    <p className="text-label-md text-on-surface-variant">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Projects Overview */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Your ongoing projects and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary font-display font-semibold group-hover:bg-primary-container transition-all">
                            {project.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-on-surface group-hover:text-primary transition-colors">{project.name}</h4>
                            <p className="text-sm text-on-surface-variant">{project.taskCount} tasks</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <AvatarGroup users={project.members} size="sm" />
                          <ArrowRight className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="cognitive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  AI Insights
                  <Badge variant="tertiary" size="sm">New</Badge>
                </CardTitle>
                <CardDescription>Cognitive recommendations for your workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-surface-container/50 border border-outline-variant/10">
                    <p className="text-body-sm text-on-surface">
                      <span className="text-tertiary font-semibold">Pro-Tip:</span> Your team completes 30% more tasks on Tuesdays. Consider scheduling complex work early in the week.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container/50 border border-outline-variant/10">
                    <p className="text-body-sm text-on-surface">
                      <span className="text-primary font-semibold">Suggestion:</span> The "E-commerce Platform" project has 3 high-priority tasks due this week. Consider resource reallocation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tasks */}
          <Card variant="default">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Tasks</CardTitle>
                  <CardDescription>Tasks updated in the last 7 days</CardDescription>
                </div>
                <Button variant="secondary" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-all cursor-pointer group">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-warning' :
                        task.priority === 'medium' ? 'bg-primary' : 'bg-success'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-on-surface group-hover:text-primary transition-colors">
                          {task.title}
                        </h4>
                        <p className="text-sm text-on-surface-variant line-clamp-1">
                          {task.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        task.status === 'done' ? 'success' :
                        task.status === 'in-progress' ? 'primary' :
                        task.status === 'review' ? 'warning' : 'default'
                      }>
                        {task.status.replace('-', ' ')}
                      </Badge>
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
    </div>
  );
}
