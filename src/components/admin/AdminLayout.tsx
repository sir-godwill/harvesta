import { ReactNode, useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { MobileAdminSidebar } from './MobileAdminSidebar';
import { AdminProvider } from '@/contexts/AdminContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <AdminProvider>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        {!isMobile && <AdminSidebar />}
        
        {/* Mobile Sidebar */}
        <MobileAdminSidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
        
        <div className={isMobile ? '' : 'pl-64 transition-all duration-300'}>
          <AdminHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AdminProvider>
  );
}
