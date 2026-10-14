import { useState } from "react";
import {
  LuBuilding2,
  LuX,
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuLockKeyhole,
  LuShieldCheck,
  LuCircleCheck,
  LuFactory,
} from "react-icons/lu";
import { useAddCompanyMutation } from "../redux/adminApi";
import { getError } from "../utils/helpers";

// "Add Company" popup → POST /admin/companies/add
// The table reloads by itself after adding. onClose = closes the popup
export default function AddCompanyModal({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [industry, setIndustry] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [addCompany, { isLoading }] = useAddCompanyMutation();

  const handleAdd = async () => {
    if (!name || !email || !password) {
      alert("Please fill in Company Name, Email and Password.");
      return;
    }
    try {
      const res = await addCompany({ name, email, password, industry }).unwrap();
      alert(res.message); // "Company added successfully."
      onClose();
    } catch (err) {
      alert(getError(err));
    }
  };

  const inputClass =
    "h-[42px] w-full rounded-lg bg-white pl-10 pr-3 text-sm text-[#0b1c30] shadow-sm outline-none ring-1 ring-[#c4c5d5]/50 placeholder:text-[#757684] focus:ring-2 focus:ring-[#1e40af]";
  const iconClass =
    "absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#757684]";

  return (
    // Dark background — click it to close
    <div
      onClick={onClose}
      className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4'
    >
      {/* stopPropagation = clicking inside the white box does NOT close it */}
      <div
        onClick={(e) => e.stopPropagation()}
        className='flex w-full max-w-[480px] flex-col gap-6 rounded-2xl bg-white p-6 shadow-2xl sm:p-8'
      >
        {/* Header */}
        <div className='flex items-start justify-between gap-3'>
          <div>
            <div className='flex items-center gap-2'>
              <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-[#dde1ff] text-[#00288e]'>
                <LuBuilding2 className='h-[18px] w-[18px]' />
              </div>
              <h2 className='text-xl font-semibold text-[#0b1c30]'>
                Add Company
              </h2>
            </div>
            <p className='mt-1 text-xs text-[#444653]'>
              Create recruiter access credentials for a partner company.
            </p>
          </div>
          <button
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full bg-[#eff4ff] text-[#757684] hover:bg-[#e5eeff]'
          >
            <LuX className='h-[18px] w-[18px]' />
          </button>
        </div>

        {/* Company Name */}
        <div className='flex flex-col gap-1.5'>
          <label className='flex justify-between text-sm font-medium text-[#0b1c30]'>
            Company Name{" "}
            <span className='text-[11px] text-[#fd761a]'>Required</span>
          </label>
          <div className='relative'>
            <LuBuilding2 className={iconClass} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. Brain Station 23 Ltd.'
              className={inputClass}
            />
          </div>
        </div>

        {/* Industry (optional) */}
        <div className='flex flex-col gap-1.5'>
          <label className='flex justify-between text-sm font-medium text-[#0b1c30]'>
            Industry <span className='text-[11px] text-[#757684]'>Optional</span>
          </label>
          <div className='relative'>
            <LuFactory className={iconClass} />
            <input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder='e.g. Software Development'
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div className='flex flex-col gap-1.5'>
          <label className='flex justify-between text-sm font-medium text-[#0b1c30]'>
            Gmail / Official Email{" "}
            <span className='text-[11px] text-[#fd761a]'>Required</span>
          </label>
          <div className='relative'>
            <LuMail className={iconClass} />
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='company.recruiter@gmail.com'
              className={inputClass}
            />
          </div>
        </div>

        {/* Password with show / hide button */}
        <div className='flex flex-col gap-1.5'>
          <label className='flex justify-between text-sm font-medium text-[#0b1c30]'>
            Password{" "}
            <span className='text-[11px] text-[#757684]'>Temporary setup</span>
          </label>
          <div className='relative'>
            <LuLock className={iconClass} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••••••'
              className={`${inputClass} pr-10`}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-[#757684] hover:text-[#0b1c30]'
            >
              {showPassword ? (
                <LuEyeOff className='h-[18px] w-[18px]' />
              ) : (
                <LuEye className='h-[18px] w-[18px]' />
              )}
            </button>
          </div>
          <p className='text-[11px] text-[#757684]'>
            Temporary password (e.g. Temp@1234). The company can change it
            later with "Forgot Password".
          </p>
        </div>

        {/* Role (fixed) */}
        <div className='flex flex-col gap-1.5'>
          <label className='text-sm font-medium text-[#0b1c30]'>Role</label>
          <div className='relative flex h-[42px] items-center rounded-lg bg-[#eff4ff] pl-10 text-sm font-medium text-[#444653]'>
            <LuLockKeyhole className={iconClass} />
            Company
            <span className='absolute right-2 flex items-center gap-1 rounded-full bg-[#dce9ff] px-2 py-0.5 text-[11px] text-[#00288e]'>
              <LuShieldCheck className='h-3.5 w-3.5' /> Fixed
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='rounded-lg bg-[#eff4ff] px-5 py-2.5 text-sm font-medium text-[#444653] hover:bg-[#e5eeff]'
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className='flex items-center gap-2 rounded-lg bg-[#1e40af] px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-[#00288e] disabled:opacity-60'
          >
            <LuCircleCheck className='h-[18px] w-[18px]' />
            {isLoading ? "Adding..." : "Add Company"}
          </button>
        </div>
      </div>
    </div>
  );
}
