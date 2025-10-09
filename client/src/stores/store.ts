import { configureStore } from "@reduxjs/toolkit";
import registerReducer, { setUserFromStorage } from "../slices/registerSlice";
import bookingReducer from "../slices/bookingSlice";
import userReducer from "../slices/usersSlice";
import courseReducer from "../slices/coursesSlice";

export const store = configureStore({
  reducer: {
    auth: registerReducer,
    bookings: bookingReducer,
    users: userReducer,
    courses: courseReducer,
  },
});

// Lấy user từ localStorage
const savedUser = localStorage.getItem("user");
if (savedUser) {
  const userData = JSON.parse(savedUser);
  store.dispatch(setUserFromStorage(userData));
}

// Types cho Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
