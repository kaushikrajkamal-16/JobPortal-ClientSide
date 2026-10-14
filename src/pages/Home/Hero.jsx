const STATS = [
  { value: "500+", label: "Students Placed" },
  { value: "100+", label: "Companies Hiring" },
  { value: "50+", label: "Placement Drives" },
];

function SearchIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <circle cx='11' cy='11' r='7' />
      <path d='m20 20-3.5-3.5' />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M5 12h14' />
      <path d='m13 6 6 6-6 6' />
    </svg>
  );
}

/**
 * Hero section for JobPortal BD.
 *
 * Props:
 *  - imageSrc: optional illustration/photo for the right column
 *  - imageAlt: alt text for that image
 */
export default function Hero({
  imageSrc,
  imageAlt = "Students meeting employers at a campus placement drive",
}) {
  return (
    <section className='relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-[#f0f4ff] via-[#f8faff] to-white py-12 sm:py-16 lg:py-24'>
      {/* Ambient background glows */}
      <div className='pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl sm:h-96 sm:w-96' />
      <div className='pointer-events-none absolute -right-24 top-1/2 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl sm:h-96 sm:w-96' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-8'>
          {/* Left content */}
          <div className='space-y-5 text-center sm:space-y-6 lg:col-span-7 lg:text-left'>
            {/* Badge */}
            <div className='inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl border border-blue-200/80 bg-blue-50 px-3 py-1.5 shadow-sm sm:rounded-full sm:px-3.5'>
              <span className='inline-flex items-center justify-center rounded bg-[#1e40af] px-1.5 py-0.5 text-[11px] font-bold text-white'>
                BD
              </span>
              <span className='text-xs font-semibold tracking-wide text-blue-900'>
                Bangladesh's #1 University Placement Network
              </span>
              <span className='hidden items-center gap-2 sm:inline-flex'>
                <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500' />
                <span className='text-[11px] font-medium text-slate-500'>
                  Active 2026 Season
                </span>
              </span>
            </div>

            {/* Heading */}
            <h1 className='text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl'>
              Find Your{" "}
              <span className='bg-gradient-to-r from-[#1e40af] to-[#2563eb] bg-clip-text text-transparent'>
                Dream Job
              </span>
            </h1>

            {/* Subtitle */}
            <p className='mx-auto max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0'>
              Connecting talented university students with premier employers,
              multinational corporations, and high-growth tech firms across
              Bangladesh.
            </p>

            {/* CTAs */}
            <div className='flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:justify-start'>
              <a
                href='#register'
                className='group inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#1e40af] shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-slate-50'
              >
                Register Now
                <ArrowRightIcon className='h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
              </a>
            </div>

            {/* Stats */}
            <dl className='mx-auto grid max-w-lg grid-cols-3 gap-3 border-t border-slate-200/70 pt-6 sm:gap-4 lg:mx-0'>
              {STATS.map(({ value, label }) => (
                <div key={label} className='flex flex-col'>
                  <dt className='order-2 mt-0.5 text-[11px] font-medium text-slate-500 sm:text-xs'>
                    {label}
                  </dt>
                  <dd className='order-1 text-xl font-bold text-slate-900 sm:text-2xl'>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right visual */}
          <div className='relative lg:col-span-5'>
            <div className='relative mx-auto max-w-sm sm:max-w-md lg:max-w-none'>
              {/* Glow under visual */}
              <div className='absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 opacity-20 blur-xl' />

              {/* Card container */}
              <div className='relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/60 bg-white shadow-xl shadow-blue-900/5 sm:aspect-[5/4]'>
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className='h-full w-full object-cover'
                    loading='eager'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-sm font-medium text-blue-300'>
                    Your illustration here
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
