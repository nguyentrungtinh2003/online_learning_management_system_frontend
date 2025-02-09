import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import URL from "../../config/URLconfig";

const ViewLessonDetail = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    axios
      .get(`${URL}/api/lessons/${lessonId}`)
      .then((response) => {
        setLesson(response.data);
      })
      .catch((error) => {
        console.error("Error fetching lesson details:", error);
      });
  }, [lessonId]);

  if (!lesson) {
    return <p>Loading lesson details...</p>;
  }

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>{lesson.lessonName}</Card.Title>
        <Card.Text>{lesson.description}</Card.Text>
        {lesson.img && <img src={`${URL}/uploads/${lesson.img}`} alt="Lesson" className="img-fluid mb-3" />}
        {lesson.video && (
          <video controls className="w-100">
            <source src={`${URL}/uploads/${lesson.video}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <Card.Text><strong>Course ID:</strong> {lesson.course?.id}</Card.Text>
        <Card.Text><strong>Date:</strong> {lesson.date}</Card.Text>
        <Card.Text><strong>Deleted:</strong> {lesson.isDeleted ? "Yes" : "No"}</Card.Text>
        <Button variant="primary" href="/lessons">Back to Lessons</Button>
      </Card.Body>
    </Card>
  );
};

export default ViewLessonDetail;