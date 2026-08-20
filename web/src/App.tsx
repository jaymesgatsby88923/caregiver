import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/routing/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import MarketingPage from "@/features/marketing/MarketingPage";
import LoginPage from "@/features/auth/LoginPage";
import ResetPasswordPage from "@/features/auth/ResetPasswordPage";
import DashboardPage from "@/features/admin/dashboard/DashboardPage";
import ActivitiesPage from "@/features/admin/activities/ActivitiesPage";
import CaregiversPage from "@/features/admin/caregivers/CaregiversPage";
import ClientsPage from "@/features/admin/clients/ClientsPage";
import ShiftsPage from "@/features/admin/shifts/ShiftsPage";
import PlaceholderPage from "@/features/admin/PlaceholderPage";
import PortalShell from "@/components/layout/PortalShell";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MarketingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="activities" element={<ActivitiesPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="caregivers" element={<CaregiversPage />} />
              <Route path="shifts" element={<ShiftsPage />} />
              <Route
                path="users"
                element={
                  <PlaceholderPage
                    title="Users"
                    subtitle="Admin-created accounts for admins, caregivers, and clients."
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <PlaceholderPage
                    title="Settings"
                    subtitle="Agency configuration including open shift policy."
                  />
                }
              />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["caregiver"]} />}>
            <Route
              path="/caregiver"
              element={
                <PortalShell>
                  <PlaceholderPage
                    title="Caregiver Portal"
                    subtitle="My shifts, open shifts, and shift detail — coming soon."
                  />
                </PortalShell>
              }
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
            <Route
              path="/client"
              element={
                <PortalShell>
                  <PlaceholderPage
                    title="Client Portal"
                    subtitle="Schedule and shift comments — coming soon."
                  />
                </PortalShell>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
