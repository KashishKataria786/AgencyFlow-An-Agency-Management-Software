import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

import { useLayout } from "../../context/LayoutContext";

const Layout = ({ children, role }) => {
  const { isSidebarCollapsed } = useLayout();

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role={role} />
      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} flex flex-col transition-all duration-300`}>
        <Header />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
