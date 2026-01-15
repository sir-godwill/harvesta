import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: ReactNode;
}

// Pages where the mobile bottom nav should NOT appear
const hiddenNavPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/checkout',
];

import { useTracking } from '@/hooks/useTracking';

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  useTracking(); // Initialize global tracking

  // Check if current path should hide the mobile nav
  const shouldHideNav = hiddenNavPaths.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <div className="hidden lg:block">
        <Header />
      </div>
      {children}
      {/* Mobile Bottom Nav - shown globally except on excluded pages */}
      {!shouldHideNav && <MobileNav />}
    </>
  );
}
