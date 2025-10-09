import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookings,
  deleteBooking,
  updateBooking,
} from "../../slices/bookingSlice";
import type { RootState, AppDispatch } from "../../stores/store";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings } = useSelector((state: RootState) => state.bookings);

  // Bộ lọc
  const [filterCourse, setFilterCourse] = useState("Tất cả");
  const [filterEmail, setFilterEmail] = useState("");

  // Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Load data
  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // Thống kê
  const totalGym = bookings.filter((b) => b.course === "Gym").length;
  const totalYoga = bookings.filter((b) => b.course === "Yoga").length;
  const totalZumba = bookings.filter((b) => b.course === "Zumba").length;

  // Lọc dữ liệu
  const filteredBookings = bookings.filter((b) => {
    const emailMatch = b.email
      .toLowerCase()
      .includes(filterEmail.toLowerCase());
    const courseMatch = filterCourse === "Tất cả" || b.course === filterCourse;
    return emailMatch && courseMatch;
  });

  // Xử lý mở modal
  const handleEdit = (booking: any) => {
    setSelectedBooking({ ...booking });
    setShowEditModal(true);
  };
  const handleDelete = (booking: any) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  // Xử lý submit modal sửa
  const handleUpdate = () => {
    dispatch(updateBooking(selectedBooking));
    setShowEditModal(false);
  };

  // Xử lý xóa
  const confirmDelete = () => {
    dispatch(deleteBooking(selectedBooking.id));
    setShowDeleteModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-6 overflow-x-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Quản lý lịch tập
        </h1>

        {/* === Thống kê === */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-gray-700">Tổng số lịch Gym</h3>
            <p className="text-blue-600 text-2xl font-bold">{totalGym}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-gray-700">Tổng số lịch Yoga</h3>
            <p className="text-green-600 text-2xl font-bold">{totalYoga}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-gray-700">Tổng số lịch Zumba</h3>
            <p className="text-purple-600 text-2xl font-bold">{totalZumba}</p>
          </div>
        </div>

        {/* === Bộ lọc === */}
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-semibold mb-3">Bộ lọc</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              className="border p-2 rounded outline-none"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            >
              <option>Tất cả</option>
              <option>Gym</option>
              <option>Yoga</option>
              <option>Zumba</option>
            </select>

            <input
              type="text"
              placeholder="Tìm theo email"
              className="border p-2 rounded outline-none"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
            />
          </div>
        </div>

        {/* === Bảng danh sách === */}
        <div className="bg-white rounded shadow overflow-x-auto mb-6">
          <table className="w-full text-sm text-left border border-gray-300 border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 border border-gray-300">Lớp học</th>
                <th className="p-3 border border-gray-300">Ngày tập</th>
                <th className="p-3 border border-gray-300">Khung giờ</th>
                <th className="p-3 border border-gray-300">Họ tên</th>
                <th className="p-3 border border-gray-300">Email</th>
                <th className="p-3 border border-gray-300 text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300">{b.course}</td>
                  <td className="p-3 border border-gray-300">{b.date}</td>
                  <td className="p-3 border border-gray-300">{b.time}</td>
                  <td className="p-3 border border-gray-300">{b.fullName}</td>
                  <td className="p-3 border border-gray-300">{b.email}</td>
                  <td className="p-3 border border-gray-300 text-center">
                    <button
                      onClick={() => handleEdit(b)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(b)}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* === Modal Sửa === */}
        {/* === Modal Sửa === */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 animate-fadeIn">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Chỉnh sửa lịch tập
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Họ tên</label>
                  <input
                    type="text"
                    value={selectedBooking.fullName}
                    disabled
                    className="border p-2 w-full rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm">Email</label>
                  <input
                    type="text"
                    value={selectedBooking.email}
                    disabled
                    className="border p-2 w-full rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm">Lớp học</label>
                  <select
                    className="border p-2 w-full rounded"
                    value={selectedBooking.course}
                    onChange={(e) =>
                      setSelectedBooking({
                        ...selectedBooking,
                        course: e.target.value,
                      })
                    }
                  >
                    <option>Gym</option>
                    <option>Yoga</option>
                    <option>Zumba</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm">Ngày tập</label>
                  <input
                    type="date"
                    className="border p-2 w-full rounded"
                    value={selectedBooking.date}
                    onChange={(e) =>
                      setSelectedBooking({
                        ...selectedBooking,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm">Khung giờ</label>
                  <input
                    type="time"
                    className="border p-2 w-full rounded"
                    value={selectedBooking.time}
                    onChange={(e) =>
                      setSelectedBooking({
                        ...selectedBooking,
                        time: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end mt-5 space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === Modal Xóa === */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 animate-fadeIn">
              <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
              <p className="mb-5 text-gray-700">
                Bạn có chắc chắn muốn xóa lịch tập này không?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
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
