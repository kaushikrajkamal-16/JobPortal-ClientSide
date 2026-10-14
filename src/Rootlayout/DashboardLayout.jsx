import { Outlet } from "react-router";
import Sidebar from "../Components/Sidebar";

// Layout for all 3 dashboards (applicant, recruiter, admin)
// role = "applicant", "recruiter" or "admin"
// <Outlet /> = the current dashboard page shows here, next to the Sidebar
export default function DashboardLayout({ role }) {
  return (
    <>
      <Sidebar role={role} />

      {/* lg:pl-64 = make room for the sidebar on desktop */}
      <main className='min-h-screen bg-[#f8f9ff] px-4 pb-8 pt-20 lg:pl-72 lg:pr-8 lg:pt-8'>
        <Outlet />
      </main>
    </>
  );
}
