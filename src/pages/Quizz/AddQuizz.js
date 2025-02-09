import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import URL from "../../config/URLconfig";

const AddQuizz = () => {
  const [quizData, setQuizData] = useState({
    quizId: "",
    quizName: "",
    description: "",
    date: "",
    isDeleted: false,
    lessonId: "", // Liên kết với bài học
  });
  const [img, setImg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    const payload = {
      quizId: quizData.quizId,
      quizName: quizData.quizName,
      description: quizData.description,
      date: quizData.date,
      isDeleted: quizData.isDeleted,
      lesson: { id: quizData.lessonId }, // Gửi ID của bài học
    };

    data.append(
      "quiz",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    if (img) {
      data.append("img", img); // Thêm file ảnh
    }

    axios
      .post(`${URL}/api/quizs/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Quizz added successfully!");
      })
      .catch((error) => {
        console.error("Error adding quizz:", error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mt-3" controlId="formQuizId">
        <Form.Label>Quiz ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter quiz ID"
          name="quizId"
          value={quizData.quizId}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formQuizName">
        <Form.Label>Quiz Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter quiz name"
          name="quizName"
          value={quizData.quizName}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter quiz description"
          name="description"
          value={quizData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDate">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="datetime-local"
          name="date"
          value={quizData.date}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formLessonId">
        <Form.Label>Lesson ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter lesson ID"
          name="lessonId"
          value={quizData.lessonId}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formIsDeleted">
        <Form.Check
          type="checkbox"
          label="Is Deleted"
          name="isDeleted"
          checked={quizData.isDeleted}
          onChange={(e) =>
            setQuizData({ ...quizData, isDeleted: e.target.checked })
          }
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formImage">
        <Form.Label>Image</Form.Label>
        <Form.Control type="file" name="img" onChange={handleImageChange} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Quizz
      </Button>
    </Form>
  );
};

export default AddQuizz;
