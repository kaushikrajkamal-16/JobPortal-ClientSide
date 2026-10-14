import { baseApi } from "./baseApi";

// ApplyModal + ApplicantApplication (login as applicant)
export const applicantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // applyJob({ jobId, formData })   formData has "resume"
    applyJob: builder.mutation({
      query: ({ jobId, formData }) => ({
        url: `/applicant/apply/${jobId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["MyApplications"],
    }),

    getMyApplications: builder.query({
      query: () => "/applicant/applications",
      providesTags: ["MyApplications"],
    }),

    withdrawApplication: builder.mutation({
      query: (id) => ({
        url: `/applicant/applications/withdraw/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyApplications"],
    }),
  }),
});

export const {
  useApplyJobMutation,
  useGetMyApplicationsQuery,
  useWithdrawApplicationMutation,
} = applicantApi;
