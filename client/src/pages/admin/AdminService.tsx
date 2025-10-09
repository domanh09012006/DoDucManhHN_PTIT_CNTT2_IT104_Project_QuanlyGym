import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export default function AdminService() {
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Service>({
    id: "",
    name: "",
    description: "",
    imageUrl: "",
  });

  // === Lấy dữ liệu từ db.json ===
  useEffect(() => {
    fetch("http://localhost:3000/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  // === Thêm dịch vụ ===
  const handleAdd = async () => {
    if (!newService.name.trim() || !newService.description.trim()) return;

    const newItem = {
      ...newService,
      id: Date.now().toString(),
    };

    await fetch("http://localhost:3000/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    setServices([...services, newItem]);
    setShowModal(false);
    setNewService({ id: "", name: "", description: "", imageUrl: "" });
  };

  // === Cập nhật dịch vụ ===
  const handleUpdate = async () => {
    if (!selectedService) return;

    await fetch(`http://localhost:3000/services/${selectedService.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedService),
    });

    setServices(
      services.map((s) => (s.id === selectedService.id ? selectedService : s))
    );
    setShowModal(false);
    setSelectedService(null);
  };

  // === Xóa dịch vụ ===
  const handleDelete = async () => {
    if (!selectedService) return;

    await fetch(`http://localhost:3000/services/${selectedService.id}`, {
      method: "DELETE",
    });

    setServices(services.filter((s) => s.id !== selectedService.id));
    setShowDeleteModal(false);
    setSelectedService(null);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Quản lý Dịch vụ</h1>
          <button
            onClick={() => {
              setShowModal(true);
              setSelectedService(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm dịch vụ mới
          </button>
        </div>

        {/* === Bảng danh sách === */}
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
                    src={s.imageUrl || "https://via.placeholder.com/100"}
                    alt={s.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => {
                      setSelectedService(s);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      setSelectedService(s);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* === Modal Thêm/Sửa === */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 animate-fadeIn">
              <h2 className="text-lg font-semibold mb-4">
                {selectedService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm">Tên dịch vụ</label>
                  <input
                    type="text"
                    className="border p-2 w-full rounded"
                    value={
                      selectedService ? selectedService.name : newService.name
                    }
                    onChange={(e) =>
                      selectedService
                        ? setSelectedService({
                            ...selectedService,
                            name: e.target.value,
                          })
                        : setNewService({
                            ...newService,
                            name: e.target.value,
                          })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm">Mô tả</label>
                  <textarea
                    className="border p-2 w-full rounded"
                    value={
                      selectedService
                        ? selectedService.description
                        : newService.description
                    }
                    onChange={(e) =>
                      selectedService
                        ? setSelectedService({
                            ...selectedService,
                            description: e.target.value,
                          })
                        : setNewService({
                            ...newService,
                            description: e.target.value,
                          })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm">Link ảnh</label>
                  <input
                    type="text"
                    className="border p-2 w-full rounded"
                    placeholder="Dán link ảnh (vd: https://...)"
                    value={
                      selectedService
                        ? selectedService.imageUrl || ""
                        : newService.imageUrl || ""
                    }
                    onChange={(e) =>
                      selectedService
                        ? setSelectedService({
                            ...selectedService,
                            imageUrl: e.target.value,
                          })
                        : setNewService({
                            ...newService,
                            imageUrl: e.target.value,
                          })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end mt-5 space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedService(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={selectedService ? handleUpdate : handleAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {selectedService ? "Lưu" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === Modal Xóa === */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 animate-fadeIn">
              <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
              <p className="mb-5 text-gray-700">
                Bạn có chắc chắn muốn xóa dịch vụ này không?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

