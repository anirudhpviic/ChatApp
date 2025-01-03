import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the user state
interface UserState {
  username: string;
  _id: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  role: string;
}

// Initial state for the user
const initialState: UserState = {
  username: "",
  _id: "",
  accessToken: "",
  refreshToken: "",
  createdAt: "",
  role: "",
};

// Create a Redux slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set the user state with provided data
    setUser: (state, action: PayloadAction<UserState>) => {
      Object.assign(state, action.payload);
    },

    // Update only the tokens in the user state
    updateUserTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    // Reset user state to initial values
    clearUser: () => initialState,
  },
});

// Export the actions and reducer
export const { setUser, clearUser, updateUserTokens } = userSlice.actions;
export default userSlice.reducer;
