"use client";

import React, { useState } from 'react';
import { useGroups } from '@/contexts/GroupContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function GroupsSettings() {
  const { groups, createGroup, deleteGroup, changeMemberRole, addMember } = useGroups();
  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createGroup({ name, description: '' });
    setName('');
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
          </Card>
        ))}
      </div>
    </div>
  );
}

export default GroupsSettings;
