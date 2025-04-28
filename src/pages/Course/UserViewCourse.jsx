import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import URL from "../../config/URLconfig"; // Đảm bảo URL được cấu hình đúng
import { getCourseById } from "../../services/courseapi"; // Import service
import axios from "axios"; // Import axios để thực hiện HTTP request
import Spinner from "react-bootstrap/Spinner";

export default function UserViewCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null); // Khởi tạo state là null
  const [loading, setLoading] = useState(true); // Thêm state loading
  const [buyLoading, setBuyLoading] = useState(false);
  const [error, setError] = useState(null); // Thêm state error

  useEffect(() => {
    const fetchCourse = async () => {
      // Sử dụng async/await
      setLoading(true); // Bắt đầu loading
      setError(null);
      try {
        const courseData = await getCourseById(id); // Gọi service để lấy dữ liệu
        setCourse(courseData.data);
      } catch (error) {
        setError(error); // Lưu lỗi vào state
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };
    fetchCourse();
  }, [id]);

  const buyCourse = async (id) => {
    setBuyLoading(true);
    const userId = localStorage.getItem("id");
    if (!userId) {
      // Handle trường hợp không có user id, ví dụ: chuyển hướng đăng nhập
      console.error("User ID not found. Please log in.");
      return; // Dừng việc mua khóa học
    }
    const response = await axios.post(`${URL}/courses/buy/${userId}/${id}`);
    if (response) {
      console.log(response.data);
      setBuyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 h-screen py-3 flex items-center justify-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 h-screen py-3 flex items-center justify-center">
        <p>Error: {error.message}</p> {/* Hiển thị thông báo lỗi */}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 h-screen py-3 flex items-center justify-center">
        <p>Course not found.</p> {/* Xử lý trường hợp không có dữ liệu */}
      </div>
    );
  }

  return (
    <div className="flex-1 h-full drop-shadow-lg shadow-lg">
      <div className="bg-white h-full overflow-y-auto rounded-2xl">
        <div className="flex w-full h-fit px-8 py-6 gap-12">
          {/* Left Side: Course Info */}
          <div className="space-y-6 text-gray-700 w-[60%] text-lg font-semibold">
            <div className="space-y-4">
              <h1 className="text-4xl text-fcolor font-bold">
                Course Introduction
              </h1>
              <div className="flex items-center gap-4">
                <img
                  src={course?.img || "/default-course.jpg"}
                  alt={course?.courseName}
                  className="h-48 w-48 object-cover rounded-lg shadow-lg"
                />
                <div>
                  <p className="text-2xl font-bold">{course?.courseName}</p>
                  <p className="text-xl">{course?.description}</p>
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-4">
              <h1 className="text-3xl text-fcolor font-bold">
                What You Will Learn?
              </h1>
              <ul className="list-disc pl-6">
                <li>Understanding JavaScript syntax and basic operations</li>
                <li>Working with variables, data types, and functions</li>
                <li>Implementing loops and conditional statements</li>
                <li>Handling user interactions with events</li>
                <li>Manipulating the DOM to dynamically update web pages</li>
              </ul>
            </div>

            {/* Course Content */}
            <div className="space-y-4">
              <h1 className="text-3xl text-fcolor font-bold">Course Content</h1>
              <ul className="list-disc pl-6">
                <li>Module 1: Introduction to JavaScript & Setup</li>
                <li>Module 2: Variables, Data Types & Operators</li>
                <li>Module 3: Functions & Scope</li>
                <li>Module 4: Loops & Conditional Statements</li>
                <li>Module 5: DOM Manipulation & Events</li>
              </ul>
            </div>
          </div>

          {/* Right Side: Instructor & Pricing */}
          <div className="w-[40%] flex flex-col max-h-full">
            {/* Instructor */}
            <div className="space-y-4">
              <h1 className="text-3xl text-fcolor font-bold">Instructor</h1>
              <div className="flex items-center gap-2">
                <img
                  src="/instructor.jpg" // Replace with actual instructor image
                  alt="Instructor"
                  className="h-20 w-20 object-cover rounded-full"
                />
                <div>
                  <p className="font-bold text-xl">
                    Lecture: Nguyen Trung Tinh
                  </p>
                  <p>
                    This course is taught by experienced JavaScript developers
                    who have worked on real-world projects.
                  </p>
                </div>
              </div>
            </div>

            {/* Ranking & Reviews */}
            <div className="space-y-4">
              <h1 className="text-3xl text-fcolor font-bold">
                Ranking & Reviews
              </h1>
              <div className="flex items-center gap-8">
                <p className="font-bold text-6xl">4.0</p>
                <div className="text-lg">400 reviews</div>
              </div>
              <div className="border p-4 mt-4 rounded-xl">
                <p className="text-2xl font-semibold">
                  The most helpful review:
                </p>
                <div className="border-t pt-2">
                  <p className="font-bold">
                    Bài học hữu ích và hay nhất mà tôi từng học
                  </p>
                  <p>
                    Giảng viên dạy dễ hiểu, có nhiều bài tập tương tác và hỗ trợ
                    người dùng rất tích cực.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing & Enrollment */}
            <div className="space-y-4">
              <h1 className="text-3xl text-fcolor font-bold">
                Pricing & Enrollment
              </h1>
              <p className="font-bold text-2xl">
                Price: <span className="text-rose-400">Free</span>
              </p>
            </div>

            {/* Buy Button */}
            <div className="mt-auto flex flex-col items-end">
              <button
                onClick={() => buyCourse(id)}
                className="bg-scolor hover:scale-105 duration-300 text-xl py-3 px-16 font-bold rounded-lg shadow-lg"
              >
                {buyLoading ? (
                  <Spinner animation="border" variant="white" />
                ) : (
                  "Buy Now"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
