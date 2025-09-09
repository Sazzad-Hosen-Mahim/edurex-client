import api from "@/src/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ===== Thunks =====

// Fetch all courses
export const fetchCourses = createAsyncThunk("courses/fetchAll", async () => {
  const res = await api.get("/courses");
  return res.data;
});

// Fetch course by ID
export const fetchCourseById = createAsyncThunk(
  "courses/fetchById",
  async (id: string) => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  }
);

// Create course
export const createCourse = createAsyncThunk(
  "courses/create",
  async (courseData: any) => {
    const res = await api.post("/courses", courseData);
    return res.data;
  }
);

// Update course
export const updateCourse = createAsyncThunk(
  "courses/update",
  async ({ id, data }: { id: string; data: any }) => {
    const res = await api.put(`/courses/${id}`, data);
    return res.data;
  }
);

// Delete course
export const deleteCourse = createAsyncThunk(
  "courses/delete",
  async (id: string) => {
    await api.delete(`/courses/${id}`);
    return id; // return deleted id so we can remove from state
  }
);

// ===== Slice =====
const courseSlice = createSlice({
  name: "courses",
  initialState: {
    list: [] as any[],
    currentCourse: null as any,
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })

      // Fetch by ID
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        console.log(action.payload, "current course in slice.....")
        state.currentCourse = action.payload;
      })

      // Create
      .addCase(createCourse.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // Update
      .addCase(updateCourse.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
        if (state.currentCourse?._id === action.payload._id) {
          state.currentCourse = action.payload;
        }
      })

      // Delete
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c._id !== action.payload);
      });
  },
});

export default courseSlice.reducer;
