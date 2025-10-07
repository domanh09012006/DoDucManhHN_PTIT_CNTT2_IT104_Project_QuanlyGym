import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/user/Register";
import HomePage from "./pages/user/HomePage";
import Login from "./pages/user/Login";
import BookingPage from "./pages/user/BookingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminService from "./pages/admin/AdminService";
import ProtectedRoute from "./components/ProtectedRouter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserFromStorage } from "./slices/registerSlice";
import type { AppDispatch } from "./stores/store";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch(setUserFromStorage(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-service"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminService />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
