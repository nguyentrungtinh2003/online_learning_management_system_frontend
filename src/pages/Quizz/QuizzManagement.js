import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, Button } from "react-bootstrap";
import URL from "../../config/URLconfig";

const QuizzManagement = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    axios
      .get(`${URL}/api/lessons`)
      .then((response) => {
        setLessons(response.data);
      })
      .catch((error) => {
        console.error("Error fetching lessons:", error);
      });
  }, []);

  const handleLessonChange = (e) => {
    const lessonId = e.target.value;
    setSelectedLessonId(lessonId);
    if (lessonId) {
      axios
        .get(`${URL}/api/quizzes/lesson/${lessonId}`)
        .then((response) => {
          setQuizzes(response.data);
        })
        .catch((error) => {
          console.error("Error fetching quizzes:", error);
        });
    } else {
      setQuizzes([]);
    }
  };

  const handleViewDetail = (quizId) => {
    alert(`Viewing details for quiz ID: ${quizId}`);
  };

  const handleEdit = (quizId) => {
    alert(`Editing quiz ID: ${quizId}`);
  };

  const handleDelete = (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      axios
        .delete(`${URL}/api/quizzes/delete/${quizId}`)
        .then(() => {
          alert("Quiz deleted successfully!");
          setQuizzes(quizzes.filter((quiz) => quiz.quizId !== quizId));
        })
        .catch((error) => {
          console.error("Error deleting quiz:", error);
        });
    }
  };

  return (
    <div className="mt-4">
      <h2>Quiz Management</h2>
      <Form.Group controlId="formLessonSelect">
        <Form.Label>Select Lesson</Form.Label>
        <Form.Control as="select" value={selectedLessonId} onChange={handleLessonChange}>
          <option value="">-- Select a Lesson --</option>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>{lesson.lessonName}</option>
          ))}
        </Form.Control>
      </Form.Group>

      {quizzes.length > 0 ? (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Quiz ID</th>
              <th>Quiz Name</th>
              <th>Description</th>
              <th>Date</th>
              <th>Image</th>
              <th>Deleted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.quizId}>
                <td>{quiz.quizId}</td>
                <td>{quiz.quizName}</td>
                <td>{quiz.description}</td>
                <td>{quiz.date}</td>
                <td>
                  {quiz.img && <img src={`${URL}/uploads/${quiz.img}`} alt="Quiz" style={{ width: "50px" }} />}
                </td>
                <td>{quiz.isDeleted ? "Yes" : "No"}</td>
                <td>
                  <Button variant="info" size="sm" onClick={() => handleViewDetail(quiz.quizId)}>View Detail</Button>{' '}
                  <Button variant="warning" size="sm" onClick={() => handleEdit(quiz.quizId)}>Edit</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(quiz.quizId)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="mt-3">No quizzes available for this lesson.</p>
      )}
    </div>
  );
};

export default QuizzManagement;
