import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/src/features/auth/authSlice";
import courseReducer from "@/src/features/courses/coursesApi";
import moduleReducer from "@/src/features/modules/moduleSlice";
import lectureReducer from "@/src/features/lectures/lectureSlice";
import progressReducer from "@/src/features/progress/progressSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    modules: moduleReducer,
    lectures: lectureReducer,
    progress: progressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
