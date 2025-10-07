import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function AdminService() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Quản lý Dịch vụ</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Thêm dịch vụ mới
          </button>
        </div>

        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Tên dịch vụ</th>
              <th className="py-3 px-4 text-left">Mô tả</th>
              <th className="py-3 px-4 text-left">Hình ảnh</th>
              <th className="py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{s.name}</td>
                <td className="py-3 px-4">{s.description}</td>
                <td className="py-3 px-4">
                  <img
                    src="https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg"
                    alt={s.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:underline mr-3">
                    Sửa
                  </button>
                  <button className="text-red-600 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
