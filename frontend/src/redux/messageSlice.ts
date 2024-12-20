// src/features/chat/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of a participant

// Define the shape of a chat
interface Message {
  createdAt: string;
  _id: string;
  sender: string;
  content: string;
  groupId: string;
  status: string;
}

// Initial state: an array of chats
const initialState: Message[] = []; // Directly store an array of chats

// Create a Redux slice
const messageSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Add a new chat to the array
    addMessage: (state, action: PayloadAction<Message>) => {
      console.log("action.payload", action.payload);
      state.push(action.payload);
    },

    // Update an existing chat by groupName
    // updateChat: (state, action: PayloadAction<Chat>) => {
    //   const { groupName, participants, createdAt } = action.payload;
    //   const chatIndex = state.chats.findIndex(chat => chat.groupName === groupName);

    //   if (chatIndex !== -1) {
    //     state.chats[chatIndex] = { groupName, participants, createdAt };
    //   }
    // },

    // Clear all chats
    clearMessages: () => initialState,
  },
});

// Export the actions and reducer
export const { addMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
