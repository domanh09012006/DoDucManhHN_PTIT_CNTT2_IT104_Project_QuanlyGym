import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../slices/registerSlice";
import type { RootState, AppDispatch } from "../../stores/store";

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
    } else if(!email.includes("@gmail.com")){
      newErrors.email = "Email không đúng định dạng!"
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newUser = {
      fullName,
      email,
      password,
      phone: "",
      role: "user",
    };

    dispatch(registerUser(newUser))
      .unwrap()
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res));
        navigate("/");
      })
      .catch(() => {
        alert("Đăng ký thất bại!");
      });
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col"
      >
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-700">
          Đăng ký
        </h2>

        <label className="mb-1 text-sm text-gray-600">Họ tên</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="p-2 mb-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mb-2">{errors.fullName}</p>
        )}

        <label className="mb-1 text-sm text-gray-600">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 mb-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}

        <label className="mb-1 text-sm text-gray-600">Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 mb-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}

        <label className="mb-1 text-sm text-gray-600">Xác nhận mật khẩu</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-2 mb-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition mt-2"
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-blue-500 font-medium">
            Đăng nhập ngay
          </a>
        </p>
      </form>
    </div>
  );
}
