import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { getCourseById, updateCourse } from "../../services/courseapi";
import URL from "../../config/URLconfig";

const EditCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [course, setCourse] = useState({
    courseName: "",
    description: "",
    price: "",
    img: "",
    courseEnum: "FREE",
    userId: localStorage.getItem("id"),
  });

  const [initialCourse, setInitialCourse] = useState({
    courseName: "",
    description: "",
    price: "",
    img: "",
    courseEnum: "FREE",
    userId: localStorage.getItem("id"),
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await getCourseById(id);
        // console.log("Fetched Course Data:", courseData); // In dữ liệu nhận được từ API

        if (courseData && courseData.data) {
          const formattedData = {
            courseName: courseData.data.courseName || "",
            description: courseData.data.description || "",
            price: courseData.data.price || "0",
            img: courseData.data.img || "",
            courseEnum: courseData.data.courseEnum || "FREE",
            userId: courseData.data.user?.id || localStorage.getItem("id"),
          };

          setCourse(formattedData);
          setInitialCourse(formattedData);

          // console.log("Formatted Course Data:", formattedData); // In dữ liệu đã format
        } else {
          setError("Không thể tải dữ liệu khóa học");
        }
      } catch (err) {
        setError("Không thể tải dữ liệu khóa học");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const parsedPrice = parseFloat(value);
      setCourse((prev) => ({
        ...prev,
        price: value,
        courseEnum: parsedPrice === 0 ? "FREE" : "PAID",
      }));
    } else {
      setCourse((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEnumChange = (e) => {
    const selectedType = e.target.value;

    setCourse((prev) => {
      let newPrice = prev.price;

      if (selectedType === "FREE") {
        newPrice = "0";
      } else if (parseFloat(prev.price) <= 0) {
        newPrice = "1";
      }

      return {
        ...prev,
        courseEnum: selectedType,
        price: newPrice,
      };
    });
  };

  const handleImageChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu đang loading hoặc đã submit rồi
    if (loading || isSubmitted) return;

    // Kiểm tra xem dữ liệu có thay đổi không
    const isDataUnchanged =
      course.courseName === initialCourse.courseName &&
      course.description === initialCourse.description &&
      course.price === initialCourse.price &&
      course.courseEnum === initialCourse.courseEnum &&
      course.img === initialCourse.img;

    // Nếu dữ liệu không thay đổi, chỉ cần quay lại
    if (isDataUnchanged) {
      navigate(-1); // Quay lại trang trước
      return;
    }

    // Kiểm tra giá cho khóa học trả phí
    if (parseFloat(course.price) <= 0 && course.courseEnum === "PAID") {
      toast.error("❌ Vui lòng nhập giá lớn hơn 0 cho khóa học trả phí.", {
        autoClose: 1000,
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append(
      "course",
      new Blob([JSON.stringify(course)], { type: "application/json" })
    );
    if (file) formData.append("img", file);

    try {
      await updateCourse(id, course, file);
      toast.success("Cập nhật khóa học thành công!", {
        autoClose: 1000,
        position: "top-right",
      });
      setIsSubmitted(true);
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error("Lỗi khi cập nhật khóa học:", err);
      toast.error("Không thể cập nhật khóa học!", {
        autoClose: 1000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex gap-2 dark:text-darkText">
        <FaBuffer size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">Course Management</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">Edit Course</h2>
      </div>

      <Form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <Form.Group className="mb-3" controlId="formCourseName">
          <Form.Label>Course Title</Form.Label>
          <Form.Control
            type="text"
            name="courseName"
            value={course.courseName}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={course.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={course.price}
            onChange={handleChange}
            min={0}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCourseEnum">
          <Form.Label>Course Type</Form.Label>
          <Form.Select
            name="courseEnum"
            value={course.courseEnum}
            onChange={handleEnumChange}
          >
            <option value="FREE">Free</option>
            <option value="PAID">Paid</option>
          </Form.Select>
        </Form.Group>

        {/* Hiển thị ảnh cũ nếu có */}
        <Form.Group className="mb-3" controlId="formImage">
          <Form.Label>Course Image</Form.Label>
          {course.img && (
            <img
              src={course.img}
              alt="Course"
              className="w-40 h-40 object-cover rounded-md mb-2"
            />
          )}
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group>

        <div className="flex justify-end space-x-2 mt-6">
          <Link
            onClick={() => navigate(-1)}
            className="px-6 py-2 border-2 border-sicolor text-ficolor rounded-lg hover:bg-opacity-80"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg ${
              loading || isSubmitted
                ? "bg-gray-400"
                : "bg-scolor text-ficolor hover:bg-opacity-80"
            }`}
            disabled={loading || isSubmitted}
          >
            {loading ? "Processing..." : isSubmitted ? "Submitted" : "Submit"}
          </button>
        </div>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default EditCourse;
