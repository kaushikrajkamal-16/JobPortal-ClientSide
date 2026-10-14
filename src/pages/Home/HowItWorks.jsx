import {
  LuUserPlus,
  LuPointer,
  LuHandshake,
  LuShieldCheck,
  LuZap,
  LuPartyPopper,
} from "react-icons/lu";

/* ---------- Colour styles ---------- */

const BLUE = {
  iconBox: "bg-[#dbeafe] text-[#1d4ed8]",
  badge: "bg-[#0b2b82]",
  subtitle: "text-[#0b2b82]",
  footerIcon: "text-[#1d4ed8]",
};

const ORANGE = {
  iconBox: "bg-[#ffedd5] text-[#c2410c]",
  badge: "bg-[#f97316]",
  subtitle: "text-[#c2410c]",
  footerIcon: "text-[#f97316]",
};

/* ---------- Steps ---------- */

const STEPS = [
  {
    step: 1,
    title: "Register",
    subtitle: "Create your account",
    description:
      "Upload your resume and add verified academic credentials from BUET, DU, NSU, BRAC, or any university across Bangladesh.",
    Icon: LuUserPlus,
    FooterIcon: LuShieldCheck,
    footerText: "Takes under 2 minutes",
    colors: BLUE,
  },
  {
    step: 2,
    title: "Apply",
    subtitle: "Apply for jobs you like",
    description:
      "Match with verified campus openings and submit instant one-click applications with customized cover notes for recruiter review.",
    Icon: LuPointer,
    FooterIcon: LuZap,
    footerText: "Real-time status tracking",
    colors: ORANGE,
  },
  {
    step: 3,
    title: "Get Placed",
    subtitle: "Attend interviews and get hired",
    description:
      "Receive interview invites, participate in scheduled campus drives, and kickstart your dream career with top starting remuneration.",
    Icon: LuHandshake,
    FooterIcon: LuPartyPopper,
    footerText: "Offer letter protection",
    colors: BLUE,
  },
];

/* ---------- Section ---------- */

export default function HowItWorks() {
  return (
    <section
      aria-labelledby='how-it-works-heading'
      className='bg-[#f8faff] px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24'
    >
      <div className='mx-auto w-full max-w-7xl'>
        {/* Header */}
        <header className='mx-auto mb-10 max-w-2xl text-center sm:mb-12 md:mb-16'>
          <div className='mb-3 inline-flex items-center gap-2 sm:mb-4'>
            <span
              className='inline-block h-2.5 w-2.5 rounded-full bg-orange-500'
              aria-hidden='true'
            />
            <span className='text-xs font-bold uppercase tracking-wider text-[#0b2b82] md:text-sm'>
              Seamless Placement Pathway
            </span>
          </div>
          <h2
            id='how-it-works-heading'
            className='mb-3 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:mb-4 sm:text-4xl md:text-5xl'
          >
            How It Works
          </h2>
          <p className='text-base leading-relaxed text-slate-500 md:text-lg'>
            Three simple steps to transition from campus to your corporate
            career
          </p>
        </header>

        {/* Steps */}
        <ol className='grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3'>
          {STEPS.map(
            (
              {
                step,
                title,
                subtitle,
                description,
                Icon,
                FooterIcon,
                footerText,
                colors,
              },
              i,
            ) => {
              // On tablets (2 columns), center the 3rd card under the first two
              const isOddLast =
                STEPS.length % 2 === 1 && i === STEPS.length - 1;

              return (
                <li
                  key={step}
                  className={
                    isOddLast
                      ? "md:col-span-2 md:mx-auto md:w-full md:max-w-md lg:col-span-1 lg:max-w-none"
                      : ""
                  }
                >
                  <article className='flex h-full flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-8 lg:p-10'>
                    <div>
                      {/* Icon & step badge */}
                      <div className='mb-6 flex items-center justify-between sm:mb-8'>
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${colors.iconBox}`}
                        >
                          <Icon
                            className='h-6 w-6 sm:h-7 sm:w-7'
                            aria-hidden='true'
                          />
                        </div>
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${colors.badge}`}
                          aria-hidden='true'
                        >
                          {step}
                        </span>
                      </div>

                      {/* Title & subtitle */}
                      <h3 className='mb-1 text-xl font-bold text-slate-900 sm:text-2xl'>
                        {step}. {title}
                      </h3>
                      <p
                        className={`mb-3 text-sm font-semibold sm:mb-4 sm:text-base ${colors.subtitle}`}
                      >
                        {subtitle}
                      </p>

                      {/* Description */}
                      <p className='mb-6 text-sm leading-relaxed text-slate-500 sm:mb-8'>
                        {description}
                      </p>
                    </div>

                    {/* Footer benefit */}
                    <div className='flex items-center gap-2.5 border-t border-slate-100 pt-4 text-xs font-medium text-slate-700 md:text-sm'>
                      <FooterIcon
                        className={`h-4 w-4 shrink-0 ${colors.footerIcon}`}
                        strokeWidth={2.5}
                        aria-hidden='true'
                      />
                      <span>{footerText}</span>
                    </div>
                  </article>
                </li>
              );
            },
          )}
        </ol>
      </div>
    </section>
  );
}
