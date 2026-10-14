import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "../../redux/authApi";
import { getError } from "../../utils/helpers";
import {
  LuShieldCheck,
  LuGraduationCap,
  LuBuilding2,
  LuUser,
  LuMail,
  LuLock,
  LuLockKeyhole,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuCircleAlert,
} from "react-icons/lu";

const ROLES = {
  applicant: {
    label: "Applicant",
    Icon: LuGraduationCap,
    emailPlaceholder: "applicant@gmail.com",
  },
  employer: {
    label: "Employer",
    Icon: LuBuilding2,
    emailHint: "Enter with Comapny Email",
    emailPlaceholder: "recruiter@gmail.com",
  },
};

const INITIAL_FORM = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

// Shared input styles
const inputClass =
  "h-11 w-full rounded-lg border border-transparent bg-[#eff4ff] pl-10 text-base text-[#0b1c30] placeholder:text-[#757684] transition-colors focus:border-[#1e40af]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e40af]/15 sm:text-sm";

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Please enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = "Please enter a valid email address.";
  // Same rule as the backend: 8+ chars, upper, lower, number and a symbol
  if (
    form.password.length < 8 ||
    !/[a-z]/.test(form.password) ||
    !/[A-Z]/.test(form.password) ||
    !/\d/.test(form.password) ||
    !/[^A-Za-z0-9]/.test(form.password)
  ) {
    errors.password =
      "Use 8+ characters with uppercase, lowercase, a number and a symbol (e.g. Rahim@123).";
  }
  if (form.confirmPassword !== form.password)
    errors.confirmPassword = "Passwords do not match.";
  if (!form.terms) errors.terms = "You must accept the terms to continue.";
  return errors;
}

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
 * Registration form page (without navbar & footer).
 *
 * Props:
 *  - onSubmit?: ({ role, fullName, email, password }) => void
 *  - loginHref?: link for "Log in"
 */
