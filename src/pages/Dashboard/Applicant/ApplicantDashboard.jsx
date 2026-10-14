import { useState } from "react";
import { Link } from "react-router";
import { LuPencil, LuSearch, LuSend } from "react-icons/lu";
import EditProfileModal from "../../../Components/EditProfileModal";
import { useGetMeQuery } from "../../../redux/authApi";
import { useGetMyApplicationsQuery } from "../../../redux/applicantApi";
import { formatDate, isWithinDays } from "../../../utils/helpers";

// Badge colour for each status (from the backend)
const stageColors = {
  pending: "bg-[#e5eeff] text-[#1e40af]",
  shortlisted: "bg-[#ffdbca] text-[#341100]",
  exam: "bg-[#dde1ff] text-[#001453]",
  interview: "bg-[#dde1ff] text-[#00288e]",
  approved: "bg-[#dcfce7] text-[#166534]",
  rejected: "bg-[#ffdad6] text-[#93000a]",
};

export default function ApplicantDashboard() {
  // The logged-in applicant (Edit Profile reloads this by itself)
  const { data: meData } = useGetMeQuery();
  const profile = meData?.user || { name: "", initials: "" };
  const [showModal, setShowModal] = useState(false); // is the Edit Profile popup open?

  // My applications → newest 5 for the table
  const { data: appsData, isLoading } = useGetMyApplicationsQuery();
  const allApps = appsData?.applications || [];
  const applications = allApps.slice(0, 5);

  // "Active" = not approved or rejected yet
  const activeCount = allApps.filter(
    (a) => !["approved", "rejected"].includes(a.status),
  ).length;
  // Applied in the last 7 days
  const thisWeek = allApps.filter((a) => isWithinDays(a.applied, 7)).length;

  // First name for "Welcome back, Rahim!"
  const firstName = profile.name.split(" ")[0];

  return (
    <div className='flex flex-col gap-6'>
      {/* ---------- Welcome card ---------- */}
      <div className='flex flex-col justify-between gap-4 rounded-xl bg-white p-5 shadow-sm sm:p-8 md:flex-row md:items-center'>
        <div className='flex items-center gap-4'>
          {/* Avatar with initials */}
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={profile.name}
              className='h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-[#eff4ff]'
            />
          ) : (
            <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1e40af] text-xl font-bold text-white ring-4 ring-[#eff4ff]'>
              {profile.initials}
            </div>
          )}
          <div>
            <div className='flex flex-wrap items-center gap-2'>
              <h1 className='text-2xl font-bold text-[#0b1c30] sm:text-3xl'>
                Welcome back, {firstName}!
              </h1>
              {profile.batch && (
                <span className='rounded-full bg-[#e5eeff] px-2 py-0.5 text-xs font-semibold text-[#173bab]'>
                  Class of {profile.batch}
                </span>
              )}
            </div>
            <p className='mt-0.5 text-sm text-[#444653]'>
              {profile.email}
              {profile.department && ` • ${profile.department} Department`}
              {profile.phone && ` • ${profile.phone}`}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className='flex flex-wrap gap-3'>
          <button
            onClick={() => setShowModal(true)}
            className='flex items-center gap-1 rounded-lg bg-[#e5eeff] px-5 py-2.5 text-sm font-medium text-[#00288e] hover:bg-[#dce9ff]'
          >
            <LuPencil className='h-[18px] w-[18px]' />
            Edit Profile
          </button>
          <Link
            to='/jobs'
            className='flex items-center gap-1 rounded-lg bg-[#fd761a] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90'
          >
            <LuSearch className='h-[18px] w-[18px]' />
            Browse Jobs
          </Link>
        </div>
      </div>

      {/* ---------- Active applications count ---------- */}
      <div className='rounded-xl bg-white p-6 shadow-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium text-[#444653]'>
            Active Applications
          </span>
          <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-[#eff4ff] text-[#00288e]'>
            <LuSend className='h-5 w-5' />
          </div>
        </div>
        <div className='mt-4 flex items-baseline gap-2'>
          <span className='text-4xl font-extrabold text-[#0b1c30] sm:text-5xl'>
            {activeCount}
          </span>
          {thisWeek > 0 && (
            <span className='text-xs font-semibold text-[#fd761a]'>
              +{thisWeek} this week
            </span>
          )}
        </div>
      </div>

      {/* ---------- Recent applications table ---------- */}
      <div className='flex flex-col gap-5 rounded-xl bg-white p-5 shadow-sm sm:p-8'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <h2 className='text-xl font-semibold text-[#0b1c30]'>
              Recent Applications
            </h2>
            <p className='text-xs text-[#444653]'>
              Real-time status updates from university employer partners
            </p>
          </div>
          <Link
            to='/dashboard/applicant/applications'
            className='shrink-0 text-sm font-semibold text-[#00288e] hover:underline'
          >
            View All
          </Link>
        </div>

        {/* overflow-x-auto = the table scrolls sideways on small phones */}
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[560px] text-left'>
            <thead>
              <tr className='bg-[#eff4ff] text-xs font-semibold uppercase tracking-wider text-[#444653]'>
                <th className='rounded-l-lg px-4 py-2'>Company &amp; Role</th>
                <th className='px-4 py-2'>Applied Date</th>
                <th className='px-4 py-2'>Stage</th>
                <th className='rounded-r-lg px-4 py-2 text-right'>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className='px-4 py-8 text-center text-sm text-[#444653]'>
                    Loading...
                  </td>
                </tr>
              )}
              {!isLoading && applications.length === 0 && (
                <tr>
                  <td colSpan={4} className='px-4 py-8 text-center text-sm text-[#444653]'>
                    You haven't applied to any jobs yet.{" "}
                    <Link to='/jobs' className='font-semibold text-[#00288e] underline'>
                      Browse jobs
                    </Link>
                  </td>
                </tr>
              )}
              {applications.map((app) => (
                <tr key={app.id} className='hover:bg-[#eff4ff]'>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-4'>
                      {app.companyLogo ? (
                        <img
                          src={app.companyLogo}
                          alt={app.company}
                          className='h-10 w-10 rounded-lg object-cover'
                        />
                      ) : (
                        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#e5eeff] text-sm font-bold text-[#00288e]'>
                          {app.companyInitials || app.company[0]}
                        </div>
                      )}
                      <div>
                        <p className='font-semibold text-[#0b1c30]'>
                          {app.company}
                        </p>
                        <p className='text-xs text-[#444653]'>{app.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4 text-xs text-[#444653]'>
                    {formatDate(app.applied)}
                  </td>
                  <td className='px-4 py-4'>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${stageColors[app.status]}`}
                    >
                      {app.statusLabel}
                    </span>
                  </td>
                  <td className='px-4 py-4 text-right'>
                    {app.slug ? (
                      <Link
                        to={`/jobs/${app.slug}`}
                        className='text-xs font-semibold text-[#00288e] hover:text-[#1e40af]'
                      >
                        Details
                      </Link>
                    ) : (
                      <span className='text-xs text-[#757684]'>Removed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Edit Profile popup ---------- */}
      {showModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
