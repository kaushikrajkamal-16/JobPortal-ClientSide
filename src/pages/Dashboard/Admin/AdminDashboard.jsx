import { useState } from "react";
import {
  LuUsers,
  LuBuilding,
  LuBriefcase,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

import {
  useGetStatsQuery,
  useGetUsersQuery,
} from "../../../redux/adminApi";
import { useGetMeQuery } from "../../../redux/authApi";
import { formatDate } from "../../../utils/helpers";

// Badge colour for each role
const roleColors = {
  Applicant: "bg-[#dde1ff] text-[#00288e]",
  Recruiter: "bg-[#ffdbca] text-[#9d4300]",
  Admin: "bg-[#ffdbce] text-[#611e00]",
};

const PER_PAGE = 3; // users shown per page

/* ---------------- Page ---------------- */

export default function AdminDashboard() {
  const [page, setPage] = useState(1);
  const { data: meData } = useGetMeQuery();

  // GET /admin/stats → the 3 number cards
  const { data: statsData } = useGetStatsQuery();
  const s = statsData?.stats;
  const stats = [
    {
      label: "Total Applicants",
      value: s ? s.totalApplicants : "...",
      icon: LuUsers,
      iconBox: "bg-[#dce9ff] text-[#00288e]",
    },
    {
      label: "Companies",
      value: s ? s.totalCompanies : "...",
      icon: LuBuilding,
      iconBox: "bg-[#ffdbca] text-[#9d4300]",
    },
    {
      label: "Jobs",
      value: s ? `${s.activeJobs} / ${s.totalJobs}` : "...",
      note: "active / total",
      icon: LuBriefcase,
      iconBox: "bg-[#e5eeff] text-[#3755c3]",
    },
  ];

  // GET /admin/users?page=1&limit=3 → the server sends only this page
  const { data: usersData, isFetching } = useGetUsersQuery({
    page,
    limit: PER_PAGE,
  });
  const pageUsers = usersData?.users || [];
  const totalUsers = usersData?.totalUsers || 0;
  const totalPages = usersData?.totalPages || 1;

  // "Showing 1 to 3 of 6 users"
  const from = totalUsers === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, totalUsers);

  return (
    <div className='flex flex-col gap-8'>
      {/* ---------- Header ---------- */}
      <div>
        <h1 className='text-2xl font-bold text-[#0b1c30] sm:text-3xl'>
          Admin Dashboard
        </h1>
        <p className='text-sm text-[#444653]'>
          Welcome back, {meData?.user?.name || "Administrator"}. Overview of
          placement statistics and partner activity.
        </p>
      </div>

      {/* ---------- Number cards: 1 → 2 → 3 columns ---------- */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className='rounded-xl bg-white p-6 shadow-sm hover:shadow-md'
          >
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-medium text-[#444653]'>
                {stat.label}
              </span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBox}`}
              >
                <stat.icon className='h-[22px] w-[22px]' />
              </div>
            </div>
            <p className='text-4xl font-extrabold text-[#0b1c30] sm:text-5xl'>
              {stat.value}
            </p>
            {stat.note && (
              <p className='mt-1 text-xs text-[#444653]'>{stat.note}</p>
            )}
          </div>
        ))}
      </div>

      {/* ---------- All Users table ---------- */}
      <div className='overflow-hidden rounded-xl border border-[#c4c5d5]/30 bg-white shadow-sm'>
        {/* Title */}
        <div className='flex flex-wrap items-center gap-2 border-b border-[#c4c5d5]/20 p-5 sm:p-6'>
          <h2 className='text-xl font-semibold text-[#0b1c30]'>All Users</h2>
          <span className='rounded-full bg-[#dce9ff] px-2 py-0.5 text-xs font-semibold text-[#00288e]'>
            {totalUsers} Users total
          </span>
        </div>

        {/* Table scrolls sideways on small screens */}
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[640px] text-left text-sm'>
            <thead className='border-b border-[#c4c5d5]/20 bg-[#eff4ff] text-[#444653]'>
              <tr>
                <th className='px-6 py-4 font-semibold'>User</th>
                <th className='px-4 py-4 font-semibold'>Role</th>
                <th className='px-4 py-4 font-semibold'>Department / Org</th>
                <th className='px-4 py-4 font-semibold'>Joined Date</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#c4c5d5]/15 text-[#0b1c30]'>
              {isFetching && pageUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className='px-6 py-8 text-center text-[#444653]'>
                    Loading users...
                  </td>
                </tr>
              )}
              {pageUsers.map((user) => (
                <tr key={user.id} className='hover:bg-[#eff4ff]/50'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-4'>
                      {user.photo ? (
                        <img
                          src={user.photo}
                          alt={user.name}
                          className='h-10 w-10 shrink-0 rounded-full object-cover'
                        />
                      ) : (
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dde1ff] font-semibold text-[#00288e]'>
                          {user.initials}
                        </div>
                      )}
                      <div>
                        <p className='font-medium'>{user.name}</p>
                        <p className='text-[11px] text-[#444653]'>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4'>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[user.role]}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className='px-4 py-4 text-[#444653]'>{user.org}</td>
                  <td className='px-4 py-4 text-[#444653]'>
                    {formatDate(user.joined)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex flex-col items-center justify-between gap-4 border-t border-[#c4c5d5]/20 p-5 sm:flex-row sm:p-6'>
          <span className='text-sm text-[#444653]'>
            Showing <span className='font-medium text-[#0b1c30]'>{from}</span>{" "}
            to <span className='font-medium text-[#0b1c30]'>{to}</span> of{" "}
            <span className='font-medium text-[#0b1c30]'>{totalUsers}</span>{" "}
            users
          </span>

          <div className='flex items-center gap-1'>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className='flex items-center gap-1 rounded-lg border border-[#c4c5d5]/40 px-3 py-1.5 text-sm text-[#444653] hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:opacity-40'
            >
              <LuChevronLeft className='h-4 w-4' />
              <span className='hidden sm:inline'>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${
                  page === num
                    ? "bg-[#00288e] text-white"
                    : "text-[#444653] hover:bg-[#e5eeff]"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className='flex items-center gap-1 rounded-lg border border-[#c4c5d5]/40 px-3 py-1.5 text-sm text-[#444653] hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:opacity-40'
            >
              <span className='hidden sm:inline'>Next</span>
              <LuChevronRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
