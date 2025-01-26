import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import URL from "../../config/URLconfig";
import { useParams } from "react-router-dom";

const UpdateLesson = () => {
  const { id } = useParams();
  const [lessonData, setLessonData] = useState({
    lessonName: "",
    description: "",
    courseId: 1, // ID của khóa học
  });
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData({ ...lessonData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    const payload = {
      lessonName: lessonData.lessonName,
      description: lessonData.description,
      course: { id: 1 }, // Gửi ID của khóa học
      quizzes: [], // Thêm quiz nếu cần (hiện tại để trống)
    };

    data.append(
      "lesson",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    if (img) {
      data.append("img", img); // Thêm file ảnh
    }
    if (video) {
      data.append("video", video); // Thêm file video
    }

    axios
      .put(`${URL}/api/lessons/update/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Lesson update successfully!");
      })
      .catch((error) => {
        console.error("Error update lesson:", error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mt-100" controlId="formLessonName">
        <Form.Label>Lesson Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter lesson name"
          name="lessonName"
          value={lessonData.lessonName}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter lesson description"
          name="description"
          value={lessonData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDate">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="datetime-local"
          name="date"
          value={lessonData.date}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formCourseId">
        <Form.Label>Course ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter course ID"
          name="courseId"
          value={lessonData.courseId}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formImage">
        <Form.Label>Image</Form.Label>
        <Form.Control type="file" name="img" onChange={handleImageChange} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formVideo">
        <Form.Label>Video</Form.Label>
        <Form.Control type="file" name="video" onChange={handleVideoChange} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Update Lesson
      </Button>
    </Form>
  );
};

export default UpdateLesson;
