import { useState } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuBookmarkCheck,
  LuCirclePlus,
  LuBuilding2,
  LuBriefcase,
  LuNetwork,
  LuBadgeCheck,
  LuCircleCheck,
  LuMapPin,
  LuGlobe,
  LuMail,
  LuPhone,
  LuPencil,
  LuSlidersHorizontal,
  LuCirclePause,
  LuCirclePlay,
  LuTrash2,
  LuArrowRight,
  LuUsers,
  LuFileText,
  LuCheck,
  LuX,
  LuClock,
} from "react-icons/lu";
import PostJobModal from "../../../Components/PostJobModal";
import { useGetMeQuery, useUpdateProfileMutation } from "../../../redux/authApi";
import {
  useGetMyJobsQuery,
  useTogglePauseJobMutation,
  useDeleteJobMutation,
  useGetCandidatesQuery,
  useUpdateCandidateStatusMutation,
  useDeleteCandidateMutation,
} from "../../../redux/companyApi";
import { formatDate, getError, STATUS_OPTIONS } from "../../../utils/helpers";

// Badge colour for each candidate status (backend values)
const statusColors = {
  pending: "bg-[#ffdbca] text-[#341100]",
  shortlisted: "bg-[#e5eeff] text-[#00288e]",
  exam: "bg-[#dde1ff] text-[#001453]",
  interview: "bg-[#dde1ff] text-[#00288e]",
  approved: "bg-[#dcfce7] text-[#166534]",
  rejected: "bg-[#ffdad6] text-[#93000a]",
};

/* ---------------- Pagination ---------------- */

const PER_PAGE = 3; // how many rows each table shows per page

