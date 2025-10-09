import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Course {
  id: string;
  name: string;
  type: string;
}

interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  loading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk("courses/fetchCourses", async () => {
  const response = await axios.get("http://localhost:3000/courses");
  return response.data;
});

export const deleteCourse = createAsyncThunk("courses/deleteCourse", async (id: string) => {
  await axios.delete(`http://localhost:3000/courses/${id}`);
  return id;
});

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.courses = action.payload;
      })
      .addCase(deleteCourse.fulfilled, (state, action: PayloadAction<string>) => {
        state.courses = state.courses.filter((c) => c.id !== action.payload);
      });
  },
});

export default courseSlice.reducer;
