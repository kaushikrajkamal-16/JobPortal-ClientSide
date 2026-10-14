import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Registration.jsx → { fullName, email, password, role }
    register: builder.mutation({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),

    // VerifyOtp.jsx → { email, otp, from: "register" | "forgot" }
    verifyEmail: builder.mutation({
      query: (body) => ({ url: "/auth/verifyEmail", method: "POST", body }),
    }),

    // VerifyOtp.jsx "Resend" → { email, from }
    resendOtp: builder.mutation({
      query: (body) => ({ url: "/auth/resendOtp", method: "POST", body }),
    }),

    // Login.jsx → { email, password }
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["Me"], // reload "getMe" with the new user
    }),

    // Navbar / Sidebar logout button
    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      // Clear ALL saved data from the old user
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(baseApi.util.resetApiState());
      },
    }),

    // ForgotPassword.jsx → { email }
    forgotPassword: builder.mutation({
      query: (body) => ({ url: "/auth/forgotPassword", method: "POST", body }),
    }),

    // ResetPassword.jsx → { email, otp, password, confirmPassword }
    resetPassword: builder.mutation({
      query: (body) => ({ url: "/auth/resetpassword", method: "POST", body }),
    }),

    // Dashboards: the logged-in user
    getMe: builder.query({
      query: () => "/auth/getme",
      providesTags: ["Me"],
    }),

    // EditProfileModal → FormData (text fields + "photo" file)
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/auth/updateprofile",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} = authApi;
