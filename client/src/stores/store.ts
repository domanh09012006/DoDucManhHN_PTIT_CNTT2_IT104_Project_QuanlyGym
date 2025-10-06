import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "../slices/registerSlice";

export const store = configureStore({
  reducer: {
    auth: registerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
