import React, { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../stores/store";
import { loginUser } from "../../slices/registerSlice";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    } else if (!email.includes("@gmail.com")) {
      newErrors.email = "Email phải có đuôi @gmail.com";
    }
    if (!password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((user) => {
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      })
      .catch(() => {});
  };
  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80 flex flex-col"
      >
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-700">
          Đăng nhập
        </h2>
        <label className="mb-1 text-sm text-gray-600">Email</label>
        <input
          type="text"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 mb-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}
        <label className="mb-1 text-sm text-gray-600">Mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 mb-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <p className="text-center text-sm text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-500 font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  );
}
