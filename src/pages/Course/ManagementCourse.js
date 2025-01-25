import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";

const ManagementCourse = () => {
  const [courses, setCourses] = useState([]);

  // Fetch danh sách khóa học từ API
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${URL}/api/courses/all`);
      setCourses(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Thêm mới khóa học
  const handleAdd = () => {
    console.log("Navigate to Add Course form");
  };

  // Chỉnh sửa khóa học
  const handleUpdate = (id) => {
    console.log(`Navigate to Update form for Course ID: ${id}`);
  };

  // Xem chi tiết khóa học
  const handleViewDetail = (id) => {
    console.log(`View details of Course ID: ${id}`);
  };

  // Xóa khóa học
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/courses/${id}`);
      alert("Deleted successfully!");
      fetchCourses(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Gọi fetchCourses khi component được render lần đầu
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Container className="mt-100">
      <h2 className="text-center mb-4">Course Management</h2>
      <Button variant="primary" className="mb-3" onClick={handleAdd}>
        Add Course
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Course Name</th>
            <th>Description</th>
            <th>Lecturer</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={course.id}>
              <td>{index + 1}</td>
              <td>{course.courseName}</td>
              <td>{course.description}</td>
              <td>{course.user.username}</td>
              <td>
                <img
                  src={course.img}
                  alt={course.courseName}
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              <td>
                <Button
                  variant="info"
                  className="me-2"
                  onClick={() => handleViewDetail(course.id)}
                >
                  View Detail
                </Button>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => handleUpdate(course.id)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(course.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManagementCourse;
