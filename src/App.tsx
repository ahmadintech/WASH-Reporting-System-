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

export default function App() {
  return (
    <AuthProvider>
      <WashDataProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Main Application Layout at Root */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="submit-report" element={<SubmitReport />} />
              <Route path="coverage-dashboard" element={<CoverageDashboard />} />
              <Route path="reports-list" element={<ReportsList />} />
              <Route path="partners" element={<PartnersDirectory />} />
              <Route
                path="admin/settings"
                element={
                  <AdminRoute>
                    <SectorSettings />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <AdminOrCoordinatorRoute>
                    <UserManagement />
                  </AdminOrCoordinatorRoute>
                }
              />
              <Route path="profile" element={<UserProfiles />} />
              <Route path="form-elements" element={<FormElements />} />
              <Route path="basic-tables" element={<BasicTables />} />
              <Route path="blank" element={<Blank />} />
            </Route>

            {/* Legacy /TailAdmin Base Path Support */}
            <Route path="/TailAdmin" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="submit-report" element={<SubmitReport />} />
              <Route path="coverage-dashboard" element={<CoverageDashboard />} />
              <Route path="reports-list" element={<ReportsList />} />
              <Route path="partners" element={<PartnersDirectory />} />
              <Route
                path="admin/settings"
                element={
                  <AdminRoute>
                    <SectorSettings />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <AdminOrCoordinatorRoute>
                    <UserManagement />
                  </AdminOrCoordinatorRoute>
                }
              />
              <Route path="profile" element={<UserProfiles />} />
              <Route path="form-elements" element={<FormElements />} />
              <Route path="basic-tables" element={<BasicTables />} />
              <Route path="blank" element={<Blank />} />
            </Route>

            {/* Centered Login Page (No Signup Allowed) */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Navigate to="/signin" replace />} />
            <Route path="/TailAdmin/signin" element={<SignIn />} />
            <Route path="/TailAdmin/signup" element={<Navigate to="/signin" replace />} />

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </WashDataProvider>
    </AuthProvider>
  );
}
