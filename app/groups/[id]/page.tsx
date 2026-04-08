'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGroups } from '@/contexts/GroupContext';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Users, Plus, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { MemberManagement } from '@/components/groups/MemberManagement';

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  const { groups, projects, tasks, changeMemberRole, removeMember, updateGroup } = useGroups();

  const group = groups.find(g => g.id === groupId);
  const groupProjects = projects.filter(p => p.groupId === groupId);
  const groupTasks = tasks.filter(t => t.groupId === groupId);

  if (!group) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-on-surface mb-4">Group not found</h2>
            <Button onClick={() => router.push('/groups')}>Back to Groups</Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-surface">
        <Header 
          title={group.name} 
          subtitle={group.description || 'Group management'}
        />

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Back Button */}
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Projects */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Projects ({groupProjects.length})</h3>
                  <Link href={`/projects/new?groupId=${groupId}`}>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Project
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  {groupProjects.length === 0 ? (
                    <p className="text-on-surface-variant py-4">No projects in this group yet</p>
                  ) : (
                    groupProjects.map(p => (
                      <Link key={p.id} href={`/projects/${p.id}`}>
                        <div className="p-3 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-on-surface">{p.name}</h4>
                              <p className="text-sm text-on-surface-variant">{p.taskCount} tasks</p>
                            </div>
                            <span className="text-xs text-on-surface-variant">{p.members.length} members</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </Card>

              {/* Tasks */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Tasks ({groupTasks.length})</h3>
                  <Link href={`/tasks/new?groupId=${groupId}`}>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Task
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  {groupTasks.length === 0 ? (
                    <p className="text-on-surface-variant py-4">No tasks in this group yet</p>
                  ) : (
                    groupTasks.map(t => (
                      <div key={t.id} className="p-3 rounded-lg bg-surface-container flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-on-surface">{t.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={t.status === 'done' ? 'success' : 'default'} size="sm">
                              {t.status}
                            </Badge>
                            <span className="text-xs text-on-surface-variant">Due {new Date(t.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {t.assignee && (
                          <span className="text-xs bg-primary-container text-on-primary-container px-2 py-1 rounded">
                            {t.assignee.name}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar - Members Management */}
            <div className="space-y-6">
              <MemberManagement groupId={groupId} />

              {/* Group Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Total Members</span>
                    <span className="font-semibold">{group.members.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Total Projects</span>
                    <span className="font-semibold">{groupProjects.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Total Tasks</span>
                    <span className="font-semibold">{groupTasks.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Completed Tasks</span>
                    <span className="font-semibold">{groupTasks.filter(t => t.status === 'done').length}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
