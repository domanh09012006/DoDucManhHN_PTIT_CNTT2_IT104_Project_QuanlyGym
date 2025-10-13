import AdminSidebar from "./AdminSidebar";
import { useEffect, useState } from "react";

interface Course {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  imageUrl: string;
}

export default function AdminService() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Course>({
    id: "",
    name: "",
    description: "",
    type: "",
    price: 0,
    imageUrl: "",
  });

  // === Lấy dữ liệu từ db.json ===
  useEffect(() => {
    fetch("http://localhost:3000/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error(err));
  }, []);

  // === Thêm khóa học ===
  const handleAdd = async () => {
    if (!newCourse.name.trim() || !newCourse.description.trim()) return;

    const newItem = {
      ...newCourse,
      id: Date.now().toString(),
    };

    await fetch("http://localhost:3000/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    setCourses([...courses, newItem]);
    setShowModal(false);
    setNewCourse({
      id: "",
      name: "",
      description: "",
      type: "",
      price: 0,
      imageUrl: "",
    });
  };

  // === Cập nhật khóa học ===
  const handleUpdate = async () => {
    if (!selectedCourse) return;

    await fetch(`http://localhost:3000/courses/${selectedCourse.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedCourse),
    });

    setCourses(
      courses.map((c) => (c.id === selectedCourse.id ? selectedCourse : c))
    );
    setShowModal(false);
    setSelectedCourse(null);
  };

  // === Xóa khóa học ===
  const handleDelete = async () => {
    if (!selectedCourse) return;

    await fetch(`http://localhost:3000/courses/${selectedCourse.id}`, {
      method: "DELETE",
    });

    setCourses(courses.filter((c) => c.id !== selectedCourse.id));
    setShowDeleteModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Quản lý Khóa học</h1>
          <button
            onClick={() => {
              setShowModal(true);
              setSelectedCourse(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm khóa học
          </button>
        </div>

        {/* === Bảng danh sách === */}
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Tên khóa học</th>
              <th className="py-3 px-4 text-left">Loại</th>
              <th className="py-3 px-4 text-left">Mô tả</th>
              <th className="py-3 px-4 text-left">Giá</th>
              <th className="py-3 px-4 text-left">Hình ảnh</th>
              <th className="py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{c.name}</td>
                <td className="py-3 px-4">{c.type}</td>
                <td className="py-3 px-4">{c.description}</td>
                <td className="py-3 px-4">{c.price.toLocaleString()}đ</td>
                <td className="py-3 px-4">
                  <img
                    src={c.imageUrl || "https://via.placeholder.com/100"}
                    alt={c.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => {
                      setSelectedCourse(c);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(c);
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
                {selectedCourse ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm">Tên khóa học</label>
                  <input
                    type="text"
                    className="border p-2 w-full rounded"
                    value={
                      selectedCourse ? selectedCourse.name : newCourse.name
                    }
                    onChange={(e) =>
                      selectedCourse
                        ? setSelectedCourse({
                            ...selectedCourse,
                            name: e.target.value,
                          })
                        : setNewCourse({
                            ...newCourse,
                            name: e.target.value,
                          })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm">Loại</label>
                  <input
                    type="text"
                    className="border p-2 w-full rounded"
                    value={
                      selectedCourse ? selectedCourse.type : newCourse.type
                    }
                    onChange={(e) =>
                      selectedCourse
                        ? setSelectedCourse({
                            ...selectedCourse,
                            type: e.target.value,
                          })
                        : setNewCourse({
                            ...newCourse,
                            type: e.target.value,
                          })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm">Mô tả</label>
                  <textarea
                    className="border p-2 w-full rounded"
                    value={
                      selectedCourse
                        ? selectedCourse.description
                        : newCourse.description
                    }
                    onChange={(e) =>
                      selectedCourse
                        ? setSelectedCourse({
                            ...selectedCourse,
                            description: e.target.value,
                          })
                        : setNewCourse({
                            ...newCourse,
                            description: e.target.value,
                          })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm">Giá (VNĐ)</label>
                  <input
                    type="number"
                    className="border p-2 w-full rounded"
                    value={
                      selectedCourse ? selectedCourse.price : newCourse.price
                    }
                    onChange={(e) =>
                      selectedCourse
                        ? setSelectedCourse({
                            ...selectedCourse,
                            price: Number(e.target.value),
                          })
                        : setNewCourse({
                            ...newCourse,
                            price: Number(e.target.value),
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
                      selectedCourse
                        ? selectedCourse.imageUrl
                        : newCourse.imageUrl
                    }
                    onChange={(e) =>
                      selectedCourse
                        ? setSelectedCourse({
                            ...selectedCourse,
                            imageUrl: e.target.value,
                          })
                        : setNewCourse({
                            ...newCourse,
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
                    setSelectedCourse(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={selectedCourse ? handleUpdate : handleAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {selectedCourse ? "Lưu" : "Thêm"}
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
                Bạn có chắc chắn muốn xóa khóa học này không?
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
