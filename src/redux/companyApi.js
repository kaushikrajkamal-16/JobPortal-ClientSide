import { baseApi } from "./baseApi";

// RecruiterDashboard (login as company)
export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyJobs: builder.query({
      query: () => "/company/jobs",
      providesTags: ["MyJobs"],
    }),

    // PostJobModal → { title, division, type, mode, salary, deadline, description, skills }
    createJob: builder.mutation({
      query: (body) => ({ url: "/company/jobs/create", method: "POST", body }),
      invalidatesTags: ["MyJobs", "Jobs"],
    }),

    // useUpdateJobMutation() → updateJob({ id, ...changedFields })
    updateJob: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/company/jobs/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["MyJobs", "Jobs"],
    }),

    // Pause / Resume button → togglePauseJob(id)
    togglePauseJob: builder.mutation({
      query: (id) => ({ url: `/company/jobs/pause/${id}`, method: "PATCH" }),
      invalidatesTags: ["MyJobs", "Jobs"],
    }),

    deleteJob: builder.mutation({
      query: (id) => ({ url: `/company/jobs/delete/${id}`, method: "DELETE" }),
      invalidatesTags: ["MyJobs", "Jobs", "Candidates"],
    }),

    // Candidates table → useGetCandidatesQuery("all") or useGetCandidatesQuery(jobId)
    getCandidates: builder.query({
      query: (job = "all") =>
        job === "all" ? "/company/candidates" : `/company/candidates?job=${job}`,
      providesTags: ["Candidates"],
    }),

    // updateCandidateStatus({ id, status: "approved", interviewNote })
    updateCandidateStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/company/candidates/status/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Candidates", "MyJobs"], // "hired" count changes too
    }),

    deleteCandidate: builder.mutation({
      query: (id) => ({
        url: `/company/candidates/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Candidates", "MyJobs"],
    }),
  }),
});

export const {
  useGetMyJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useTogglePauseJobMutation,
  useDeleteJobMutation,
  useGetCandidatesQuery,
  useUpdateCandidateStatusMutation,
  useDeleteCandidateMutation,
} = companyApi;
