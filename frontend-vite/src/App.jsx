import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import React, { lazy, Suspense, useEffect } from "react";
import "./App.css";
import { useAuth } from "./context/AuthContext.jsx";
import { LayoutProvider } from "./context/LayoutContext.jsx";
import { useUser } from "@clerk/clerk-react";

// Public Pages
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.jsx"));
const FeaturesPage = lazy(() => import("./pages/FeaturesPage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const AgencySetupPage = lazy(() => import("./pages/AgencySetupPage.jsx"));

// Owner Pages
const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard.jsx"));
// ... (rest of imports)
const TeamManagement = lazy(() => import('./pages/TeamManagement.jsx'));
const ClientManagement = lazy(() => import('./pages/ClientManagement.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails.jsx'));
const Financials = lazy(() => import("./pages/Financials.jsx"));
const InvoiceView = lazy(() => import("./pages/InvoiceView.jsx"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage.jsx"));
const CalendarPage = lazy(() => import("./pages/CalendarPage.jsx"));
const Chat = lazy(() => import("./pages/Chat.jsx"));
const AgencySettings = lazy(() => import("./pages/AgencySettings.jsx"));
const ResourcePlanning = lazy(() => import("./pages/ResourcePlanning.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const MyTasks = lazy(() => import('./pages/MyTasks.jsx'));
// Member Pages
const MemberDashboard = lazy(() => import("./pages/MemberDashboard.jsx"));

// Client Pages
const ClientPortal = lazy(() => import("./pages/ClientPortal.jsx"));
const ClientInvoices = lazy(() => import("./pages/ClientInvoices.jsx"));

const RoleBasedLayout = lazy(() => import("./components/layout/RoleBasedLayout.jsx"));

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium animate-pulse">Loading AgencyFlow...</p>
    </div>
  </div>
);

function App() {
  const { user, clerkSync, logout } = useAuth();
  const { user: clerkUser, isLoaded } = useUser();
  const navigate = useNavigate();

  // Sync Clerk User with our Backend
  useEffect(() => {
    const sync = async () => {
      if (isLoaded && clerkUser && !user) {
        console.log("Clerk User detected, syncing with backend...");
        const result = await clerkSync(clerkUser);
        if (result.success && !result.user.agencyId) {
          navigate("/setup-agency");
        }
      }

      // Handle Case where Clerk user is gone but local user still exists
      // (This ensures local state clears if Clerk signs out)
      if (isLoaded && !clerkUser && user && user.clerkId) {
        logout();
      }
    };
    sync();
  }, [clerkUser, isLoaded, user, clerkSync, navigate, logout]);

  // Protected Route for Agency Setup
  if (user && !user.agencyId && user.role === 'owner' && window.location.pathname !== '/setup-agency') {
    return <Navigate to="/setup-agency" replace />;
  }

  return (
    <LayoutProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={user ? (user.agencyId ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Navigate to="/setup-agency" replace />) : <LoginPage />} />
          <Route path="/register" element={user ? (user.agencyId ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Navigate to="/setup-agency" replace />) : <RegisterPage />} />

          {/* Root Redirect */}
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Root Route */}
          <Route path="/" element={<HomePage />} />

          {/* Agency Setup */}
          <Route path="/setup-agency" element={user ? <AgencySetupPage /> : <Navigate to="/login" replace />} />

          {/* Owner Routes */}
          <Route path="/owner/*" element={
            <RoleBasedLayout allowedRoles={["owner"]}>
              <Routes>
                <Route path="dashboard" element={<OwnerDashboard />} />
                <Route path="analytics" element={<Analytics />} />
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
      </Suspense>
    </LayoutProvider>
  );
}

export default App;
