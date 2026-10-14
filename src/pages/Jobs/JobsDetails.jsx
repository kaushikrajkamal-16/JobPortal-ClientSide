import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { LuCircleCheck, LuArrowRight, LuCircleAlert } from "react-icons/lu";
import { useGetJobBySlugQuery } from "../../redux/publicApi";
import { useGetMeQuery } from "../../redux/authApi";
import { useGetMyApplicationsQuery } from "../../redux/applicantApi";
import { formatDate, getError } from "../../utils/helpers";
import ApplyModal from "../../Components/ApplyModal";

// Helper component for bullet lists
function CheckList({ items }) {
  return (
    <ul className='flex flex-col gap-2.5 text-sm leading-[22px] text-[#444653]'>
      {items.map((item) => (
        <li key={item} className='flex items-start gap-2.5'>
          <LuCircleCheck
            className='mt-0.5 h-[18px] w-[18px] shrink-0 text-[#00288e]'
            aria-hidden='true'
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function JobDetails() {
  // 1. Get the slug from the URL route (/jobs/:slug)
  const { slug } = useParams();

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // is the popup open?

  // 2. Load the job: GET /jobs/:slug (loads again when the slug changes)
  const { data, isLoading: loading, isError, error: apiError } =
    useGetJobBySlugQuery(slug);
  const job = data?.job;
  const error = isError ? getError(apiError) : "";

  // 3. Who is looking? (guests get an error here — that's fine)
  const { data: meData } = useGetMeQuery();
  const user = meData?.user;

  // 4. Applicant only: did I already apply to this job?
  const { data: myApps } = useGetMyApplicationsQuery(undefined, {
    skip: user?.role !== "applicant", // don't call it for guests/companies/admin
  });
  const alreadyApplied = myApps?.applications?.some(
    (app) => String(app.jobId) === String(job?.id),
  );

  const isOpen = job?.status === "active";

  // "Apply for this Job" button
  const handleApplyClick = () => {
    if (!user) {
      alert("Please log in as an applicant to apply.");
      navigate("/login");
      return;
    }
    if (user.role !== "applicant") {
      alert("Only applicants can apply for jobs.");
      return;
    }
    setShowModal(true);
  };

  // 4. State: Simple Loading Text
  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#f8f9ff] text-sm text-[#444653]'>
        Loading job details...
      </div>
    );
  }

  // 5. State: Simple Error Message
  if (error || !job) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-[#f8f9ff] gap-3'>
        <p className='text-red-600 font-medium'>{error || "Job not found."}</p>
        <Link
          to='/jobs'
          className='text-sm font-semibold text-[#00288e] underline'
        >
          Back to Career Board
        </Link>
      </div>
    );
  }

  // Helper array for Key Facts (Department, Experience, Deadline)
  const facts = [
    { label: "Department", value: job.department },
    { label: "Experience", value: job.experience },
    { label: "Deadline", value: job.deadline ? formatDate(job.deadline) : "" },
  ].filter((f) => f.value);

  // 6. State: Success (Render Full Details)
  return (
    <section className='w-full bg-[#f8f9ff]'>
      <div className='mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12'>
        <article className='flex flex-col gap-6 rounded-xl border border-[#757684]/30 bg-white p-5 shadow-sm sm:gap-8 sm:p-10'>
          {/* Header */}
          <header className='flex flex-col gap-1 border-b border-[#757684]/30 pb-5 sm:pb-6'>
            <span className='text-base font-semibold text-[#0b1c30]'>
              {job.company}
            </span>
            <h1 className='text-[26px] font-bold leading-[34px] tracking-tight text-[#0b1c30] sm:text-[32px] sm:leading-10'>
              {job.title}
            </h1>
            <div className='mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#444653] sm:text-sm'>
              <span>{job.location}</span>
              <span aria-hidden='true'>•</span>
              <span>{job.type}</span>
              {job.salary && (
                <>
                  <span aria-hidden='true'>•</span>
                  <span className='font-medium text-[#00288e]'>
                    {job.salary} / {job.salaryPeriod}{" "}
                    {/* CHANGED — added "/ month" */}
                  </span>
                </>
              )}
            </div>
          </header>

          {/* Paused / closed notice */}
          {!isOpen && (
            <div className='flex items-center gap-2 rounded-lg border border-[#ffdad6] bg-[#fff8f7] p-3 text-sm font-medium text-[#ba1a1a]'>
              <LuCircleAlert className='h-5 w-5 shrink-0' />
              {job.status === "paused"
                ? "This job is paused. The company is not taking applications right now."
                : "This job is closed."}
            </div>
          )}

          {/* Key Facts */}
          {facts.length > 0 && (
            <dl className='grid grid-cols-2 gap-4 border-y border-[#757684]/30 py-4 sm:grid-cols-3'>
              {facts.map(({ label, value }) => (
                <div key={label} className='flex flex-col gap-0.5'>
                  <dt className='text-[11px] font-medium uppercase tracking-wider text-[#444653]'>
                    {label}
                  </dt>
                  <dd className='text-sm font-semibold text-[#0b1c30]'>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* About */}
          {job.about && (
            <div className='flex flex-col gap-3 sm:gap-4'>
              <h2 className='text-lg font-semibold text-[#0b1c30] sm:text-xl'>
                About the Role
              </h2>
              <p className='text-sm leading-relaxed text-[#444653]'>
                {job.about}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className='flex flex-col gap-3 sm:gap-4'>
              <h2 className='text-lg font-semibold text-[#0b1c30] sm:text-xl'>
                Requirements &amp; Qualifications
              </h2>
              <CheckList items={job.requirements} />
            </div>
          )}

          {/* Benefits */}
          {job.benefits?.length > 0 && (
            <div className='flex flex-col gap-3 sm:gap-4'>
              <h2 className='text-lg font-semibold text-[#0b1c30] sm:text-xl'>
                What We Offer
              </h2>
              <CheckList items={job.benefits} />
            </div>
          )}

          {/* Apply Button */}
          <div className='flex flex-col justify-between gap-4 border-t border-[#757684]/30 pt-5 sm:flex-row sm:items-center sm:pt-6'>
            <div className='flex flex-col'>
              {job.ctaTitle && (
                <span className='text-base font-semibold text-[#0b1c30]'>
                  {job.ctaTitle}
                </span>
              )}
              {/* NEW — the small grey line from the design */}
              <span className='text-xs text-[#444653]'>
                Applications are reviewed on a rolling basis.
              </span>
            </div>

            {/* Opens the resume popup */}
            <button
              onClick={handleApplyClick}
              disabled={!isOpen || alreadyApplied}
              className='group flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#00288e] px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:bg-[#757684] sm:w-auto'
            >
              <span>
                {alreadyApplied
                  ? "Already Applied"
                  : isOpen
                    ? "Apply for this Job"
                    : "Not Accepting Applications"}
              </span>
              <LuArrowRight
                className='h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5'
                aria-hidden='true'
              />
            </button>
          </div>
        </article>
      </div>

      {/* NEW — show the popup only when showModal is true */}
      {showModal && (
        <ApplyModal job={job} onClose={() => setShowModal(false)} />
      )}
    </section>
  );
}
