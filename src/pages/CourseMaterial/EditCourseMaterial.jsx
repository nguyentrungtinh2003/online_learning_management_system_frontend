import React, { useState, useEffect } from "react";
import axios from "axios";
import URL from "../../config/URLconfig";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";

const EditCourseMaterial = () => {
  const { id } = useParams(); // id của tài liệu cần sửa
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [materialData, setMaterialData] = useState({
    id: "",
    title: "",
    description: "",
    courseId: "",
    courseName: "",
    lecturerId: "",
    lecturerName: "",
  });
  const [file, setFile] = useState(null);

  // Lấy danh sách khóa học
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
      .catch((err) => console.error("Lỗi lấy danh sách khóa học:", err));
  }, [id]);

  // Lấy dữ liệu tài liệu hiện tại
  useEffect(() => {
    axios
      .get(`${URL}/course-materials/${parseInt(id)}`, { withCredentials: true })
      .then((res) => {
        const data = res.data.data;
        setMaterialData({
          id: data.id,
          title: data.title,
          description: data.description,
          courseId: data.courseId,
          courseName: data.courseName,
          lecturerId: data.lecturerId,
          lecturerName: data.lecturerName,
        });

        console.log("material " + materialData);
      })
      .catch((err) => console.error("Lỗi lấy tài liệu:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseSelect = (selectedOption) => {
    setMaterialData((prev) => ({
      ...prev,
      courseId: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const blob = new Blob([JSON.stringify(materialData)], {
      type: "application/json",
    });

    formData.append("course-material", blob);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.put(
        `${URL}/course-materials/update/${parseInt(id)}`,
        formData,
        {
          withCredentials: true,
        }
      );
      alert("Cập nhật tài liệu thành công!");
      navigate("/admin/course-material");
    } catch (error) {
      console.error("Lỗi cập nhật tài liệu:", error.message);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Cập nhật tài liệu học</h2>
      <form onSubmit={handleUpdate}>
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
          />
        </div>

        <div className="mb-3">
          <label>Chọn file mới (nếu cần)</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
          <a href={materialData.file} target="_blank" rel="noopener noreferrer">
            Xem tệp
          </a>
          {" | "}
          <a href={materialData.file} download>
            Tải xuống
          </a>
        </div>

        <div className="mb-3">
          <label>Chọn khóa học</label>
          <Select
            options={courses}
            onChange={handleCourseSelect}
            value={courses.find((c) => c.value === materialData.courseId)}
            placeholder="Tìm và chọn khóa học"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default EditCourseMaterial;
