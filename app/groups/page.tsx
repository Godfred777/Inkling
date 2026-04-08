'use client';

import React, { useState } from 'react';
import { useGroups } from '@/contexts/GroupContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Users, FolderOpen, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function GroupsPage() {
  const { groups, projects, tasks, deleteGroup, createGroup } = useGroups();
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    setIsCreating(true);
    try {
      await createGroup({ name: newGroupName, description: '' });
      setNewGroupName('');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-surface">
        <Header title="Groups" subtitle="Manage and organize your teams" />

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Create Group Card */}
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Create New Group</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="flex-1 px-3 py-2 rounded-lg border bg-surface text-on-surface"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateGroup()}
              />
              <Button onClick={handleCreateGroup} disabled={isCreating || !newGroupName.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </Card>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => {
              const groupProjects = projects.filter(p => p.groupId === group.id);
              const groupTasks = tasks.filter(t => t.groupId === group.id);
              const completedTasks = groupTasks.filter(t => t.status === 'done');

              return (
                <Link key={group.id} href={`/groups/${group.id}`}>
                  <Card className="p-6 cursor-pointer hover:shadow-ambient transition-all h-full flex flex-col">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="text-xl font-semibold text-on-surface">{group.name}</h2>
                        <Badge variant="primary" size="sm">{group.members.length}</Badge>
                      </div>
                      <p className="text-sm text-on-surface-variant">{group.description || 'No description'}</p>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-on-surface-variant">{group.members.length} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FolderOpen className="w-4 h-4 text-primary" />
                        <span className="text-on-surface-variant">{groupProjects.length} projects</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-on-surface-variant">{completedTasks.length}/{groupTasks.length} tasks done</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-on-surface-variant/10">
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 3).map((m) => (
                          <div
                            key={m.id}
                            className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container text-xs flex items-center justify-center border-2 border-surface"
                            title={m.user.name}
                          >
                            {m.user.name.charAt(0)}
                          </div>
                        ))}
                        {group.members.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant text-xs flex items-center justify-center border-2 border-surface font-semibold">
                            +{group.members.length - 3}
                          </div>
                        )}
                      </div>
                      <Button variant="secondary" size="sm" onClick={(e) => { e.preventDefault(); deleteGroup(group.id); }}>
                        Delete
                      </Button>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {groups.length === 0 && (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-on-surface mb-2">No groups yet</h3>
              <p className="text-on-surface-variant mb-6">Create your first group to get started with team collaboration</p>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
