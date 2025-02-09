import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import URL from "../../config/URLconfig";

const UpdateQuizz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    quizName: "",
    description: "",
    date: "",
    isDeleted: false,
    lessonId: "",
  });
  const [img, setImg] = useState(null);

  useEffect(() => {
    axios
      .get(`${URL}/api/quizzes/${quizId}`)
      .then((response) => {
        setQuizData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quiz details:", error);
      });
  }, [quizId]);

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
      quizName: quizData.quizName,
      description: quizData.description,
      date: quizData.date,
      isDeleted: quizData.isDeleted,
      lesson: { id: quizData.lessonId },
    };

    data.append(
      "quiz",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    if (img) {
      data.append("img", img);
    }

    axios
      .put(`${URL}/api/quizzes/update/${quizId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Quiz updated successfully!");
        navigate("/quizzes");
      })
      .catch((error) => {
        console.error("Error updating quiz:", error);
      });
  };

  return (
    <Form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="mb-4">Edit Quiz</h2>
      <Form.Group controlId="formQuizName">
        <Form.Label>Quiz Name</Form.Label>
        <Form.Control
          type="text"
          name="quizName"
          value={quizData.quizName}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={quizData.description}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formDate">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="datetime-local"
          name="date"
          value={quizData.date}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formLessonId">
        <Form.Label>Lesson ID</Form.Label>
        <Form.Control
          type="text"
          name="lessonId"
          value={quizData.lessonId}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formIsDeleted">
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

      <Form.Group controlId="formImage">
        <Form.Label>Image</Form.Label>
        <Form.Control type="file" name="img" onChange={handleImageChange} />
      </Form.Group>

      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </div>
    </Form>
  );
};

export default UpdateQuizz;
