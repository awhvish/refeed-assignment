import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../slices/taskSlice";

// Store setup
export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

// Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
