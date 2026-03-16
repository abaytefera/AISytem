import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  DarkMode: false,
  isSidebarOpen: true,
};

const WebState = createSlice({
  name: 'webState',
  initialState,
  reducers: {

    ToggleDarkMode: (state) => {
      state.DarkMode = !state.DarkMode;
    },
    SetSidebarStatus: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    ToggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    }
  }
});

export const { 
  
  ToggleDarkMode, 
  SetSidebarStatus, 
  ToggleSidebar 
} = WebState.actions;

export default WebState.reducer;