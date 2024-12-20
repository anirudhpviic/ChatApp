// src/features/chat/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of a participant
interface Participant {
  _id: string;
  username: string;
}

// Define the shape of a chat
interface Chat {
  groupName: string;
  participants: Participant[];
  createdAt: string;
  _id: string;
}

// Initial state: an array of chats
const initialState: Chat[] = []; // Directly store an array of chats

// Create a Redux slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Add a new chat to the array
    addChat: (state, action: PayloadAction<Chat>) => {
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
    clearChats: () => initialState,

    setChats:(state,action)=>{
        console.log("action.payload chec", action.payload);
        return state = [...action.payload];

        // state = action.payload
    }

},
});

// Export the actions and reducer
export const { addChat, clearChats,setChats } = chatSlice.actions;
export default chatSlice.reducer;
