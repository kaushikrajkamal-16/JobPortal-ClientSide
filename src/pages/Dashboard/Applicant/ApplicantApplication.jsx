import { Link } from "react-router";
import {
  LuLayoutGrid,
  LuChevronRight,
  LuTrendingUp,
  LuFolderOpen,
  LuTerminal,
  LuPalette,
  LuCode,
  LuMapPin,
  LuBriefcase,
  LuFileText,
  LuEye,
  LuVideo,
  LuExternalLink,
  LuCircleHelp,
  LuClock,
} from "react-icons/lu";
import {
  useGetMyApplicationsQuery,
  useWithdrawApplicationMutation,
} from "../../../redux/applicantApi";
import { formatDate, getError, STATUS_OPTIONS } from "../../../utils/helpers";

// Badge colour for each status
const statusColors = {
  pending: "bg-[#e5eeff] text-[#444653]",
  shortlisted: "bg-[#ffdbca] text-[#341100]",
  exam: "bg-[#dde1ff] text-[#001453]",
  interview: "bg-[#dde1ff] text-[#00288e]",
  approved: "bg-[#dcfce7] text-[#166534]",
  rejected: "bg-[#ffdad6] text-[#93000a]",
};

// Icon for each job type
const typeIcons = { Internship: LuPalette, "Full-time": LuTerminal };

// "interview" → "Interview Scheduled"
const labelOf = (status) =>
  STATUS_OPTIONS.find((s) => s.value === status)?.label || status;

