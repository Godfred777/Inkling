"use client";

import React, { useState } from 'react';
import { useGroups } from '@/contexts/GroupContext';
import { useProjects } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function GroupsSettings() {
  const { groups, createGroup, deleteGroup, changeMemberRole, addMember, updateGroup } = useGroups();
  const { projects, getTasksByProject, createProject, createTask } = useProjects();
  const [name, setName] = useState('');
  const [newProjectNames, setNewProjectNames] = useState<Record<string, string>>({});
  const [newTaskTitles, setNewTaskTitles] = useState<Record<string, string>>({});

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createGroup({ name, description: '' });
    setName('');
  };

  const handleCreateProject = async (groupId: string) => {
    const projectName = newProjectNames[groupId]?.trim();
    if (!projectName) return;
    const created = await createProject({ name: projectName, description: '' }, groupId);
    // add project id to group
    const g = groups.find((x) => x.id === groupId);
    if (g) {
      await updateGroup(groupId, { projectIds: [...g.projectIds, created.id] });
    }
    setNewProjectNames(prev => ({ ...prev, [groupId]: '' }));
  };

  const handleCreateTask = async (projectId: string) => {
    const title = newTaskTitles[projectId]?.trim();
    if (!title) return;
    await createTask({ title, projectId });
    setNewTaskTitles(prev => ({ ...prev, [projectId]: '' }));
  };

  return (
    <div>
      <Card className="p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Create Group</h3>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New group name"
            className="flex-1 px-3 py-2 rounded-lg border bg-surface text-on-surface"
          />
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </Card>

      <div className="grid gap-4">
        {groups.map((g) => (
          <Card key={g.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{g.name}</h4>
                <p className="text-sm text-on-surface-variant">{g.description}</p>
                <p className="text-xs mt-2">Members: {g.members.length}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => deleteGroup(g.id)}>Delete</Button>
              </div>
            </div>

            <div className="mt-3">
              <h5 className="text-sm font-medium">Members</h5>
              <ul className="mt-2 space-y-2">
                {g.members.map((m) => (
                  <li key={m.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{m.user.name}</div>
                      <div className="text-xs text-on-surface-variant">{m.user.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={m.role}
                        onChange={async (e) => await changeMemberRole(g.id, m.id, e.target.value as any)}
                        className="rounded-md px-2 py-1 bg-surface border"
                      >
                        <option>Owner</option>
                        <option>Editor</option>
                        <option>Assignee</option>
                        <option>Viewer</option>
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h5 className="text-sm font-medium">Projects</h5>
              <div className="mt-2 space-y-3">
                <div className="flex gap-2">
                  <input
                    value={newProjectNames[g.id] || ''}
                    onChange={(e) => setNewProjectNames(prev => ({ ...prev, [g.id]: e.target.value }))}
                    placeholder="New project name"
                    className="flex-1 px-3 py-2 rounded-lg border bg-surface text-on-surface"
                  />
                  <Button onClick={() => handleCreateProject(g.id)}>Add Project</Button>
                </div>

                {projects.filter(p => g.projectIds.includes(p.id)).map(p => (
                  <div key={p.id} className="p-3 bg-surface-container rounded-md border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-on-surface-variant">{p.description}</div>
                      </div>
                    </div>

                    <div className="mt-2">
                      <h6 className="text-xs font-medium">Tasks</h6>
                      <ul className="mt-2 space-y-2">
                        {getTasksByProject(p.id).map(t => (
                          <li key={t.id} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{t.title}</div>
                              <div className="text-xs text-on-surface-variant">{t.status} • {t.priority}</div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-2 flex gap-2">
                        <input
                          value={newTaskTitles[p.id] || ''}
                          onChange={(e) => setNewTaskTitles(prev => ({ ...prev, [p.id]: e.target.value }))}
                          placeholder="New task title"
                          className="flex-1 px-3 py-2 rounded-lg border bg-surface text-on-surface"
                        />
                        <Button onClick={() => handleCreateTask(p.id)}>Add Task</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default GroupsSettings;
