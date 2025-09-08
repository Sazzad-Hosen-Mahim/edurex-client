import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/src/features/auth/authSlice";
import courseReducer from "@/src/features/courses/coursesApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
