// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { group } from "console";

// Define the shape of the user state

interface SelectedChatState {
  isSelected: boolean;
  groupName: string;
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
      console.log("action.payload", action.payload);
      // const { groupName, participants, createdAt, _id } = action.payload;
      // state.isSelected = true;
      // state.groupName = groupName;
      // state.participants = participants;
      // state.createdAt = createdAt;
      // state._id = _id;

      return (state = { ...action.payload });
    },

    clearSelectedChat: () => initialState, // Resets to initial state
  },
});

// Export the actions and reducer
export const { setSelectedChat, clearSelectedChat } = userSlice.actions;
export default userSlice.reducer;
