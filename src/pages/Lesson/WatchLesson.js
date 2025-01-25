import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Card } from "react-bootstrap";
import URL from "../../config/URLconfig";

const WatchLesson = () => {
  const [lessons, setLessons] = useState([]); // State lưu danh sách bài học
  const [currentLesson, setCurrentLesson] = useState(null); // State lưu bài học hiện tại

  useEffect(() => {
    // Lấy danh sách bài học từ API
    axios
      .get(`${URL}/api/lessons/all`)
      .then((response) => {
        const data = response.data.data || []; // Kiểm tra dữ liệu trả về từ API
        setLessons(data);
        if (data.length > 0) {
          setCurrentLesson(data[0]); // Gán bài học đầu tiên làm mặc định
        }
      })
      .catch((error) => {
        console.error("Error fetching lessons:", error);
      });
  }, []);

  return (
    <Container fluid className="mt-100">
      <Row>
        {/* Cột bên trái: Video bài học */}
        <Col lg={9} className="mb-4">
          <Card className="shadow">
            <Card.Body>
              {currentLesson ? ( // Kiểm tra nếu currentLesson không phải null
                <>
                  <video
                    src={currentLesson.videoURL}
                    controls
                    style={{
                      width: "100%", // Chiều rộng video chiếm 100% chiều rộng của phần tử cha
                      height: "500px", // Chiều cao video là 300px (hoặc có thể thay đổi thành 400px tùy theo yêu cầu)
                      borderRadius: "8px", // Bo góc video để mềm mại hơn
                    }}
                  ></video>
                  <h4 className="mt-3">{currentLesson.lessonName}</h4>
                  <p className="text-muted">
                    Đây là video bài học:{" "}
                    <strong>{currentLesson.description}</strong>.
                  </p>
                </>
              ) : (
                <p>Loading video...</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Cột bên phải: Danh sách các bài học */}
        <Col lg={3}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h5>Danh Sách Bài Học</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {lessons.map((lesson) => (
                <ListGroup.Item
                  key={lesson.id}
                  action
                  onClick={() => setCurrentLesson(lesson)}
                  className={`d-flex align-items-center ${
                    currentLesson && currentLesson.id === lesson.id
                      ? "bg-light"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <h6 className="mb-0">{lesson.lessonName}</h6>
                    <small className="text-muted">Bài học #{lesson.id}</small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WatchLesson;
