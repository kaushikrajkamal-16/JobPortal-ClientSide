import { useState } from "react";
import {
  LuX,
  LuFileUp,
  LuCloudUpload,
  LuFileText,
  LuCircleCheck,
  LuTrash2,
  LuInfo,
  LuSend,
} from "react-icons/lu";
import { useApplyJobMutation } from "../redux/applicantApi";
import { getError } from "../utils/helpers";

// Popup for uploading a resume.
// "job" = the job being applied for, "onClose" = function that closes the popup
export default function ApplyModal({ job, onClose }) {
  const [file, setFile] = useState(null); // the chosen resume file
  const [applyJob, { isLoading }] = useApplyJobMutation();

  // Runs when the user picks a file
  const handleFileChange = (e) => {
    const chosen = e.target.files[0];
    if (!chosen) return;

    // Max 5 MB
    if (chosen.size > 5 * 1024 * 1024) {
      alert("File is too big. Max size is 5MB.");
      return;
    }
    setFile(chosen);
  };

  // Runs when the user clicks "Submit Application"
  // POST /applicant/apply/:jobId  (form-data: resume)
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("resume", file); // the name must be "resume" (backend: uploadResume.single("resume"))

    try {
      await applyJob({ jobId: job.id, formData }).unwrap();
      alert(`Application sent for ${job.title}!`);
      onClose();
    } catch (err) {
      alert(getError(err)); // e.g. "You have already applied to this job."
    }
  };

  return (
    // Dark background
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4'>
      {/* White box */}
      <div className='relative flex w-full max-w-lg flex-col gap-6 rounded-2xl bg-white p-5 shadow-2xl sm:p-8'>
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className='absolute right-4 top-4 rounded-full p-1.5 text-[#444653] hover:bg-[#eff4ff]'
        >
          <LuX className='h-5 w-5' />
        </button>

        {/* Title */}
        <div className='flex items-start gap-4 pr-6'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#d3e4fe] text-[#00288e]'>
            <LuFileUp className='h-6 w-6' />
          </div>
          <div>
            <h3 className='text-xl font-semibold text-[#0b1c30]'>
              Apply for this Job
            </h3>
            <p className='mt-0.5 text-xs text-[#444653]'>
              {job.title} at{" "}
              <span className='font-medium text-[#0b1c30]'>{job.company}</span>
            </p>
          </div>
        </div>

        {/* Upload area */}
        <div className='flex flex-col gap-1.5'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-semibold text-[#0b1c30]'>
              Upload Resume <span className='text-[#ba1a1a]'>*</span>
            </p>
            <span className='text-[11px] text-[#444653]'>
              PDF, DOCX (Max 5MB)
            </span>
          </div>

          {/* Clicking this box opens the file picker (it's a <label> for the hidden input) */}
          <label className='flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[#c4c5d5] bg-[#f8f9ff] p-5 text-center hover:border-[#00288e]'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#d3e4fe] text-[#00288e]'>
              <LuCloudUpload className='h-5 w-5' />
            </div>
            <span className='text-sm font-semibold text-[#0b1c30]'>
              Click to browse
            </span>
            <span className='text-xs text-[#444653]'>
              Your most up-to-date CV or resume
            </span>
            <input
              type='file'
              accept='.pdf,.doc,.docx'
              onChange={handleFileChange}
              className='hidden'
            />
          </label>
        </div>

        {/* Chosen file (only shows after a file is picked) */}
        {file && (
          <div className='flex items-center justify-between gap-3 rounded-lg border border-[#c4c5d5]/50 bg-[#eff4ff] p-3'>
            <div className='flex min-w-0 items-center gap-3'>
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1e40af] text-white'>
                <LuFileText className='h-5 w-5' />
              </div>
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold text-[#0b1c30]'>
                  {file.name}
                </p>
                <p className='text-[11px] text-[#444653]'>
                  {(file.size / 1024 / 1024).toFixed(1)} MB • Uploaded just now
                </p>
              </div>
            </div>
            <div className='flex shrink-0 items-center gap-1'>
              <LuCircleCheck className='h-5 w-5 text-[#00288e]' />
              <button
                onClick={() => setFile(null)}
                className='p-1 text-[#444653] hover:text-[#ba1a1a]'
              >
                <LuTrash2 className='h-[18px] w-[18px]' />
              </button>
            </div>
          </div>
        )}

        {/* Info note */}
        <div className='flex items-start gap-2 rounded-lg border border-[#c4c5d5]/50 bg-[#dce9ff]/40 p-3 text-xs text-[#444653]'>
          <LuInfo className='mt-0.5 h-[18px] w-[18px] shrink-0 text-[#00288e]' />
          <span>
            Make sure your contact information and graduation year are up to
            date before submitting.
          </span>
        </div>

        {/* Buttons */}
        <div className='flex justify-end gap-3 border-t border-[#c4c5d5]/50 pt-4'>
          <button
            onClick={onClose}
            className='h-10 rounded-lg border border-[#c4c5d5] px-5 text-sm font-medium text-[#0b1c30] hover:bg-[#eff4ff]'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || isLoading} // can't submit without a resume
            className='flex h-10 items-center gap-2 rounded-lg bg-[#00288e] px-5 text-sm font-medium text-white hover:bg-[#1e40af] disabled:opacity-50'
          >
            <LuSend className='h-[18px] w-[18px]' />
            {isLoading ? "Uploading..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
