
import { ReactNode } from 'react';
import AppSidebar from './AppSidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-[#f1f2f6]">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden w-full p-6">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
};

export default DashboardLayout;
