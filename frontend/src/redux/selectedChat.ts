import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedChatState {
  isSelected: boolean;
  groupName?: string;
  broadCastName?: string;
  _id: string;
  participants: {
    username: string;
    _id: string;
  }[];
  type: string;
  createdAt: string;
}

// Initial state for the user
const initialState: SelectedChatState = {
  isSelected: false,
  groupName: "",
  broadCastName: "",
  _id: "",
  participants: [],
  createdAt: "",
  type: "",
};

// Create a Redux slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedChat: (state, action: PayloadAction<SelectedChatState>) => {
      return (state = { ...action.payload });
    },

    clearSelectedChat: () => initialState,
  },
});

// Export the actions and reducer
export const { setSelectedChat, clearSelectedChat } = userSlice.actions;
export default userSlice.reducer;
