'use client';

import { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AvatarGroup } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/Sidebar';
import { projects } from '@/lib/dummyData';
import { Plus, Search, Filter, ArrowRight, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // For now, treat all projects as active (you can add status field later)
    const matchesFilter = filterStatus === 'all' || filterStatus === 'active';
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header 
          title="Projects" 
          subtitle="Manage and collaborate on your projects"
        />
        
        <main className="p-8">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <Link href="/projects/new">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <Card variant="default">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="w-16 h-16 text-on-surface-variant/30 mb-4" />
                <h3 className="text-display-sm font-display font-semibold text-on-surface mb-2">
                  No projects found
                </h3>
                <p className="text-body-md text-on-surface-variant mb-6 text-center">
                  {searchQuery 
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first project"}
                </p>
                {!searchQuery && (
                  <Link href="/projects/new">
                    <Button variant="primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Project
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card variant="default" className="cursor-pointer hover:shadow-ambient transition-all group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary font-display font-semibold text-body-lg group-hover:bg-primary-container transition-all">
                            {project.name.charAt(0)}
                          </div>
                          <div>
                            <CardTitle className="group-hover:text-primary transition-colors">
                              {project.name}
                            </CardTitle>
                            <CardDescription>
                              {project.taskCount} tasks
                            </CardDescription>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-body-sm text-on-surface-variant line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <AvatarGroup users={project.members} size="sm" />
                        <div className="flex items-center gap-4 text-label-sm text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created {project.createdAt}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-outline-variant/10">
                        <div className="flex items-center gap-2">
                          <Badge variant="primary" size="sm">
                            Active
                          </Badge>
                          <Badge variant="default" size="sm">
                            {project.members.length} members
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
