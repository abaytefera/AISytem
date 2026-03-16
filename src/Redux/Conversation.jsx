import { APi } from "./CenteralAPI";

export const Conversion = APi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // ✅ Get sessions with Tag
    getSessions: builder.query({
      query: () => "/chat/sessions",
      providesTags: ["Sessions"],
    }),

    // ✅ Chat history with ID-specific Tag
    getChatHistory: builder.query({
      query: (sessionId) => `/chat/history/admin/${sessionId}`,
      providesTags: (result, error, sessionId) => [
        { type: "Messages", id: sessionId },
      ],
    }),

    // ✅ Send message: Invalidates both history and sidebar list
    sendAdminMessage: builder.mutation({
      query: ({ sessionId, text }) => ({
        url: `/chat/send-admin`,
        method: 'POST',
        body: { session_id: sessionId, text },
      }),
      invalidatesTags: (result, error, { sessionId }) => [
        { type: 'Messages', id: sessionId },
        "Sessions", 
      ],
    }),

    // ✅ Edit message: Now invalidates "Sessions" to update sidebar preview
    editMessage: builder.mutation({
      query: ({ messageId, newText }) => ({
        url: `/chat/message/${messageId}`,
        method: 'PATCH',
        body: { text: newText },
      }),
      invalidatesTags: (result, error, { sessionId }) => [
        { type: 'Messages', id: sessionId },
        "Sessions",
      ],
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useGetChatHistoryQuery,
  useEditMessageMutation,
  useSendAdminMessageMutation
} = Conversion;