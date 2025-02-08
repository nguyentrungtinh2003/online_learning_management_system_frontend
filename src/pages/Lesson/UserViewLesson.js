import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import URL from "../../config/URLconfig";

const UserViewLesson = ({ courseId }) => {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    axios
      .get(`${URL}/api/courses/${courseId}/lessons`)
      .then((response) => {
        setLessons(response.data);
        if (response.data.length > 0) {
          setCurrentLesson(response.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching lessons:", error);
      });
  }, [courseId]);

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          {currentLesson && (
            <Card>
              <Card.Body>
                <video width="100%" controls>
                  <source
                    src={`${URL}/uploads/${currentLesson.video}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <Card.Title className="mt-3">
                  {currentLesson.lessonName}
                </Card.Title>
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Nội dung bài học</Card.Header>
            <ListGroup variant="flush">
              {lessons.map((lesson) => (
                <ListGroup.Item
                  key={lesson.id}
                  action
                  onClick={() => handleLessonClick(lesson)}
                >
                  {lesson.lessonName}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserViewLesson;
