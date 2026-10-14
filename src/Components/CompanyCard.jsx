import { Link } from "react-router";
import { LuMapPin } from "react-icons/lu";

// One company card. Pass a "company" object to it.
export default function CompanyCard({ company }) {
  return (
    <div className='flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6'>
      <div>
        {/* Logo + open jobs badge */}
        <div className='mb-4 flex items-start justify-between gap-2'>
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className='h-12 w-12 shrink-0 rounded-xl object-cover'
            />
          ) : (
            <div
              className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-semibold'
              style={{
                backgroundColor: company.bg || "#dde1ff",
                color: company.color || "#00288e",
              }}
            >
              {company.logo}
            </div>
          )}

          <span className='inline-flex items-center gap-1 rounded-full bg-[#eff4ff] px-2.5 py-1 text-xs font-semibold text-[#00288e]'>
            <span className='h-1.5 w-1.5 rounded-full bg-[#00288e]'></span>
            {company.openJobs} Open Jobs
          </span>
        </div>

        {/* Name, industry, description */}
        <h2 className='mb-1 text-lg font-semibold text-[#0b1c30] sm:text-xl'>
          {company.name}
        </h2>
        <p className='mb-1 text-xs font-semibold text-[#fd761a]'>
          {company.industry || "Industry not set"}
        </p>
        <p className='mb-4 line-clamp-2 text-sm text-[#444653]'>
          {company.description || "No description yet."}
        </p>
      </div>

      {/* Location + button */}
      <div className='flex flex-col gap-4 pt-2'>
        <div className='flex items-center gap-1 text-xs text-[#444653]'>
          <LuMapPin className='h-[18px] w-[18px] text-[#757684]' />
          <span>{company.location || "Bangladesh"}</span>
        </div>

        <Link
          to={`/jobs?company=${company.id}`}
          className='flex h-10 w-full items-center justify-center rounded-lg bg-[#00288e] text-sm font-medium text-white transition hover:bg-[#1e40af]'
        >
          View Jobs
        </Link>
      </div>
    </div>
  );
}
