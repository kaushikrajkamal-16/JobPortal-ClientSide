import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useGetMeQuery, useLogoutMutation } from "../redux/authApi";
import {
  LuLayoutDashboard,
  LuLogOut,
  LuMenu,
  LuX,
  LuBriefcase,
  LuFileText,
  LuUsers,
  LuBuilding,
  LuIdCard,
} from "react-icons/lu";

// Menu for each role. To add a link, copy one line and change it.
const menus = {
  applicant: {
    logo: "TA",
    name: "Tanvir Ahmed",
    subtitle: "Applicant Portal",
    title: "Applicant Menu",
    links: [
      {
        label: "Dashboard",
        path: "/dashboard/applicant",
        icon: LuLayoutDashboard,
      },
      {
        label: "My Applications",
        path: "/dashboard/applicant/applications",
        icon: LuFileText,
      },
    ],
  },
  recruiter: {
    logo: "TS",
    name: "TechSoft Ltd.",
    subtitle: "Enterprise Portal",
    title: "Recruiter Menu",
    links: [
      {
        label: "Dashboard",
        path: "/dashboard/recruiter",
        icon: LuLayoutDashboard,
      },
    ],
  },
  admin: {
    logo: <LuBriefcase className='h-5 w-5' />, // an icon instead of letters
    name: "JobPortal",
    subtitle: "University Placement",
    title: "Admin Menu",
    links: [
      { label: "Dashboard", path: "/dashboard/admin", icon: LuLayoutDashboard },
      {
        label: "Manage Applicants",
        path: "/dashboard/admin/applicants",
        icon: LuUsers,
      },
      {
        label: "Manage Companies",
        path: "/dashboard/admin/companies",
        icon: LuBuilding,
      },
      {
        label: "Job Posts",
        path: "/dashboard/admin/managejobs",
        icon: LuIdCard,
      },
    ],
  },
};

// role = "applicant", "recruiter" or "admin"
export default function Sidebar({ role = "applicant" }) {
  const [open, setOpen] = useState(false); // is the sidebar open on mobile?
  const menu = menus[role];
  const navigate = useNavigate();

  // The logged-in user (name + photo/initials at the top)
  const { data } = useGetMeQuery();
  const user = data?.user;
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // even if the server fails, still go to Login
    }
    navigate("/login");
  };

  return (
    <>
      {/* Menu button — only on mobile */}
      <button
        onClick={() => setOpen(true)}
        className='fixed left-4 top-4 z-40 rounded-lg bg-white p-2 shadow-md lg:hidden'
      >
        <LuMenu className='h-6 w-6 text-[#0b1c30]' />
      </button>

      {/* Dark background behind the sidebar — only on mobile, when open */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className='fixed inset-0 z-40 bg-black/40 lg:hidden'
        ></div>
      )}

      {/* Sidebar
          Mobile: hidden off-screen, slides in when open
          Desktop (lg): always visible */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col justify-between bg-white shadow-md transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Top: logo + name */}
          <div className='flex h-16 items-center gap-2 bg-[#eff4ff] px-6'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#1e40af] font-bold text-white'>
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className='h-full w-full object-cover'
                />
              ) : role === "admin" ? (
                menu.logo
              ) : (
                user?.initials || menu.logo
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate font-semibold text-[#0b1c30]'>
                {user?.name || menu.name}
              </p>
              <p className='text-[11px] text-[#444653]'>{menu.subtitle}</p>
            </div>

            {/* Close button — only on mobile */}
            <button onClick={() => setOpen(false)} className='lg:hidden'>
              <LuX className='h-5 w-5 text-[#444653]' />
            </button>
          </div>

          {/* Menu title */}
          <p className='px-6 pt-6 text-xs font-semibold uppercase tracking-wider text-[#757684]'>
            {menu.title}
          </p>

          {/* Menu links */}
          <nav className='flex flex-col gap-1 px-4 pt-2'>
            {menu.links.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                end // only highlight on the exact page
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#1e40af] text-white"
                      : "text-[#444653] hover:bg-[#dce9ff] hover:text-[#0b1c30]"
                  }`
                }
              >
                <link.icon className='h-5 w-5' />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout at the bottom */}
        <div className='p-4'>
          <button
            onClick={handleLogout}
            className='flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[#ba1a1a] transition hover:bg-[#ffdad6]'
          >
            <LuLogOut className='h-5 w-5' />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
