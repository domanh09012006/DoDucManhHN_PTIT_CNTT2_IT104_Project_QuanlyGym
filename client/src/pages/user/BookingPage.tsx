import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../stores/store";
import axios from "axios";
import HeaderNav from "./Header";
import Footer from "./Footer";

interface Booking {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  course: string;
  time: string;
  date: string;
}

export default function BookingPage() {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ course: "", time: "", date: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Lấy lịch tập từ server (và lọc theo người dùng)
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Khi đã có user thì load lịch tập
  useEffect(() => {
    if (!currentUser) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get<Booking[]>(
          "http://localhost:3000/bookings"
        );
        const userBookings = res.data.filter(
          (b) => b.email === currentUser.email
        );
        setBookings(userBookings);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      }
    };

    fetchBookings();
  }, [currentUser]);

  //  Ghi nhận thay đổi trong form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Lưu hoặc sửa lịch
  const handleSave = async () => {
    if (!form.course || !form.time || !form.date) {
      setError("Không được để trống!");
      return;
    }

    //  Kiểm tra trùng lịch (cùng ngày + cùng giờ của chính user)
    const isDuplicate = bookings.some(
      (b) => b.date === form.date && b.time === form.time && b.id !== editingId // không tính chính lịch đang sửa
    );

    if (isDuplicate) {
      setError("Bạn đã có lịch tập trùng khung giờ này!");
      return;
    }

    try {
      if (editingId) {
        //  Sửa lịch
        const updatedBooking: Booking = {
          id: editingId,
          userId: currentUser?.id?.toString() || "",
          fullName: currentUser?.fullName || "Người dùng",
          email: currentUser?.email || "",
          course: form.course,
          time: form.time,
          date: form.date,
        };

        await axios.put(
          `http://localhost:3000/bookings/${editingId}`,
          updatedBooking
        );

        const updatedList = bookings.map((b) =>
          b.id === editingId ? updatedBooking : b
        );
        setBookings(updatedList);
      } else {
        //  Thêm lịch mới
        const newBooking: Booking = {
          id: Date.now().toString(),
          userId: currentUser?.id?.toString() || "",
          fullName: currentUser?.fullName || "Người dùng",
          email: currentUser?.email || "",
          course: form.course,
          time: form.time,
          date: form.date,
        };

        await axios.post("http://localhost:3000/bookings", newBooking);
        setBookings([...bookings, newBooking]);
      }

      setShowModal(false);
      setForm({ course: "", time: "", date: "" });
      setEditingId(null);
      setError("");
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
    }
  };

  //  Xóa lịch tập
  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        await axios.delete(`http://localhost:3000/bookings/${selectedId}`);
        setBookings(bookings.filter((b) => b.id !== selectedId));
        setShowDeleteModal(false);
        setSelectedId(null);
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
      }
    }
  };
  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  //  Mở modal để sửa
  const handleEdit = (booking: Booking) => {
    setForm({
      course: booking.course,
      time: booking.time,
      date: booking.date,
    });
    setEditingId(booking.id);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderNav />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6 bg-white shadow rounded-lg px-6 py-4">
          <h2 className="text-xl font-semibold">
            Lịch tập của {currentUser?.fullName}
          </h2>
          <button
            onClick={() => {
              setShowModal(true);
              setEditingId(null);
              setForm({ course: "", time: "", date: "" });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Đặt lịch mới
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">Lớp học</th>
                <th className="p-3 border-b">Ngày tập</th>
                <th className="p-3 border-b">Khung giờ</th>
                <th className="p-3 border-b">Họ tên</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-6 text-gray-500 italic"
                  >
                    Chưa có lịch tập nào.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{b.course}</td>
                    <td className="p-3 border-b">{b.date}</td>
                    <td className="p-3 border-b">{b.time}</td>
                    <td className="p-3 border-b">{b.fullName}</td>
                    <td className="p-3 border-b">{b.email}</td>
                    <td className="p-3 border-b text-center space-x-3">
                      <button
                        onClick={() => handleEdit(b)}
                        className="text-blue-600 hover:underline"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => openDeleteModal(b.id)}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />

      {/* Modal đặt/sửa lịch */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl w-[400px] p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-center mb-4">
              {editingId ? "Sửa lịch tập" : "Đặt lịch mới"}
            </h3>
            {error && <p className="text-red-500 text-center mb-2">{error}</p>}

            <label className="block text-sm font-medium mb-1">Lớp học</label>
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            >
              <option value="">Chọn lớp học</option>
              <option value="Gym">Gym</option>
              <option value="Yoga">Yoga</option>
              <option value="Zumba">Zumba</option>
            </select>

            <label className="block text-sm font-medium mb-1">Khung giờ</label>
            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            >
              <option value="">Chọn giờ tập</option>
              <option value="07:00">07:00</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
            </select>

            <label className="block text-sm font-medium mb-1">Ngày tập</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 mb-6"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl w-[400px] p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-center mb-4 text-red-600">
              Xác nhận xóa lịch tập
            </h3>

            <p className="text-center text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa lịch tập này không?
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
