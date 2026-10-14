import { useState } from "react";
import { LuUserPlus, LuX } from "react-icons/lu";
import { useAddApplicantMutation } from "../redux/adminApi";
import { getError } from "../utils/helpers";

// "Add Applicant" popup → POST /admin/applicants/add
// The table reloads by itself after adding. onClose = closes the popup
export default function AddApplicantModal({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [addApplicant, { isLoading }] = useAddApplicantMutation();

  const handleAdd = async () => {
    if (!email || !password) {
      alert("Please enter an email and a password.");
      return;
    }
    try {
      const res = await addApplicant({
        name,
        email,
        password,
        department,
        batch,
      }).unwrap();
      alert(res.message); // "Applicant added successfully."
      onClose();
    } catch (err) {
      alert(getError(err)); // e.g. "An account with this email already exists."
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#c4c5d5]/40 bg-[#eff4ff] px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#00288e]";
  const labelClass = "mb-1.5 block text-xs font-semibold text-[#0b1c30]";

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/50 p-4'>
      <div className='flex w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl'>
        {/* Header */}
        <div className='flex items-start justify-between gap-3 border-b border-[#e5eeff] px-6 py-4'>
          <div>
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e40af] text-white'>
                <LuUserPlus className='h-5 w-5' />
              </div>
              <h2 className='text-xl font-semibold text-[#0b1c30]'>
                Add Applicant
              </h2>
            </div>
            <p className='mt-1 text-xs text-[#444653]'>
              Create a new student applicant account for campus placement
              drives.
            </p>
          </div>
          <button
            onClick={onClose}
            className='rounded-lg p-1.5 text-[#444653] hover:bg-[#e5eeff]'
          >
            <LuX className='h-5 w-5' />
          </button>
        </div>

        {/* Form */}
        <div className='flex flex-col gap-4 p-6'>
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Empty = the part of the email before @'
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Email / Gmail Address <span className='text-[#ba1a1a]'>*</span>
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='e.g., applicant@gmail.com'
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Password <span className='text-[#ba1a1a]'>*</span>
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='e.g., Temp@1234 (upper, lower, number, symbol)'
              className={inputClass}
            />
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <label className={labelClass}>Department</label>
              <input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder='e.g., CSE'
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Batch</label>
              <input
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                placeholder='e.g., 2026'
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Role</label>
            {/* Fixed — this popup only creates applicants */}
            <div className='rounded-lg border border-[#c4c5d5]/40 bg-[#eff4ff] px-3 py-2 text-sm font-medium text-[#0b1c30]'>
              Applicant
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 border-t border-[#e5eeff] bg-[#eff4ff] px-6 py-4'>
          <button
            onClick={onClose}
            className='rounded-lg px-4 py-2 text-sm font-medium text-[#444653] hover:bg-[#e5eeff]'
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className='flex items-center gap-1.5 rounded-lg bg-[#00288e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:opacity-60'
          >
            <LuUserPlus className='h-[18px] w-[18px]' />
            {isLoading ? "Adding..." : "Add Applicant"}
          </button>
        </div>
      </div>
    </div>
  );
}
