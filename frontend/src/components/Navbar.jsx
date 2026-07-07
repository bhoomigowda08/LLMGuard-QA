import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, Bell, Shield } from 'lucide-react';

const Navbar = ({ toggleMobileSidebar, currentPathName }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 border-b bg-darkbg/85 backdrop-blur-md border-darkborder">
      {/* Left section: mobile hamburger & page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileSidebar}
          className="p-1 text-slate-400 rounded-md hover:bg-darkborder hover:text-white md:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-medium">Framework /</span>
          <span className="text-slate-200 text-sm font-semibold capitalize">{currentPathName || 'Home'}</span>
        </div>
      </div>

      {/* Right section: user actions & notifications */}
      <div className="flex items-center gap-6">
        {/* Notifications Mock Bell */}
        <button className="relative p-1.5 text-slate-400 hover:text-white hover:bg-darkborder rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brandblue animate-ping"></span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brandblue"></span>
        </button>

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-4 pl-4 border-l border-darkborder">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-semibold text-slate-200 leading-none">{user.username}</span>
              <span className="text-[10px] text-slate-500 font-mono capitalize mt-1 flex items-center justify-end gap-1">
                <Shield size={10} className="text-brandblue" />
                {user.role}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-darkborder flex items-center justify-center text-slate-300">
                <User size={16} />
              </div>
              <button
                onClick={logout}
                title="Logout from session"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
