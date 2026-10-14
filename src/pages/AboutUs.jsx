import { Link } from "react-router";
import {
  LuBadgeCheck,
  LuTarget,
  LuEye,
  LuArrowRight,
  LuUser,
  LuBuilding2,
  LuZap,
} from "react-icons/lu";

// Change this to your own image (e.g. put a photo in src/assets and import it)
const heroImage =
  "https://lh3.googleusercontent.com/aida/AEtjO1XaYQ3c54bwTkIlWkPz-1NlvrE0XJPFEaG6XfklMg8h1cenxD9xYm95SY50z11GOtXyeMHJCL2DqxG2tkTgZcVy2rEUMND3OiSw0tK04seFIMkm0wpjw5hgaJ9rof1_0r-15ztbcOC0Ujm_q8vnKyJRvs1fpqDgLO9yjNx-3WD0xZjf9ChhThC8AKvwzrxPkhwc9jTMbld9aYTx-SCUFsJIo3_i6OJuZvGV_ysw50-cpObNFPoGrzeD8rM";

// Mission & Vision cards
const missionVision = [
  {
    icon: LuTarget,
    title: "Our Mission",
    text: "To make job opportunities easy to reach for everyone in Bangladesh by connecting applicants and companies with transparency, dignity, and efficiency.",
    link: "Action-driven outcomes",
  },
  {
    icon: LuEye,
    title: "Our Vision",
    text: "To become South Asia's most trusted career launchpad, where every qualified applicant easily connects with merit-based career growth.",
    link: "Nationwide scalability",
  },
];

// Numbers row
const stats = [
  { number: "500+", label: "Applicants Hired" },
  { number: "120+", label: "Partner Companies" },
  { number: "300+", label: "Jobs Posted" },
  { number: "95%", label: "Satisfaction" },
];

// What We Offer cards
const offers = [
  {
    icon: LuUser,
    title: "For Applicants",
    text: "Discover verified entry-level jobs, paid internships, and tailored career pathways.",
  },
  {
    icon: LuBuilding2,
    title: "For Recruiters",
    text: "Find skilled applicants and recruit faster with simple application management.",
  },
  {
    icon: LuZap,
    title: "Easy Hiring Process",
    text: "Simple one-click resume submission, direct interview alerts, and zero hidden barriers.",
  },
];

export default function AboutUs() {
  return (
    <div className='bg-[#f8f9ff] text-[#0b1c30]'>
      <div className='mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16'>
        {/* =============== HERO =============== */}
        <section className='grid grid-cols-1 items-center gap-10 lg:grid-cols-12'>
          {/* Left: text */}
          <div className='lg:col-span-7'>
            <span className='inline-flex items-center gap-1.5 rounded-full bg-[#eff4ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#00288e]'>
              <span className='h-1.5 w-1.5 rounded-full bg-[#00288e]'></span>
              About Us
            </span>

            <h1 className='mb-4 mt-4 text-3xl font-extrabold leading-tight lg:text-[44px] lg:leading-[52px]'>
              Connecting Applicants with the Right Opportunities
            </h1>

            <p className='mb-6 max-w-xl text-base leading-relaxed text-[#444653]'>
              JobPortal BD is Bangladesh's job placement platform dedicated to
              bridging the gap between ambitious applicants and forward-thinking
              companies. We help applicants launch meaningful careers and make
              hiring simple for leading employers.
            </p>

            <div className='inline-flex items-center gap-3 rounded-xl bg-white p-3.5 pr-5 shadow-sm'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eff4ff] text-[#00288e]'>
                <LuBadgeCheck className='h-4 w-4' />
              </div>
              <span className='text-xs font-medium text-[#444653]'>
                Trusted by top employers across Dhaka, Chittagong, and beyond.
              </span>
            </div>
          </div>

          {/* Right: image */}
          <div className='lg:col-span-5'>
            <div className='aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#e5eeff] shadow-md'>
              <img
                src={heroImage}
                alt='Applicants preparing job applications'
                className='h-full w-full object-cover transition-transform duration-700 hover:scale-105'
              />
            </div>
          </div>
        </section>

        {/* =============== MISSION & VISION =============== */}
        <section className='mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2'>
          {missionVision.map((item) => (
            <div
              key={item.title}
              className='flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm'
            >
              <div>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] text-[#00288e]'>
                  <item.icon className='h-6 w-6' />
                </div>
                <h2 className='mb-3 mt-5 text-xl font-bold'>{item.title}</h2>
                <p className='text-sm leading-relaxed text-[#444653]'>
                  {item.text}
                </p>
              </div>
              <p className='mt-6 flex items-center gap-2 text-xs font-semibold text-[#00288e]'>
                {item.link} <LuArrowRight className='h-4 w-4' />
              </p>
            </div>
          ))}
        </section>

        {/* =============== STATS =============== */}
        <section className='mt-14 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4'>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className='rounded-2xl bg-white p-6 text-center shadow-sm'
            >
              <p className='text-3xl font-extrabold text-[#00288e]'>
                {stat.number}
              </p>
              <p className='mt-1 text-sm font-medium text-[#444653]'>
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* =============== WHAT WE OFFER =============== */}
        <section className='mt-20 md:mt-24'>
          <div className='mx-auto mb-10 max-w-xl text-center'>
            <span className='inline-flex rounded-full bg-[#eff4ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#00288e]'>
              Platform Values
            </span>
            <h2 className='mt-3 text-2xl font-bold'>
              Built for Seamless Hiring in Bangladesh
            </h2>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {offers.map((offer) => (
              <div
                key={offer.title}
                className='rounded-2xl bg-white p-8 shadow-sm'
              >
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] text-[#00288e]'>
                  <offer.icon className='h-6 w-6' />
                </div>
                <h3 className='mb-2 mt-5 text-base font-bold'>{offer.title}</h3>
                <p className='text-sm leading-relaxed text-[#444653]'>
                  {offer.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =============== CALL TO ACTION =============== */}
        <section className='mt-20 md:mt-24'>
          <div className='relative overflow-hidden rounded-2xl bg-[#00288e] p-8 text-center text-white shadow-xl md:p-14'>
            {/* Decorative circles */}
            <div className='pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#1e40af]/40'></div>
            <div className='pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#dde1ff]/10'></div>

            <div className='relative mx-auto max-w-2xl'>
              <h2 className='mb-3 text-2xl font-extrabold md:text-3xl'>
                Ready to start your career?
              </h2>
              <p className='mb-8 text-sm leading-relaxed text-[#dde1ff] md:text-base'>
                Join thousands of applicants and leading organizations
                transforming hiring across Bangladesh.
              </p>

              <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                <Link
                  to='/jobs'
                  className='w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#00288e] shadow-sm hover:bg-[#eff4ff] sm:w-auto'
                >
                  Browse Jobs
                </Link>
                <Link
                  to='/register'
                  className='w-full rounded-xl bg-[#1e40af] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e40af]/80 sm:w-auto'
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
