import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../slices/registerSlice";
import type { RootState, AppDispatch } from "../../stores/store";
import Swal from "sweetalert2";
import axios from "axios";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) {
      newErrors.fullName = "Họ tên không được để trống!";
    }
    if (!email.trim()) {
      newErrors.email = "Email không được để trống!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ!";
    } else if (!email.includes("@gmail.com")) {
      newErrors.email = "Email không đúng định dạng!";
    }
    if (!password) {
      newErrors.password = "Mật khẩu không được để trống!";
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu phải ít nhất 8 ký tự!";
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const check = await axios.get(
        `http://localhost:3000/users?email=${email}`
      );

      if (check.data.length > 0) {
        setErrors((prev) => ({
          ...prev,
          email: "Email này đã được sử dụng, vui lòng chọn email khác!",
        }));
        return;
      }

      const newUser = {
        fullName,
        email,
        password,
        phone: "",
        role: "user",
      };

      const res = await dispatch(registerUser(newUser)).unwrap();
      localStorage.setItem("user", JSON.stringify(res));

      Swal.fire({
        title: "Đăng ký thành công!",
        text: `Chào mừng ${res.fullName || "bạn"} đến với hệ thống!`,
        icon: "success",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Bắt đầu ngay",
        timer: 1500,
        timerProgressBar: true,
      }).then(() => navigate("/"));
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Đăng ký thất bại!",
        text: "Vui lòng kiểm tra lại thông tin và thử lại.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col"
      >
        <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
          Đăng ký tài khoản
        </h2>

        {/* Họ tên */}
        <label className="mb-1 text-base text-gray-700 font-medium">
          Họ tên
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 text-base"
          placeholder="Nhập họ và tên"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mb-2">{errors.fullName}</p>
        )}

        {/* Email */}
        <label className="mb-1 text-base text-gray-700 font-medium">
          Email
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 text-base"
          placeholder="Nhập email của bạn"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}

        {/* Mật khẩu */}
        <label className="mb-1 text-base text-gray-700 font-medium">
          Mật khẩu
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 text-base"
          placeholder="Nhập mật khẩu"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}

        {/* Xác nhận mật khẩu */}
        <label className="mb-1 text-base text-gray-700 font-medium">
          Xác nhận mật khẩu
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 text-base"
          placeholder="Nhập lại mật khẩu"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>
        )}

        {/* Nút đăng ký */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition duration-200 shadow-md disabled:opacity-60"
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        {/* Lỗi chung */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        {/* Link đăng nhập */}
        <p className="text-center text-base text-gray-600 mt-6">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Đăng nhập ngay
          </a>
        </p>
      </form>
    </div>
  );
}
