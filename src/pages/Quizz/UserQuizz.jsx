import { useState, useEffect } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getQuizById, submitQuiz } from "../../services/quizapi";
import URL from "../../config/URLconfig";

export default function UserQuizz() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [hasDoneQuiz, setHasDoneQuiz] = useState(null);
  const userId = parseInt(localStorage.getItem("id"));
  const [isLoading, setIsLoading] = useState(true);

  const lessons = [
    { title: "Khái niệm cần biết", duration: "11:35" },
    { title: "Cấu trúc cơ bản", duration: "09:20" },
    { title: "Biến và kiểu dữ liệu", duration: "12:45" },
  ];

  useEffect(() => {
    const fetchQuizStatus = async () => {
      try {
        const res = await axios.get(
          `${URL}/quizzes/check/${userId}/${quizId}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.data === false) {
          setHasDoneQuiz(false);
          const data = await getQuizById(quizId);
          if (data && data.statusCode === 200) {
            setQuiz(data.data);
          } else {
            console.error("Không thể tải dữ liệu quiz:", data);
          }
        } else {
          setHasDoneQuiz(true);
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái quiz:", err);
      } finally {
        setIsLoading(false); // <-- Đặt đây để tắt loading sau khi fetch xong, dù thành công hay lỗi
      }
    };

    fetchQuizStatus();
  }, [quizId, userId]);

  const handleAnswerChange = (questionIndex, value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleSubmitQuiz = async () => {
    const answers = Object.values(selectedAnswers);
    const quizID = parseInt(quizId);

    try {
      const res = await submitQuiz(quizID, userId, answers);

      if (res.statusCode === 200) {
        const point = res.data;
        const score = (point / quiz.questions.length) * 100;

        localStorage.setItem(
          "quizResult",
          JSON.stringify({ quiz, selectedAnswers, score, point })
        );

        // await savePointHistory(userId, point);

        setTimeout(() => {
          navigate(`/view-result/${quizId}`);
        }, 1000);
      } else {
        alert("Nộp bài thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi nộp bài:", err);
      alert("Đã xảy ra lỗi khi nộp bài.");
    }
  };

  if (hasDoneQuiz === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (hasDoneQuiz === true) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center p-6 text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-red-400 mb-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2a1 1 0 102 0zm0 2a1 1 0 10-2 0v4a1 1 0 002 0v-4z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-xl font-bold">Bạn đã hoàn thành quiz này</p>
        <p className="text-gray-600 dark:text-darkSubtext mt-2">
          Không thể làm lại bài quiz. Hãy kiểm tra kết quả của bạn nhé!
        </p>
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => navigate(`/view-result/${quizId}`)}
            className="px-5 py-2 rounded-lg border-2 text-sm hover:bg-fcolor dark:border-darkBorder"
          >
            Xem kết quả
          </button>
          <button
            onClick={() => navigate(-1)} // Quay về trang trước đó
            className="px-5 py-2 rounded-lg border-2 text-sm hover:bg-gray-200 dark:hover:bg-darkHover dark:border-darkBorder"
          >
            Quay về
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center p-6 text-gray-500 dark:text-darkSubtext">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-xl font-bold">Đang tải quiz...</p>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center p-6 text-gray-500 dark:text-darkSubtext">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 9.75h.008v.008H9.75V9.75zM14.25 9.75h.008v.008h-.008V9.75zM12 15h.008v.008H12V15zM21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
        <p className="text-xl font-bold">Quiz chưa có câu hỏi</p>
        <p className="mt-2">
          Vui lòng quay lại sau khi admin thêm nội dung vào quiz này.
        </p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="h-full w-full dark:text-darkText dark:bg-darkBackground flex text-sm font-semibold box-border relative">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="quiz-container px-2">
          <h2 className="text-xl font-bold mb-2">{quiz.quizName}</h2>
          <p className="text-gray-500 dark:text-darkSubtext mb-4">
            Câu {currentQuestionIndex + 1} / {quiz.questions.length}
          </p>

          <p className="text-lg font-semibold mb-4">
            {currentQuestion.questionName}
          </p>
          {currentQuestion.img && (
            <img
              className="w-full h-40 object-contain mb-4"
              src={currentQuestion.img}
              alt="Hình minh họa"
            />
          )}

          <div className="grid grid-cols-1 gap-4">
            {["A", "B", "C", "D"].map((label, idx) => {
              const value = currentQuestion[`answer${label}`];
              const inputId = `choice-${currentQuestionIndex}-${label}`;
              return (
                <label
                  key={idx}
                  htmlFor={inputId}
                  className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer
                    ${
                      selectedAnswers[currentQuestionIndex] === value
                        ? "bg-blue-100 dark:bg-darkBorder"
                        : "hover:bg-blue-50 dark:hover:bg-darkHover"
                    }`}
                >
                  <input
                    type="radio"
                    name={`answer-${currentQuestionIndex}`}
                    id={inputId}
                    value={value}
                    checked={selectedAnswers[currentQuestionIndex] === value}
                    onChange={() =>
                      handleAnswerChange(currentQuestionIndex, value)
                    }
                    className="mt-1 accent-cyan-500"
                  />
                  <div className="text-base">
                    <span className="font-bold">{label}.</span> {value}
                  </div>
                </label>
              );
            })}
          </div>

          <hr className="my-6 border-t" />

          <div className="flex justify-between gap-4">
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 hover:bg-tcolor dark:border-darkBorder dark:hover:bg-darkHover disabled:opacity-50"
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 hover:bg-tcolor dark:border-darkBorder dark:hover:bg-darkHover disabled:opacity-50"
            >
              Sau <MdNavigateNext />
            </button>
          </div>
        </div>
      </div>

      <div className="w-[250px] p-4 space-y-4 border-l dark:border-darkBorder">
        <p className="text-xl font-bold">Danh sách câu hỏi</p>
        <div className="flex gap-2 flex-wrap">
          {quiz.questions.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 cursor-pointer
                ${
                  currentQuestionIndex === index
                    ? "ring-2 ring-cyan-400"
                    : "hover:bg-fcolor dark:hover:bg-darkHover"
                }
                ${
                  selectedAnswers[index]
                    ? "bg-green-200 dark:bg-green-700"
                    : "bg-white dark:bg-darkBackground"
                }
              `}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmitQuiz}
          disabled={
            Object.keys(selectedAnswers).length !== quiz.questions.length
          }
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          Nộp bài
        </button>
      </div>
    </div>
  );
}
