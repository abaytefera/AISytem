// src/features/UserApi.js
import { APi } from "./CenteralAPI";

export const UserApi = APi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Fetch all admins
    getAdmins: builder.query({
      query: () => '/auth/admins',
      providesTags: ['Admins'],
    }),

    // 2. Add new admin
    createAdmin: builder.mutation({
      query: (newAdmin) => ({
        url: '/auth/admins',
        method: 'POST',
        body: newAdmin,
      }),
      invalidatesTags: ['Admins'],
    }),

    // 3. Update existing admin
    updateAdmin: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/auth/admins/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Admins'],
    }),

    // 4. Remove admin
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/auth/admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admins'],
    }),
  }),
});

export const { 
  useGetAdminsQuery, 
  useCreateAdminMutation, 
  useUpdateAdminMutation, 
  useDeleteAdminMutation 
} = UserApi;