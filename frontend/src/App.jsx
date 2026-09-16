import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminProtectedRoute from "./components/common/AdminProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/Applyjob";

import Dashboard from "./pages/Dashboard";
import SavedJobs from "./pages/SavedJobs";
import MyApplications from "./pages/MyApplications";
import Interviews from "./pages/Interviews";
import Profile from "./pages/Profile";

import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/Adminjobs";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInterviews from "./pages/admin/AdminInterviews";

function AppContent() {
  const location = useLocation();

  // Hide public Navbar + Footer inside both dashboards
  const isDashboard = location.pathname.startsWith("/dashboard");

  const isAdmin = location.pathname.startsWith("/admin");

  const hidePublicLayout = isDashboard || isAdmin;

  return (
    <>
      {/* PUBLIC NAVBAR */}
      {!hidePublicLayout && <Navbar />}

      <Routes>
        {/* =====================================================
            PUBLIC ROUTES
        ====================================================== */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route path="/jobs/:id/apply" element={<ApplyJob />} />

        <Route path="/features" element={<Features />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        {/* =====================================================
            USER PROTECTED ROUTES
        ====================================================== */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/dashboard/saved" element={<SavedJobs />} />

          <Route path="/dashboard/applications" element={<MyApplications />} />

          <Route path="/dashboard/interviews" element={<Interviews />} />

          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>

        {/* =====================================================
            ADMIN PROTECTED ROUTES
        ====================================================== */}

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/admin/jobs" element={<AdminJobs />} />

          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/interviews" element={<AdminInterviews />} />
        </Route>
      </Routes>

      {/* PUBLIC FOOTER */}
      {!hidePublicLayout && <Footer />}
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
