import { useState } from "react";
import {
  LuUserPlus,
  LuGraduationCap,
  LuTrendingUp,
  LuTrash2,
  LuTriangleAlert,
  LuChevronLeft,
  LuChevronRight,
  LuSearch,
  LuFlag,
} from "react-icons/lu";
import AddApplicantModal from "../../../Components/AddApplicantModal";
import {
  useGetApplicantsQuery,
  useDeleteApplicantMutation,
  useToggleFlagApplicantMutation,
} from "../../../redux/adminApi";
import { formatDate, getError } from "../../../utils/helpers";

const PER_PAGE = 3; // rows per page

export default function ManageApplicants() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false); // is "Add Applicant" popup open?

  // GET /admin/applicants?search=&page=1&limit=3 (the server sends one page)
  const { data, isFetching } = useGetApplicantsQuery({
    search,
    page,
    limit: PER_PAGE,
  });
  const pageRows = data?.applicants || [];
  const totalApplicants = data?.totalApplicants || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = Math.min(page, totalPages); // stay on a page that exists
  const from = totalApplicants === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const to = Math.min(currentPage * PER_PAGE, totalApplicants);

  const [deleteApplicantApi] = useDeleteApplicantMutation();
  const [toggleFlag] = useToggleFlagApplicantMutation();

  /* ----- Actions ----- */
  const deleteApplicant = async (id) => {
    if (!confirm("Delete this applicant's profile? Their applications will be deleted too."))
      return;
    try {
      await deleteApplicantApi(id).unwrap();
      // last row of the last page deleted → go back one page
      if (pageRows.length === 1 && page > 1) setPage(page - 1);
    } catch (err) {
      alert(getError(err));
    }
  };

  const flagApplicant = async (id) => {
    try {
      await toggleFlag(id).unwrap(); // flagged ↔ not flagged
    } catch (err) {
      alert(getError(err));
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* =============== HEADER =============== */}
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <p className='text-[11px] uppercase tracking-wider'>
            <span className='font-semibold text-[#00288e]'>Job Placement</span>
            <span className='mx-2 text-[#c4c5d5]'>/</span>
            <span className='text-[#444653]'>Administration</span>
          </p>
          <h1 className='text-2xl font-bold text-[#0b1c30] sm:text-3xl'>
            Manage Applicants
          </h1>
          <p className='max-w-2xl text-sm text-[#444653]'>
            Monitor registered students, track academic standing, filter
            placement status, and manage platform access for campus hiring
            cycles.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className='flex shrink-0 items-center gap-2 self-start rounded-lg bg-[#00288e] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1e40af] md:self-auto'
        >
          <LuUserPlus className='h-[18px] w-[18px]' />
          Add Applicant
        </button>
      </div>

      {/* =============== TOTAL REGISTERED CARD =============== */}
      <div className='flex items-center justify-between rounded-xl bg-white p-4 shadow-sm'>
        <div>
          <p className='text-[11px] font-semibold uppercase tracking-wider text-[#444653]'>
            Total Registered
          </p>
          <p className='mt-1 text-2xl font-semibold text-[#0b1c30]'>
            {totalApplicants}
          </p>
        </div>

        {/* Search by name, email or department */}
        <div className='relative w-full max-w-xs'>
          <LuSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757684]' />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder='Search name, email, department'
            className='h-10 w-full rounded-lg bg-[#eff4ff] pl-9 pr-3 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20'
          />
        </div>
      </div>

      {/* =============== APPLICANTS TABLE =============== */}
      <div className='flex flex-col overflow-hidden rounded-xl bg-white shadow-sm'>
        <div className='flex items-center gap-3 p-4'>
          <h2 className='text-xl font-semibold text-[#0b1c30]'>
            Applicants List
          </h2>
          <span className='rounded-full bg-[#dde1ff] px-2.5 py-0.5 text-xs font-semibold text-[#001453]'>
            {totalApplicants} registered
          </span>
        </div>

        {/* Table scrolls sideways on small screens */}
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[720px] text-left text-sm'>
            <thead>
              <tr className='bg-[#eff4ff] text-xs font-semibold text-[#444653]'>
                <th className='px-4 py-3'>Applicant</th>
                <th className='px-4 py-3'>Email</th>
                <th className='px-4 py-3'>Department</th>
                <th className='px-4 py-3'>Joined Date</th>
                <th className='px-4 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#e5eeff] text-[#0b1c30]'>
              {!isFetching && pageRows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='px-4 py-10 text-center text-[#444653]'
                  >
                    {search ? "No applicants match your search." : "No applicants yet."}
                  </td>
                </tr>
              )}
              {isFetching && pageRows.length === 0 && (
                <tr>
                  <td colSpan={5} className='px-4 py-10 text-center text-[#444653]'>
                    Loading...
                  </td>
                </tr>
              )}

              {pageRows.map((a) => (
                <tr
                  key={a.id}
                  className={
                    a.flagged
                      ? "bg-[#ffdad6]/10 hover:bg-[#ffdad6]/20"
                      : "hover:bg-[#eff4ff]/60"
                  }
                >
                  <td className='px-4 py-3.5'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold ${a.flagged ? "bg-[#ffdad6] text-[#ba1a1a]" : "bg-[#1e40af] text-white"}`}
                      >
                        {a.initials}
                      </div>
                      <span className='flex items-center gap-1.5 font-semibold'>
                        {a.name}
                        {a.flagged && (
                          <LuTriangleAlert
                            className='h-4 w-4 text-[#ba1a1a]'
                            title='Under administrative caution'
                          />
                        )}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 py-3.5 text-xs text-[#444653]'>
                    {a.email}
                  </td>
                  <td className='px-4 py-3.5'>
                    <p className='text-xs'>{a.dept}</p>
                    <p className='text-[11px] text-[#444653]'>
                      Batch {a.batch}
                    </p>
                  </td>
                  <td className='px-4 py-3.5 text-xs font-medium text-[#444653]'>
                    {formatDate(a.joined)}
                  </td>
                  <td className='px-4 py-3.5 text-right'>
                    <button
                      onClick={() => flagApplicant(a.id)}
                      title={a.flagged ? "Remove flag" : "Flag this applicant"}
                      className={`mr-1 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#ffdad6]/40 ${a.flagged ? "text-[#ba1a1a]" : "text-[#444653] hover:text-[#ba1a1a]"}`}
                    >
                      <LuFlag className='h-[18px] w-[18px]' />
                    </button>
                    <button
                      onClick={() => deleteApplicant(a.id)}
                      title='Delete Profile'
                      className='inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#444653] hover:bg-[#ffdad6]/40 hover:text-[#ba1a1a]'
                    >
                      <LuTrash2 className='h-[18px] w-[18px]' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex flex-col items-center justify-between gap-3 p-4 sm:flex-row'>
          <span className='text-xs text-[#444653]'>
            Showing <span className='font-semibold text-[#0b1c30]'>{from}</span>{" "}
            to <span className='font-semibold text-[#0b1c30]'>{to}</span> of{" "}
            <span className='font-semibold text-[#0b1c30]'>
              {totalApplicants}
            </span>{" "}
            applicants
          </span>

          <div className='flex items-center gap-1'>
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className='flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#444653] hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:opacity-40'
            >
              <LuChevronLeft className='h-4 w-4' />{" "}
              <span className='hidden sm:inline'>Previous</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold ${
                  currentPage === num
                    ? "bg-[#00288e] text-white"
                    : "text-[#0b1c30] hover:bg-[#e5eeff]"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#444653] hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:opacity-40'
            >
              <span className='hidden sm:inline'>Next</span>{" "}
              <LuChevronRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>

      {/* =============== ADD APPLICANT POPUP =============== */}
      {showAdd && (
        <AddApplicantModal onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}
