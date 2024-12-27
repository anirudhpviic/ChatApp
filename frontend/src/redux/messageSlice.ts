import { createSlice } from "@reduxjs/toolkit";

interface Message {
  createdAt: string;
  _id: string;
  sender: string;
  message: { type: string; content: string; format?: string };
  groupId: string;
  status: string;
  readBy: string[];
}

// Initial state: an array of chats
const initialState: Message[] = []; // Directly store an array of chats

// Create a Redux slice
const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // Add a new chat to the array
    addMessage: (state, action) => {
      state.push(action.payload);
    },

    // Replace the entire state with new chats
    setMessages: (state, action) => {
      return (state = [...action.payload]);
    },

    updateMessageSlice: (state, action) => {
      const messageIndex = state.findIndex((m) => m._id === action.payload._id);
      if (messageIndex !== -1) {
        // Replace the message at the found index
        state[messageIndex] = action.payload;
      }
    },

    updateGroupMessageSeen: (state, action) => {
      const messageIndex = state.findIndex(
        (m) => m._id === action.payload.messageId
      );

      if (messageIndex !== -1) {
        // Check if the senderId already exists in the readBy array
        const message = state[messageIndex];
        if (!message.readBy.includes(action.payload.readerId)) {
          // Push the senderId to the readBy array
          state[messageIndex] = {
            ...message,
            readBy: [...message.readBy, action.payload.readerId],
          };
        }
      }
    },

    clearMessages: () => initialState,
  },
});

// Export the actions and reducer
export const {
  addMessage,
  clearMessages,
  setMessages,
  updateMessageSlice,
  updateGroupMessageSeen,
} = messageSlice.actions;
export default messageSlice.reducer;
