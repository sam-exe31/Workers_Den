import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './main/Component/ProtectedRoute';
import WorkerGuard from './main/Component/WorkerGuard';
import ErrorBoundary from './main/Component/ErrorBoundary';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import { PALETTE} from './theme/palette.js';

import Home from './main/pages/Home';
import Login from './main/pages/Login';
import Register from './main/pages/Register';
import AboutUs from './main/pages/AboutUs';

import CustomerDashboard from './main/pages/Customer/CustomerDashboard';
import CreateJobPage from './main/pages/Customer/CreateJobPage';
import CustomerRequestsPage from './main/pages/Customer/CustomerRequestsPage';
import CustomerProfilePage from './main/pages/Customer/CustomerProfilePage';

import WorkerSetupFlow from './main/pages/Worker/WorkerSetupFlow';
import WorkerDashboard from './main/pages/Worker/WorkerDashboard';
import FindJobsPage from './main/pages/Worker/FindJobsPage';
import WorkerProfilePage from './main/pages/Worker/WorkerProfilePage';
import WorkerMyJobsPage from './main/pages/Worker/WorkerMyJobsPage';
import WorkerEarningsPage from './main/pages/Worker/WorkerEarningsPage';

import JobDetailsPage from './main/pages/jobs/JobDetailsPage';
import LogoutConfirmPage from './main/pages/LogoutConfirmPage';

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