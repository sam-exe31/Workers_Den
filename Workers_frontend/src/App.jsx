import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTheme } from './theme/ThemeContext';
import ProtectedRoute from './main/Component/ProtectedRoute';

// Public Components
import LandingNavbar from './main/Component/LandingNavbar';
import Home from './main/pages/Home';
import Login from './main/pages/Login';
import Register from './main/pages/Register';
import AboutUs from './main/pages/AboutUs';

// Customer Flow
import CustomerDashboard from './main/pages/Customer/CustomerDashboard';
import CreateJobPage from './main/pages/Customer/CreateJobPage';

// Worker Flow
import WorkerDashboard from './main/pages/Worker/WorkerDashboard';
import FindJobsPage from './main/pages/Worker/FindJobsPage';
import WorkerProfilePage from './main/pages/Worker/WorkerProfilePage';

// Admin Flow
import AdminDashboard from './main/pages/Admin/AdminDashboard';

// Shared Dynamic Detail View
import JobDetailsPage from './main/pages/jobs/JobDetailsPage';

function AppLayout() {
  const location = useLocation();
  const { theme: t } = useTheme();

  // LandingNavbar is shown strictly on the root landing page (/)
  // Auth pages (/login, /register) and Customer/Worker dashboards use their own self-contained headers
  const isLandingPage = location.pathname === '/';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: t.bg,
        color: t.text,
        transition: 'background 150ms ease, color 150ms ease',
      }}
      className="font-sans flex flex-col"
    >
      {/* Render Public Landing Header only on Home */}
      {isLandingPage && <LandingNavbar />}

      <main className="flex-1 flex flex-col">
        <Routes>
          {/* ─── 1. Public Routes ─── */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutUs />} />

          {/* ─── 2. Customer-Protected Routes ─── */}
          <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/create-job" element={<CreateJobPage />} />
          </Route>

          {/* ─── 3. Worker-Protected Routes ─── */}
          <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
            <Route path="/worker/dashboard" element={<WorkerDashboard />} />
            <Route path="/worker/find-jobs" element={<FindJobsPage />} />
            <Route path="/worker/profile" element={<WorkerProfilePage />} />
          </Route>

          {/* ─── 4. Admin-Protected Routes ─── */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/categories" element={<AdminDashboard />} />
          </Route>

          {/* ─── 5. Shared Routes (Accessible by CUSTOMER, WORKER, ADMIN) ─── */}
          <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'WORKER', 'ADMIN']} />}>
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
          </Route>

          {/* ─── 6. Fallback 404 Route ─── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
