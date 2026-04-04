'use client';

import { useState } from 'react';
import { X, Sparkles, Loader2, ExternalLink, Lightbulb, AlertTriangle, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Task, AIInsight } from '@/types';
import { cn } from '@/lib/utils';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  const [isHelpLoading, setIsHelpLoading] = useState(false);
  const [aiHelpContent, setAiHelpContent] = useState<string | null>(null);

  const handleAIHelp = async () => {
    setIsHelpLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      setAiHelpContent(`## Quick-Start Guide

1. **Review the requirements** - Carefully read through the task description and any linked documentation
2. **Set up your environment** - Ensure you have the necessary tools and access permissions
3. **Create a working branch** - Use the naming convention \`feature/task-{id}\`
4. **Implement the solution** - Follow best practices and coding standards
5. **Test thoroughly** - Write unit tests and verify edge cases
6. **Submit for review** - Create a pull request with clear description

## Resource List

- [Project Documentation](#) - Complete project overview
- [API Reference](#) - Backend API documentation
- [Design System](#) - UI components and guidelines
- [Similar Implementation](#) - Reference implementation from another module

## AI Insight

💡 **Pro-Tip**: Consider breaking this task into smaller subtasks if it's taking more than 4 hours. This makes progress tracking easier and reduces cognitive load.

⚠️ **Risk Alert**: This task involves authentication logic. Make sure to review security best practices and get a senior developer review before merging.`);
      setIsHelpLoading(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-surface/80 backdrop-blur-glass"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface-container-low rounded-lg shadow-ambient-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-outline-variant/15">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display text-headline-lg text-on-surface">
                {task.title}
              </h2>
              <Badge variant={
                task.status === 'done' ? 'success' :
                task.status === 'in-progress' ? 'primary' :
                task.status === 'review' ? 'warning' : 'default'
              }>
                {task.status.replace('-', ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-label-sm text-on-surface-variant">
              <span>Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              {task.assignee && (
                <div className="flex items-center gap-2">
                  <Avatar user={task.assignee} size="sm" />
                  <span>{task.assignee.name}</span>
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* AI Help Button */}
          <Card variant="cognitive" className="mb-6">
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-tertiary-fixed/20">
                  <Sparkles className="w-5 h-5 text-tertiary" />
                </div>
                <div>
                  <h3 className="font-medium text-on-surface">Need assistance?</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Get AI-powered guidance for this task
                  </p>
                </div>
              </div>
              <Button 
                variant="primary" 
                size="md"
                onClick={handleAIHelp}
                disabled={isHelpLoading}
              >
                {isHelpLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching & Synthesizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Help me with this task
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Help Content */}
          {aiHelpContent && (
            <Card variant="default" className="mb-6">
              <CardContent className="prose prose-invert max-w-none">
                <div className="text-on-surface">
                  <pre className="whitespace-pre-wrap font-sans text-body-md bg-transparent p-0">
                    {aiHelpContent}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-display font-semibold text-on-surface mb-3">
              Description
            </h3>
            <p className="text-body-md text-on-surface leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Activity Timeline */}
          <div>
            <h3 className="font-display font-semibold text-on-surface mb-4">
              Activity
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-label-sm">
                  {task.assignee?.name.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-body-md text-on-surface">
                    <span className="font-medium">{task.assignee?.name || 'User'}</span> created this task
                  </p>
                  <span className="text-label-sm text-on-surface-variant">
                    {new Date(task.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-outline-variant/15 bg-surface-container">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View in Board
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md">
              Mark as Review
            </Button>
            <Button variant="primary" size="md">
              Mark as Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
