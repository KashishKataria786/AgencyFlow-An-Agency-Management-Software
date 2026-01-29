import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    CheckSquare,
    FileText,
    Settings,
    LogOut,
    Bell,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Search,
    MessageSquare
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useLayout } from "../../context/LayoutContext";

const Sidebar = ({ role }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { unreadCount, unreadChatCount } = useSocket();
    const { isSidebarCollapsed, toggleSidebar } = useLayout();

    const ownerLinks = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/owner/dashboard" },
        { name: "Clients", icon: <Users size={20} />, path: "/owner/clients" },
        { name: "Projects", icon: <Briefcase size={20} />, path: "/owner/projects" },
        { name: "Tasks", icon: <CheckSquare size={20} />, path: "/owner/tasks" },
        { name: "Financials", icon: <FileText size={20} />, path: "/owner/financials" },
        { name: "Team", icon: <Users size={20} />, path: "/owner/team" },
        { name: "Chat", icon: <MessageSquare size={20} />, count: unreadChatCount, path: "/owner/chat" },
        { name: "Calendar", icon: <Calendar size={20} />, path: "/owner/calendar" },
    ];

    const memberLinks = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/member/dashboard" },
        { name: "My Projects", icon: <Briefcase size={20} />, path: "/member/projects" },
        { name: "My Tasks", icon: <CheckSquare size={20} />, path: "/member/tasks" },
        { name: "Chat", icon: <MessageSquare size={20} />, count: unreadChatCount, path: "/member/chat" },
        { name: "Calendar", icon: <Calendar size={20} />, path: "/member/calendar" },
    ];

    const clientLinks = [
        { name: "Our Project", icon: <Briefcase size={20} />, path: "/client/project" },
        { name: "Tasks", icon: <CheckSquare size={20} />, path: "/client/tasks" },
        { name: "Invoices", icon: <FileText size={20} />, path: "/client/invoices" },
        { name: "Chat", icon: <MessageSquare size={20} />, count: unreadChatCount, path: "/client/chat" },
        { name: "Calendar", icon: <Calendar size={20} />, path: "/client/calendar" },
    ];

    const links = role === "owner" ? ownerLinks : role === "member" ? memberLinks : clientLinks;

    return (
        <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} h-screen bg-white border-r border-slate-200 text-slate-900 flex flex-col fixed left-0 top-0 transition-all duration-300 z-50`}>
            <div className={`p-6 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-2'} border-b border-slate-100 relative`}>
                <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center text-white font-bold shrink-0">A</div>
                {!isSidebarCollapsed && <span className="text-xl font-bold tracking-tight whitespace-nowrap">AgencyFlow</span>}

                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-7 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:text-emerald-500 transition-colors z-50"
                >
                    {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        title={isSidebarCollapsed ? link.name : ""}
                        className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-2.5'} py-2.5 rounded-sm text-sm font-medium transition-all ${location.pathname === link.path
                            ? "bg-emerald-50 text-emerald-600 shadow-sm"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            } relative`}
                    >
                        <span className={`${location.pathname === link.path ? "text-emerald-500" : "text-slate-400"} shrink-0 relative`}>
                            {link.icon}
                            {link.count > 0 && isSidebarCollapsed && (
                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                            )}
                        </span>
                        {!isSidebarCollapsed && (
                            <div className="flex-1 flex justify-between items-center">
                                <span className="whitespace-nowrap">{link.name}</span>
                                {link.count > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                        {link.count > 9 ? "9+" : link.count}
                                    </span>
                                )}
                            </div>
                        )}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <Link
                    to={`/${role}/notifications`}
                    title={isSidebarCollapsed ? "Notifications" : ""}
                    className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-2.5'} mb-4 py-2.5 rounded-sm text-sm font-medium transition-all ${location.pathname === `/${role}/notifications`
                        ? "bg-emerald-50 text-emerald-600 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                >
                    <div className="relative shrink-0">
                        <Bell size={20} className={location.pathname === `/${role}/notifications` ? "text-emerald-500" : "text-slate-400"} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </div>
                    {!isSidebarCollapsed && <span>Notifications</span>}
                </Link>
                <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'} mb-4 px-2`}>
                    <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-sm flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {user?.name?.substring(0, 2) || "U"}
                    </div>
                    {!isSidebarCollapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold truncate">{user?.name || "User"}</p>
                            <p className="text-[10px] text-slate-500 truncate capitalize">{user?.role || role}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={logout}
                    title={isSidebarCollapsed ? "Sign Out" : ""}
                    className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-2.5'} w-full rounded-sm hover:bg-white hover:shadow-sm text-slate-600 text-sm font-medium transition-all group py-2.5`}
                >
                    <LogOut size={18} className="group-hover:text-red-500 shrink-0" />
                    {!isSidebarCollapsed && <span className="group-hover:text-red-500">Sign Out</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
