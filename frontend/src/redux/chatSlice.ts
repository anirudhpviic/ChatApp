// src/features/chat/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of a participant
interface Participant {
  _id: string;
  username: string;
}

// Define the shape of a chat
interface Chat {
  groupName?: string; // Optional for one-to-one chats
  type: "group" | "one-to-one";
  participants: Participant[];
  createdAt: string;
  _id: string;
}

// Initial state: an array of chats
const initialState: Chat[] = [];

// Create a Redux slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Add a new chat to the state
    addChat: (state, action: PayloadAction<Chat>) => {
      state.push(action.payload);
    },

    // Replace the entire state with new chats
    setChats: (state, action: PayloadAction<Chat[]>) => {
      return action.payload; // Directly replace state
    },

    // Clear all chats (reset to initial state)
    clearChats: () => initialState,
  },
});

// Export the actions and reducer
export const { addChat, clearChats, setChats } = chatSlice.actions;
export default chatSlice.reducer;
