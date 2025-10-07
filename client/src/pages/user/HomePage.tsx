import React from "react";
import HeaderNav from "./Header";
import FooterNav from "./Footer";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const classes = [
    {
      title: "Gym",
      desc: "Tập luyện với các thiết bị hiện đại",
      img: "https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg",
    },
    {
      title: "Yoga",
      desc: "Rèn luyện cả sức khỏe lẫn tinh thần",
      img: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg",
    },
    {
      title: "Zumba",
      desc: "Đốt cháy calories với âm nhạc sôi động",
      img: "https://images.pexels.com/photos/4324021/pexels-photo-4324021.jpeg",
    },
  ];

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
        <div className="grid gap-6 max-w-6xl mx-auto sm:grid-cols-2 md:grid-cols-3">
          {classes.map((cls) => (
            <div
              key={cls.title}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition pl-10 pr-10 pb-4"
            >
              <img
                src={cls.img}
                alt={cls.title}
                className="w-full h-44 object-cover"
              />
              <h3 className="text-lg font-semibold mt-4">{cls.title}</h3>
              <p className="text-sm text-gray-600 px-3 mt-2">{cls.desc}</p>
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
