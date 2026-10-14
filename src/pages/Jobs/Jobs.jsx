import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import JobCard from "../../Components/JobCard";
import { useGetJobsQuery } from "../../redux/publicApi";
import { getError } from "../../utils/helpers";

const PAGE_SIZE = 4;

// Builds the page list, e.g. [1, 2, 3, "...", 8]
function getPageNumbers(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 2) pages.add(3); // start: 1 2 3 ... 8
  if (current >= total - 1) pages.add(total - 2); // end: 1 ... 6 7 8
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("...");
    result.push(p);
  });
  return result;
}

// Grey placeholder shown while jobs are loading
function CardSkeleton() {
  return (
    <div className='animate-pulse rounded-2xl border border-gray-100 bg-white p-5 sm:p-6'>
      <div className='mb-4 flex items-center gap-3'>
        <div className='h-12 w-12 rounded-xl bg-gray-200' />
        <div className='flex-1 space-y-2'>
          <div className='h-4 w-2/3 rounded bg-gray-200' />
          <div className='h-3 w-1/3 rounded bg-gray-200' />
        </div>
      </div>
      <div className='mb-4 flex gap-2'>
        <div className='h-6 w-20 rounded-md bg-gray-200' />
        <div className='h-6 w-28 rounded-md bg-gray-200' />
      </div>
      <div className='mb-6 space-y-2'>
        <div className='h-3 w-1/2 rounded bg-gray-200' />
        <div className='h-3 w-2/5 rounded bg-gray-200' />
      </div>
      <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
        <div className='h-3 w-16 rounded bg-gray-200' />
        <div className='h-9 w-24 rounded-lg bg-gray-200' />
      </div>
    </div>
  );
}

/**
 * Jobs page (without navbar & footer). Loads jobs from the backend.
 * /jobs?company=<id> shows only one company's jobs (Companies → "View Jobs")
 *
 * Props:
 *  - onApply?: (job) => void
 *  - onBookmarkChange?: (job, isBookmarked) => void
 */
export default function Jobs({ onApply, onBookmarkChange }) {
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const company = searchParams.get("company") || "";

  // RTK Query loads again by itself when "page" changes
  const { data, isFetching, isError, error, refetch } = useGetJobsQuery({
    page,
    limit: PAGE_SIZE,
    company,
  });
  const jobs = data?.jobs || [];
  const totalPages = data?.totalPages || 1;
  const loading = isFetching;

  const goTo = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navBtn =
    "inline-flex h-10 items-center gap-1 rounded-lg bg-white px-3 text-sm font-medium text-[#444653] shadow-sm transition-colors hover:bg-[#e5eeff] hover:text-[#0b1c30] disabled:pointer-events-none disabled:opacity-40 sm:px-4";

  return (
    <section className='w-full bg-[#f8f9ff]'>
      <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12'>
        {/* Header */}
        <div className='mb-8 flex max-w-2xl flex-col gap-1 sm:mb-10'>
          <span className='text-xs font-semibold uppercase tracking-wider text-[#00288e]'>
            Career Board
          </span>
          <h1 className='text-[26px] font-bold leading-[34px] tracking-tight text-[#0b1c30] sm:text-[32px] sm:leading-10'>
            Explore Opportunities
          </h1>
          <p className='text-sm leading-relaxed text-[#444653] sm:text-base'>
            Find and apply for open positions across top companies in
            Bangladesh.
          </p>
        </div>

        {company && (
          <p className='mb-6 text-sm text-[#444653]'>
            Showing jobs from{" "}
            <span className='font-semibold text-[#0b1c30]'>
              {jobs[0]?.company || "this company"}
            </span>{" "}
            ·{" "}
            <Link to='/jobs' className='font-semibold text-[#00288e] underline'>
              Show all jobs
            </Link>
          </p>
        )}

        {/* Job cards */}
        {loading ? (
          <div className='mb-10 grid grid-cols-1 gap-5 sm:mb-12 sm:gap-6 md:grid-cols-2'>
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className='mb-10 rounded-xl border border-red-200 bg-red-50 py-12 text-center text-sm text-red-700'>
            <p className='mb-3'>{getError(error)}</p>
            <button
              type='button'
              onClick={refetch}
              className='rounded-lg bg-white px-4 py-2 font-medium text-red-700 shadow-sm hover:bg-red-100'
            >
              Try again
            </button>
          </div>
        ) : jobs.length > 0 ? (
          <div className='mb-10 grid grid-cols-1 gap-5 sm:mb-12 sm:gap-6 md:grid-cols-2'>
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={onApply}
                onBookmarkChange={onBookmarkChange}
              />
            ))}
          </div>
        ) : (
          <p className='mb-10 rounded-xl border border-dashed border-[#c4c5d5] bg-white py-12 text-center text-sm text-[#444653]'>
            No jobs found. Check back soon.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label='Pagination'
            className='mx-auto flex max-w-lg items-center justify-between gap-2 sm:gap-4'
          >
            <button
              type='button'
              onClick={() => goTo(page - 1)}
              disabled={page === 1 || loading}
              aria-label='Previous page'
              className={navBtn}
            >
              <LuChevronLeft className='h-[18px] w-[18px]' aria-hidden='true' />
              <span className='hidden sm:inline'>Previous</span>
            </button>

            <ul className='flex items-center gap-1'>
              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <li
                    key={`dots-${i}`}
                    className='px-1 text-[#757684]'
                    aria-hidden='true'
                  >
                    ...
                  </li>
                ) : (
                  <li key={p}>
                    <button
                      type='button'
                      onClick={() => goTo(p)}
                      disabled={loading}
                      aria-current={p === page ? "page" : undefined}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors sm:h-10 sm:w-10 ${
                        p === page
                          ? "bg-[#00288e] text-white shadow-sm"
                          : "bg-white text-[#0b1c30] hover:bg-[#e5eeff]"
                      }`}
                    >
                      {p}
                    </button>
                  </li>
                ),
              )}
            </ul>

            <button
              type='button'
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages || loading}
              aria-label='Next page'
              className={navBtn}
            >
              <span className='hidden sm:inline'>Next</span>
              <LuChevronRight
                className='h-[18px] w-[18px]'
                aria-hidden='true'
              />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
