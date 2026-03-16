import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  user: null,
  isloading: false,
  isAuthenticate: false,
  error: null,
  token: null
};

export const LoginUser = createAsyncThunk(
  'auth/login', // Better action name for debugging
  async (credentials, thunksAPI) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', // Capitalized standard
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      // Check if the response status is not 2xx
      if (!response.ok) {
        return thunksAPI.rejectWithValue(data.message || "Login failed");
      }

      return data; // Usually contains { token, user: { id, role, etc. } }

    } catch (error) {
      return thunksAPI.rejectWithValue("Network error. Please try again.");
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticate = false;
      state.error = null;
      state.token = null;
      // Also clear localStorage if you use it for manual backups
      localStorage.removeItem('authToken');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(LoginUser.pending, (state) => {
      state.isloading = true;
      state.error = null;
    });
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      // Mapping action.payload to your state
      state.token = action.payload.access_token;
      state.user = action.payload.user; // Storing the full user object
      state.isAuthenticate = true;
      state.isloading = false;
      state.error = null;

      // Backup storage for CentralAPI.jsx if state is briefly unavailable
      localStorage.setItem('authToken', action.payload.access_token);
    });
    builder.addCase(LoginUser.rejected, (state, action) => {
      state.error = action.payload;
      state.isloading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticate = false;
    });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;