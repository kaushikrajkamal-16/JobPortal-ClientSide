import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useResetPasswordMutation } from "../../redux/authApi";
import { getError } from "../../utils/helpers";
import {
  LuBox,
  LuKeyRound,
  LuLock,
  LuShieldCheck,
  LuEye,
  LuEyeOff,
  LuCheck,
  LuArrowLeft,
} from "react-icons/lu";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // eye button for "New Password"
  const [showConfirm, setShowConfirm] = useState(false); // eye button for "Confirm Password"
  const navigate = useNavigate();
  const location = useLocation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Sent from VerifyOtp: { email, otp }
  const email = location.state?.email;
  const otp = location.state?.otp;

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from reloading

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Opened this page directly (no email/code) → start again
    if (!email || !otp) {
      alert("Please start from Forgot Password.");
      navigate("/forgetPassword");
      return;
    }

    try {
      const res = await resetPassword({
        email,
        otp,
        password,
        confirmPassword,
      }).unwrap();
      alert(res.message); // "Password changed successfully. Please log in."
      navigate("/login");
    } catch (err) {
      alert(getError(err)); // e.g. "Password needs an uppercase letter..."
    }
  };

  // Same style for both inputs
  const inputClass =
    "h-[42px] w-full rounded-lg border border-slate-200 pl-10 pr-10 text-sm outline-none placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-[#00288e]";

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-[#f8f9ff] p-4 text-[#0b1c30] sm:p-6'>
      {/* =============== CARD =============== */}
      <div className='w-full max-w-[420px] rounded-2xl border border-[#eff4ff] bg-white p-8 shadow-[0_4px_24px_rgba(11,28,48,0.06)] sm:p-9'>
        {/* Logo */}
        <div className='mb-8 flex items-center justify-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff4ff] text-[#00288e]'>
            <LuBox className='h-5 w-5' />
          </div>
          <span className='text-lg font-bold'>
            JobPortal <span className='text-[#00288e]'>BD</span>
          </span>
        </div>

        {/* Key icon */}
        <div className='mb-5 flex justify-center'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-[#eff4ff] text-[#00288e] ring-8 ring-[#f0f4ff]'>
            <LuKeyRound className='h-7 w-7' />
          </div>
        </div>

        {/* Title */}
        <div className='mb-7 text-center'>
          <h1 className='mb-2 text-2xl font-bold'>Set New Password</h1>
          <p className='text-sm text-[#444653]'>
            Use 8+ characters with uppercase, lowercase, a number and a symbol.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* New Password */}
          <div>
            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#444653]'>
              New Password
            </label>
            <div className='relative'>
              <LuLock className='absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                className={inputClass}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0b1c30]'
              >
                {showPassword ? (
                  <LuEyeOff className='h-4 w-4' />
                ) : (
                  <LuEye className='h-4 w-4' />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#444653]'>
              Confirm Password
            </label>
            <div className='relative'>
              <LuShieldCheck className='absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='••••••••'
                className={inputClass}
              />
              <button
                type='button'
                onClick={() => setShowConfirm(!showConfirm)}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0b1c30]'
              >
                {showConfirm ? (
                  <LuEyeOff className='h-4 w-4' />
                ) : (
                  <LuEye className='h-4 w-4' />
                )}
              </button>
            </div>
          </div>

          {/* Button */}
          <div className='pt-2'>
            <button
              type='submit'
              disabled={isLoading}
              className='flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-[#00288e] text-sm font-semibold text-white shadow-sm hover:bg-[#1e40af] disabled:opacity-60'
            >
              {isLoading ? "Saving..." : "Reset Password"}
              <LuCheck className='h-4 w-4' />
            </button>
          </div>
        </form>

        {/* Back to login */}
        <div className='mt-7 text-center'>
          <Link
            to='/login'
            className='inline-flex items-center gap-1.5 text-sm font-medium text-[#00288e] hover:underline'
          >
            <LuArrowLeft className='h-4 w-4' />
            Back to Login
          </Link>
        </div>
      </div>

      {/* Footer note */}
      <p className='mt-6 text-center text-xs text-slate-400'>
        University Job Placement Management System • JobPortal BD
      </p>
    </div>
  );
}
