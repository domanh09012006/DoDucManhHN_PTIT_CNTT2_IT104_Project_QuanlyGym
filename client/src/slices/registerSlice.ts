import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id?: number;
  fullName: string;
  email: string;
  password: string;
  role: string; 
}

interface AuthState {
  loading: boolean;
  error: string | null;
  currentUser: User | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  currentUser: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user: Omit<User, "id" | "role">, { rejectWithValue }) => {
    try {
      const newUser = { ...user, role: "user" };
      const response = await axios.post("http://localhost:3000/users", newUser);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Đăng nhập
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (user: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users?email=${user.email}&password=${user.password}`
      );
      if (response.data.length > 0) {
        return response.data[0];
      } else {
        return rejectWithValue("Sai email hoặc mật khẩu");
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("user");
    },
    setUserFromStorage: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
