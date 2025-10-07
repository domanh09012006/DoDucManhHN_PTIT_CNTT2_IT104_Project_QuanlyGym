import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

interface Booking {
  id: string;
  userId: string | number;
  courseId: string | number;
  bookingDate: string;
  bookingTime: string;
  status: string;
}

interface User {
  id: string | number;
  fullName: string;
  email: string;
}

interface Course {
  id: string | number;
  name: string;
  type: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [bookingRes, userRes, courseRes] = await Promise.all([
        axios.get("http://localhost:3000/bookings"),
        axios.get("http://localhost:3000/users"),
        axios.get("http://localhost:3000/courses"),
      ]);
      setBookings(bookingRes.data);
      setUsers(userRes.data);
      setCourses(courseRes.data);
    };
    fetchData();
  }, []);

  const totalGym = bookings.filter((b) => {
    const c = courses.find((course) => course.id === b.courseId);
    return c?.type === "Gym";
  }).length;

  const totalYoga = bookings.filter((b) => {
    const c = courses.find((course) => course.id === b.courseId);
    return c?.type === "Yoga";
  }).length;

  const totalZumba = bookings.filter((b) => {
    const c = courses.find((course) => course.id === b.courseId);
    return c?.type === "Zumba";
  }).length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-6 overflow-x-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Thống kê lịch tập
        </h1>

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

        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-semibold mb-3">Bộ lọc</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select className="border p-2 rounded outline-none">
              <option>Tất cả</option>
              <option>Gym</option>
              <option>Yoga</option>
              <option>Zumba</option>
            </select>

            <input
              type="text"
              placeholder="Tìm theo email"
              className="border p-2 rounded outline-none"
            />

            <input type="date" className="border p-2 rounded outline-none" />
          </div>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-300 border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 border border-gray-300">Lớp học</th>
                <th className="p-3 border border-gray-300">Ngày tập</th>
                <th className="p-3 border border-gray-300">Khung giờ</th>
                <th className="p-3 border border-gray-300">Họ tên</th>
                <th className="p-3 border border-gray-300">Email</th>
                <th className="p-3 border border-gray-300">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {/* {bookings.map((b) => {
                const user = users.find((u) => u.id === b.userId);
                const course = courses.find((c) => c.id === b.courseId);

                return (
                  <tr key={b.id}>
                    <td className="p-3 border border-gray-300">
                      {course?.name || "—"}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {b.bookingDate}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {b.bookingTime}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {user?.fullName || "—"}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {user?.email || "—"}
                    </td>
                    <td className="p-3 border border-gray-300">{b.status}</td>
                  </tr>
                );
              })} */}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
