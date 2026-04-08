'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/Sidebar';
import { Avatar } from '@/components/ui/Avatar';
import { users } from '@/lib/dummyData';
import { ArrowLeft, Users, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreateProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement actual project creation API call
    console.log('Creating project:', { name, description, selectedMembers });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to the projects page after creation
    router.push('/projects/');
    setIsSubmitting(false);
  };

  const availableMembers = users.filter(u => !selectedMembers.includes(u.id));

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
              <Card variant="default" className="mb-6">
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>Provide the basic details for your new project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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

              <Card variant="default" className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>Select team members to collaborate on this project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Members */}
                  {selectedMembers.length > 0 && (
                    <div>
                      <h4 className="text-label-md font-medium text-on-surface-variant mb-3">
                        Selected Members ({selectedMembers.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMembers.map(memberId => {
                          const member = users.find(u => u.id === memberId);
                          if (!member) return null;
                          return (
                            <div
                              key={memberId}
                              className="flex items-center gap-2 px-3 py-2 bg-surface-container-high rounded-md"
                            >
                              <Avatar user={member} size="sm" />
                              <span className="text-body-sm text-on-surface">{member.name}</span>
                              <button
                                type="button"
                                onClick={() => toggleMember(memberId)}
                                className="text-on-surface-variant hover:text-on-surface"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Available Members */}
                  <div>
                    <h4 className="text-label-md font-medium text-on-surface-variant mb-3">
                      Available Members
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {availableMembers.map(member => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => toggleMember(member.id)}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-md border transition-all',
                            'hover:bg-surface-container hover:border-outline-variant/30',
                            selectedMembers.includes(member.id)
                              ? 'bg-surface-container-high border-outline-variant/40'
                              : 'bg-surface-container-lowest border-outline-variant/20'
                          )}
                        >
                          <Avatar user={member} size="sm" />
                          <div className="flex-1 text-left">
                            <p className="text-body-sm font-medium text-on-surface">{member.name}</p>
                            <p className="text-label-sm text-on-surface-variant">{member.role}</p>
                          </div>
                          <Plus className={cn(
                            'w-4 h-4',
                            selectedMembers.includes(member.id)
                              ? 'text-on-surface-variant'
                              : 'text-primary'
                          )} />
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

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
