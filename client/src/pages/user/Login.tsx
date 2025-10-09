import React, { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../stores/store";
import { loginUser } from "../../slices/registerSlice";
import Swal from "sweetalert2";

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
    } else if (!email.endsWith("@gmail.com")) {
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

    Swal.fire({
      title: "Đăng nhập thành công!",
      text: `Chào mừng ${user.fullName || "bạn"} !`,
      icon: "success",
      timer: 1000,
    }).then(() => {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    });
  })
  .catch(() => {});
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-12 rounded-2xl shadow-2xl w-[420px] flex flex-col border border-gray-200"
      >
        <h2 className="text-center text-3xl font-extrabold mb-8 text-gray-800">
          Đăng nhập tài khoản
        </h2>

        <label className="mb-2 text-base text-gray-700 font-medium">
          Email
        </label>
        <input
          type="text"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 mb-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}

        <label className="mb-2 text-base text-gray-700 font-medium">
          Mật khẩu
        </label>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 mb-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 hover:shadow-md transition duration-200"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
        )}

        <p className="text-center text-base text-gray-700 mt-6">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  );
}
