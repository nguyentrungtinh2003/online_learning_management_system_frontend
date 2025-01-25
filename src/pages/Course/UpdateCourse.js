import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";
import { useParams } from "react-router-dom";

const UpdateCourse = () => {
  const { id } = useParams(); // Lấy ID khóa học từ URL params
  const [courseData, setCourseData] = useState({
    courseName: "",
    description: "",
    user: { id: localStorage.getItem("id") },
  });
  const [img, setImg] = useState(null);

  // Lấy thông tin khóa học hiện tại khi component mount
  useEffect(() => {
    axios
      .get(`${URL}/api/courses/${id}`)
      .then((response) => {
        const course = response.data;
        setCourseData({
          ...course,
          date: course.date
            ? new Date(course.date).toISOString().slice(0, 16)
            : "",
        });
      })
      .catch((error) => {
        console.error("Error fetching course:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
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
      .put(`${URL}/api/courses/update/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Course updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating course:", error);
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
        <Form.Control type="file" name="img" onChange={handleImageChange} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Update Course
      </Button>
    </Form>
  );
};

export default UpdateCourse;
