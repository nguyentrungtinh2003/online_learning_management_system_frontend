import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import URL from "../../config/URLconfig";

const QuestionManagement = () => {
  const [quizId, setQuizId] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const fetchQuestions = (id) => {
    axios
      .get(`${URL}/api/questions/byQuiz/${id}`)
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${URL}/api/questions/delete/${id}`)
      .then(() => {
        alert("Question deleted successfully!");
        fetchQuestions(quizId);
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      });
  };

  return (
    <div>
      <h2>Question Management</h2>
      <Form.Group controlId="formQuizId">
        <Form.Label>Quiz ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Quiz ID"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
        />
        <Button className="mt-2" onClick={() => fetchQuestions(quizId)}>
          Load Questions
        </Button>
      </Form.Group>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Question Name</th>
            <th>Answer A</th>
            <th>Answer B</th>
            <th>Answer C</th>
            <th>Answer D</th>
            <th>Correct Answer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.questionId}>
              <td>{question.questionId}</td>
              <td>{question.questionName}</td>
              <td>{question.answerA}</td>
              <td>{question.answerB}</td>
              <td>{question.answerC}</td>
              <td>{question.answerD}</td>
              <td>{question.answerCorrect}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() =>
                    navigate(`/questions/view/${question.questionId}`)
                  }
                >
                  View
                </Button>{" "}
                <Button
                  variant="warning"
                  onClick={() =>
                    navigate(`/questions/edit/${question.questionId}`)
                  }
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(question.questionId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default QuestionManagement;
