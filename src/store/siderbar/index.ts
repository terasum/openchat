import { createSlice } from "@reduxjs/toolkit";
import { ChatFolder } from "@/types";

declare type SidrbarState = {
  sidebarOpen: boolean;
  folders: ChatFolder[];
  loading: boolean;
  searchTerm: string;
};

const initialState: SidrbarState = {
  sidebarOpen: true,
  folders: [],
  loading: false,
  searchTerm: "",
};

const sidebarState = createSlice({
  name: "sidebar",
  initialState: initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    createFolder: (state, action) => {
      state.folders.push(action.payload);
    },
    deleteFolder: (state, action) => {
      state.folders = state.folders.filter(
        (folder) => folder.id !== action.payload
      );
    },
    updateFolder: (state, action) => {
      state.folders = state.folders.map((folder) =>
        folder.id === action.payload.id ? action.payload : folder
      );
    },
  },
  extraReducers(_builder) {},
});

export const { createFolder, deleteFolder, updateFolder, toggleSidebar } =
  sidebarState.actions;
// default reducer
export default sidebarState.reducer;
