import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../stores/store";

export default function HeaderNav() {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === "admin";

  return (
    <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">GYM MANAGEMENT</h1>
      <nav>
        <ul className="flex gap-6 list-none m-0 p-0">
          <li>
            <a href="/" className="hover:text-blue-400">
              Trang chủ
            </a>
          </li>
          {isLoggedIn && (
            <li>
              <a href="/booking" className="hover:text-blue-400">
                Lịch tập
              </a>
            </li>
          )}
          {!isLoggedIn && (
            <>
              <li>
                <a href="/register" className="hover:text-blue-400">
                  Đăng ký
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-blue-400">
                  Đăng nhập
                </a>
              </li>
            </>
          )}
          {isAdmin && (
            <li>
              <a href="/admin" className="hover:text-blue-400">
                Quản lý Admin
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
