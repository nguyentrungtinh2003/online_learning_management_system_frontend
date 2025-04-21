import { useState, useEffect } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById } from "../../services/quizapi";
import AdminNavbar from "../../components/Navbar/AdminNavbar";

export default function UserQuizz() {
  const navigate = useNavigate();
  const { quizId } = useParams(); // 👈 dùng đúng tên
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(quizId);
        console.log("Fetched Quiz Data:", data); // Kiểm tra dữ liệu trả về
        if (data && data.statusCode === 200) {
          setQuiz(data.data); // Đảm bảo rằng bạn lấy đúng dữ liệu từ response
        } else {
          console.error("Lỗi tải quiz hoặc dữ liệu không hợp lệ", data);
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi API", error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <p>Đang tải quiz hoặc không có câu hỏi nào.</p>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="quiz-container p-4">
      <AdminNavbar />
      <h2 className="quiz-title">{quiz.quizName}</h2>
      <p className="question-counter">
        Câu {currentQuestionIndex + 1} / {quiz.questions.length}
      </p>

      <div className="question-container">
        <p className="question-text">{currentQuestion.questionName}</p>

        {/* Hiển thị các lựa chọn của mỗi câu hỏi (A, B, C, D) */}
        {["A", "B", "C", "D"].map((choiceLabel, idx) => {
          const choiceValue = currentQuestion[`answer${choiceLabel}`];
          return (
            <div key={idx} className="choice-container">
              <input
                type="radio"
                name={`answer-${currentQuestionIndex}`}
                value={choiceValue}
                id={`choice-${choiceLabel}`}
                className="choice-input"
              />
              <label htmlFor={`choice-${choiceLabel}`} className="choice-label">
                {choiceLabel}: {choiceValue}
              </label>
            </div>
          );
        })}
      </div>

      <hr className="divider" />

      {/* Các nút điều hướng câu hỏi */}
      <div className="navigation-buttons">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="nav-button"
        >
          <MdNavigateBefore /> Trước
        </button>

        <button
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(quiz.questions.length - 1, prev + 1)
            )
          }
          disabled={currentQuestionIndex === quiz.questions.length - 1}
          className="nav-button"
        >
          Sau <MdNavigateNext />
        </button>
      </div>
    </div>
  );
}
