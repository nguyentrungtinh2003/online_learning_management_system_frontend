import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import URL from "../../config/URLconfig";

const QuizzDetail = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    axios
      .get(`${URL}/api/quizs/${quizId}`)
      .then((response) => {
        setQuiz(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quiz details:", error);
      });
  }, [quizId]);

  if (!quiz) {
    return <p>Loading quiz details...</p>;
  }

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>{quiz.quizName}</Card.Title>
        <Card.Text>
          <strong>Description:</strong> {quiz.description}
        </Card.Text>
        <Card.Text>
          <strong>Date:</strong> {quiz.date}
        </Card.Text>
        <Card.Text>
          <strong>Lesson ID:</strong> {quiz.lesson.id}
        </Card.Text>
        {quiz.img && (
          <div>
            <strong>Image:</strong>
            <img
              src={`${URL}/uploads/${quiz.img}`}
              alt="Quiz"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
        <Card.Text>
          <strong>Deleted:</strong> {quiz.isDeleted ? "Yes" : "No"}
        </Card.Text>
        <Button
          variant="primary"
          onClick={() => alert("Edit feature coming soon!")}
        >
          Edit Quiz
        </Button>
      </Card.Body>
    </Card>
  );
};

export default QuizzDetail;
