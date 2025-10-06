import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface Booking {
  id: number;
  userId: number;
  courseId: number;
  bookingDate: string;
  bookingTime: string;
  status: string;
}

interface User {
  id: number | string;
  fullName: string;
  email: string;
}

interface Course {
  id: number;
  name: string;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/bookings").then((res) => res.json()),
      fetch("http://localhost:3000/users").then((res) => res.json()),
      fetch("http://localhost:3000/courses").then((res) => res.json()),
    ]).then(([bookingData, userData, courseData]) => {
      setBookings(bookingData);
      setUsers(userData);
      setCourses(courseData);
    });
  }, []);

  const getUser = (id: number) => users.find((u) => u.id == id);
  const getCourse = (id: number) => courses.find((c) => c.id === id);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-gray-100 p-8">
        <div className="bg-white shadow rounded-lg p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Quản lý lịch tập</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Đặt lịch mới
            </button>
          </div>

          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3 border">Lớp học</th>
                <th className="p-3 border">Ngày tập</th>
                <th className="p-3 border">Khung giờ</th>
                <th className="p-3 border">Họ tên</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const user = getUser(b.userId);
                const course = getCourse(b.courseId);
                return (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{course?.name}</td>
                    <td className="p-3 border">{b.bookingDate}</td>
                    <td className="p-3 border">{b.bookingTime}</td>
                    <td className="p-3 border">{user?.fullName}</td>
                    <td className="p-3 border">{user?.email}</td>
                    <td className="p-3 border text-center">
                      <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                        Hủy
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
