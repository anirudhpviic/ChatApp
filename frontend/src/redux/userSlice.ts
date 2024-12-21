// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the user state
interface UserState {
  username: string;
  _id: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
}

// Initial state for the user
const initialState: UserState = {
  username: "",
  _id: "",
  accessToken: "",
  refreshToken: "",
  createdAt: "",
};

// Create a Redux slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      console.log("hre", action.payload);
      const { username, _id, accessToken, refreshToken, createdAt } =
        action.payload;

      state.username = username;
      state._id = _id;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.createdAt = createdAt;
    },

    updateUserTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state = {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    },
    clearUser: () => initialState, // Resets to initial state
  },
});

// Export the actions and reducer
export const { setUser, clearUser, updateUserTokens } = userSlice.actions;
export default userSlice.reducer;
