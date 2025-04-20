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
    <div className="flex-1 h-screen py-3 ">
      <div className="bg-white h-full overflow-y-auto shadow rounded-2xl">
        <Navbar />
        <div className="flex w-full h-fit px-10 gap-12">
          <div className=" space-y-4 text-gray-700 w-[50%] text-lg font-semibold">
            <div className="space-y-2">
              <h1 className="text-3xl text-fcolor font-bold">
                Course Introduction
              </h1>
              <p className="text-2xl font-bold">{course?.courseName}</p>{" "}
              {/* Sử dụng optional chaining */}
              <p>{course?.description}</p> {/* Sử dụng optional chaining */}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl text-fcolor font-bold">
                What You Will Learn?
              </h1>
              <ul>
                <li>Understanding JavaScript syntax and basic operations</li>
                <li>Working with variables, data types, and functions</li>
                <li>Implementing loops and conditional statements</li>
                <li>Handling user interactions with events</li>
                <li>Manipulating the DOM to dynamically update web pages</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl text-fcolor font-bold">Course Content</h1>
              <ul>
                <li>Module 1: Introduction to JavaScript & Setup</li>
                <li>Module 2: Variables, Data Types & Operators</li>
                <li>Module 3: Functions & Scope</li>
                <li>Module 4: Loops & Conditional Statements</li>
                <li>Module 5: DOM Manipulation & Events</li>
              </ul>
            </div>
          </div>
          <div className="w-[50%] flex flex-col max-h-full">
            <div className="space-y-2">
              <h1 className="text-3xl text-fcolor font-bold">Instructor</h1>
              <p className="flex items-center gap-2 font-bold text-xl">
                Lecture: <h2 className="text-fcolor">Nguyen Trung Tinh</h2>
              </p>
              <p>
                This course is taught by experienced JavaScript developers who
                have worked on real-world projects and have years of teaching
                experience.
              </p>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl text-fcolor font-bold">
                Ranking & Reviews
              </h1>
              <div className="flex items-center w-full gap-40">
                <p className="font-bold text-8xl">4.0</p>
                <div className="font-bold text-xl">400 reviews</div>
              </div>
              <div className="">
                <p className="text-2xl font-bold my-2">
                  The most helpful review
                </p>
                <div className="border p-3">
                  <p className="font-bold">
                    Bài học hữu ích và hay nhất mà tôi từng học
                  </p>
                  <p>
                    giảng viên dạy dễ hiểu, có nhiều bài tập tương tác và hỗ trợ
                    người dùng rất tích cực
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl text-fcolor font-bold">
                Pricing & Enrollment
              </h1>
              <h1 className="font-bold text-2xl flex gap-2">
                Price: <p className="text-rose-400">Free</p>
              </h1>
            </div>
            <div className="flex-col flex-1 flex">
              <button
                onClick={() => buyCourse(id)}
                className="bg-scolor border hover:shadow-lg hover:scale-105 duration-500 text-xl py-3 px-20 font-bold rounded mt-auto self-end"
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
