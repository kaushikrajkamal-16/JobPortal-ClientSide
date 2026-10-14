import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router";
import { FaRegUserCircle } from "react-icons/fa";
import { LuLayoutDashboard, LuLogOut } from "react-icons/lu";
import { useGetMeQuery, useLogoutMutation } from "../redux/authApi";
import { dashboardPath } from "../utils/helpers";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/Jobs" },
  { label: "Companies", href: "/Companies" },
  { label: "About", href: "/aboutus" },
  { label: "Contact", href: "/contact" },
];

function BriefcaseIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <rect width='20' height='14' x='2' y='7' rx='2' ry='2' />
      <path d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' />
    </svg>
  );
}

function MenuIcon({ open, className = "" }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      {open ? (
        <>
          <path d='M18 6 6 18' />
          <path d='m6 6 12 12' />
        </>
      ) : (
        <>
          <path d='M4 6h16' />
          <path d='M4 12h16' />
          <path d='M4 18h16' />
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false); // small account menu
  const navigate = useNavigate();

  // Logged in? (guests get an error here — that's fine, we show Login/Register)
  const { data } = useGetMeQuery();
  const user = data?.user;
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    setAccountOpen(false);
    setMenuOpen(false);
    try {
      await logout().unwrap();
    } catch {
      // ignore — go to Login anyway
    }
    navigate("/login");
  };

  // Close the mobile menu when resizing up to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className='sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md transition-all'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between sm:h-20'>
          {/* Logo */}
          <Link to='/' className='group flex items-center gap-2 sm:gap-2.5'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 shadow-md shadow-blue-500/20 transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10'>
              <BriefcaseIcon className='h-5 w-5 text-white' />
            </div>
            <div className='flex items-center'>
              <span className='text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-700 sm:text-2xl'>
                Job<span className='font-extrabold text-blue-700'>Portal</span>
              </span>
              <span className='ml-2 rounded-full border border-blue-200/70 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-blue-700 sm:ml-2.5'>
                BD
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className='hidden items-center gap-1 md:flex lg:gap-2'>
            {NAV_LINKS.map(({ label, href }) => (
              <NavLink
                key={label}
                to={href}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm transition-all duration-150 lg:px-4 ${
                    isActive
                      ? "bg-blue-50/80 font-semibold text-blue-700"
                      : "font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className='flex items-center gap-2 sm:gap-3'>
            {user ? (
              <Link
                to={dashboardPath(user.role)}
                className='hidden items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-800 sm:inline-flex lg:px-5 lg:py-2.5'
              >
                <LuLayoutDashboard className='h-4 w-4' />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to='/login'
                  className='hidden rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/60 hover:text-blue-800 sm:inline-flex lg:px-5 lg:py-2.5'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='hidden items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-800 hover:shadow-md hover:shadow-blue-600/25 active:bg-blue-900 sm:inline-flex lg:px-5 lg:py-2.5'
                >
                  Register
                </Link>
              </>
            )}

            {/* Account button: photo/initials when logged in */}
            <div className='relative'>
              <button
                type='button'
                aria-label='Account'
                onClick={() =>
                  user ? setAccountOpen((o) => !o) : navigate("/login")
                }
                className='flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-600 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-700 sm:ml-1 sm:h-10 sm:w-10'
              >
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className='h-full w-full object-cover'
                  />
                ) : user ? (
                  user.initials
                ) : (
                  <FaRegUserCircle className='h-5 w-5' />
                )}
              </button>

              {/* Small menu under the account button */}
              {user && accountOpen && (
                <div className='absolute right-0 top-12 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg'>
                  <div className='border-b border-slate-100 px-3 pb-2 pt-1'>
                    <p className='truncate text-sm font-semibold text-slate-900'>
                      {user.name}
                    </p>
                    <p className='truncate text-xs text-slate-500'>
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to={dashboardPath(user.role)}
                    onClick={() => setAccountOpen(false)}
                    className='mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  >
                    <LuLayoutDashboard className='h-4 w-4' />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50'
                  >
                    <LuLogOut className='h-4 w-4' />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type='button'
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls='mobile-menu'
              className='flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 hover:text-blue-700 md:hidden'
            >
              <MenuIcon open={menuOpen} className='h-6 w-6' />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id='mobile-menu'
        className={`overflow-hidden border-t border-slate-200/80 bg-white transition-[max-height,opacity] duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "max-h-[28rem] opacity-100"
            : "max-h-0 border-t-0 opacity-0"
        }`}
      >
        <nav className='flex flex-col gap-1 px-4 py-3'>
          {NAV_LINKS.map(({ label, href }) => (
            <NavLink
              key={label}
              to={href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2.5 text-base transition-colors ${
                  isActive
                    ? "bg-blue-50/80 font-semibold text-blue-700"
                    : "font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Auth buttons shown in the menu on small phones */}
        <div className='flex gap-3 border-t border-slate-100 px-4 py-4 sm:hidden'>
          {user ? (
            <>
              <Link
                to={dashboardPath(user.role)}
                onClick={() => setMenuOpen(false)}
                className='flex-1 rounded-lg bg-blue-700 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-800'
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className='flex-1 rounded-lg border border-red-200 bg-white py-2.5 text-center text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                onClick={() => setMenuOpen(false)}
                className='flex-1 rounded-lg border border-blue-300 bg-white py-2.5 text-center text-sm font-semibold text-blue-700 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50/60'
              >
                Login
              </Link>
              <Link
                to='/register'
                onClick={() => setMenuOpen(false)}
                className='flex-1 rounded-lg bg-blue-700 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-800 active:bg-blue-900'
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
