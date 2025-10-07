import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "../../stores/store";
import { logout } from "../../slices/registerSlice";

export default function HeaderNav() {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === "admin";

  return (
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">GYM MANAGEMENT</h1>
      <nav>
        <ul className="flex gap-6 list-none m-0 p-0">
          <li>
            <Link to="/" className="hover:text-blue-400">
              Trang chủ
            </Link>
          </li>

          {/* 🧍 Người dùng thường */}
          {isLoggedIn && !isAdmin && (
            <>
              <li className="text-yellow-400">
                Xin chào {currentUser?.fullName}
              </li>
              <li>
                <Link to="/booking" className="hover:text-blue-400">
                  Lịch tập
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-600"
                >
                  Đăng xuất
                </button>
              </li>
            </>
          )}

          {/* 👑 Quản trị viên */}
          {isAdmin && (
            <>
              <li className="text-yellow-400">
                Xin chào quản trị viên {currentUser?.fullName}
              </li>
              <li>
                <Link to="/admin-dashboard" className="hover:text-blue-400">
                  Quản lý Admin
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-600"
                >
                  Đăng xuất
                </button>
              </li>
            </>
          )}

          {/* 🚪 Chưa đăng nhập */}
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/register" className="hover:text-blue-400">
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400">
                  Đăng nhập
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
