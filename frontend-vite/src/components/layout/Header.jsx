import React from "react";
import { Bell, Search, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center bg-slate-50 border border-slate-100 rounded-sm px-4 py-2 w-96 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
        <Search size={18} className="text-slate-400 mr-2" />
        <input
          type="text"
          placeholder="Search everything..."
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-700"
        />
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-slate-400 hover:text-primary hover:bg-primary-light rounded-sm transition-all">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 bg-primary border-2 border-white text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-sm font-bold">3</span>
        </button>
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6 h-8">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || "Admin User"}</p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{user?.role === 'owner' ? 'Premium Plan' : user?.role || 'Guest'}</p>
          </div>
          <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center text-white font-bold shadow-sm uppercase">
            {user?.name?.substring(0, 2) || "AU"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
