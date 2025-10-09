import React, { useEffect, useState } from "react";
import HeaderNav from "./Header";
import FooterNav from "./Footer";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  imageUrl: string;
}
export default function HomePage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Lỗi khi tải dữ liệu khóa học:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderNav />

      <section
        className="relative h-[450px] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4">Welcome to Our Gym</h2>
          <p className="text-lg mb-6">
            Transform Your Body, Transform Your Life
          </p>
          <button
            onClick={() => navigate("/booking")}
            className="bg-blue-600 px-5 py-2 rounded text-white font-medium hover:bg-blue-700"
          >
            Bắt đầu ngay
          </button>
        </div>
      </section>

      <main className="flex-1 bg-gray-50 py-12 px-6">
        <h2 className="text-center text-2xl font-bold mb-8">
          Các lớp học phổ biến
        </h2>
        <div className="grid gap-6 max-w-6xl mx-auto sm:grid-cols-2 md:grid-cols-3 px-">
          {courses.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition pl-10 pr-10 pb-4"
            >
              <img
                src={cls.imageUrl}
                alt={cls.name}
                className="w-full h-44 object-cover"
              />
              <h3 className="text-lg font-semibold mt-4">{cls.name}</h3>
              <p className="text-base text-gray-800 px-3 mt-2">
                {cls.description}
              </p>

              <button
                onClick={() => navigate("/booking")}
                className="bg-blue-600 mt-3 px-4 py-2 rounded text-white text-sm hover:bg-blue-700"
              >
                Đặt lịch
              </button>
            </div>
          ))}
        </div>
      </main>

      <FooterNav />
    </div>
  );
}
