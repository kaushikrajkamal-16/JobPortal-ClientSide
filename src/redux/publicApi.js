import { baseApi } from "./baseApi";

// No login needed
export const publicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Jobs.jsx → useGetJobsQuery({ page: 1, limit: 6, company: "" })
    getJobs: builder.query({
      query: ({ page = 1, limit = 6, company = "" } = {}) =>
        `/jobs?page=${page}&limit=${limit}${company ? `&company=${company}` : ""}`,
      providesTags: ["Jobs"],
    }),

    // Home "Latest Jobs" → useGetLatestJobsQuery(6)
    getLatestJobs: builder.query({
      query: (limit = 6) => `/jobs/latest?limit=${limit}`,
      providesTags: ["Jobs"],
    }),

    // JobsDetails.jsx → useGetJobBySlugQuery(slug)
    getJobBySlug: builder.query({
      query: (slug) => `/jobs/${slug}`,
      providesTags: ["Jobs"],
    }),

    // Companies.jsx
    getCompanies: builder.query({
      query: () => "/companies",
      providesTags: ["Jobs"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetLatestJobsQuery,
  useGetJobBySlugQuery,
  useGetCompaniesQuery,
} = publicApi;