// Prev / 1 2 3 / Next buttons. Used by both tables.
// page = current page, totalPages = number of pages, onChange = go to a page
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null; // only 1 page → no buttons needed

  const btn =
    "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors";

  return (
    <div className='flex items-center justify-between gap-2 pt-2'>
      <span className='text-xs text-[#444653]'>
        Page <span className='font-semibold text-[#0b1c30]'>{page}</span> of{" "}
        <span className='font-semibold text-[#0b1c30]'>{totalPages}</span>
      </span>

      <div className='flex items-center gap-1'>
        {/* Previous */}
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className={`${btn} bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <LuChevronLeft className='h-[18px] w-[18px]' />
        </button>

        {/* Page numbers: 1, 2, 3 ... */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`${btn} ${
              page === num
                ? "bg-[#1e40af] text-white"
                : "bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]"
            }`}
          >
            {num}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className={`${btn} bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:opacity-40`}
        >
          <LuChevronRight className='h-[18px] w-[18px]' />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function RecruiterDashboard() {
  /* ----- Data from the backend ----- */
  const { data: meData } = useGetMeQuery(); // the logged-in company
  const company = meData?.user || {};
  const { data: jobsData, isLoading: jobsLoading } = useGetMyJobsQuery();
  const jobs = jobsData?.jobs || [];

  const [filter, setFilter] = useState("all"); // "all" or a job id
  const { data: candData, isFetching: candLoading } =
    useGetCandidatesQuery(filter); // reloads when the filter changes
  const shownCandidates = candData?.candidates || [];

  const [updateProfile, { isLoading: savingProfile }] = useUpdateProfileMutation();
  const [togglePauseJob] = useTogglePauseJobMutation();
  const [deleteJobApi] = useDeleteJobMutation();
  const [updateStatus] = useUpdateCandidateStatusMutation();
  const [deleteCandidateApi] = useDeleteCandidateMutation();

  const [editing, setEditing] = useState(false); // is the edit panel open?
  const [form, setForm] = useState({}); // values while editing
  const [logoFile, setLogoFile] = useState(null); // new logo picked in the editor
  const [showModal, setShowModal] = useState(false); // is the job popup open?
  const [editJob, setEditJob] = useState(null); // job being edited (null = new job)

  const [jobPage, setJobPage] = useState(1); // current page of the jobs table
  const [candidatePage, setCandidatePage] = useState(1); // current page of the candidates table

  /* ----- Company profile ----- */
  const openEditor = () => {
    // start with the current info
    setForm({
      name: company.name || "",
      industry: company.industry || "",
      address: company.address || "",
      website: company.website || "",
      phone: company.phone || "",
      description: company.description || "",
    });
    setLogoFile(null);
    setEditing(!editing);
  };

  // PUT /auth/updateprofile (form-data, logo = "photo")
  const saveCompany = async () => {
    if (!form.name?.trim()) {
      alert("Company name cannot be empty.");
      return;
    }
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (logoFile) formData.append("photo", logoFile);

    try {
      await updateProfile(formData).unwrap();
      setEditing(false);
      alert("Company profile saved!");
    } catch (err) {
      alert(getError(err));
    }
  };

  /* ----- Jobs ----- */
  const togglePause = async (id) => {
    try {
      await togglePauseJob(id).unwrap(); // active ↔ paused
    } catch (err) {
      alert(getError(err));
    }
  };
  const deleteJob = async (id) => {
    if (!confirm("Delete this job post? Its applications will be deleted too."))
      return;
    try {
      await deleteJobApi(id).unwrap();
    } catch (err) {
      alert(getError(err));
    }
  };
  // Clicking "28 Applicants" shows that job's candidates
  const viewPipeline = (jobId) => {
    changeFilter(jobId);
    document
      .getElementById("pipeline-section")
      .scrollIntoView({ behavior: "smooth" });
  };
  const openNewJob = () => {
    setEditJob(null);
    setShowModal(true);
  };
  const openEditJob = (job) => {
    setEditJob(job);
    setShowModal(true);
  };

  /* ----- Candidates ----- */
  // status = "approved", "interview"... Interview/exam ask for a short note.
  const setStatus = async (candidate, status) => {
    let interviewNote;
    if (status === "interview" || status === "exam") {
      interviewNote = prompt(
        "Add a note for the applicant (date, time, place):",
        candidate.interviewNote || "",
      );
      if (interviewNote === null) return; // pressed Cancel
    }
    try {
      await updateStatus({ id: candidate.id, status, interviewNote }).unwrap();
    } catch (err) {
      alert(getError(err));
    }
  };
  const deleteCandidate = async (id) => {
    if (!confirm("Remove this candidate?")) return;
    try {
      await deleteCandidateApi(id).unwrap();
    } catch (err) {
      alert(getError(err));
    }
  };

  // Change the job filter and go back to page 1
  const changeFilter = (value) => {
    setFilter(value);
    setCandidatePage(1);
  };

  /* ----- Pagination maths ----- */
  // Number of pages (at least 1)
  const jobTotalPages = Math.max(1, Math.ceil(jobs.length / PER_PAGE));
  const candidateTotalPages = Math.max(
    1,
    Math.ceil(shownCandidates.length / PER_PAGE),
  );

  // If a delete removes the last row of a page, step back to a page that exists
  const currentJobPage = Math.min(jobPage, jobTotalPages);
  const currentCandidatePage = Math.min(candidatePage, candidateTotalPages);

  // Only the rows for the current page
  const pageJobs = jobs.slice(
    (currentJobPage - 1) * PER_PAGE,
    currentJobPage * PER_PAGE,
  );
  const pageCandidates = shownCandidates.slice(
    (currentCandidatePage - 1) * PER_PAGE,
    currentCandidatePage * PER_PAGE,
  );

  const totalAllApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0);
  const totalHired = jobs.reduce((sum, job) => sum + job.hired, 0);
  const activeJobs = jobs.filter((job) => job.status === "active").length;

  // Number for "Total Pipeline"
  const totalApplicants =
    filter === "all"
      ? totalAllApplicants
      : jobs.find((job) => job.id === filter)?.applicants || 0;
  const filterTitle =
    filter === "all"
      ? "All Jobs Combined"
      : jobs.find((job) => job.id === filter)?.title || "";

  const inputClass =
    "h-10 rounded-lg bg-white px-3 text-sm text-[#0b1c30] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00288e]/20";

  return (
    <div className='flex flex-col gap-6'>
      {/* =============== HEADER =============== */}
      <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div className='flex flex-col gap-1'>
          <p className='flex items-center gap-1 text-[11px] text-[#444653]'>
            Recruiter Portal <LuChevronRight className='h-3.5 w-3.5' />
            <span className='font-semibold text-[#0b1c30]'>
              Company Management Hub
            </span>
          </p>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-2xl font-bold text-[#0b1c30] sm:text-3xl'>
              {company.name || "Company"} Management Hub
            </h1>
            <span className='flex items-center gap-1 rounded-full bg-[#dce9ff] px-2.5 py-0.5 text-xs font-semibold text-[#00288e]'>
              <span className='h-2 w-2 animate-pulse rounded-full bg-[#fd761a]'></span>
              Live Sync Active
            </span>
          </div>
          <p className='max-w-3xl text-sm text-[#444653]'>
            Manage active campus listings, track applicants through hiring
            stages, and maintain your university recruiting profile.
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          <button
            onClick={openEditor}
            className='flex h-10 items-center gap-1 rounded-lg bg-[#eff4ff] px-4 text-sm font-medium text-[#0b1c30] shadow-sm hover:bg-[#e5eeff]'
          >
            <LuBookmarkCheck className='h-[18px] w-[18px] text-[#00288e]' />
            Edit Profile
          </button>
          <button
            onClick={openNewJob}
            className='flex h-10 items-center gap-1 rounded-lg bg-[#fd761a] px-4 text-sm font-medium text-white shadow-md hover:bg-[#9d4300]'
          >
            <LuCirclePlus className='h-5 w-5' />
            Post a New Job
          </button>
        </div>
      </div>

      {/* =============== QUICK LINKS (jump to a section) =============== */}

      {/* =============== SECTION 1: COMPANY PROFILE =============== */}
      <section
        id='company-section'
        className='rounded-xl bg-white p-5 shadow-sm sm:p-6'
      >
        <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-start'>
          {/* Left: logo + info */}
          <div className='flex flex-1 flex-col gap-4 sm:flex-row'>
            <div className='relative shrink-0'>
              {company.photo ? (
                <img
                  src={company.photo}
                  alt={`${company.name} logo`}
                  className='h-20 w-20 rounded-xl object-cover'
                />
              ) : (
                <div className='flex h-20 w-20 items-center justify-center rounded-xl bg-[#1e40af] text-2xl font-bold text-white'>
                  {company.initials}
                </div>
              )}
              <span className='absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm'>
                <LuBadgeCheck className='h-[18px] w-[18px] text-[#fd761a]' />
              </span>
            </div>

            <div className='flex flex-1 flex-col gap-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <h2 className='text-2xl font-semibold text-[#0b1c30]'>
                  {company.name}
                </h2>
                {company.industry && (
                  <span className='rounded-full bg-[#dce9ff] px-2 py-0.5 text-[11px] font-semibold text-[#00288e]'>
                    {company.industry}
                  </span>
                )}
                <span className='flex items-center gap-1 rounded-full bg-[#eff4ff] px-2 py-0.5 text-[11px] font-medium text-[#9d4300]'>
                  <LuCircleCheck className='h-3.5 w-3.5' /> Verified Campus
                  Employer
                </span>
              </div>
              <p className='max-w-2xl text-sm text-[#444653]'>
                {company.description ||
                  "No company description yet. Click \"Quick Edit Profile\" to add one."}
              </p>

              {/* Contact info: 1 → 2 → 4 columns */}
              <div className='mt-1 grid grid-cols-1 gap-2 text-xs text-[#444653] sm:grid-cols-2 xl:grid-cols-4'>
                <span className='flex items-center gap-1 truncate'>
                  <LuMapPin className='h-[18px] w-[18px] shrink-0 text-[#00288e]' />
                  {company.address || "Address not set"}
                </span>
                <span className='flex items-center gap-1 truncate text-[#00288e]'>
                  <LuGlobe className='h-[18px] w-[18px] shrink-0' />
                  {company.website || "Website not set"}
                </span>
                <span className='flex items-center gap-1 truncate'>
                  <LuMail className='h-[18px] w-[18px] shrink-0 text-[#00288e]' />
                  {company.email}
                </span>
                <span className='flex items-center gap-1 truncate'>
                  <LuPhone className='h-[18px] w-[18px] shrink-0 text-[#00288e]' />
                  {company.phone || "Phone not set"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: edit button + numbers */}
          <div className='flex flex-col items-start gap-4 lg:items-end'>
            <button
              onClick={openEditor}
              className='flex items-center gap-1 rounded-lg bg-[#eff4ff] px-4 py-2 text-xs font-semibold text-[#0b1c30] shadow-sm hover:bg-[#dce9ff]'
            >
              <LuPencil className='h-4 w-4 text-[#00288e]' />
              {editing ? "Close Profile Editor" : "Quick Edit Profile"}
            </button>
            <div className='flex w-full items-center justify-around gap-4 rounded-xl bg-[#eff4ff] p-2 lg:w-auto'>
              <div className='px-2 text-center'>
                <p className='text-xl font-bold text-[#00288e]'>{activeJobs}</p>
                <p className='text-[11px] uppercase tracking-wider text-[#444653]'>
                  Active Jobs
                </p>
              </div>
              <div className='h-8 w-px bg-[#d3e4fe]'></div>
              <div className='px-2 text-center'>
                <p className='text-xl font-bold text-[#fd761a]'>
                  {totalAllApplicants}
                </p>
                <p className='text-[11px] uppercase tracking-wider text-[#444653]'>
                  Applicants
                </p>
              </div>
              <div className='h-8 w-px bg-[#d3e4fe]'></div>
              <div className='px-2 text-center'>
                <p className='text-xl font-bold text-[#0b1c30]'>{totalHired}</p>
                <p className='text-[11px] uppercase tracking-wider text-[#444653]'>
                  Hired
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit panel (only shows when "Quick Edit Profile" is clicked) */}
        {editing && (
          <div className='mt-6 rounded-xl bg-[#eff4ff] p-4'>
            <div className='mb-3 flex flex-col justify-between gap-1 sm:flex-row sm:items-center'>
              <p className='flex items-center gap-1 font-semibold text-[#0b1c30]'>
                <LuSlidersHorizontal className='h-5 w-5 text-[#00288e]' />
                Update Employer Visibility Settings
              </p>
              <p className='text-[11px] text-[#444653]'>
                Changes immediately reflect on Student Boards
              </p>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              {[
                { label: "Company Name", key: "name" },
                { label: "Primary Industry Sector", key: "industry" },
                { label: "Headquarter Address", key: "address" },
                { label: "Career Portal Website", key: "website" },
                { label: "Verification Hotline", key: "phone" },
              ].map((field) => (
                <div key={field.key} className='flex flex-col gap-1'>
                  <label className='text-xs font-semibold text-[#444653]'>
                    {field.label}
                  </label>
                  <input
                    value={form[field.key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [field.key]: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              ))}

              {/* Logo (sent as "photo") */}
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-semibold text-[#444653]'>
                  Company Logo (PNG/JPG/WebP, max 5MB)
                </label>
                <input
                  type='file'
                  accept='image/png, image/jpeg, image/webp'
                  onChange={(e) => setLogoFile(e.target.files[0] || null)}
                  className='text-xs text-[#444653] file:mr-2 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#00288e]'
                />
              </div>

              {/* Description (full width) */}
              <div className='flex flex-col gap-1 md:col-span-3'>
                <label className='text-xs font-semibold text-[#444653]'>
                  About the Company
                </label>
                <textarea
                  rows={3}
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className='resize-none rounded-lg bg-white p-3 text-sm text-[#0b1c30] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00288e]/20'
                />
              </div>
            </div>

            <div className='mt-4 flex justify-end gap-2'>
              <button
                onClick={() => setEditing(false)}
                className='rounded-lg bg-[#e5eeff] px-4 py-1.5 text-xs font-semibold text-[#444653] hover:bg-[#dce9ff]'
              >
                Discard
              </button>
              <button
                onClick={saveCompany}
                disabled={savingProfile}
                className='rounded-lg bg-[#1e40af] px-4 py-1.5 text-xs font-semibold text-white shadow-sm disabled:opacity-60'
              >
                {savingProfile ? "Saving..." : "Save Information"}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =============== SECTION 2: MANAGE JOBS =============== */}
      <section
        id='jobs-section'
        className='flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:p-6'
      >
        <div className='flex items-center gap-2'>
          <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-[#eff4ff] text-[#00288e]'>
            <LuBriefcase className='h-5 w-5' />
          </div>
          <div>
            <h2 className='text-xl font-semibold text-[#0b1c30]'>
              Manage Active Job Postings
            </h2>
            <p className='text-xs text-[#444653]'>
              {jobs.length} job posts · {activeJobs} accepting applicant CVs
            </p>
          </div>
        </div>

        {/* Table scrolls sideways on small screens */}
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[860px] text-left text-sm'>
            <thead>
              <tr className='bg-[#eff4ff] text-xs font-semibold text-[#444653]'>
                <th className='rounded-l-lg px-4 py-2'>
                  Job Title &amp; Division
                </th>
                <th className='px-4 py-2'>Type &amp; Mode</th>
                <th className='px-4 py-2'>Salary / Stipend</th>
                <th className='px-4 py-2'>Timeline</th>
                <th className='px-4 py-2'>Pipeline Status</th>
                <th className='rounded-r-lg px-4 py-2 text-right'>
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {jobsLoading && (
                <tr>
                  <td colSpan={6} className='px-4 py-8 text-center text-sm text-[#444653]'>
                    Loading your jobs...
                  </td>
                </tr>
              )}
              {!jobsLoading && jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className='px-4 py-8 text-center text-sm text-[#444653]'>
                    No job posts yet. Click "Post a New Job" to add one.
                  </td>
                </tr>
              )}
              {pageJobs.map((job) => (
                <tr
                  key={job.id}
                  className={`hover:bg-[#eff4ff]/60 ${job.status !== "active" ? "opacity-50" : ""}`}
                >
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-2'>
                      <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#dce9ff] text-[11px] font-bold text-[#00288e]'>
                        {job.short}
                      </div>
                      <div>
                        <p className='font-semibold text-[#0b1c30]'>
                          {job.title}
                        </p>
                        <p className='text-[11px] text-[#444653]'>
                          {job.division}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4'>
                    <p className='text-xs font-semibold text-[#0b1c30]'>
                      {job.type}
                    </p>
                    <p className='text-[11px] text-[#444653]'>{job.mode}</p>
                  </td>
                  <td className='px-4 py-4'>
                    <p className='font-semibold text-[#0b1c30]'>{job.salary}</p>
                    <p className='text-[11px] text-[#444653]'>
                      BDT / {job.salaryPeriod || "month"}
                    </p>
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-1.5'>
                      <span className='whitespace-nowrap rounded-full bg-[#dce9ff] px-2 py-0.5 text-[11px] font-medium text-[#00288e]'>
                        {job.status === "closed"
                          ? "Closed by admin"
                          : job.paused
                            ? "Paused"
                            : job.daysLeft > 0
                              ? `${job.daysLeft} Days left`
                              : "Deadline passed"}
                      </span>
                      <span className='whitespace-nowrap text-[11px] text-[#444653]'>
                        Closes {formatDate(job.closes)}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 py-4'>
                    <button
                      onClick={() => viewPipeline(job.id)}
                      className='flex items-center gap-1 whitespace-nowrap rounded-full bg-[#dce9ff] px-2.5 py-1 text-xs font-semibold text-[#00288e] hover:bg-[#1e40af] hover:text-white'
                    >
                      <span className='h-2 w-2 rounded-full bg-[#fd761a]'></span>
                      {job.applicants} Applicants ({job.hired} Hired)
                      <LuArrowRight className='h-3.5 w-3.5' />
                    </button>
                  </td>
                  <td className='px-4 py-4 text-right'>
                    <div className='inline-flex gap-1'>
                      <button
                        onClick={() => openEditJob(job)}
                        title='Edit Job Post'
                        className='flex h-8 w-8 items-center justify-center rounded-lg text-[#444653] hover:bg-[#dce9ff] hover:text-[#00288e]'
                      >
                        <LuPencil className='h-[18px] w-[18px]' />
                      </button>
                      <button
                        onClick={() => togglePause(job.id)}
                        disabled={job.status === "closed"}
                        title={
                          job.paused
                            ? "Resume Applications"
                            : "Pause Applications"
                        }
                        className='flex h-8 w-8 items-center justify-center rounded-lg text-[#444653] hover:bg-[#dce9ff] hover:text-[#fd761a] disabled:cursor-not-allowed disabled:opacity-40'
                      >
                        {job.paused ? (
                          <LuCirclePlay className='h-[18px] w-[18px]' />
                        ) : (
                          <LuCirclePause className='h-[18px] w-[18px]' />
                        )}
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        title='Delete Job Post'
                        className='flex h-8 w-8 items-center justify-center rounded-lg text-[#444653] hover:bg-[#ffdad6] hover:text-[#93000a]'
                      >
                        <LuTrash2 className='h-[18px] w-[18px]' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Jobs pagination */}
        <Pagination
          page={currentJobPage}
          totalPages={jobTotalPages}
          onChange={setJobPage}
        />
      </section>

      {/* =============== SECTION 3: CANDIDATES =============== */}
      <section
        id='pipeline-section'
        className='flex flex-col gap-5 rounded-xl bg-white p-5 shadow-sm sm:p-6'
      >
        <div className='flex flex-col justify-between gap-4 lg:flex-row lg:items-center'>
          <div className='flex items-center gap-2'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eff4ff] text-[#00288e]'>
              <LuUsers className='h-5 w-5' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-[#0b1c30]'>
                Candidates &amp; Hired Pipeline per Job
              </h2>
              <p className='text-xs text-[#444653]'>
                Real-time status for university applicants, interviewees, and
                hired placements
              </p>
            </div>
          </div>

          {/* Job filter dropdown */}
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-xs font-semibold text-[#444653]'>
              Filter Role:
            </span>
            <select
              value={filter}
              onChange={(e) => changeFilter(e.target.value)}
              className='h-10 max-w-full cursor-pointer rounded-lg bg-[#eff4ff] px-3 text-sm font-medium text-[#0b1c30] shadow-sm focus:outline-none'
            >
              <option value='all'>
                All Jobs Combined ({totalAllApplicants} Applicants)
              </option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.applicants} Applicants, {job.hired} Hired)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Total pipeline number */}
        <div className='w-full rounded-xl bg-[#eff4ff] p-4 shadow-sm sm:w-56'>
          <div className='flex items-center justify-between'>
            <span className='text-[11px] font-semibold uppercase text-[#444653]'>
              Total Pipeline
            </span>
            <LuUsers className='h-[18px] w-[18px] text-[#00288e]' />
          </div>
          <p className='mt-2 text-2xl font-bold text-[#0b1c30]'>
            {totalApplicants}
          </p>
          <p className='text-[11px] text-[#444653]'>Students Evaluated</p>
        </div>

        {/* Candidate table */}
        <p className='font-semibold text-[#0b1c30]'>
          {filterTitle}{" "}
          <span className='text-[11px] font-normal text-[#444653]'>
            Candidate Roster
          </span>
        </p>

        <div className='overflow-x-auto'>
          <table className='w-full min-w-[760px] text-left text-sm'>
            <thead>
              <tr className='bg-[#eff4ff] text-xs font-semibold text-[#444653]'>
                <th className='rounded-l-lg px-4 py-2'>Student / Candidate</th>
                <th className='px-4 py-2'>Applied Job Post</th>
                <th className='px-4 py-2'>Stage Status</th>
                <th className='px-4 py-2'>Portfolio / CV</th>
                <th className='rounded-r-lg px-4 py-2 text-right'>
                  Manage Candidate
                </th>
              </tr>
            </thead>
            <tbody>
              {candLoading && (
                <tr>
                  <td colSpan={5} className='px-4 py-8 text-center text-sm text-[#444653]'>
                    Loading candidates...
                  </td>
                </tr>
              )}
              {!candLoading && shownCandidates.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='px-4 py-8 text-center text-sm text-[#444653]'
                  >
                    No candidates for this job yet.
                  </td>
                </tr>
              )}

              {!candLoading && pageCandidates.map((c) => (
                <tr key={c.id} className='hover:bg-[#eff4ff]/60'>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-2'>
                      {c.photo ? (
                        <img
                          src={c.photo}
                          alt={c.name}
                          className='h-9 w-9 shrink-0 rounded-full object-cover'
                        />
                      ) : (
                        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dce9ff] text-[11px] font-bold text-[#00288e]'>
                          {c.initials}
                        </div>
                      )}
                      <div>
                        <p className='font-semibold text-[#0b1c30]'>{c.name}</p>
                        <p className='text-[11px] text-[#444653]'>{c.email}</p>
                        {(c.department || c.batch) && (
                          <p className='text-[11px] text-[#757684]'>
                            {[c.department, c.batch].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4 font-medium text-[#0b1c30]'>
                    {c.job}
                    <p className='text-[11px] font-normal text-[#757684]'>
                      Applied {formatDate(c.appliedAt)}
                    </p>
                  </td>
                  <td className='px-4 py-4'>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[c.status]}`}
                    >
                      {c.status === "pending" ? (
                        <LuClock className='h-3.5 w-3.5' />
                      ) : (
                        <LuCircleCheck className='h-3.5 w-3.5' />
                      )}
                      {c.statusLabel}
                    </span>
                    {c.interviewNote && (
                      <p className='mt-1 max-w-[200px] text-[11px] text-[#444653]'>
                        {c.interviewNote}
                      </p>
                    )}
                  </td>
                  <td className='px-4 py-4'>
                    <a
                      href={c.resume}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center gap-1 text-xs font-semibold text-[#00288e] hover:underline'
                    >
                      <LuFileText className='h-[18px] w-[18px]' />
                      <span className='max-w-[140px] truncate'>
                        {c.resumeName || "Resume"}
                      </span>
                    </a>
                  </td>
                  <td className='px-4 py-4 text-right'>
                    {/* Pending → quick Approve / Reject. Any time: change stage or delete */}
                    <div className='inline-flex flex-wrap items-center justify-end gap-1.5'>
                      {c.status === "pending" && (
                        <>
                          <button
                            onClick={() => setStatus(c, "approved")}
                            className='flex items-center gap-1 rounded-lg bg-[#00288e] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1e40af]'
                          >
                            <LuCheck className='h-4 w-4' /> Approve
                          </button>
                          <button
                            onClick={() => setStatus(c, "rejected")}
                            className='flex items-center gap-1 rounded-lg bg-[#e5eeff] px-2.5 py-1.5 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]'
                          >
                            <LuX className='h-4 w-4' /> Reject
                          </button>
                        </>
                      )}

                      {/* All stages: Pending, Shortlisted, Exam, Interview, Approved, Rejected */}
                      <select
                        value={c.status}
                        onChange={(e) => setStatus(c, e.target.value)}
                        title='Change stage'
                        className='h-8 cursor-pointer rounded-lg bg-[#eff4ff] px-2 text-xs font-semibold text-[#0b1c30] focus:outline-none'
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => deleteCandidate(c.id)}
                        title='Delete candidate'
                        className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff4ff] text-[#ba1a1a] hover:bg-[#ffdad6]'
                      >
                        <LuTrash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Candidates pagination */}
        <Pagination
          page={currentCandidatePage}
          totalPages={candidateTotalPages}
          onChange={setCandidatePage}
        />
      </section>

      {/* =============== POST A JOB POPUP =============== */}
      {/* job = null → "Post a New Job", job = {...} → "Edit Job" */}
      {showModal && (
        <PostJobModal job={editJob} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
