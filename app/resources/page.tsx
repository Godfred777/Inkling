import { Header } from '@/components/ui/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/ui/Sidebar';
import { resources } from '@/lib/dummyData';
import { FileText, Presentation, Video, Link as LinkIcon, Upload, Search } from 'lucide-react';

const resourceIcons = {
  document: FileText,
  presentation: Presentation,
  demo: Video,
  link: LinkIcon,
};

const resourceColors = {
  document: 'text-primary',
  presentation: 'text-tertiary',
  demo: 'text-success',
  link: 'text-secondary',
};

export default function ResourcesPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 ml-64">
        <Sidebar/>
        <Header 
          title="Resource Hub" 
          subtitle="Centralized storage for project documents and assets"
        />
        
        <main className="p-8">
          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest rounded-md text-on-surface placeholder-on-surface-variant focus:outline-none input-focus-glow transition-all"
              />
            </div>
            <Button variant="primary" size="md">
              <Upload className="w-4 h-4 mr-2" />
              Upload Resource
            </Button>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-3 gap-6">
            {resources.map((resource) => {
              const Icon = resourceIcons[resource.type];
              return (
                <Card key={resource.id} variant="default" className="cursor-pointer hover:shadow-ambient group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg bg-surface-container-high ${resourceColors[resource.type]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="default" size="sm">
                        {resource.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-display font-semibold text-on-surface group-hover:text-primary transition-colors mb-2">
                      {resource.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar user={resource.uploadedBy} size="sm" />
                        <span className="text-label-sm text-on-surface-variant">
                          {resource.uploadedBy.name}
                        </span>
                      </div>
                      <span className="text-label-sm text-on-surface-variant">
                        {new Date(resource.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Empty State / Upload Prompt */}
            <Card variant="default" className="border-2 border-dashed border-outline-variant/30 hover:border-primary/50 transition-all cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center h-full py-12">
                <div className="p-4 rounded-full bg-surface-container-high group-hover:bg-primary-container/20 transition-all mb-4">
                  <Upload className="w-8 h-8 text-on-surface-variant group-hover:text-primary transition-all" />
                </div>
                <h3 className="font-display font-semibold text-on-surface mb-2">
                  Upload Resource
                </h3>
                <p className="text-body-sm text-on-surface-variant text-center mb-4">
                  Drag and drop files here or click to browse
                </p>
                <Button variant="secondary" size="sm">
                  Browse Files
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Categories Section */}
          <div className="mt-12">
            <h2 className="font-display text-headline-lg text-on-surface mb-6">
              Browse by Category
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Documents', count: 12, icon: FileText },
                { label: 'Presentations', count: 8, icon: Presentation },
                { label: 'Demos', count: 5, icon: Video },
                { label: 'External Links', count: 15, icon: LinkIcon },
              ].map((category) => (
                <Card key={category.label} variant="default" className="cursor-pointer hover:shadow-ambient">
                  <CardContent className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-surface-container-high">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-on-surface">{category.label}</h4>
                      <p className="text-label-sm text-on-surface-variant">{category.count} items</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
