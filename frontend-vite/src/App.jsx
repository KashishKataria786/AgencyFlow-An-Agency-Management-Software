import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import FeaturesPage from "./pages/FeaturesPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import MemberDashboard from "./pages/MemberDashboard.jsx";
import ClientPortal from "./pages/ClientPortal.jsx";
import RoleBasedLayout from "./components/layout/RoleBasedLayout.jsx";
import TeamManagement from './pages/TeamManagement.jsx'
import ClientManagement from './pages/ClientManagement.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetails from './pages/ProjectDetails.jsx'
import MyTasks from './pages/MyTasks.jsx'
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import Financials from "./pages/Financials.jsx";
import ClientInvoices from "./pages/ClientInvoices.jsx";
import InvoiceView from "./pages/InvoiceView.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import Chat from "./pages/Chat.jsx";
import AgencySettings from "./pages/AgencySettings.jsx";
import ResourcePlanning from "./pages/ResourcePlanning.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import { LayoutProvider } from "./context/LayoutContext.jsx";

function App() {
  const { user } = useAuth();

  return (
    <LayoutProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <RegisterPage />} />

        {/* Root Redirect */}
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Root Route */}
        <Route path="/" element={<HomePage />} />

        {/* Owner Routes */}
        <Route path="/owner/*" element={
          <RoleBasedLayout allowedRoles={["owner"]}>
            <Routes>
              <Route path="dashboard" element={<OwnerDashboard />} />
              <Route path="clients" element={<ClientManagement />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<MyTasks />} />
              <Route path="projects/:id" element={<ProjectDetails />} />
              <Route path="financials" element={<Financials />} />
              <Route path="invoices/:id" element={<InvoiceView />} />
              <Route path="team" element={<TeamManagement />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="chat" element={<Chat />} />
              <Route path="capacity" element={<ResourcePlanning />} />
              <Route path="settings" element={<AgencySettings />} />
              <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
            </Routes>
          </RoleBasedLayout>
        } />

        {/* Member Routes */}
        <Route path="/member/*" element={
          <RoleBasedLayout allowedRoles={["member"]}>
            <Routes>
              <Route path="dashboard" element={<MemberDashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<ProjectDetails />} />
              <Route path="tasks" element={<MyTasks />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="chat" element={<Chat />} />
              <Route path="*" element={<Navigate to="/member/dashboard" replace />} />
            </Routes>
          </RoleBasedLayout>
        } />

        {/* Client Routes */}
        <Route path="/client/*" element={
          <RoleBasedLayout allowedRoles={["client"]}>
            <Routes>
              <Route path="project" element={<ClientPortal />} />
              <Route path="projects/:id" element={<ProjectDetails />} />
              <Route path="tasks" element={<MyTasks />} />
              <Route path="invoices" element={<ClientInvoices />} />
              <Route path="invoices/:id" element={<InvoiceView />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="chat" element={<Chat />} />
              <Route path="*" element={<Navigate to="/client/project" replace />} />
            </Routes>
          </RoleBasedLayout>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </LayoutProvider>
  );
}

export default App;
