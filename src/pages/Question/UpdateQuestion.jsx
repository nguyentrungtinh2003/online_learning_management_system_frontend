import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import URL from "../../config/URLconfig";

const UpdateQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState({
    questionName: "",
    answerA: "",
    answerB: "",
    answerC: "",
    answerD: "",
    answerCorrect: "",
    isDeleted: false,
    quizId: "",
  });

  useEffect(() => {
    axios
      .get(`${URL}/api/questions/${questionId}`)
      .then((response) => {
        setQuestionData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching question details:", error);
      });
  }, [questionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({ ...questionData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`${URL}/api/questions/update/${questionId}`, questionData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("Question updated successfully!");
        navigate("/questions");
      })
      .catch((error) => {
        console.error("Error updating question:", error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Edit Question</h2>
      <Form.Group controlId="formQuestionName">
        <Form.Label>Question Name</Form.Label>
        <Form.Control
          type="text"
          name="questionName"
          value={questionData.questionName}
          onChange={handleChange}
        />
      </Form.Group>

      {["A", "B", "C", "D"].map((option) => (
        <Form.Group key={option} controlId={`formAnswer${option}`}>
          <Form.Label>Answer {option}</Form.Label>
          <Form.Control
            type="text"
            name={`answer${option}`}
            value={questionData[`answer${option}`]}
            onChange={handleChange}
          />
        </Form.Group>
      ))}

      <Form.Group controlId="formAnswerCorrect">
        <Form.Label>Correct Answer</Form.Label>
        <Form.Control
          as="select"
          name="answerCorrect"
          value={questionData.answerCorrect}
          onChange={handleChange}
        >
          <option value="">Select Correct Answer</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formQuizId">
        <Form.Label>Quiz ID</Form.Label>
        <Form.Control
          type="text"
          name="quizId"
          value={questionData.quizId}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formIsDeleted">
        <Form.Check
          type="checkbox"
          label="Is Deleted"
          name="isDeleted"
          checked={questionData.isDeleted}
          onChange={(e) =>
            setQuestionData({ ...questionData, isDeleted: e.target.checked })
          }
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Changes
      </Button>
    </Form>
  );
};

export default UpdateQuestion;
