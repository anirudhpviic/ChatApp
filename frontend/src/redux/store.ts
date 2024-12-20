// // src/store.ts
// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // localStorage for web
// import userReducer from './userSlice';

// // Persist configuration
// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['user'], // Only persist the 'user' slice
// };

// // Combine the reducer with persist capabilities
// const persistedReducer = persistReducer(persistConfig, userReducer);

// export const store = configureStore({
//   reducer: {
//     user: persistedReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore these action types from redux-persist
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
//       },
//     }),
// });

// // Export types for dispatch and state
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// // Persistor for redux-persist
// export const persistor = persistStore(store);

// src/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import userReducer from './userSlice';
import chatReducer from './chatSlice';

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  user: userReducer, // Add other reducers here if needed
  chat: chatReducer
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'chat'], // Persist only the 'user' slice
};

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore non-serializable actions
      },
    }),
});

// Export types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Persistor
export const persistor = persistStore(store);
