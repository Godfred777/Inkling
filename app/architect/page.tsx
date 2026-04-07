'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sidebar } from '@/components/ui/Sidebar';
import { Avatar } from '@/components/ui/Avatar';
import { users } from '@/lib/dummyData';
import { Send, Sparkles, ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export default function ArchitectPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Architect. I'll help you set up a new project from scratch. Tell me about your project idea, goals, and requirements.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [blueprintOpen, setBlueprintOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Great! Based on your requirements, I've identified the following key components:\n\n**Tasks Identified**:\n- User authentication system\n- Database schema design\n- API endpoint development\n- Frontend component library\n\n**Resources Needed**:\n- SRS Document\n- Technical Architecture Diagram\n- UI/UX Mockups\n\nWould you like me to generate the complete project structure?",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 ml-64 flex flex-col">
        <Sidebar/>
        <Header 
          title="AI Architect" 
          subtitle="Conversational project setup powered by AI"
        />
        
        <main className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-4',
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  )}
                >
                  <Avatar 
                    name={message.role === 'user' ? 'JD' : 'AI'}
                    size="lg"
                    className={message.role === 'assistant' ? 'bg-tertiary-container text-on-tertiary-container' : ''}
                  />
                  <div
                    className={cn(
                      'max-w-2xl p-4 rounded-lg',
                      message.role === 'user'
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container text-on-surface'
                    )}
                  >
                    <p className="text-body-md whitespace-pre-wrap">{message.content}</p>
                    <span className="text-label-sm opacity-60 mt-2 block">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4">
                  <Avatar name="AI" size="lg" className="bg-tertiary-container text-on-tertiary-container" />
                  <div className="bg-surface-container p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-surface-container-low border-t border-outline-variant/15">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-4 bg-surface-container-lowest rounded-lg p-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your project idea..."
                    className="flex-1 bg-transparent text-on-surface placeholder-on-surface-variant resize-none focus:outline-none px-4 py-3 max-h-32 min-h-[48px]"
                    rows={1}
                  />
                  <Button 
                    variant="primary" 
                    size="md"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-label-sm text-on-surface-variant mt-2 text-center">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </div>
          </div>

          {/* Blueprint Panel */}
          <div
            className={cn(
              'flex flex-col border-l border-outline-variant/15 bg-surface-container-low transition-all duration-300 ease-in-out overflow-hidden',
              blueprintOpen ? 'w-96' : 'w-0 border-l-0'
            )}
          >
            <div className="flex flex-col min-w-96 w-96 h-full">
              <div className="flex-shrink-0 p-4 border-b border-outline-variant/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-tertiary" />
                  <h3 className="font-display font-semibold text-on-surface">
                    Project Blueprint
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBlueprintOpen(false)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Draft Tasks */}
                <div>
                  <h4 className="font-medium text-on-surface mb-3 flex items-center gap-2">
                    <Badge variant="primary" size="sm">Draft</Badge>
                    Tasks
                  </h4>
                  <div className="space-y-2">
                    {[
                      'User authentication system',
                      'Database schema design',
                      'API endpoint development',
                      'Frontend component library',
                    ].map((task, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all">
                        <div className="w-4 h-4 rounded border border-outline-variant mt-0.5" />
                        <span className="text-body-sm text-on-surface">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Draft Resources */}
                <div>
                  <h4 className="font-medium text-on-surface mb-3 flex items-center gap-2">
                    <Badge variant="primary" size="sm">Draft</Badge>
                    Resources
                  </h4>
                  <div className="space-y-2">
                    {[
                      'SRS Document',
                      'Technical Architecture Diagram',
                      'UI/UX Mockups',
                    ].map((resource, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all">
                        <Check className="w-4 h-4 text-success" />
                        <span className="text-body-sm text-on-surface">{resource}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Commit Action */}
              <div className="flex-shrink-0 p-4 border-t border-outline-variant/15">
                <Button variant="primary" size="lg" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Project Structure
                </Button>
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          {!blueprintOpen && (
            <button
              onClick={() => setBlueprintOpen(true)}
              className="flex-shrink-0 p-2 bg-surface-container-low border-l border-outline-variant/15 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
