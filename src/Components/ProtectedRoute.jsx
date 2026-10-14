import { Navigate } from "react-router";
import { useGetMeQuery } from "../redux/authApi";
import { dashboardPath } from "../utils/helpers";

// Only lets the right role open a page
// <ProtectedRoute role="admin"> <DashboardLayout role="admin" /> </ProtectedRoute>
// role = "applicant", "company" or "admin" (the backend role)
export default function ProtectedRoute({ role, children }) {
  // Ask the server again every time a dashboard opens (cookie may have expired)
  const { data, isLoading, isFetching, isError } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading || (isFetching && isError)) {
    return (
      <div className='flex min-h-screen items-center justify-center text-sm text-[#444653]'>
        Loading...
      </div>
    );
  }

  // Not logged in (no cookie / expired) → Login page
  if (isError || !data?.user) return <Navigate to='/login' replace />;

  // Logged in but wrong role → their own dashboard
  if (role && data.user.role !== role) {
    return <Navigate to={dashboardPath(data.user.role)} replace />;
  }

  return children;
}
