import { useState } from "react";
import { Link } from "react-router";
import { LuMapPin, LuBanknote } from "react-icons/lu";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { timeAgo } from "../utils/helpers";

// Colour styles for the job-type badge. Add more types here as needed.
const TYPE_STYLES = {
  "Full-time": "bg-blue-50 text-blue-600",
  "Part-time": "bg-emerald-50 text-emerald-600",
  Internship: "bg-[#fff2eb] text-[#d9531e]",
  Contract: "bg-purple-50 text-purple-600",
  Remote: "bg-teal-50 text-teal-600",
};

// Icons (react-icons)
const BookmarkIcon = ({ filled, className = "" }) =>
  filled ? (
    <FaBookmark className={className} aria-hidden='true' />
  ) : (
    <FaRegBookmark className={className} aria-hidden='true' />
  );

const LocationIcon = ({ className = "" }) => (
  <LuMapPin className={className} aria-hidden='true' />
);

const SalaryIcon = ({ className = "" }) => (
  <LuBanknote className={className} aria-hidden='true' />
);

export default function JobCard({
  job,
  initiallyBookmarked = false,
  onBookmarkChange,
  onApply,
}) {
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);

  const {
    title,
    company,
    logoText,
    logoUrl,
    logoColor = "#13357b",
    type,
    level,
    location,
    salary,
    salaryPeriod = "month",
    skills = [],
    postedAt,
  } = job;

  const toggleBookmark = () => {
    const next = !bookmarked;
    setBookmarked(next);
    onBookmarkChange?.(job, next);
  };

  const typeClass = TYPE_STYLES[type] ?? "bg-gray-100 text-gray-600";

  // Backend sends a date → show "2 days ago"
  const posted =
    postedAt && !isNaN(Date.parse(postedAt)) ? timeAgo(postedAt) : postedAt;

  // Details page link — uses the slug, or the id if there's no slug
  const detailsUrl = `/jobs/${job.slug ?? job.id}`;

  return (
    // "relative" + the title link's ::after overlay makes the WHOLE card clickable
    <article className='group relative flex h-full flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-[#1e40af]/40 hover:-translate-y-0.5 hover:shadow-md sm:p-6'>
      <div>
        {/* Top row: logo, title, bookmark */}
        <div className='mb-4 flex items-start justify-between gap-3'>
          <div className='flex min-w-0 items-start gap-3 sm:gap-3.5'>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${company} logo`}
                className='h-11 w-11 flex-shrink-0 rounded-xl object-cover sm:h-12 sm:w-12'
              />
            ) : (
              <div
                className='flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white sm:h-12 sm:w-12 sm:text-base'
                style={{ backgroundColor: logoColor }}
                aria-hidden='true'
              >
                {logoText}
              </div>
            )}
            <div className='min-w-0'>
              <h3 className='break-words text-base font-bold leading-snug text-[#0f172a] sm:text-lg'>
                <Link
                  to={detailsUrl}
                  className="outline-none transition-colors after:absolute after:inset-0 after:rounded-2xl after:content-[''] group-hover:text-[#1e40af]"
                >
                  {title}
                </Link>
              </h3>
              <p className='truncate text-sm text-gray-500'>{company}</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className='mb-4 flex flex-wrap gap-2 text-xs font-semibold'>
          <span className={`rounded-md px-2.5 py-1 ${typeClass}`}>{type}</span>
          {level && level !== type && (
            <span className='rounded-md bg-gray-100 px-2.5 py-1 text-gray-600'>
              {level}
            </span>
          )}
        </div>

        {/* Location & salary */}
        <div className='mb-4 space-y-2 text-xs text-gray-600 sm:text-sm'>
          <div className='flex items-center gap-2'>
            <LocationIcon className='h-4 w-4 flex-shrink-0 text-gray-400' />
            <span>{location}</span>
          </div>
          {salary && (
            <div className='flex items-center gap-2'>
              <SalaryIcon className='h-4 w-4 flex-shrink-0 text-gray-400' />
              <span className='font-semibold text-gray-800'>
                {salary} /{" "}
                <span className='font-normal text-gray-500'>
                  {salaryPeriod}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <ul
            className='mb-6 flex flex-wrap gap-1.5'
            aria-label='Required skills'
          >
            {skills.map((skill) => (
              <li
                key={skill}
                className='rounded border border-gray-100 bg-[#f8f9fa] px-2 py-1 text-xs text-gray-600'
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between gap-3 border-t border-gray-100 pt-4'>
        <span className='text-xs font-medium text-gray-400'>{posted}</span>
        {/* With onApply it runs your code; without it, it opens the details page */}
        {onApply ? (
          <button
            type='button'
            onClick={() => onApply(job)}
            className='relative z-10 rounded-lg bg-[#1642a6] px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#123687] active:bg-[#0f2c70] sm:px-5 sm:text-sm'
          >
            Apply Now
          </button>
        ) : (
          <Link
            to={detailsUrl}
            tabIndex={-1}
            className='relative z-10 rounded-lg bg-[#1642a6] px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#123687] active:bg-[#0f2c70] sm:px-5 sm:text-sm'
          >
            Apply Now
          </Link>
        )}
      </div>
    </article>
  );
}
