import {combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/user.slice";
import sessionStorage from "redux-persist/es/storage/session";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  user: userReducer, // Make sure the key is "user" not "name" for clarity
});

const persistConfig = {
  key: "root", // Key for the persist store
  storage: sessionStorage, // Use session storage instead of localStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

export const persistor = persistStore(store);