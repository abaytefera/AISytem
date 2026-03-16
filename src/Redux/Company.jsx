import { APi } from "./CenteralAPI";

export const CompanyApi = APi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET ALL COMPANIES
    getCompanies: builder.query({
      query: () => '/auth/companies',
      providesTags: ['Company'],
    }),

    // 2. REGISTER NEW COMPANY
    registerCompany: builder.mutation({
      query: (newCompany) => ({
        url: '/auth/companies',
        method: 'POST',
        body: newCompany,
      }),
      invalidatesTags: ['Company'],
    }),

    // 3. UPDATE COMPANY (EDIT)
    updateCompany: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/auth/companies/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Company'],
    }),

    // 4. DELETE COMPANY
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `/auth/companies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Company'],
    }),

    // 5. TOGGLE STATUS (ACTIVE/DEACTIVE)
    toggleCompanyStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/auth/companies/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Company'],
    }),
  }),
});

export const { 
  useGetCompaniesQuery, 
  useRegisterCompanyMutation, 
  useUpdateCompanyMutation, 
  useDeleteCompanyMutation,
  useToggleCompanyStatusMutation 
} = CompanyApi;