import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import URL from "../../config/URLconfig";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UpdateLesson = () => {
  const navigate = useNavigate();
  
  const { courseId, id } = useParams();
  const [lessonData, setLessonData] = useState({
    lessonName: "",
    description: "",
    courseId: courseId, // ID của khóa học
  });
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    // const payload = {
    //   lessonName: lessonData.lessonName,
    //   description: lessonData.description,
    //   course: { id: 1 }, // Gửi ID của khóa học
    //   quizzes: [], // Thêm quiz nếu cần (hiện tại để trống)
    // };

    data.append(
      "lesson",
      new Blob([JSON.stringify(lessonData)], { type: "application/json" })
    );
    if (img) {
      data.append("img", img); // Thêm file ảnh
    }
    if (video) {
      data.append("video", video); // Thêm file video
    }

    try {
      const response =  await axios.put(`${URL}/api/lessons/update/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
    );
    console.log("Thành công:",response);
    navigate(-1);
  }
  catch (error){
    console.error("Lỗi:", error.response?.data || error.message);
  } finally{
    setLoading(false);
  }
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
