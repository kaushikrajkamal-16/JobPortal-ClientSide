import { useState } from "react";
import {
  LuFilePlus,
  LuX,
  LuInfo,
  LuUpload,
  LuChevronDown,
} from "react-icons/lu";

import {
  useCreateJobMutation,
  useUpdateJobMutation,
} from "../redux/companyApi";
import { getError } from "../utils/helpers";

// Utility to convert text lines or comma lists into clean arrays
const toArray = (text, separator) =>
  text
    ? text

        .split(separator)
        .map((item) => item.trim())

        .filter(Boolean)
    : [];

export default function PostJobModal({ job, onClose }) {
  const isEdit = Boolean(job);
  const [showMore, setShowMore] = useState(isEdit);

  const [createJob, { isLoading: creating }] = useCreateJobMutation();
  const [updateJob, { isLoading: updating }] = useUpdateJobMutation();

  a;
  const saving = creating || updating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(data.entries());

    // Basic validation
    if (!formValues.title || !formValues.salary || !formValues.deadline) {
      alert("Please fill in Job Title, Salary, and Deadline.");
      return;
    }

    // Transform raw form inputs to the expected API payload structure
    const payload = {
      ...formValues,
      skills: toArray(formValues.skills, ","),
      requirements: toArray(formValues.requirements, "\n"),
      benefits: toArray(formValues.benefits, "\n"),
    };

    try {
      if (isEdit) {
        await updateJob({ id: job.id, ...payload }).unwrap();
        alert("Job updated successfully.");
      } else {
        await createJob(payload).unwrap();
        alert("Job posted successfully.");
      }
      onClose();
    } catch (err) {
      alert(getError(err));
    }
  };

  const inputClass =
    "h-10 w-full rounded-lg bg-[#eff4ff] px-3 text-sm text-[#0b1c30] placeholder:text-[#757684] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20";
  const labelClass = "text-xs font-semibold text-[#0b1c30]";

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0b1c30]/40 p-4'>
      <div className='my-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl'>
        {/* Modal Header */}
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
            type='button'
            onClick={onClose}
            className='rounded-lg p-2 text-[#444653] hover:bg-[#e5eeff]'
          >
            <LuX className='h-5 w-5' />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit}>
          <div className='flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-5 py-6 sm:px-8'>
            {/* Primary Grid Fields */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='flex flex-col gap-1'>
                <label className={labelClass}>
                  Job Title <span className='text-[#ba1a1a]'>*</span>
                </label>
                <input
                  name='title'
                  defaultValue={job?.title || ""}
                  placeholder='e.g., Associate Software Engineer'
                  className={inputClass}
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className={labelClass}>
                  Department / Division{" "}
                  <span className='text-[#ba1a1a]'>*</span>
                </label>
                <input
                  name='division'
                  defaultValue={job?.division || ""}
                  placeholder='e.g., Core Engineering & Cloud'
                  className={inputClass}
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className={labelClass}>
                  Job Type <span className='text-[#ba1a1a]'>*</span>
                </label>
                <select
                  name='type'
                  defaultValue={job?.type || "Full-time"}
                  className={inputClass}
                >
                  <option value='Full-time'>Full-time</option>
                  <option value='Part-time'>Part-time</option>
                  <option value='Internship'>Internship</option>
                  <option value='Contract'>Contract</option>
                </select>
              </div>

              <div className='flex flex-col gap-1'>
                <label className={labelClass}>
                  Work Mode <span className='text-[#ba1a1a]'>*</span>
                </label>
                <select
                  name='mode'
                  defaultValue={job?.mode || "On-site (Gulshan-2)"}
                  className={inputClass}
                >
                  <option value='On-site (Gulshan-2)'>
                    On-site (Gulshan-2)
                  </option>
                  <option value='Hybrid (3 Days Office)'>
                    Hybrid (3 Days Office)
                  </option>
                  <option value='Remote'>Remote</option>
                </select>
              </div>

              <div className='flex flex-col gap-1'>
                <label className={labelClass}>
                  Salary / Stipend Range{" "}
                  <span className='text-[#ba1a1a]'>*</span>
                </label>
                <input
                  name='salary'
                  defaultValue={job?.salary || ""}
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
                  defaultValue={
                    job?.deadline ? String(job.deadline).slice(0, 10) : ""
                  }
                  className={inputClass}
                />
              </div>
            </div>

            {/* Description & Skills */}
            <div className='flex flex-col gap-1'>
              <label className={labelClass}>
                Job Description &amp; Key Responsibilities
              </label>
              <textarea
                name='description'
                defaultValue={job?.about || job?.description || ""}
                rows={3}
                placeholder='Describe the role expectations...'
                className='resize-none rounded-lg bg-[#eff4ff] p-3 text-sm text-[#0b1c30] placeholder:text-[#757684] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className={labelClass}>
                Required Qualifications &amp; Technologies
              </label>
              <input
                name='skills'
                defaultValue={(job?.skills || []).join(", ")}
                placeholder='e.g., React, Node.js, TypeScript, Git'
                className={inputClass}
              />
            </div>

            {/* Optional Section Toggle */}
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

            {/* Optional Fields */}
            {showMore && (
              <div className='flex flex-col gap-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                  <div className='flex flex-col gap-1'>
                    <label className={labelClass}>Location</label>
                    <input
                      name='location'
                      defaultValue={job?.location || ""}
                      placeholder='Empty = company address'
                      className={inputClass}
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className={labelClass}>Experience Level</label>
                    <input
                      name='level'
                      defaultValue={job?.level || ""}
                      placeholder='e.g., Graduate Hire'
                      className={inputClass}
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className={labelClass}>Salary Per</label>
                    <select
                      name='salaryPeriod'
                      defaultValue={job?.salaryPeriod || "month"}
                      className={inputClass}
                    >
                      <option value='month'>month</option>
                      <option value='month stipend'>month stipend</option>
                      <option value='year'>year</option>
                      <option value='hour'>hour</option>
                    </select>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='flex flex-col gap-1'>
                    <label className={labelClass}>
                      Requirements (one per line)
                    </label>
                    <textarea
                      name='requirements'
                      defaultValue={(job?.requirements || []).join("\n")}
                      rows={3}
                      placeholder={"B.Sc. in CSE\nGood with Git"}
                      className='resize-none rounded-lg bg-[#eff4ff] p-3 text-sm text-[#0b1c30] placeholder:text-[#757684] focus:outline-none focus:ring-2 focus:ring-[#00288e]/20'
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className={labelClass}>
                      Benefits (one per line)
                    </label>
                    <textarea
                      name='benefits'
                      defaultValue={(job?.benefits || []).join("\n")}
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
                    defaultValue={job?.ctaTitle || ""}
                    placeholder='e.g., Ready to build with us?'
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className='flex flex-col justify-between gap-3 bg-[#eff4ff] px-5 py-4 sm:flex-row sm:items-center sm:px-8'>
            <p className='flex items-center gap-1 text-[11px] text-[#444653]'>
              <LuInfo className='h-4 w-4 text-[#fd761a]' />
              Instantly synced to active student applicant feeds
            </p>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={onClose}
                className='h-10 rounded-lg bg-[#dce9ff] px-4 text-sm font-medium text-[#0b1c30] hover:bg-[#d3e4fe]'
              >
                Cancel
              </button>
              <button
                type='submit'
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
        </form>
      </div>
    </div>
  );
}
