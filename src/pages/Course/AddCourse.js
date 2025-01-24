import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    description: "",
    users: [], // Nếu cần, thêm danh sách user ID
    user: { id: localStorage.getItem("id") }, // Đối tượng user cơ bản
    lessons: [], // Nếu cần, thêm danh sách lesson ID
  });

  const [img, setImg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]); // Sửa lỗi setImage thành setImg
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append(
      "course",
      new Blob([JSON.stringify(courseData)], { type: "application/json" })
    );
    if (img) {
      data.append("img", img);
    }

    axios
      .post(`${URL}/api/courses/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Course added successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding course:", error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mt-100" controlId="formCourseName">
        <Form.Label>Course Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter course name"
          name="courseName"
          value={courseData.courseName}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter course description"
          name="description"
          value={courseData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formImage">
        <Form.Label>Course Image</Form.Label>
        <Form.Control
          type="file"
          name="img"
          onChange={handleImageChange} // Đảm bảo tải file lên
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDate">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="datetime-local"
          name="date"
          value={courseData.date}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formUserId">
        <Form.Label>User ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter user ID"
          name="userId"
          value={courseData.userId}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formIsDeleted">
        <Form.Check
          type="checkbox"
          label="Is Deleted"
          name="isDeleted"
          checked={courseData.isDeleted}
          onChange={(e) =>
            setCourseData({ ...courseData, isDeleted: e.target.checked })
          }
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Course
      </Button>
    </Form>
  );
};

export default AddCourse;
