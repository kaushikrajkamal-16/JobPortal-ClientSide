import { LuMail, LuPhone, LuMapPin, LuClock } from "react-icons/lu";

// Contact cards. "link" makes the text clickable (opens email app / phone dialer).
const contacts = [
  {
    icon: LuMail,
    label: "Email Us",
    text: "support@jobportalbd.com",
    link: "mailto:support@jobportalbd.com",
  },
  {
    icon: LuPhone,
    label: "Call Us",
    text: "+880 1700-000000",
    link: "tel:+8801700000000",
  },
  { icon: LuMapPin, label: "Visit Us", text: "Head Office, Dhaka, Bangladesh" }, // no link
];

export default function Contact() {
  return (
    <div className='bg-[#f8f9ff] px-4 py-12 text-[#444653] sm:px-6 md:py-20'>
      <div className='mx-auto w-full max-w-3xl'>
        {/* =============== HEADER =============== */}
        <div className='mb-10 text-center md:mb-12'>
          <span className='mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#eff4ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#00288e]'>
            <span className='h-1.5 w-1.5 rounded-full bg-[#00288e]'></span>
            Contact Us
          </span>
          <h1 className='mb-2 text-3xl font-bold text-[#0b1c30] md:text-4xl'>
            Get in Touch
          </h1>
          <p className='mx-auto max-w-xl text-base md:text-lg'>
            Have questions about jobs or applications? We're here to help.
          </p>
        </div>

        {/* =============== CONTACT CARDS =============== */}
        <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
          {contacts.map((item) => (
            <div
              key={item.label}
              className='flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm hover:border-blue-100'
            >
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#eff4ff] text-[#00288e]'>
                <item.icon className='h-6 w-6' />
              </div>
              <span className='mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400'>
                {item.label}
              </span>

              {/* If the card has a link → clickable, otherwise plain text */}
              {item.link ? (
                <a
                  href={item.link}
                  className='break-all font-semibold text-[#0b1c30] hover:text-[#00288e]'
                >
                  {item.text}
                </a>
              ) : (
                <p className='font-semibold text-[#0b1c30]'>{item.text}</p>
              )}
            </div>
          ))}
        </div>

        {/* =============== OFFICE HOURS =============== */}
        <div className='flex items-center justify-center gap-3 rounded-xl border border-blue-100 bg-[#eff4ff]/60 p-4'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#00288e] shadow-sm'>
            <LuClock className='h-4 w-4' />
          </div>
          <p className='text-sm'>
            <span className='font-semibold text-[#0b1c30]'>Office hours:</span>{" "}
            Sun – Thu, 9:00 AM – 5:00 PM
          </p>
        </div>
      </div>
    </div>
  );
}
