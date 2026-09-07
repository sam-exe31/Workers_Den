import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import WorkerGuard from './components/common/WorkerGuard';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import { PALETTE } from './theme/palette.js';

import Home from './pages/Home';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import AboutUs from './pages/AboutUs';

import CustomerDashboard from './features/customer/CustomerDashboard';
import CreateJobPage from './features/customer/CreateJobPage';
import CustomerRequestsPage from './features/customer/CustomerRequestsPage';
import CustomerProfilePage from './features/customer/CustomerProfilePage';

import WorkerSetupFlow from './features/worker/WorkerSetupFlow';
import WorkerDashboard from './features/worker/WorkerDashboard';
import FindJobsPage from './features/worker/FindJobsPage';
import WorkerProfilePage from './features/worker/WorkerProfilePage';
import WorkerMyJobsPage from './features/worker/WorkerMyJobsPage';
import WorkerEarningsPage from './features/worker/WorkerEarningsPage';

import JobDetailsPage from './features/jobs/JobDetailsPage';
import LogoutConfirmPage from './features/auth/LogoutConfirmPage';

function AppLayout() {
  return (
    <div
      className="min-h-screen font-sans flex flex-col antialiased selection:bg-[#1D4E89] selection:text-[#FCFBF7]"
      style={{ background: PALETTE.bg, color: PALETTE.text }}
    >
      <main className="flex-1 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutUs />} />

          {/* Customer Portal */}
          <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/create-job" element={<CreateJobPage />} />
            <Route path="/customer/requests" element={<CustomerRequestsPage />} />
            <Route path="/customer/profile" element={<CustomerProfilePage />} />
          </Route>

          {/* Worker Portal */}
          <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
            {/* Setup — no completeness guard; incomplete profiles land here */}
            <Route path="/worker/setup" element={<WorkerSetupFlow />} />

            {/* All other worker routes require a complete profile */}
            <Route element={<WorkerGuard />}>
              <Route path="/worker/dashboard" element={<WorkerDashboard />} />
              <Route path="/worker/find-jobs" element={<FindJobsPage />} />
              <Route path="/worker/my-jobs" element={<WorkerMyJobsPage />} />
              <Route path="/worker/earnings" element={<WorkerEarningsPage />} />
              <Route path="/worker/profile" element={<WorkerProfilePage />} />
            </Route>
          </Route>

          {/* Shared Job Details & Logout Confirmation */}
          <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'WORKER', 'ADMIN']} />}>
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/logout-confirm" element={<LogoutConfirmPage />} />
            <Route path="/customer/logout" element={<LogoutConfirmPage />} />
            <Route path="/worker/logout" element={<LogoutConfirmPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AppLayout />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}