export default function Register({ loginHref = "/login" }) {
  const [role, setRole] = useState("applicant");
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const current = ROLES[role];
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [id]: type === "checkbox" ? checked : value }));
    // Clear a field's error as soon as the user edits it
    if (errors[id]) setErrors((err) => ({ ...err, [id]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload = {
      role, // "applicant" or "employer" (backend saves "employer" as "company")
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
    };

    try {
      const res = await register(payload).unwrap();
      alert(res.message); // "Registration successful. Please verify your email."
      // Go to the OTP page (shared with Forgot Password)
      navigate("/verifyOtp", {
        state: { email: payload.email, from: "register" },
      });
    } catch (err) {
      alert(getError(err)); // e.g. "An account with this email already exists."
    }
  };

  const errorProps = (field) =>
    errors[field]
      ? { "aria-invalid": true, "aria-describedby": `${field}-error` }
      : {};

  return (
    <section className='relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden bg-[#f8f9ff] px-4 py-10 sm:min-h-[calc(100vh-5rem)] sm:px-6 sm:py-12'>
      {/* Background glows */}
      <div className='pointer-events-none absolute -left-20 -top-32 h-72 w-72 rounded-full bg-[#b8c4ff]/20 blur-3xl sm:h-96 sm:w-96' />
      <div className='pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-[#ffdbca]/30 blur-3xl sm:h-96 sm:w-96' />

      <div className='relative flex w-full max-w-[520px] flex-col items-center'>
        {/* Card */}
        <div className='flex w-full flex-col gap-6 rounded-xl bg-white px-5 py-7 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06),0_2px_8px_-2px_rgba(15,23,42,0.04)] sm:px-8 sm:py-8'>
          {/* Header */}
          <div className='flex flex-col gap-1 text-center'>
            <h1 className='text-[26px] font-bold leading-[34px] tracking-tight text-[#0b1c30] sm:text-[32px] sm:leading-10'>
              Create your account
            </h1>
          </div>

          {/* Role switcher */}
          <div
            role='tablist'
            aria-label='Account type'
            className='flex w-full items-center gap-1 rounded-lg bg-[#eff4ff] p-1'
          >
            {Object.entries(ROLES).map(([key, { label, Icon }]) => {
              const active = role === key;
              return (
                <button
                  key={key}
                  type='button'
                  role='tab'
                  aria-selected={active}
                  onClick={() => setRole(key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
                    active
                      ? "bg-white text-[#00288e] shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                      : "text-[#444653] hover:text-[#0b1c30]"
                  }`}
                >
                  <Icon className='h-[18px] w-[18px]' aria-hidden='true' />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className='h-px w-full bg-[#dce9ff]' />

          {/* Form */}
          <form
            noValidate
            onSubmit={handleSubmit}
            className='flex flex-col gap-4'
          >
            {/* Full name */}
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='fullName'
                className='text-sm font-medium text-[#0b1c30]'
              >
                Full Name
              </label>
              <div className='relative'>
                <LuUser
                  className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#444653]'
                  aria-hidden='true'
                />
                <input
                  id='fullName'
                  type='text'
                  autoComplete='name'
                  placeholder='e.g. Tanvir Ahmed'
                  value={form.fullName}
                  onChange={handleChange}
                  className={`${inputClass} pr-4 ${errors.fullName ? "border-[#ba1a1a]/50 bg-[#fff8f7]" : ""}`}
                  {...errorProps("fullName")}
                />
              </div>
              <FieldError id='fullName-error' message={errors.fullName} />
            </div>

            {/* Email */}
            <div className='flex flex-col gap-1'>
              <div className='flex flex-wrap items-baseline justify-between gap-x-2'>
                <label
                  htmlFor='email'
                  className='text-sm font-medium text-[#0b1c30]'
                >
                  Email Address
                </label>
                <span className='text-[11px] font-medium text-[#444653]'>
                  {current.emailHint}
                </span>
              </div>
              <div className='relative'>
                <LuMail
                  className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#444653]'
                  aria-hidden='true'
                />
                <input
                  id='email'
                  type='email'
                  autoComplete='email'
                  placeholder={current.emailPlaceholder}
                  value={form.email}
                  onChange={handleChange}
                  className={`${inputClass} pr-4 ${errors.email ? "border-[#ba1a1a]/50 bg-[#fff8f7]" : ""}`}
                  {...errorProps("email")}
                />
              </div>
              <FieldError id='email-error' message={errors.email} />
            </div>

            {/* Password */}
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='password'
                className='text-sm font-medium text-[#0b1c30]'
              >
                Password
              </label>
              <div className='relative'>
                <LuLock
                  className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#444653]'
                  aria-hidden='true'
                />
                <input
                  id='password'
                  type={showPassword ? "text" : "password"}
                  autoComplete='new-password'
                  placeholder='••••••••••••'
                  value={form.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-10 ${errors.password ? "border-[#ba1a1a]/50 bg-[#fff8f7]" : ""}`}
                  {...errorProps("password")}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className='absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded p-1.5 text-[#444653] transition-colors hover:text-[#0b1c30]'
                >
                  {showPassword ? (
                    <LuEyeOff
                      className='h-[18px] w-[18px]'
                      aria-hidden='true'
                    />
                  ) : (
                    <LuEye className='h-[18px] w-[18px]' aria-hidden='true' />
                  )}
                </button>
              </div>
              {errors.password ? (
                <FieldError id='password-error' message={errors.password} />
              ) : (
                <span className='pl-1 text-[11px] font-medium text-[#757684]'>
                  Must be at least 8 characters with letters &amp; numbers
                </span>
              )}
            </div>

            {/* Confirm password */}
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='confirmPassword'
                className='text-sm font-medium text-[#0b1c30]'
              >
                Confirm Password
              </label>
              <div className='relative'>
                <LuLockKeyhole
                  className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#444653]'
                  aria-hidden='true'
                />
                <input
                  id='confirmPassword'
                  type={showConfirm ? "text" : "password"}
                  autoComplete='new-password'
                  placeholder='••••••••••••'
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`${inputClass} pr-10 ${errors.confirmPassword ? "border-[#ba1a1a]/50 bg-[#fff8f7]" : ""}`}
                  {...errorProps("confirmPassword")}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className='absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded p-1.5 text-[#444653] transition-colors hover:text-[#0b1c30]'
                >
                  {showConfirm ? (
                    <LuEyeOff
                      className='h-[18px] w-[18px]'
                      aria-hidden='true'
                    />
                  ) : (
                    <LuEye className='h-[18px] w-[18px]' aria-hidden='true' />
                  )}
                </button>
              </div>
              <FieldError
                id='confirmPassword-error'
                message={errors.confirmPassword}
              />
            </div>

            {/* Terms */}
            <div className='flex flex-col gap-1 pt-1'>
              <div className='flex items-start gap-2'>
                <input
                  id='terms'
                  type='checkbox'
                  checked={form.terms}
                  onChange={handleChange}
                  className='mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-[#1e40af]'
                  {...errorProps("terms")}
                />
                <label
                  htmlFor='terms'
                  className='cursor-pointer select-none text-xs leading-[18px] text-[#444653]'
                >
                  I agree to the{" "}
                  <a
                    href='#'
                    className='font-semibold text-[#1e40af] hover:underline'
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href='#'
                    className='font-semibold text-[#1e40af] hover:underline'
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
              <FieldError id='terms-error' message={errors.terms} />
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={isLoading}
              className='group mt-1 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-[#1e40af] text-sm font-medium text-white shadow-sm transition-all hover:bg-[#00288e] active:scale-[0.99] disabled:opacity-60'
            >
              <span>{isLoading ? "Creating account..." : "Create Account"}</span>
              <LuArrowRight
                className='h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5'
                aria-hidden='true'
              />
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className='mt-6 text-center text-sm text-[#444653]'>
          Already have an account?
          <Link
            to={loginHref}
            className='ml-1 font-semibold text-[#00288e] hover:underline'
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
