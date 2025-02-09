import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Table,
  Button,
  Form,
} from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";

const LessonManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios
      .get(`${URL}/api/courses`)
      .then((response) => {
        setCourses(response.data);
        if (response.data.length > 0) {
          setSelectedCourseId(response.data[0].id);
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      axios
        .get(`${URL}/api/lessons?courseId=${selectedCourseId}`)
        .then((response) => {
          setLessons(response.data);
        })
        .catch((error) => {
          console.error("Error fetching lessons:", error);
        });
    }
  }, [selectedCourseId]);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Lesson Management</Card.Title>
          <Form.Group controlId="formCourseSelect" className="mb-3">
            <Form.Label>Select Course</Form.Label>
            <Form.Control
              as="select"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Lesson Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td>{lesson.id}</td>
                  <td>{lesson.lessonName}</td>
                  <td>{lesson.description}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LessonManagement;
