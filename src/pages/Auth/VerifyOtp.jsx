import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { LuBox, LuShieldCheck, LuCheck, LuArrowLeft } from "react-icons/lu";
import {
  useVerifyEmailMutation,
  useResendOtpMutation,
} from "../../redux/authApi";
import { getError } from "../../utils/helpers";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 boxes, 1 digit each
  const navigate = useNavigate();
  const location = useLocation();

  // Data sent from Register or Forgot Password page
  const email = location.state?.email || "your email";
  const from = location.state?.from || "register"; // "register" or "forgot"

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: resending }] = useResendOtpMutation();

  // "Resend" link → new code by email
  const handleResend = async () => {
    try {
      const res = await resendOtp({ email, from }).unwrap();
      alert(res.message);
    } catch (err) {
      alert(getError(err));
    }
  };

  // When the user types in a box
  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // only allow one number (or empty)

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Jump to the next box after typing a number
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Backspace on an empty box → go back to the previous box
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from reloading
    const code = otp.join(""); // ["1","2","3","4","5","6"] → "123456"

    if (code.length < 6) {
      alert("Please enter all 6 digits.");
      return;
    }
    try {
      const res = await verifyEmail({ email, otp: code, from }).unwrap();

      // Correct code → where to go next?
      if (from === "forgot") {
        // Reset Password needs the email AND the code again
        navigate("/resetPassword", { state: { email, otp: code } });
      } else {
        alert(res.message); // "Email verified successfully. You can now log in."
        navigate("/login");
      }
    } catch (err) {
      alert(getError(err)); // "Wrong OTP..." or "OTP has expired..."
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-[#f8f9ff] p-4 text-[#0b1c30] sm:p-6'>
      {/* =============== CARD =============== */}
      <div className='w-full max-w-[420px] rounded-2xl border border-[#eff4ff] bg-white p-6 shadow-[0_4px_24px_rgba(11,28,48,0.06)] sm:p-9'>
        {/* Logo */}
        <div className='mb-8 flex items-center justify-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff4ff] text-[#00288e]'>
            <LuBox className='h-5 w-5' />
          </div>
          <span className='text-lg font-bold'>
            JobPortal <span className='text-[#00288e]'>BD</span>
          </span>
        </div>

        {/* Shield icon */}
        <div className='mb-5 flex justify-center'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-[#eff4ff] text-[#00288e] ring-8 ring-[#f0f4ff]'>
            <LuShieldCheck className='h-7 w-7' />
          </div>
        </div>

        {/* Title */}
        <div className='mb-7 text-center'>
          <h1 className='mb-2 text-2xl font-bold'>Verify Your Email</h1>
          <p className='text-sm text-[#444653]'>
            We sent a 6-digit code to{" "}
            <span className='font-medium text-[#0b1c30]'>{email}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='mb-3 block text-center text-xs font-semibold uppercase tracking-wider text-[#444653]'>
              Verification Code
            </label>

            {/* 6 digit boxes (grid = they shrink on small phones) */}
            <div className='grid grid-cols-6 gap-2'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  placeholder='•'
                  className='h-12 w-full rounded-lg border border-slate-200 text-center text-lg font-semibold outline-none placeholder:text-slate-300 focus:border-transparent focus:ring-2 focus:ring-[#00288e]'
                />
              ))}
            </div>
          </div>

          {/* Verify button */}
          <button
            type='submit'
            disabled={isLoading}
            className='flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-[#00288e] text-sm font-semibold text-white shadow-sm hover:bg-[#1e40af] disabled:opacity-60'
          >
            {isLoading ? "Checking..." : "Verify"}
            <LuCheck className='h-4 w-4' />
          </button>

          {/* Resend */}
          <p className='text-center text-sm text-[#444653]'>
            Didn't get the code?
            <button
              type='button'
              onClick={handleResend}
              disabled={resending}
              className='ml-1 font-semibold text-[#00288e] hover:underline disabled:opacity-60'
            >
              {resending ? "Sending..." : "Resend"}
            </button>
          </p>
        </form>

        {/* Back (goes to the previous page) */}
        <div className='mt-7 text-center'>
          <button
            onClick={() => navigate(-1)}
            className='inline-flex items-center gap-1.5 text-sm font-medium text-[#00288e] hover:underline'
          >
            <LuArrowLeft className='h-4 w-4' />
            Back
          </button>
        </div>
      </div>

      {/* Footer note */}
      <p className='mt-6 text-center text-xs text-slate-400'>
        University Job Placement Management System • JobPortal BD
      </p>
    </div>
  );
}
