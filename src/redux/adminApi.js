import { baseApi } from "./baseApi";

// Admin pages (login as admin)
// Turns { page: 1, search: "" } into "page=1" (empty values are skipped)
const toQuery = (params = {}) =>
  new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined),
  ).toString();

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---- AdminDashboard ----
    getStats: builder.query({
      query: () => "/admin/stats",
      providesTags: ["AdminStats"],
    }),
    getUsers: builder.query({
      query: (params) => `/admin/users?${toQuery(params)}`, // { page, limit, role }
      providesTags: ["AdminUsers"],
    }),

    // ---- ManageApplicants ----
    getApplicants: builder.query({
      query: (params) => `/admin/applicants?${toQuery(params)}`, // { search, page, limit }
      providesTags: ["Applicants"],
    }),
    addApplicant: builder.mutation({
      query: (body) => ({ url: "/admin/applicants/add", method: "POST", body }),
      invalidatesTags: ["Applicants", "AdminStats", "AdminUsers"],
    }),
    toggleFlagApplicant: builder.mutation({
      query: (id) => ({ url: `/admin/applicants/flag/${id}`, method: "PATCH" }),
      invalidatesTags: ["Applicants"],
    }),
    deleteApplicant: builder.mutation({
      query: (id) => ({ url: `/admin/applicants/delete/${id}`, method: "DELETE" }),
      invalidatesTags: ["Applicants", "AdminStats", "AdminUsers"],
    }),

    // ---- ManageCompanies ----
    getAdminCompanies: builder.query({
      query: (params) => `/admin/companies?${toQuery(params)}`, // { search, industry, page, limit }
      providesTags: ["Companies"],
    }),
    addCompany: builder.mutation({
      query: (body) => ({ url: "/admin/companies/add", method: "POST", body }),
      invalidatesTags: ["Companies", "AdminStats", "AdminUsers"],
    }),
    deleteCompany: builder.mutation({
      query: (id) => ({ url: `/admin/companies/delete/${id}`, method: "DELETE" }),
      invalidatesTags: ["Companies", "AdminStats", "AdminUsers", "AdminJobs", "Jobs"],
    }),

    // ---- ManageJobPosts ----
    getAdminJobs: builder.query({
      query: (params) => `/admin/jobs?${toQuery(params)}`, // { status, page, limit }
      providesTags: ["AdminJobs"],
    }),
    closeJob: builder.mutation({
      query: (id) => ({ url: `/admin/jobs/close/${id}`, method: "PATCH" }),
      invalidatesTags: ["AdminJobs", "AdminStats", "Jobs"],
    }),
    adminDeleteJob: builder.mutation({
      query: (id) => ({ url: `/admin/jobs/delete/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminJobs", "AdminStats", "Jobs"],
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGetUsersQuery,
  useGetApplicantsQuery,
  useAddApplicantMutation,
  useToggleFlagApplicantMutation,
  useDeleteApplicantMutation,
  useGetAdminCompaniesQuery,
  useAddCompanyMutation,
  useDeleteCompanyMutation,
  useGetAdminJobsQuery,
  useCloseJobMutation,
  useAdminDeleteJobMutation,
} = adminApi;
