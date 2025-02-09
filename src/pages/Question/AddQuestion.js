import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import URL from "../../config/URLconfig";

const AddQuestion = () => {
  const [questionData, setQuestionData] = useState({
    questionId: "",
    questionName: "",
    answerA: "",
    answerB: "",
    answerC: "",
    answerD: "",
    answerCorrect: "",
    isDeleted: false,
    quizId: "", // Liên kết với quiz
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({ ...questionData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${URL}/api/questions/add`, questionData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("Question added successfully!");
      })
      .catch((error) => {
        console.error("Error adding question:", error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formQuestionId">
        <Form.Label>Question ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter question ID"
          name="questionId"
          value={questionData.questionId}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formQuestionName">
        <Form.Label>Question Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter question"
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
            placeholder={`Enter answer ${option}`}
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
          placeholder="Enter quiz ID"
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
        Add Question
      </Button>
    </Form>
  );
};

export default AddQuestion;
