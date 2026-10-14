import { useState } from "react";
import { LuFilePlus, LuX, LuInfo, LuUpload, LuChevronDown } from "react-icons/lu";
import { useCreateJobMutation, useUpdateJobMutation } from "../redux/companyApi";
import { getError } from "../utils/helpers";

// Keeps the job's saved value in a dropdown even if it isn't one of the options
const withCurrent = (options, value) =>
  value && !options.includes(value) ? [value, ...options] : options;

// "2026-12-31T00:00:00.000Z" → "2026-12-31" (what <input type="date"> needs)
const toDateInput = (date) => (date ? String(date).slice(0, 10) : "");

// Popup for posting a NEW job or EDITING one.
// job = null → new job (POST /company/jobs/create)
// job = {...} → edit it (PUT /company/jobs/update/:id)
// The "My Jobs" table reloads by itself after saving.
export default function PostJobModal({ job, onClose }) {
  const isEdit = Boolean(job);
  const [createJob, { isLoading: creating }] = useCreateJobMutation();
  const [updateJob, { isLoading: updating }] = useUpdateJobMutation();
  const saving = creating || updating;
  const [showMore, setShowMore] = useState(isEdit); // optional fields open?

  const [form, setForm] = useState({
    title: job?.title || "",
    division: job?.division || "Core Engineering & Cloud",
    type: job?.type || "Full-time",
    mode: job?.mode || "On-site (Gulshan-2)",
    salary: job?.salary || "",
    deadline: toDateInput(job?.deadline),
    description: job?.about || "",
    skills: (job?.skills || []).join(", "),
    // Optional
    location: job?.location || "",
    level: job?.level || "",
    salaryPeriod: job?.salaryPeriod || "month",
    requirements: (job?.requirements || []).join("\n"), // one per line
    benefits: (job?.benefits || []).join("\n"), // one per line
    ctaTitle: job?.ctaTitle || "",
  });

  // Runs on every key press / selection
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Runs when "Publish Job Posting" / "Save Changes" is clicked
  const handlePublish = async () => {
    if (!form.title || !form.salary || !form.deadline) {
      alert("Please fill in Job Title, Salary and Deadline.");
      return;
    }

    try {
      if (isEdit) {
        await updateJob({ id: job.id, ...form }).unwrap();
        alert("Job updated successfully.");
      } else {
        await createJob(form).unwrap();
        alert("Job posted successfully.");
      }
      onClose();
    } catch (err) {
      alert(getError(err)); // e.g. "Deadline must be a valid future date"
    }
  };

  const inputClass =
    "h-10 w-full rounded-lg bg-[#eff4ff] px-3 text-sm text-[#0b1c30] placeholder:text-[#757684] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20";
  const labelClass = "text-xs font-semibold text-[#0b1c30]";

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0b1c30]/40 p-4'>
      <div className='my-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl'>
        {/* Header */}
        <div className='flex items-start justify-between gap-4 bg-[#eff4ff] px-5 py-5 sm:px-8'>
          <div>
            <div className='flex items-center gap-1'>
              <LuFilePlus className='h-[22px] w-[22px] text-[#00288e]' />
              <h3 className='text-xl font-bold text-[#0b1c30]'>
                {isEdit ? "Edit Job Posting" : "Post a New Job Opening"}
              </h3>
            </div>
            <p className='mt-0.5 text-[11px] text-[#444653]'>
              Create and publish a campus or entry-level job posting for
              university applicants.
            </p>
          </div>
          <button
            onClick={onClose}
            className='rounded-lg p-2 text-[#444653] hover:bg-[#e5eeff]'
          >
            <LuX className='h-5 w-5' />
          </button>
        </div>

        {/* Form (scrolls if too tall) */}
        <div className='flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-5 py-6 sm:px-8'>
          {/* 1 column on phone, 2 columns on tablet+ */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>
                Job Title <span className='text-[#ba1a1a]'>*</span>
              </label>
              <input
                name='title'
                value={form.title}
                onChange={handleChange}
                placeholder='e.g., Associate Software Engineer'
                className={inputClass}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>
                Department / Division <span className='text-[#ba1a1a]'>*</span>
              </label>
              <select
                name='division'
                value={form.division}
                onChange={handleChange}
                className={inputClass}
              >
                {withCurrent(
                  [
                    "Core Engineering & Cloud",
                    "UI/UX & Web Experience",
                    "Distributed Systems & API Core",
                    "Quality & Performance Lab",
                    "Mobile Applications & IoT",
                  ],
                  form.division,
                ).map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>
                Job Type <span className='text-[#ba1a1a]'>*</span>
              </label>
              <select
                name='type'
                value={form.type}
                onChange={handleChange}
                className={inputClass}
              >
                {withCurrent(
                  ["Full-time", "Part-time", "Internship", "Contract"],
                  form.type,
                ).map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>
                Work Mode <span className='text-[#ba1a1a]'>*</span>
              </label>
              <select
                name='mode'
                value={form.mode}
                onChange={handleChange}
                className={inputClass}
              >
                {withCurrent(
                  ["On-site (Gulshan-2)", "Hybrid (3 Days Office)", "Remote"],
                  form.mode,
                ).map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>
                Salary / Stipend Range <span className='text-[#ba1a1a]'>*</span>
              </label>
              <input
                name='salary'
                value={form.salary}
                onChange={handleChange}
                placeholder='e.g., 40,000 - 55,000'
                className={inputClass}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>
                Application Deadline <span className='text-[#ba1a1a]'>*</span>
              </label>
              <input
                name='deadline'
                type='date'
                value={form.deadline}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <label className={labelClass}>
              Job Description &amp; Key Responsibilities
            </label>
            <textarea
              name='description'
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder='Describe the role expectations, team structure, and learning opportunities...'
              className='resize-none rounded-lg bg-[#eff4ff] p-3 text-sm text-[#0b1c30] placeholder:text-[#757684] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className={labelClass}>
              Required Qualifications &amp; Technologies
            </label>
            <input
              name='skills'
              value={form.skills}
              onChange={handleChange}
              placeholder='e.g., React, Node.js, TypeScript, Git'
              className={inputClass}
            />
          </div>

          {/* ---------- Optional details (shown on the Job Details page) ---------- */}
          <button
            type='button'
            onClick={() => setShowMore(!showMore)}
            className='flex items-center gap-1 self-start text-xs font-semibold text-[#00288e] hover:underline'
          >
            <LuChevronDown
              className={`h-4 w-4 transition-transform ${showMore ? "rotate-180" : ""}`}
            />
            {showMore ? "Hide" : "Add"} more details (optional)
          </button>

          {showMore && (
            <div className='flex flex-col gap-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                <div className='flex flex-col gap-1'>
                  <label className={labelClass}>Location</label>
                  <input
                    name='location'
                    value={form.location}
                    onChange={handleChange}
                    placeholder='Empty = company address'
                    className={inputClass}
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <label className={labelClass}>Experience Level</label>
                  <input
                    name='level'
                    value={form.level}
                    onChange={handleChange}
                    placeholder='e.g., Graduate Hire'
                    className={inputClass}
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <label className={labelClass}>Salary Per</label>
                  <select
                    name='salaryPeriod'
                    value={form.salaryPeriod}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {withCurrent(
                      ["month", "month stipend", "year", "hour"],
                      form.salaryPeriod,
                    ).map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='flex flex-col gap-1'>
                  <label className={labelClass}>Requirements (one per line)</label>
                  <textarea
                    name='requirements'
                    value={form.requirements}
                    onChange={handleChange}
                    rows={3}
                    placeholder={"B.Sc. in CSE\nGood with Git"}
                    className='resize-none rounded-lg bg-[#eff4ff] p-3 text-sm text-[#0b1c30] placeholder:text-[#757684] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20'
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <label className={labelClass}>Benefits (one per line)</label>
                  <textarea
                    name='benefits'
                    value={form.benefits}
                    onChange={handleChange}
                    rows={3}
                    placeholder={"Two festival bonuses\nFree lunch"}
                    className='resize-none rounded-lg bg-[#eff4ff] p-3 text-sm text-[#0b1c30] placeholder:text-[#757684] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-1'>
                <label className={labelClass}>Closing Line</label>
                <input
                  name='ctaTitle'
                  value={form.ctaTitle}
                  onChange={handleChange}
                  placeholder='e.g., Ready to build with us?'
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex flex-col justify-between gap-3 bg-[#eff4ff] px-5 py-4 sm:flex-row sm:items-center sm:px-8'>
          <p className='flex items-center gap-1 text-[11px] text-[#444653]'>
            <LuInfo className='h-4 w-4 text-[#fd761a]' />
            Instantly synced to active student applicant feeds
          </p>
          <div className='flex gap-2'>
            <button
              onClick={onClose}
              className='h-10 rounded-lg bg-[#dce9ff] px-4 text-sm font-medium text-[#0b1c30] hover:bg-[#d3e4fe]'
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              className='flex h-10 items-center gap-1 rounded-lg bg-[#1e40af] px-5 text-sm font-medium text-white shadow-md hover:bg-[#00288e] disabled:opacity-60'
            >
              <LuUpload className='h-[18px] w-[18px]' />
              {saving
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Publish Job Posting"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
