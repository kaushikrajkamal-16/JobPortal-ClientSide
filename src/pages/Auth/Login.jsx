import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLoginMutation, useResendOtpMutation } from "../../redux/authApi";
import { getError, dashboardPath } from "../../utils/helpers";
import {
  LuShieldCheck,
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuArrowUpRight,
  LuCircleAlert,
} from "react-icons/lu";

// Shared input styles (grey outline, blue 2px ring on focus)
const inputClass =
  "h-11 w-full rounded-lg bg-white pl-11 text-base text-[#0b1c30] shadow-sm outline-none ring-1 ring-inset ring-[#c4c5d5] transition-all placeholder:text-[#757684] focus:ring-2 focus:ring-[#1e40af] sm:text-sm";

const errorInputClass = "ring-[#ba1a1a]/60 bg-[#fff8f7]";

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className='flex items-center gap-1 pl-1 text-xs font-medium text-[#ba1a1a]'
    >
      <LuCircleAlert className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
      {message}
    </p>
  );
}

/**
 * Login form page (without navbar & footer).
 *
 * Props:
 *  - forgotHref?: link for "Forgot password?"
 *  - registerHref?: link for "Create an account"
 */
export default function Login({
  forgotHref = "/forgetPassword",
  registerHref = "/register",
}) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [resendOtp] = useResendOtpMutation();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
    if (errors[id]) setErrors((err) => ({ ...err, [id]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      found.email = "Please enter a valid email address.";
    if (!form.password) found.password = "Please enter your password.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload = { email: form.email.trim(), password: form.password };

    try {
      const res = await login(payload).unwrap();
      // admin → /dashboard/admin, company → /dashboard/recruiter, applicant → /dashboard/applicant
      navigate(dashboardPath(res.user.role));
    } catch (err) {
      const message = getError(err);

      // Email not verified yet → send a new code and go to the OTP page
      if (message.toLowerCase().includes("not verified")) {
        alert("Your email is not verified. We are sending you a new code.");
        try {
          await resendOtp({ email: payload.email, from: "register" }).unwrap();
        } catch {
          // ignore — they can press "Resend" on the next page
        }
        navigate("/verifyOtp", {
          state: { email: payload.email, from: "register" },
        });
        return;
      }

      alert(message); // e.g. "Password is incorrect"
    }
  };

  const errorProps = (field) =>
    errors[field]
      ? { "aria-invalid": true, "aria-describedby": `${field}-error` }
      : {};

  return (
    <section className='relative w-full overflow-hidden bg-gradient-to-b from-[#eff4ff]/60 via-[#f8f9ff] to-[#eff4ff]/30 px-4 py-8 sm:px-6 sm:py-12 lg:py-16'>
      {/* Ambient background accents */}
      <div className='pointer-events-none absolute -top-40 left-1/2 h-[340px] w-[min(720px,100%)] -translate-x-1/2 rounded-full bg-[#00288e]/5 blur-3xl' />
      <div className='pointer-events-none absolute -left-48 top-1/3 h-72 w-72 rounded-full bg-[#dde1ff]/30 blur-3xl sm:h-96 sm:w-96' />
      <div className='pointer-events-none absolute -right-48 bottom-10 h-72 w-72 rounded-full bg-[#ffdbca]/40 blur-3xl sm:h-96 sm:w-96' />

      <div className='relative mx-auto flex max-w-xl flex-col items-center'>
        {/* Trust badge */}
        <div className='mb-6 inline-flex flex-wrap items-center justify-center gap-1 rounded-full bg-[#e5eeff] px-4 py-1 text-xs font-semibold tracking-wide text-[#00288e] shadow-sm'>
          <LuShieldCheck className='h-4 w-4' aria-hidden='true' />
          <span>Campus Talent Network</span>
          <span
            className='mx-1 h-1 w-1 rounded-full bg-[#00288e]'
            aria-hidden='true'
          />
          <span className='text-[11px] font-medium text-[#444653]'>
            Placement 2026
          </span>
        </div>

        {/* Card */}
        <div className='w-full rounded-xl bg-white p-5 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06),0_4px_10px_-4px_rgba(15,23,42,0.03)] sm:p-8'>
          {/* Header */}
          <div className='mb-6 text-center'>
            <h1 className='text-[26px] font-bold leading-[34px] tracking-tight text-[#0b1c30] sm:text-[32px] sm:leading-10'>
              Log in to your account
            </h1>
            <p className='mx-auto mt-1.5 max-w-md text-sm leading-[22px] text-[#444653]'>
              Access your JobPortal applicant profile and campus placement
              drives.
            </p>
          </div>

          {/* Divider */}
          <div className='mb-6 h-px w-full bg-[#e5eeff]' />

          {/* Form */}
          <form
            noValidate
            onSubmit={handleSubmit}
            className='flex flex-col gap-4'
          >
            {/* Email */}
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='email'
                className='text-sm font-medium text-[#0b1c30]'
              >
                Email Address
              </label>
              <div className='relative flex items-center'>
                <LuMail
                  className='pointer-events-none absolute left-3.5 h-5 w-5 text-[#757684]'
                  aria-hidden='true'
                />
                <input
                  id='email'
                  type='email'
                  autoComplete='email'
                  placeholder='applicant@university.ac.bd'
                  value={form.email}
                  onChange={handleChange}
                  className={`${inputClass} pr-4 ${errors.email ? errorInputClass : ""}`}
                  {...errorProps("email")}
                />
              </div>
              <FieldError id='email-error' message={errors.email} />
            </div>

            {/* Password */}
            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center justify-between gap-2'>
                <label
                  htmlFor='password'
                  className='text-sm font-medium text-[#0b1c30]'
                >
                  Password
                </label>
                <Link
                  to={forgotHref}
                  className='text-xs font-semibold text-[#1e40af] transition-colors hover:text-[#00288e]'
                >
                  Forgot password?
                </Link>
              </div>
              <div className='relative flex items-center'>
                <LuLock
                  className='pointer-events-none absolute left-3.5 h-5 w-5 text-[#757684]'
                  aria-hidden='true'
                />
                <input
                  id='password'
                  type={showPassword ? "text" : "password"}
                  autoComplete='current-password'
                  placeholder='••••••••••••'
                  value={form.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-11 ${errors.password ? errorInputClass : ""}`}
                  {...errorProps("password")}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className='absolute right-2.5 flex items-center justify-center rounded p-1.5 text-[#757684] transition-colors hover:text-[#0b1c30]'
                >
                  {showPassword ? (
                    <LuEyeOff className='h-5 w-5' aria-hidden='true' />
                  ) : (
                    <LuEye className='h-5 w-5' aria-hidden='true' />
                  )}
                </button>
              </div>
              <FieldError id='password-error' message={errors.password} />
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={isLoading}
              className='mt-2 h-11 w-full rounded-lg bg-[#1e40af] text-sm font-medium text-white transition-colors hover:bg-[#00288e] disabled:opacity-60'
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>

        {/* Register link */}
        <div className='mt-6 flex flex-col items-center justify-center gap-1 text-center text-sm text-[#444653] sm:flex-row'>
          <span>Don't have an account yet?</span>
          <Link
            to={registerHref}
            className='inline-flex items-center gap-0.5 text-base font-semibold text-[#00288e] transition-colors hover:text-[#1e40af]'
          >
            <span>Create an account</span>
            <LuArrowUpRight className='h-4 w-4' aria-hidden='true' />
          </Link>
        </div>
      </div>
    </section>
  );
}
