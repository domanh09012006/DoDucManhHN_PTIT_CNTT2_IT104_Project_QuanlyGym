import React from "react";

export default function FooterNav() {
  return (
    <footer className="bg-slate-900 text-white px-6 py-10 grid gap-8 md:grid-cols-3">
      {/* Cột 1: Về chúng tôi */}
      <div>
        <h3 className="text-lg font-bold mb-3">Về chúng tôi</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          Gym Management - Nơi bạn bắt đầu hành trình fitness của mình với các
          trang thiết bị hiện đại và đội ngũ huấn luyện viên chuyên nghiệp.
        </p>
      </div>

      {/* Cột 2: Liên hệ */}
      <div>
        <h3 className="text-lg font-bold mb-3">Liên hệ</h3>
        <p className="text-sm text-gray-300">Email: contact@gym.com</p>
        <p className="text-sm text-gray-300">Phone: (123) 456-7890</p>
        <p className="text-sm text-gray-300">
          Địa chỉ: 123 Đường ABC, Quận XYZ
        </p>
      </div>

      {/* Cột 3: Theo dõi chúng tôi */}
      <div>
        <h3 className="text-lg font-bold mb-3">Theo dõi chúng tôi</h3>
        <div className="flex gap-4">
          <a href="#" className="text-gray-300 hover:text-white">
            Facebook
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Instagram
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            Twitter
          </a>
        </div>
      </div>

      {/* Dòng cuối */}
      <div className="md:col-span-3 text-center border-t border-slate-700 pt-6 text-sm text-gray-400">
        © 2024 Gym Management. All rights reserved.
      </div>
    </footer>
  );
}
