import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { GroupProvider } from '@/contexts/GroupContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Inkling - AI-Powered Project Management',
  description: 'A cognitive canvas for AI-assisted project management and collaboration',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body bg-surface text-on-surface antialiased min-h-screen">
        <AuthProvider>
          <ProjectProvider>
            <GroupProvider>
              <ProtectedRoute>{children}</ProtectedRoute>
            </GroupProvider>
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
