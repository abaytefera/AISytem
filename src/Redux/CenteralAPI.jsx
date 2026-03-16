import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL;

export const APi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Pulling token from the Redux State (auth slice) 
      // This is more reliable when using redux-persist
      const token = getState().auth?.token || localStorage.getItem('authToken');
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Added all tags used across your application for global synchronization
  tagTypes: [],
  endpoints: () => ({}),
});