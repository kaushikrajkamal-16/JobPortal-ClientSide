import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  LuBox,
  LuLock,
  LuMail,
  LuArrowRight,
  LuArrowLeft,
} from "react-icons/lu";
import { useForgotPasswordMutation } from "../../redux/authApi";
import { getError } from "../../utils/helpers";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [forgotPassword, { isLoading: loading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from reloading
    try {
      const res = await forgotPassword({ email: email.trim() }).unwrap();
      alert(res.message); // "We sent a 6-digit code to your email."
      // Same OTP page as Registration, but from = "forgot"
      navigate("/verifyOtp", { state: { email: email.trim(), from: "forgot" } });
    } catch (err) {
      alert(getError(err)); // e.g. "No account found with this email."
    }
  };

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

        {/* Lock icon */}
        <div className='mb-5 flex justify-center'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-[#eff4ff] text-[#00288e] ring-8 ring-[#f0f4ff]'>
            <LuLock className='h-7 w-7' />
          </div>
        </div>

        {/* Title */}
        <div className='mb-7 text-center'>
          <h1 className='mb-2 text-2xl font-bold'>Forgot Password?</h1>
          <p className='text-sm text-[#444653]'>
            Enter your registered email and we'll send you a 6-digit code.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#444653]'>
              Registered Email
            </label>
            <div className='relative'>
              <LuMail className='absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='rahim@gmail.com'
                className='h-[42px] w-full rounded-lg border border-slate-200 pl-10 pr-3.5 text-sm outline-none placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-[#00288e]'
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-[#00288e] text-sm font-semibold text-white shadow-sm hover:bg-[#1e40af] disabled:opacity-60'
          >
            {loading ? "Sending..." : "Send Code"}
            {!loading && <LuArrowRight className='h-4 w-4' />}
          </button>
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
