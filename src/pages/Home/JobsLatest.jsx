import { HiArrowRight } from "react-icons/hi2";
import { Link } from "react-router";
import JobCard from "../../Components/JobCard";
import { useGetLatestJobsQuery } from "../../redux/publicApi";

/**
 * Latest Jobs section.
 *
 * Props:
 *  - jobs?: array of job objects (default: newest jobs from the backend)
 *  - onApply?: (job) => void
 *  - viewAllHref?: link for "View All Jobs"
 *  - maxDisplay?: maximum number of jobs to render (defaults to 4)
 */
export default function JobsLatest({
  jobs,
  onApply,
  viewAllHref = "/jobs",
  maxDisplay = 4,
}) {
  // Newest jobs from the backend: GET /jobs/latest?limit=4
  const { data, isLoading, isError } = useGetLatestJobsQuery(maxDisplay);

  // Always limit display to maximum 4 jobs
  const displayedJobs = (jobs || data?.jobs || []).slice(0, maxDisplay);

  return (
    <section
      aria-labelledby='latest-jobs-heading'
      className='bg-[#f6f8fc] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20'
    >
      <div className='mx-auto w-full max-w-7xl'>
        {/* Section Header */}
        <div className='mb-8 flex flex-col justify-between gap-4 sm:mb-10 md:flex-row md:items-end'>
          <div>
            <div className='mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700'>
              <span className='inline-block h-2 w-2 rounded-full bg-blue-600' />
              <span>Verified Opportunities</span>
            </div>
            <h2
              id='latest-jobs-heading'
              className='text-3xl font-extrabold tracking-tight text-[#0d1527] sm:text-4xl'
            >
              Latest Jobs
            </h2>
            <p className='mt-2 max-w-xl text-sm text-gray-500 sm:text-base'>
              Explore recently posted openings from verified employers across
              Bangladesh
            </p>
          </div>

          <Link
            to={viewAllHref}
            className='group inline-flex flex-shrink-0 items-center gap-1.5 self-start text-sm font-bold text-blue-800 transition-colors duration-150 hover:text-blue-900 sm:text-base md:self-auto'
          >
            <span>View All Jobs</span>
            <HiArrowRight className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
          </Link>
        </div>

        {/* Jobs Grid */}
        {isLoading ? (
          <p className='rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center text-sm text-gray-500'>
            Loading jobs...
          </p>
        ) : isError ? (
          <p className='rounded-2xl border border-red-200 bg-red-50 py-12 text-center text-sm text-red-700'>
            Could not load jobs. Is the server running?
          </p>
        ) : displayedJobs.length > 0 ? (
          <div className='grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-2'>
            {displayedJobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={onApply} />
            ))}
          </div>
        ) : (
          <p className='rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center text-sm text-gray-500'>
            No jobs posted yet. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
