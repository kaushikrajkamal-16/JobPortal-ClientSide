import { useState } from "react";
import { LuBuilding2, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import CompanyCard from "../../Components/CompanyCard";
import { useGetCompaniesQuery } from "../../redux/publicApi";

const PER_PAGE = 9; // cards per page

export default function Companies() {
  // GET /companies → { companies: [...] }
  const { data, isLoading: loading, isError } = useGetCompaniesQuery();
  const companies = data?.companies || [];
  const [page, setPage] = useState(1); // which page is selected

  const totalPages = Math.max(1, Math.ceil(companies.length / PER_PAGE));
  const pageCompanies = companies.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <section className='bg-[#f8f9ff]'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12'>
        {/* ---------- Header ---------- */}
        <div className='mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end'>
          <div className='max-w-2xl'>
            <p className='mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#00288e]'>
              <span className='h-2 w-2 rounded-full bg-[#fd761a]'></span>
              Placement Network
            </p>
            <h1 className='text-2xl font-bold text-[#0b1c30] sm:text-3xl'>
              Top Hiring Companies
            </h1>
            <p className='mt-1 text-sm text-[#444653] sm:text-base'>
              Explore top employers and university placement partners recruiting
              actively in Bangladesh.
            </p>
          </div>

          <div className='flex items-center gap-1 self-start rounded-lg bg-[#eff4ff] px-4 py-2 text-sm text-[#444653] md:self-auto'>
            <LuBuilding2 className='h-5 w-5 text-[#00288e]' />
            <span className='font-semibold text-[#0b1c30]'>
              {loading ? "..." : companies.length}
            </span>
            Partnered
          </div>
        </div>

        {/* ---------- Company cards ---------- */}
        {loading ? (
          <p className='py-12 text-center text-sm text-[#444653]'>
            Loading companies...
          </p>
        ) : isError ? (
          <p className='rounded-xl border border-red-200 bg-red-50 py-12 text-center text-sm text-red-700'>
            Could not load companies. Is the server running?
          </p>
        ) : companies.length === 0 ? (
          <p className='rounded-xl border border-dashed border-[#c4c5d5] bg-white py-12 text-center text-sm text-[#444653]'>
            No companies yet.
          </p>
        ) : (
          // 1 column on phone, 2 on tablet, 3 on desktop
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {pageCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}

        {/* ---------- Pagination (only when there is more than 1 page) ---------- */}
        {totalPages > 1 && (
        <div className='mt-12 flex items-center justify-center gap-1'>
          <button
            onClick={() => page > 1 && setPage(page - 1)}
            className='flex h-10 items-center rounded-lg bg-white px-3 text-sm text-[#444653] shadow-sm hover:bg-[#eff4ff]'
          >
            <LuChevronLeft className='h-[18px] w-[18px]' />
            <span className='hidden sm:inline'>Previous</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`h-10 w-10 rounded-lg text-sm shadow-sm ${
                page === num
                  ? "bg-[#00288e] text-white"
                  : "bg-white text-[#444653] hover:bg-[#eff4ff]"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => page < totalPages && setPage(page + 1)}
            className='flex h-10 items-center rounded-lg bg-white px-3 text-sm text-[#444653] shadow-sm hover:bg-[#eff4ff]'
          >
            <span className='hidden sm:inline'>Next</span>
            <LuChevronRight className='h-[18px] w-[18px]' />
          </button>
        </div>
        )}
      </div>
    </section>
  );
}
