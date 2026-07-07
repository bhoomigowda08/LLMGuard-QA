import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlaySquare, 
  Search, 
  ShieldAlert, 
  FileText, 
  Bug, 
  User, 
  Settings,
  HelpCircle,
  EyeOff,
  Scale,
  Activity,
  History,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Prompt Testing', path: '/prompts', icon: PlaySquare },
    { name: 'Hallucination Detector', path: '/hallucination', icon: HelpCircle },
    { name: 'Sensitivity Analyzer', path: '/sensitivity', icon: Scale },
    { name: 'Context Leakage', path: '/leakage', icon: EyeOff },
    { name: 'Safety Analyzer', path: '/safety', icon: ShieldAlert },
    { name: 'Consistency Testing', path: '/consistency', icon: Activity },
    { name: 'Regression Testing', path: '/regression', icon: History },
    { name: 'Bug Reports', path: '/bug-reports', icon: Bug },
    { name: 'Export Reports', path: '/reports', icon: FileText },
    { name: 'Profile & Admin', path: '/profile', icon: User },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-transform bg-darkcard border-r border-darkborder ${
        isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'
      }`}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          {/* Logo Section */}
          <div className="flex items-center justify-between px-4 py-6 border-b border-darkborder">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-brandblue/10 rounded-lg text-brandblue flex-shrink-0">
                <ShieldCheck size={24} className="animate-pulse" />
              </div>
              {isOpen && (
                <span className="font-extrabold text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent truncate whitespace-nowrap">
                  LLMGuard QA
                </span>
              )}
            </div>
            
            {/* Collapse toggle (Desktop only) */}
            <button 
              onClick={toggleSidebar}
              className="hidden md:flex p-1 hover:bg-darkborder rounded-md text-slate-400 hover:text-white transition-colors"
            >
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group duration-200 ${
                    isActive
                      ? 'bg-brandblue/10 text-brandblue shadow-[inset_0_0_8px_rgba(59,130,246,0.15)] border-l-2 border-brandblue'
                      : 'text-slate-400 hover:bg-darkborder/50 hover:text-slate-100'
                  }`
                }
              >
                <item.icon size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                {isOpen && <span className="truncate">{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer of Sidebar */}
        <div className="p-4 border-t border-darkborder">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-brandblue/20 flex items-center justify-center text-brandblue font-semibold flex-shrink-0">
              QA
            </div>
            {isOpen && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-slate-200">LLMGuard System</span>
                <span className="text-[10px] text-slate-500 font-mono">v1.0.0 Stable</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
