import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";

const UserViewCourse = ({ courseId }) => {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios
      .get(`${URL}/api/courses/${courseId}`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
      });
  }, [courseId]);

  if (!course) {
    return <p>Loading course details...</p>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Row>
            <Col md={4}>
              {course.img && (
                <Card.Img
                  variant="top"
                  src={`${URL}/uploads/${course.img}`}
                  alt="Course Image"
                  className="mb-3"
                />
              )}
            </Col>
            <Col md={8}>
              <Card.Title>{course.courseName}</Card.Title>
              <Card.Text>{course.description}</Card.Text>
              <p><strong>Created Date:</strong> {course.date}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserViewCourse;