export default function MyApplications() {
  // GET /applicant/applications
  const { data, isLoading, isError } = useGetMyApplicationsQuery();
  const applications = data?.applications || [];
  const [withdraw, { isLoading: withdrawing }] = useWithdrawApplicationMutation();

  // Active = still in progress (not approved / rejected)
  const activeCount = applications.filter(
    (a) => !["approved", "rejected"].includes(a.status),
  ).length;

  // DELETE /applicant/applications/withdraw/:id  → list reloads by itself
  const handleWithdraw = async (id) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    try {
      const res = await withdraw(id).unwrap();
      alert(res.message);
    } catch (err) {
      alert(getError(err)); // e.g. "You can't withdraw an approved application."
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* ---------- Header ---------- */}
      <div>
        {/* Breadcrumb: Dashboard > My Applications */}
        <div className='mb-1.5 flex items-center gap-1 text-xs font-semibold text-[#444653]'>
          <Link
            to='/dashboard/applicant'
            className='flex items-center gap-1 hover:text-[#00288e]'
          >
            <LuLayoutGrid className='h-4 w-4' />
            Dashboard
          </Link>
          <LuChevronRight className='h-3.5 w-3.5 text-[#757684]' />
          <span className='text-[#00288e]'>My Applications</span>
        </div>
        <h1 className='text-2xl font-bold text-[#0b1c30] sm:text-3xl'>
          My Applications
        </h1>
        <p className='mt-0.5 max-w-2xl text-sm text-[#444653]'>
          Track, manage, and review your job applications and recruitment status
          across campus partner companies.
        </p>
      </div>

      {/* ---------- Total Applied card ---------- */}
      <div className='flex items-center justify-between rounded-xl bg-white p-4 shadow-sm sm:max-w-sm'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-wider text-[#444653]'>
            Total Applied
          </p>
          <div className='mt-1 flex items-baseline gap-2'>
            <span className='text-4xl font-extrabold text-[#0b1c30]'>
              {applications.length}
            </span>
            <span className='rounded bg-[#dde1ff] px-1.5 py-0.5 text-[11px] font-semibold text-[#00288e]'>
              All time
            </span>
          </div>
          <p className='mt-2 flex items-center gap-1 text-[11px] text-[#444653]'>
            <LuTrendingUp className='h-3.5 w-3.5 text-[#00288e]' />
            {activeCount} still in progress
          </p>
        </div>
        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] text-[#00288e]'>
          <LuFolderOpen className='h-6 w-6' />
        </div>
      </div>

      {/* ---------- Application cards ---------- */}
      <div className='flex flex-col gap-4'>
        {isLoading && (
          <p className='rounded-xl bg-white p-8 text-center text-sm text-[#444653]'>
            Loading your applications...
          </p>
        )}
        {isError && (
          <p className='rounded-xl bg-red-50 p-8 text-center text-sm text-red-700'>
            Could not load your applications.
          </p>
        )}
        {!isLoading && !isError && applications.length === 0 && (
          <p className='rounded-xl bg-white p-8 text-center text-sm text-[#444653]'>
            You have no applications yet.{" "}
            <Link to='/jobs' className='font-semibold text-[#00288e] underline'>
              Browse jobs
            </Link>
          </p>
        )}

        {applications.map((app) => {
          const Icon = typeIcons[app.type] || LuCode;
          return (
          <div
            key={app.id}
            className='relative flex flex-col justify-between gap-4 overflow-hidden rounded-xl bg-white p-5 pl-6 shadow-sm hover:shadow-md xl:flex-row xl:items-center'
          >
            {/* Blue strip on the left */}
            <div className='absolute bottom-0 left-0 top-0 w-1.5 bg-[#1e40af]'></div>

            {/* Left: logo + details */}
            <div className='flex min-w-0 flex-1 items-start gap-4'>
              {app.companyLogo ? (
                <img
                  src={app.companyLogo}
                  alt={app.company}
                  className='h-14 w-14 shrink-0 rounded-xl object-cover'
                />
              ) : (
                <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#dce9ff] text-[#00288e]'>
                  <Icon className='h-7 w-7' />
                </div>
              )}

              <div className='min-w-0'>
                {/* Title + status badge */}
                <div className='flex flex-wrap items-center gap-2'>
                  <h2 className='text-lg font-semibold text-[#0b1c30] sm:text-xl'>
                    {app.title}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[app.status]}`}
                  >
                    {app.statusLabel}
                  </span>
                </div>

                {/* Company • location • type • date */}
                <div className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#444653]'>
                  <span className='font-semibold text-[#0b1c30]'>
                    {app.company}
                  </span>
                  <span className='flex items-center gap-1'>
                    <LuMapPin className='h-4 w-4 text-[#757684]' />
                    {app.location}
                  </span>
                  <span className='flex items-center gap-1'>
                    <LuBriefcase className='h-4 w-4 text-[#757684]' />
                    {app.type}
                  </span>
                  <span className='text-[#757684]'>
                    Applied {formatDate(app.applied)}
                  </span>
                </div>

                {/* CV + interview info */}
                <div className='mt-3 flex flex-wrap items-center gap-3'>
                  {/* Opens the uploaded CV from Cloudinary */}
                  <a
                    href={app.cvUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='flex items-center gap-1.5 rounded-md bg-[#eff4ff] px-2.5 py-1 text-[11px] text-[#0b1c30] hover:bg-[#dce9ff]'
                  >
                    <LuFileText className='h-4 w-4 text-[#00288e]' />
                    <span className='font-medium'>{app.cv || "My CV"}</span>
                    <LuEye className='ml-1 h-3.5 w-3.5 text-[#444653]' />
                  </a>

                  {app.interview && (
                    <div className='flex items-center gap-1.5 rounded-md bg-[#dde1ff]/60 px-2.5 py-1 text-[11px] font-semibold text-[#1e40af]'>
                      <LuVideo className='h-4 w-4' />
                      {app.interview}
                    </div>
                  )}
                </div>

                {/* Status timeline: Pending Review → Shortlisted → ... */}
                {app.statusHistory?.length > 1 && (
                  <div className='mt-3 flex flex-wrap items-center gap-1 text-[11px] text-[#444653]'>
                    <LuClock className='h-3.5 w-3.5 text-[#757684]' />
                    {app.statusHistory.map((step, i) => (
                      <span key={i} className='flex items-center gap-1'>
                        {i > 0 && (
                          <LuChevronRight className='h-3 w-3 text-[#757684]' />
                        )}
                        <span className='font-medium text-[#0b1c30]'>
                          {labelOf(step.status)}
                        </span>
                        <span>({formatDate(step.changedAt)})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: buttons */}
            <div className='flex gap-2 border-t pt-3 xl:border-t-0 xl:pt-0'>
              <Link
                to={app.slug ? `/jobs/${app.slug}` : "/jobs"}
                className='flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#e5eeff] px-4 py-2 text-sm font-medium text-[#0b1c30] hover:bg-[#dce9ff] sm:flex-none'
              >
                <LuExternalLink className='h-[18px] w-[18px]' />
                View Job
              </Link>
              {app.status !== "approved" && (
                <button
                  onClick={() => handleWithdraw(app.id)}
                  disabled={withdrawing}
                  className='rounded-lg bg-[#eff4ff] px-4 py-2 text-sm font-medium text-[#ba1a1a] hover:bg-[#ffdad6] disabled:opacity-60'
                >
                  Withdraw
                </button>
              )}
            </div>
          </div>
          );
        })}
      </div>

      {/* ---------- Help note + count ---------- */}
      <div className='flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row'>
        <div className='flex items-center gap-2 text-xs text-[#444653]'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dce9ff] text-[#00288e]'>
            <LuCircleHelp className='h-[18px] w-[18px]' />
          </div>
          <span>
            Need to update your submitted CV for an active opening?
            <Link
              to='/contact'
              className='ml-1 font-semibold text-[#00288e] hover:underline'
            >
              Contact University Placement Cell
            </Link>
            .
          </span>
        </div>
        <span className='text-xs font-semibold text-[#444653]'>
          Showing <span className='text-[#0b1c30]'>{applications.length}</span>{" "}
          applications
        </span>
      </div>
    </div>
  );
}
