import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import SubmitReport from "./pages/Wash/SubmitReport";
import CoverageDashboard from "./pages/Wash/CoverageDashboard";
import ReportsList from "./pages/Wash/ReportsList";
import PartnersDirectory from "./pages/Wash/PartnersDirectory";
import SectorSettings from "./pages/Admin/SectorSettings";
import UserManagement from "./pages/Admin/UserManagement";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WashDataProvider } from "./context/WashDataContext";
import LandingPage from "./pages/Landing/LandingPage";

import PublicLayout from "./layout/PublicLayout";

/**
 * Route guard that strictly restricts access to users with the 'admin' role.
 */
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

/**
 * Route guard that allows access to users with 'admin' or 'coordinator' roles.
 */
function AdminOrCoordinatorRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "coordinator")) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function MainRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* 1. Standalone Public Pages with Shared Top Navbar & Layout (Home, Dashboard, 5W Reporting) - NO Sidebar */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/dashboard" element={<CoverageDashboard />} />
        <Route path="/coverage-dashboard" element={<CoverageDashboard />} />
        <Route path="/submit-report" element={<SubmitReport />} />
      </Route>

      {/* 2. State Coordinator and Admin Workspace (Requires authentication via AppLayout with sidebar) */}
      <Route path="/admin" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Home />} />
        <Route
          path="settings"
          element={
            <AdminRoute>
              <SectorSettings />
            </AdminRoute>
          }
        />
        <Route
          path="users"
          element={
            <AdminOrCoordinatorRoute>
              <UserManagement />
            </AdminOrCoordinatorRoute>
          }
        />
      </Route>

      {/* Internal Management Routes (with AppSidebar) */}
      <Route element={<AppLayout />}>
        <Route path="/coordinator/dashboard" element={<Home />} />
        <Route path="/reports-list" element={<ReportsList />} />
        <Route path="/profile" element={<UserProfiles />} />
        <Route path="/form-elements" element={<FormElements />} />
        <Route path="/basic-tables" element={<BasicTables />} />
        <Route path="/blank" element={<Blank />} />
        <Route path="/partners" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Legacy /TailAdmin Base Path Support */}
      <Route path="/TailAdmin" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="reports-list" element={<ReportsList />} />
        <Route path="profile" element={<UserProfiles />} />
      </Route>

      {/* Legacy TailAdmin aliases */}
      <Route path="/TailAdmin/landing" element={<LandingPage />} />
      <Route path="/TailAdmin/home" element={<LandingPage />} />

      {/* Centered Login Page (No Signup Allowed) */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<Navigate to="/signin" replace />} />
      <Route path="/TailAdmin/signin" element={<SignIn />} />
      <Route path="/TailAdmin/signup" element={<Navigate to="/signin" replace />} />

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WashDataProvider>
        <Router>
          <ScrollToTop />
          <MainRoutes />
        </Router>
      </WashDataProvider>
    </AuthProvider>
  );
}
