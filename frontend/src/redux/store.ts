
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";
import selectedChatReducer from "./selectedChat";
import messageReducer from "./messageSlice";

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  user: userReducer, 
  chat: chatReducer,
  selectedChat: selectedChatReducer,
  message: messageReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "chat", "selectedChat", "message"], // Persist only the 'user' slice
};

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // Ignore non-serializable actions
      },
    }),
});

// Export types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Persistor
export const persistor = persistStore(store);
