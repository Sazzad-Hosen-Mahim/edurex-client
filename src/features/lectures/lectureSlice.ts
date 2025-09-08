import api from "@/src/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ===== Thunks =====

// Fetch lectures by module
export const fetchLecturesByModule = createAsyncThunk(
  "lectures/fetchByModule",
  async (moduleId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/lectures/${moduleId}`);
      return { moduleId, lectures: res.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create lecture
export const createLecture = createAsyncThunk(
  "lectures/create",
  async (
    { moduleId, data }: { moduleId: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(`/lectures/${moduleId}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update lecture
export const updateLecture = createAsyncThunk(
  "lectures/update",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/lectures/${id}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete lecture
export const deleteLecture = createAsyncThunk(
  "lectures/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/lectures/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ===== Slice =====
const lectureSlice = createSlice({
  name: "lectures",
  initialState: {
    byModule: {} as Record<string, any[]>,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLecturesByModule.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLecturesByModule.fulfilled, (state, action) => {
        state.loading = false;
        state.byModule[action.payload.moduleId] = action.payload.lectures;
      })
      .addCase(fetchLecturesByModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createLecture.fulfilled, (state, action) => {
        const moduleId = action.payload.moduleId;
        if (!state.byModule[moduleId]) state.byModule[moduleId] = [];
        state.byModule[moduleId].push(action.payload);
      })
      .addCase(updateLecture.fulfilled, (state, action) => {
        const moduleId = action.payload.moduleId;
        if (!state.byModule[moduleId]) return;
        const idx = state.byModule[moduleId].findIndex(
          (l) => l._id === action.payload._id
        );
        if (idx !== -1) state.byModule[moduleId][idx] = action.payload;
      })
      .addCase(deleteLecture.fulfilled, (state, action) => {
        for (const moduleId in state.byModule) {
          state.byModule[moduleId] = state.byModule[moduleId].filter(
            (l) => l._id !== action.payload
          );
        }
      });
  },
});

export default lectureSlice.reducer;
