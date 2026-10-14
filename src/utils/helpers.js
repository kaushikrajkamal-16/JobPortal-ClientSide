// Small helpers used by many pages

// RTK Query error → the message from our backend
// err.data.message = "Password is incorrect" (from the server)
export const getError = (err) =>
  err?.data?.message ||
  (err?.status === "FETCH_ERROR"
    ? "Cannot reach the server. Is the backend running?"
    : "Something went wrong. Please try again.");

// "2026-10-12T08:00:00.000Z" → "Oct 12, 2026"
export const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

// "2026-10-12T08:00:00.000Z" → "2 days ago"
export const timeAgo = (date) => {
  if (!date) return "";
  const days = Math.floor((Date.now() - new Date(date)) / (24 * 60 * 60 * 1000));
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return formatDate(date);
};

// Backend role → dashboard URL ("company" uses the recruiter dashboard)
export const dashboardPath = (role) =>
  role === "admin"
    ? "/dashboard/admin"
    : role === "company"
      ? "/dashboard/recruiter"
      : "/dashboard/applicant";

// Application status → badge text (same as the backend's statusLabel)
export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "exam", label: "Exam Scheduled" },
  { value: "interview", label: "Interview Scheduled" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

// Was this date in the last N days? (e.g. "applied this week")
export const isWithinDays = (date, days) =>
  Date.now() - new Date(date) < days * 24 * 60 * 60 * 1000;
