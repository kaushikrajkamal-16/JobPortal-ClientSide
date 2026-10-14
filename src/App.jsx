import { Routes, Route } from "react-router";

// Layouts
import MainLayout from "./Rootlayout/MainLayout";
import DashboardLayout from "./Rootlayout/DashboardLayout";

// Public pages (← change paths if your files are somewhere else)
import Home from "./pages/Home/Home";
import Jobs from "./pages/Jobs/Jobs";
import JobDetails from "./pages/Jobs/JobsDetails";
import Companies from "./pages/Companies/Companies";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Registration";

// Dashboard pages
import DashboardHome from "./pages/Dashboard/DashboardHome";
import ApplicantDashboard from "./pages/Dashboard/Applicant/ApplicantDashboard";
import MyApplications from "./pages/Dashboard/Applicant/ApplicantApplication";
import RecruiterDashboard from "./pages/Dashboard/Recruiter/RecruiterDashboard";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import ManageApplicants from "./pages/Dashboard/Admin/ManageApplicants";
import ManageCompanies from "./pages/Dashboard/Admin/ManageCompanies";
import ManageJobPosts from "./pages/Dashboard/Admin/ManageJobPosts";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import AboutUs from "./pages/AboutUs";
import ProtectedRoute from "./Components/ProtectedRoute";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <Routes>
      {/* ---------- Public pages: Navbar + Footer ---------- */}
      <Route element={<MainLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/jobs/:slug' element={<JobDetails />} />
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path='/companies' element={<Companies />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgetPassword' element={<ForgotPassword />} />
        <Route path='/resetPassword' element={<ResetPassword />} />
        <Route path='/verifyOtp' element={<VerifyOtp />} />
      </Route>

      {/* ---------- Applicant dashboard: Sidebar ---------- */}
      <Route
        path='/dashboard/applicant'
        element={
          <ProtectedRoute role='applicant'>
            <DashboardLayout role='applicant' />
          </ProtectedRoute>
        }
      >
        <Route index element={<ApplicantDashboard />} />
        <Route path='applications' element={<MyApplications />} />
      </Route>

      {/* ---------- Recruiter dashboard: Sidebar ---------- */}
      <Route
        path='/dashboard/recruiter'
        element={
          <ProtectedRoute role='company'>
            <DashboardLayout role='recruiter' />
          </ProtectedRoute>
        }
      >
        <Route index element={<RecruiterDashboard />} />
      </Route>

      {/* ---------- Admin dashboard: Sidebar ---------- */}
      <Route
        path='/dashboard/admin'
        element={
          <ProtectedRoute role='admin'>
            <DashboardLayout role='admin' />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path='applicants' element={<ManageApplicants />} />
        <Route path='companies' element={<ManageCompanies />} />
        <Route path='managejobs' element={<ManageJobPosts />} />
      </Route>
    </Routes>
  );
}
