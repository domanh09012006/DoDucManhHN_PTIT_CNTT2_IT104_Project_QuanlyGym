import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

export interface Booking {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  course: string;
  date: string;
  time: string;
}

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

const API_URL = "http://localhost:3000/bookings";

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async () => {
    const res = await axios.get(API_URL);
    return res.data as Booking[];
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (newBooking: Omit<Booking, "id">) => {
    const res = await axios.post(API_URL, newBooking);
    return res.data as Booking;
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/updateBooking",
  async (updatedBooking: Booking) => {
    const res = await axios.put(
      `${API_URL}/${updatedBooking.id}`,
      updatedBooking
    );
    return res.data as Booking;
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.loading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi tải dữ liệu!";
      })

      /* === DELETE === */
      .addCase(
        deleteBooking.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.bookings = state.bookings.filter(
            (b) => b.id !== action.payload
          );
        }
      )

      .addCase(
        createBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.bookings.push(action.payload);
        }
      )

      .addCase(
        updateBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          const index = state.bookings.findIndex(
            (b) => b.id === action.payload.id
          );
          if (index !== -1) {
            state.bookings[index] = action.payload;
          }
        }
      );
  },
});

export default bookingSlice.reducer;
