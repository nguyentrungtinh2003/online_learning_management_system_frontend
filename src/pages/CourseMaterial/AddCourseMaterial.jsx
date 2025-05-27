import React, { useState, useEffect } from "react";
import axios from "axios";
import URL from "../../config/URLconfig";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddCourseMaterial = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [materialData, setMaterialData] = useState({
    title: "",
    description: "",
    courseId: "",
    lecturerId: parseInt(localStorage.getItem("id")),
    isDeleted: false,
  });

  const [file, setFile] = useState(null);

  // Gọi API để lấy danh sách khóa học
  useEffect(() => {
    axios
      .get(`${URL}/courses/all`, { withCredentials: true })
      .then((res) => {
        const options = res.data.data.map((course) => ({
          value: course.id,
          label: course.courseName,
        }));
        setCourses(options);
      })
      .catch((err) => console.log("Lỗi lấy danh sách khóa học: ", err));
  }, []);

  // Xử lý nhập dữ liệu khác (title, description)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Xử lý chọn khóa học từ react-select
  const handleCourseSelect = (selectedOption) => {
    setMaterialData((prev) => ({
      ...prev,
      courseId: selectedOption ? selectedOption.value : "",
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const courseMaterialDTO = {
      title: materialData.title,
      description: materialData.description,
      courseId: materialData.courseId,
      lecturerId: materialData.lecturerId,
    };

    const blob = new Blob([JSON.stringify(courseMaterialDTO)], {
      type: "application/json",
    });

    formData.append("course-material", blob);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post(`${URL}/course-materials/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      alert("Thêm tài liệu thành công!");
      navigate("/admin/course-material");
    } catch (error) {
      console.error("Lỗi khi thêm tài liệu:", error);
      alert("Đã xảy ra lỗi!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Thêm tài liệu học</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tiêu đề</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={materialData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Mô tả</label>
          <textarea
            name="description"
            className="form-control"
            value={materialData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label>Chọn file</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-3">
          <label>Chọn khóa học</label>
          <Select
            options={courses}
            onChange={handleCourseSelect}
            placeholder="Tìm kiếm và chọn khóa học"
            isClearable
          />
        </div>

        <button type="submit" className="btn btn-success">
          Thêm tài liệu
        </button>
      </form>
    </div>
  );
};

export default AddCourseMaterial;
