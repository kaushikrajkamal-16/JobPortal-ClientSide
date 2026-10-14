import { LuBriefcase, LuMail, LuPhone, LuMapPin } from "react-icons/lu";
import { FaLinkedin, FaFacebook, FaXTwitter, FaGithub } from "react-icons/fa6";

const QUICK_LINKS = [
  { label: "Home", href: "#" },
  { label: "Jobs", href: "/Jobs" },
  { label: "Companies", href: "/Companies" },
  { label: "About Us", href: "/aboutus" },
  { label: "Contact", href: "/contact" },
];

const CONTACTS = [
  {
    Icon: LuMail,
    text: "info@jobportal.com",
    href: "mailto:info@jobportal.com",
  },
  { Icon: LuPhone, text: "+880 1234-567890", href: "tel:+8801234567890" },
  { Icon: LuMapPin, text: "Gulshan-2, Dhaka, Bangladesh" },
];

const SOCIALS = [
  { Icon: FaLinkedin, label: "LinkedIn", href: "#" },
  { Icon: FaFacebook, label: "Facebook", href: "#" },
  { Icon: FaXTwitter, label: "X (Twitter)", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
  { label: "Support", href: "#" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='w-full border-t border-slate-800/80 bg-[#0d1b2a] pb-8 pt-12 text-slate-300 sm:pb-10 sm:pt-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Top grid */}
        <div className='grid grid-cols-2 gap-x-6 gap-y-10 border-b border-slate-800 pb-10 sm:pb-12 lg:flex lg:justify-between lg:gap-16'>
          {/* Brand */}
          <div className='col-span-2 space-y-4 lg:col-span-4'>
            <a href='#' className='inline-flex items-center gap-3'>
              <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/30'>
                <LuBriefcase className='h-5 w-5' aria-hidden='true' />
              </span>
              <span className='text-xl font-bold tracking-tight text-white'>
                JobPortal
              </span>
              <span className='rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-blue-400'>
                BD
              </span>
            </a>
            <p className='max-w-sm text-sm leading-relaxed text-slate-400'>
              Connecting talented university students with top premier
              employers, tech innovators, and multinational companies across
              Bangladesh.
            </p>
            <div className='pt-1'>
              <span className='inline-flex items-center gap-2 rounded-full border border-emerald-800/50 bg-emerald-950/60 px-3 py-1.5 text-xs font-medium text-emerald-400'>
                <span className='h-2 w-2 animate-pulse rounded-full bg-emerald-400' />
                Placement Session 2026 Active
              </span>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label='Quick links' className='space-y-4 lg:col-span-2'>
            <h4 className='text-sm font-semibold uppercase tracking-wider text-white'>
              Quick Links
            </h4>
            <ul className='space-y-2.5 text-sm'>
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className='text-slate-400 transition-colors duration-150 hover:text-white'
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact & socials */}
          <div className='col-span-2 space-y-4 lg:col-span-4'>
            <h4 className='text-sm font-semibold uppercase tracking-wider text-white'>
              Contact
            </h4>
            <ul className='space-y-3 text-sm text-slate-400'>
              {CONTACTS.map(({ Icon, text, href }) => (
                <li key={text} className='flex items-center gap-3'>
                  <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/80 text-slate-300'>
                    <Icon className='h-4 w-4' aria-hidden='true' />
                  </span>
                  {href ? (
                    <a
                      href={href}
                      className='break-all transition-colors hover:text-blue-400'
                    >
                      {text}
                    </a>
                  ) : (
                    <span>{text}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className='flex items-center gap-2.5 pt-2'>
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className='flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/80 text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-600 hover:text-white'
                >
                  <Icon className='h-4 w-4' aria-hidden='true' />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='flex flex-col items-center justify-between gap-4 pt-6 text-xs text-slate-500 sm:pt-8 md:flex-row'>
          <p className='text-center md:text-left'>
            © {year} JobPortal. All rights reserved.
          </p>
          <nav aria-label='Legal'>
            <ul className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2'>
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className='transition-colors hover:text-slate-300'
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
