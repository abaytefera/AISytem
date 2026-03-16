import { APi } from "./CenteralAPI";

const KnowledgeBased = APi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Fetch existing documents
    getUploadDocuments: builder.query({
      query: () => '/upload/document',
      providesTags: ['Knowledge'], // Standardized Tag
    }),

    // 2. Create NEW File
    createFileUpload: builder.mutation({
      query: (formData) => ({
        url: '/upload/file',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Knowledge'],
    }),

    // 3. Create NEW Manual Text
    createManualEntry: builder.mutation({
      query: (data) => ({
        url: '/upload/text',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Knowledge'],
    }),

    // 4. Update METADATA Only (Title/Category) - Same Version
    updateMetadata: builder.mutation({
      query: ({ id, title, category }) => ({
        url: `/upload/document/${id}/metadata`, // Matches the PATCH route
        method: 'PATCH',
        body: { title, category },
      }),
      invalidatesTags: ['Knowledge'],
    }),

    // 5. Update FILE CONTENT (Version + 1)
    updateFileUpload: builder.mutation({
      query: (formData) => ({
        url: "/knowledge/update-file", 
        method: "POST",
        body: formData, // previous_id, file, title, category
      }),
      invalidatesTags: ['Knowledge'],
    }),

    // 6. Update TEXT CONTENT (Version + 1)
    updateManualEntry: builder.mutation({
      query: (data) => ({
        url: "/upload/knowledge/update-text",
        method: "POST",
        body: data, // previous_id, content, title, category
      }),
      invalidatesTags: ['Knowledge'],
    }),

    // 7. Utility Actions
    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `/upload/document/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Knowledge'],
    }),

    toggleDocumentStatus: builder.mutation({
      query: (id) => ({
        url: `/upload/document/${id}/status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Knowledge'],
    }),
  }),
});

export const { 
  useGetUploadDocumentsQuery, 
  useCreateFileUploadMutation, 
  useCreateManualEntryMutation,
  useUpdateMetadataMutation, // Added for your requirement
  useDeleteDocumentMutation,
  useToggleDocumentStatusMutation,
  useUpdateFileUploadMutation,
  useUpdateManualEntryMutation
} = KnowledgeBased;