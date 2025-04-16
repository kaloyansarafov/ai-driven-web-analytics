
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  FileSearch,
  Upload,
  Settings,
  HelpCircle,
  User,
  Home,
  LogOut,
  Bot,
  LineChart,
  Clock,
  Bug,
  FileText,
} from 'lucide-react';

type SidebarItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

const mainItems: SidebarItem[] = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Metrics', path: '/metrics', icon: LineChart },
  { name: 'Statistics', path: '/statistics', icon: BarChart3 },
  { name: 'Crawler', path: '/crawler', icon: Bug },
  { name: 'AI Helper', path: '/ai-helper', icon: Bot },
];

const bottomItems: SidebarItem[] = [
  { name: 'Support', path: '/support', icon: HelpCircle },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const AppSidebar: React.FC = () => {
  const location = useLocation();

  const renderNavItem = (item: SidebarItem) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.path}
        to={item.path}
        className={cn(
          "flex items-center px-4 py-3 my-1 rounded-lg text-sm transition-colors",
          isActive
            ? "bg-sidebar-accent text-primary font-medium"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary"
        )}
      >
        <item.icon className="mr-3 h-5 w-5" />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="h-screen w-64 bg-[#e6e7eb] border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">cre8tion lab</h1>
        <p className="text-xs text-gray-500">Accessibility & SEO Analysis</p>
      </div>
      
      {/* Profile section moved to the top */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <User className="h-4 w-4 text-gray-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">Profile</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
        <button className="p-1 rounded-md hover:bg-gray-200 text-gray-500">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="mb-6">
          {mainItems.map(renderNavItem)}
        </div>
        
        <div className="mb-2 px-4">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Support
          </h2>
        </div>
        
        {bottomItems.map(renderNavItem)}
      </nav>
    </div>
  );
};

export default AppSidebar;
