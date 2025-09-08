// store/slices/moduleSlice.ts
import api from "@/src/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ===== Thunks =====

// Fetch modules for a course
export const fetchModulesByCourse = createAsyncThunk(
  "modules/fetchByCourse",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/modules/${courseId}`);
      return { courseId, modules: res.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create a new module
export const createModule = createAsyncThunk(
  "modules/create",
  async (
    { courseId, data }: { courseId: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(`/modules/${courseId}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete a module
export const deleteModule = createAsyncThunk(
  "modules/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/modules/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ===== Slice =====
const moduleSlice = createSlice({
  name: "modules",
  initialState: {
    byCourse: {} as Record<string, any[]>, // keyed by courseId
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModulesByCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchModulesByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.byCourse[action.payload.courseId] = action.payload.modules;
      })
      .addCase(fetchModulesByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createModule.fulfilled, (state, action) => {
        const courseId = action.payload.courseId;
        if (!state.byCourse[courseId]) state.byCourse[courseId] = [];
        state.byCourse[courseId].push(action.payload);
      })

      .addCase(deleteModule.fulfilled, (state, action) => {
        for (const courseId in state.byCourse) {
          state.byCourse[courseId] = state.byCourse[courseId].filter(
            (m) => m._id !== action.payload
          );
        }
      });
  },
});

export default moduleSlice.reducer;
