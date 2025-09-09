import api from "@/src/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Enroll in course
export const enrollCourse = createAsyncThunk(
  "progress/enrollCourse",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/progress/enroll/${courseId}`);
      return res.data.progress;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch my courses with progress
export const fetchMyCourses = createAsyncThunk(
  "progress/fetchMyCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/progress/my-courses");
      return res.data.courses;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Complete a lecture
export const completeLecture = createAsyncThunk(
  "progress/completeLecture",
  async (
    { courseId, lectureOrder }: { courseId: string; lectureOrder: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(
        `/progress/${courseId}/complete/${lectureOrder}`
      );
      return res.data.progress;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

interface ProgressState {
  courses: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  courses: [],
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // enroll course
      .addCase(enrollCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetch courses
      .addCase(fetchMyCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // complete lecture
      .addCase(completeLecture.pending, (state) => {
        state.loading = true;
      })
      .addCase(completeLecture.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.courses = state.courses.map((c) =>
          c._id === updated._id ? updated : c
        );
      })
      .addCase(completeLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default progressSlice.reducer;
