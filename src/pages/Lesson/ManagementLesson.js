import React, { useState, useEffect } from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";

const ManagementLesson = () => {
  const [lessons, setLessons] = useState([]); // Danh sách bài học

  useEffect(() => {
    // Lấy dữ liệu từ API
    axios
      .get(`${URL}/api/lessons/all`)
      .then((response) => setLessons(response.data.data || []))
      .catch((error) => console.error("Error fetching lessons:", error));
  }, []);

  // Xử lý xóa bài học
  const handleDelete = (lessonId) => {
    if (window.confirm("Bạn có chắc muốn xóa bài học này không?")) {
      axios
        .delete(`${URL}/api/lessons/${lessonId}`)
        .then(() =>
          setLessons(lessons.filter((lesson) => lesson.id !== lessonId))
        )
        .catch((error) => console.error("Error deleting lesson:", error));
    }
  };

  return (
    <Container className="mt-100">
      <Row>
        <Col>
          <h3 className="text-center">Quản Lý Bài Học</h3>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" href="/add-lesson">
              Thêm Bài Học
            </Button>
          </div>
          <Table striped bordered hover className="shadow">
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Tên Bài Học</th>
                <th>Mô Tả</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, index) => (
                <tr key={lesson.id}>
                  <td>{index + 1}</td>
                  <td>{lesson.lessonName}</td>
                  <td>{lesson.description}</td>
                  <td>
                    <Button
                      variant="info"
                      className="me-2"
                      href={`/view-lesson/${lesson.id}`}
                    >
                      Chi Tiết
                    </Button>
                    <Button
                      variant="warning"
                      className="me-2"
                      href={`/edit-lesson/${lesson.id}`}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(lesson.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagementLesson;
