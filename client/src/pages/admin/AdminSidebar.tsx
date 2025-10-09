import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Quản lý lịch", path: "/admin-dashboard" },
    { name: "Quản lý dịch vụ", path: "/admin-service" },
    { name: "Trang chủ", path: "/" },
  ];

  return (
    <aside className="fixed left-0 top-0 w-60 h-screen bg-[#1f2937] text-white flex flex-col shadow-lg">
      <div className="text-xl font-bold text-center py-5 border-b border-gray-700">
        Admin Dashboard
      </div>

      <nav className="flex-1 px-3 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block py-2.5 px-4 rounded mb-2 transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-gray-700 text-white font-semibold"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <Link
          to="/login"
          className="text-center block py-2.5 px-4 rounded text-red-400 hover:text-white hover:bg-red-600 transition-all duration-200"
        >
          Đăng xuất
        </Link>
      </div>
    </aside>
  );
}
