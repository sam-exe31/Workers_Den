import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './main/Component/ProtectedRoute';

import Home from './main/pages/Home';
import Login from './main/pages/Login';
import Register from './main/pages/Register';
import AboutUs from './main/pages/AboutUs';

import CustomerDashboard from './main/pages/Customer/CustomerDashboard';
import CreateJobPage from './main/pages/Customer/CreateJobPage';

import WorkerDashboard from './main/pages/Worker/WorkerDashboard';
import FindJobsPage from './main/pages/Worker/FindJobsPage';
import WorkerProfilePage from './main/pages/Worker/WorkerProfilePage';

import JobDetailsPage from './main/pages/jobs/JobDetailsPage';

function AppLayout() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F7F6F2] font-sans flex flex-col antialiased selection:bg-[#F4A340] selection:text-[#0B0B0D]">
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
          </Route>

          {/* Worker Portal */}
          <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
            <Route path="/worker/dashboard" element={<WorkerDashboard />} />
            <Route path="/worker/find-jobs" element={<FindJobsPage />} />
            <Route path="/worker/profile" element={<WorkerProfilePage />} />
          </Route>

          {/* Shared Job Details */}
          <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'WORKER', 'ADMIN']} />}>
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
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
    <Router>
      <AppLayout />
    </Router>
  );
}