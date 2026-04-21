'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/Sidebar';
import { useGroups } from '@/contexts/GroupContext';
import { ArrowLeft, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreateProjectPage() {
  const router = useRouter();
  const { createProject, groups } = useGroups();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createProject({ 
        name, 
        description, 
        groupId: selectedGroupId || undefined
      });
      
      router.push('/projects/');
    } catch (err) {
      console.error('Project creation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header 
          title="Create New Project" 
          subtitle="Define your project details and invite team members"
        />
        
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.back()}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 p-4 bg-error-container border border-error rounded-md">
                  <p className="text-body-md text-on-error-container">{error}</p>
                </div>
              )}

              <Card variant="default" className="mb-6">
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>Provide the basic details for your new project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label htmlFor="group" className="block text-body-md font-medium text-on-surface mb-2">
                      Group (Optional)
                    </label>
                    <select
                      id="group"
                      value={selectedGroupId}
                      onChange={(e) => setSelectedGroupId(e.target.value)}
                      className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">No Group</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-body-md font-medium text-on-surface mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter project name"
                      className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-body-md font-medium text-on-surface mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the project goals and scope"
                      rows={4}
                      className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {selectedGroupId && (
                <Card variant="default" className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Team Members
                    </CardTitle>
                    <CardDescription>
                      Team members will be automatically added from the selected group
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-on-surface-variant">
                      All members of "{groups.find(g => g.id === selectedGroupId)?.name}" will have access to this project.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isSubmitting || !name || !description}
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
