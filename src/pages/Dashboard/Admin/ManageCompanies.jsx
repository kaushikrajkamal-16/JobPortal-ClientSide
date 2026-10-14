import { useState } from "react";
import {
  LuPlus,
  LuTrendingUp,
  LuBriefcaseBusiness,
  LuBadgeCheck,
  LuAward,
  LuSearch,
  LuFilter,
  LuAtSign,
  LuTrash2,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import AddCompanyModal from "../../../Components/AddCompanyModal";
import {
  useGetAdminCompaniesQuery,
  useDeleteCompanyMutation,
} from "../../../redux/adminApi";
import { formatDate, getError } from "../../../utils/helpers";

const PER_PAGE = 3; // rows per page

/* ---------------- Page ---------------- */

export default function ManageCompanies() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState(""); // "" = all industries
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false); // is "Add Company" popup open?

  // GET /admin/companies?search=&industry=&page=1&limit=3
  // The server filters + sends one page. It also sends the industry list.
  const { data, isFetching } = useGetAdminCompaniesQuery({
    search,
    industry,
    page,
    limit: PER_PAGE,
  });
  const pageRows = data?.companies || [];
  const industries = data?.industries || [];
  const totalCompanies = data?.totalCompanies || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = Math.min(page, totalPages); // stay on a page that exists
  const from = totalCompanies === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const to = Math.min(currentPage * PER_PAGE, totalCompanies);

  const [deleteCompanyApi] = useDeleteCompanyMutation();

  /* ----- Actions ----- */
  const deleteCompany = async (id) => {
    if (!confirm("Delete this company? Its jobs and applications will be deleted too."))
      return;
    try {
      await deleteCompanyApi(id).unwrap();
      if (pageRows.length === 1 && page > 1) setPage(page - 1);
    } catch (err) {
      alert(getError(err));
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      {/* =============== HEADER =============== */}
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div className='flex flex-col gap-1'>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-2xl font-bold text-[#0b1c30] sm:text-3xl'>
              Manage Companies
            </h1>
            <span className='flex items-center gap-1.5 rounded-full bg-[#dce9ff] px-3 py-1 text-xs font-semibold text-[#00288e] shadow-sm'>
              <span className='h-2 w-2 animate-pulse rounded-full bg-[#fd761a]'></span>
              {totalCompanies} Companies
            </span>
          </div>
          <p className='text-sm text-[#444653]'>
            Overview of registered partner companies, recruitment credentials,
            and hiring status.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className='flex items-center gap-2 self-start rounded-lg bg-[#1e40af] px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-[#00288e] md:self-auto'
        >
          <LuPlus className='h-5 w-5' />
          Add Company
        </button>
      </div>

      {/* =============== 4 NUMBER CARDS: 1 → 2 → 4 columns =============== */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='flex items-center justify-between rounded-xl bg-white p-6 shadow-sm'>
          <div>
            <p className='text-[11px] uppercase tracking-wider text-[#757684]'>
              Active Companies
            </p>
            <p className='mt-1 text-2xl font-semibold text-[#0b1c30]'>
              {totalCompanies}
            </p>
          </div>
        </div>
      </div>

      {/* =============== SEARCH + INDUSTRY FILTER =============== */}
      <div className='flex flex-col gap-3 sm:flex-row'>
        <div className='relative flex-1'>
          <LuSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757684]' />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder='Search company name'
            className='h-10 w-full rounded-lg bg-white pl-9 pr-3 text-sm text-[#0b1c30] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00288e]/20'
          />
        </div>
        <div className='relative sm:w-64'>
          <LuFilter className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#757684]' />
          <select
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
              setPage(1);
            }}
            className='h-10 w-full cursor-pointer rounded-lg bg-white pl-9 pr-3 text-sm text-[#0b1c30] shadow-sm focus:outline-none'
          >
            <option value=''>All industries</option>
            {industries.map((ind) => (
              <option key={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>

      {/* =============== COMPANIES TABLE =============== */}
      <div className='flex flex-col overflow-hidden rounded-xl bg-white shadow-sm'>
        {/* Table scrolls sideways on small screens */}
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[760px] text-left text-sm'>
            <thead>
              <tr className='text-[11px] uppercase tracking-wider text-[#757684]'>
                <th className='px-4 py-4 sm:px-8'>Company</th>
                <th className='px-4 py-4'>Official / Gmail Address</th>
                <th className='px-4 py-4'>Total Job Posts</th>
                <th className='px-4 py-4'>Joined Date</th>
                <th className='px-4 py-4 text-right sm:px-8'>Actions</th>
              </tr>
            </thead>
            <tbody className='text-[#0b1c30]'>
              {pageRows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='px-4 py-10 text-center text-[#444653]'
                  >
                    {isFetching ? "Loading..." : "No companies found."}
                  </td>
                </tr>
              )}

              {pageRows.map((c) => (
                <tr key={c.id} className='hover:bg-[#eff4ff]'>
                  <td className='px-4 py-4 sm:px-8'>
                    <div className='flex items-center gap-4'>
                      {c.logoUrl ? (
                        <img
                          src={c.logoUrl}
                          alt={c.name}
                          className='h-10 w-10 shrink-0 rounded-xl object-cover shadow-sm'
                        />
                      ) : (
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dde1ff] font-semibold text-[#00288e] shadow-sm'>
                          {c.logo}
                        </div>
                      )}
                      <div className='min-w-0'>
                        <p className='truncate font-semibold'>{c.name}</p>
                        <span className='mt-0.5 inline-block rounded-full bg-[#e5eeff] px-2 py-0.5 text-[11px] text-[#444653]'>
                          {c.industry}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-1.5 text-xs'>
                      <LuAtSign className='h-4 w-4 text-[#757684]' />
                      {c.email}
                    </div>
                  </td>
                  <td className='px-4 py-4'>
                    <span className='inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#dce9ff] px-2.5 py-1 text-xs font-semibold text-[#00288e]'>
                      <span className='h-1.5 w-1.5 rounded-full bg-[#00288e]'></span>
                      {c.jobs} Job Posts
                    </span>
                  </td>
                  <td className='px-4 py-4 text-xs text-[#444653]'>
                    {formatDate(c.joined)}
                  </td>
                  <td className='px-4 py-4 text-right sm:px-8'>
                    <button
                      onClick={() => deleteCompany(c.id)}
                      className='inline-flex items-center gap-1 rounded-lg bg-[#ffdad6]/40 px-3 py-1.5 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]'
                    >
                      <LuTrash2 className='h-4 w-4' />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex flex-col items-center justify-between gap-3 bg-[#eff4ff] px-4 py-4 sm:flex-row sm:px-8'>
          <p className='text-xs text-[#444653]'>
            Showing <span className='font-semibold text-[#0b1c30]'>{from}</span>{" "}
            to <span className='font-semibold text-[#0b1c30]'>{to}</span> of{" "}
            <span className='font-semibold text-[#0b1c30]'>
              {totalCompanies}
            </span>{" "}
            companies
          </p>

          <div className='flex items-center gap-1'>
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className='flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#444653] shadow-sm hover:text-[#0b1c30] disabled:cursor-not-allowed disabled:opacity-40'
            >
              <LuChevronLeft className='h-4 w-4' />{" "}
              <span className='hidden sm:inline'>Previous</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold shadow-sm ${
                  currentPage === num
                    ? "bg-[#1e40af] text-white"
                    : "bg-white text-[#444653] hover:text-[#0b1c30]"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#444653] shadow-sm hover:text-[#0b1c30] disabled:cursor-not-allowed disabled:opacity-40'
            >
              <span className='hidden sm:inline'>Next</span>{" "}
              <LuChevronRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>

      {/* =============== ADD COMPANY POPUP =============== */}
      {showAdd && (
        <AddCompanyModal onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}
