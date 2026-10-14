import { useState } from "react";
import {
  LuChevronRight,
  LuChevronLeft,
  LuIdCard,
  LuPalette,
  LuChartLine,
  LuMonitorSmartphone,
  LuBug,
  LuTrash2,
  LuBriefcase,
  LuBan,
  LuExternalLink,
} from "react-icons/lu";
import { Link } from "react-router";
import {
  useGetAdminJobsQuery,
  useCloseJobMutation,
  useAdminDeleteJobMutation,
} from "../../../redux/adminApi";
import { formatDate, getError } from "../../../utils/helpers";

// Icon for each job type (anything else → briefcase)
const typeIcons = {
  Internship: LuPalette,
  "Full-time": LuMonitorSmartphone,
  "Part-time": LuChartLine,
  Contract: LuBug,
};

// Status filter buttons
const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "closed", label: "Closed" },
];

const PER_PAGE = 3; // rows per page

export default function ManageJobPosts() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(""); // "" = all

  // GET /admin/jobs?status=&page=1&limit=3 (the server sends one page)
  const { data, isFetching } = useGetAdminJobsQuery({
    status,
    page,
    limit: PER_PAGE,
  });
  const pageRows = data?.jobs || [];
  const totalJobs = data?.totalJobs || 0;

  /* ----- Pagination ----- */
  const totalPages = data?.totalPages || 1;
  const currentPage = Math.min(page, totalPages); // stay on a page that exists
  const from = totalJobs === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const to = Math.min(currentPage * PER_PAGE, totalJobs);

  const [closeJobApi] = useCloseJobMutation();
  const [deleteJobApi] = useAdminDeleteJobMutation();

  // PATCH /admin/jobs/close/:id → status "closed" (hidden from the Jobs page)
  const closeJob = async (id) => {
    if (!confirm("Close this job? Applicants won't be able to apply anymore."))
      return;
    try {
      await closeJobApi(id).unwrap();
    } catch (err) {
      alert(getError(err));
    }
  };

  const deleteJob = async (id) => {
    if (!confirm("Delete this job listing? Its applications will be deleted too."))
      return;
    try {
      await deleteJobApi(id).unwrap();
      if (pageRows.length === 1 && page > 1) setPage(page - 1);
    } catch (err) {
      alert(getError(err));
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      {/* =============== HEADER =============== */}
      <div className='flex flex-col gap-1'>
        <p className='flex items-center gap-1 text-[11px] text-[#444653]'>
          Admin Console <LuChevronRight className='h-3.5 w-3.5' />
          <span className='font-semibold text-[#00288e]'>Job Moderation</span>
        </p>
        <h1 className='text-2xl font-bold text-[#0b1c30] sm:text-3xl'>
          Manage Job Posts
        </h1>
        <p className='max-w-2xl text-sm text-[#444653]'>
          Review, approve, and manage campus recruitment listings. Validate
          institutional eligibility standards before broadcasting to student
          pools.
        </p>
      </div>

      {/* =============== TOTAL LISTINGS CARD =============== */}
      <div className='flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm sm:max-w-xs'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-semibold uppercase tracking-wider text-[#444653]'>
            Total Listings
          </span>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5eeff] text-[#00288e]'>
            <LuIdCard className='h-[18px] w-[18px]' />
          </div>
        </div>
        <div className='flex items-baseline justify-between'>
          <span className='text-4xl font-extrabold text-[#0b1c30]'>
            {totalJobs}
          </span>
          <span className='text-[11px] text-[#444653]'>
            {status ? `${status} jobs` : "all jobs"}
          </span>
        </div>
      </div>

      {/* =============== STATUS FILTER =============== */}
      <div className='flex flex-wrap gap-2'>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={`rounded-lg px-4 py-2 text-xs font-semibold shadow-sm ${
              status === tab.value
                ? "bg-[#00288e] text-white"
                : "bg-white text-[#444653] hover:bg-[#e5eeff]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =============== JOB POSTS TABLE =============== */}
      <div className='flex flex-col overflow-hidden rounded-xl bg-white shadow-sm'>
        {/* Table scrolls sideways on small screens */}
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[760px] text-left text-sm'>
            <thead>
              <tr className='bg-[#eff4ff] text-xs font-semibold text-[#444653]'>
                <th className='px-6 py-4'>Job Title &amp; Domain</th>
                <th className='px-4 py-4'>Hiring Enterprise</th>
                <th className='px-4 py-4'>Posted Date</th>
                <th className='px-4 py-4'>Deadline</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='text-[#0b1c30]'>
              {pageRows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='px-4 py-10 text-center text-[#444653]'
                  >
                    {isFetching ? "Loading..." : "No job listings."}
                  </td>
                </tr>
              )}

              {pageRows.map((job) => {
                const Icon = typeIcons[job.type] || LuBriefcase;
                return (
                <tr
                  key={job.id}
                  className={`group hover:bg-[#eff4ff]/60 ${job.closed ? "opacity-80" : ""}`}
                >
                  {/* Title + icon */}
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-4'>
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e5eeff] ${job.closed ? "text-[#757684]" : "text-[#00288e]"}`}
                      >
                        <Icon className='h-5 w-5' />
                      </div>
                      <div className='min-w-0'>
                        <p className='truncate font-semibold group-hover:text-[#00288e]'>
                          {job.title}
                        </p>
                        <p className='text-[11px] text-[#444653]'>
                          {job.type} • {job.dept || "—"}
                        </p>
                        {job.status !== "active" && (
                          <span className='mt-0.5 inline-block rounded-full bg-[#ffdad6]/60 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#93000a]'>
                            {job.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className='px-4 py-4 font-medium'>{job.company}</td>
                  <td className='px-4 py-4 text-[#444653]'>
                    {formatDate(job.posted)}
                  </td>

                  {/* Deadline + days left */}
                  <td className='px-4 py-4'>
                    <p
                      className={`font-medium ${job.closed ? "text-[#757684]" : ""}`}
                    >
                      {formatDate(job.deadline)}
                    </p>
                    <p
                      className={`text-[11px] ${job.urgent ? "font-medium text-[#ba1a1a]" : "text-[#444653]"}`}
                    >
                      {job.left}
                    </p>
                  </td>

                  <td className='whitespace-nowrap px-6 py-4 text-right'>
                    <Link
                      to={`/jobs/${job.slug}`}
                      title='View Job'
                      className='inline-flex rounded-lg p-2 text-[#757684] hover:bg-[#e5eeff] hover:text-[#00288e]'
                    >
                      <LuExternalLink className='h-[18px] w-[18px]' />
                    </Link>
                    {job.status !== "closed" && (
                      <button
                        onClick={() => closeJob(job.id)}
                        title='Close Job'
                        className='rounded-lg p-2 text-[#757684] hover:bg-[#e5eeff] hover:text-[#9d4300]'
                      >
                        <LuBan className='h-[18px] w-[18px]' />
                      </button>
                    )}
                    <button
                      onClick={() => deleteJob(job.id)}
                      title='Delete Listing'
                      className='rounded-lg p-2 text-[#757684] hover:bg-[#e5eeff] hover:text-[#ba1a1a]'
                    >
                      <LuTrash2 className='h-[18px] w-[18px]' />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex flex-col items-center justify-between gap-3 bg-[#eff4ff] px-6 py-4 sm:flex-row'>
          <span className='text-xs text-[#444653]'>
            Showing{" "}
            <span className='font-semibold text-[#0b1c30]'>
              {from} - {to}
            </span>{" "}
            of{" "}
            <span className='font-semibold text-[#0b1c30]'>{totalJobs}</span>{" "}
            campus listings
          </span>

          <div className='flex items-center gap-1'>
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className='rounded-lg bg-white p-2 text-[#0b1c30] hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:opacity-50'
            >
              <LuChevronLeft className='h-[18px] w-[18px]' />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                  currentPage === num
                    ? "bg-[#00288e] text-white"
                    : "bg-white text-[#444653] hover:bg-[#e5eeff]"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='rounded-lg bg-white p-2 text-[#0b1c30] hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:opacity-50'
            >
              <LuChevronRight className='h-[18px] w-[18px]' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
