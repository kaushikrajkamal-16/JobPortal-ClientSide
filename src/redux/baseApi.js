import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// One base API — the other files add their endpoints to it
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
    credentials: "include", // send the accessToken cookie on every request
  }),
  // Tags = labels. When a mutation "invalidates" a tag, every query with that tag reloads.
  tagTypes: [
    "Me",
    "Jobs",
    "MyJobs",
    "Candidates",
    "MyApplications",
    "AdminStats",
    "AdminUsers",
    "Applicants",
    "Companies",
    "AdminJobs",
  ],
  endpoints: () => ({}),
});
