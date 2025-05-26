import { useState, useEffect } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById } from "../../services/quizapi";
import { submitQuiz } from "../../services/quizapi";
import { savePointHistory } from "../../services/quizapi";

export default function UserQuizz() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const lessons = [
    { title: "Khái niệm cần biết", duration: "11:35" },
    { title: "Cấu trúc cơ bản", duration: "09:20" },
    { title: "Biến và kiểu dữ liệu", duration: "12:45" },
  ];

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(quizId);
        if (data && data.statusCode === 200) {
          setQuiz(data.data);
        } else {
          console.error("Lỗi tải quiz hoặc dữ liệu không hợp lệ", data);
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi API", error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionIndex, value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleSubmitQuiz = async () => {
    const answersUser = Object.values(selectedAnswers); // Câu trả lời của người dùng
    const userId = parseInt(localStorage.getItem("id"));
    const id = parseInt(quizId);

    try {
      const response = await submitQuiz(id, userId, answersUser);

      if (response.statusCode === 200) {
        const point = response.data;
        console.log("Dữ liệu API trả về:", response.data);

        const totalQuestions = quiz.questions.length;
        const score = (point / totalQuestions) * 100;
        console.log("Điểm số tính được:", score);

        // ✅ Lưu vào localStorage
        localStorage.setItem(
          "quizResult",
          JSON.stringify({
            quiz,
            selectedAnswers,
            score,
            point,
          })
        );

        // ✅ Gọi API để lưu lại lịch sử điểm
        await savePointHistory(userId, point); // Lưu lịch sử điểm

        // ✅ Điều hướng đến trang kết quả
        setTimeout(() => {
          navigate(`/view-result/${quizId}`);
        }, 1000);
      } else {
        alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Có lỗi khi nộp bài:", error);
      alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
    }
  };

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="h-full w-full dark:border dark:text-darkText dark:border-darkBorder p-2 rounded-lg flex text-sm font-semibold box-border relative">
      <div className="h-full flex-1 overflow-y-auto flex-row p-4 z-0">
        <div className="quiz-container px-2">
          <h2 className="text-xl font-bold mb-2">{quiz.quizName}</h2>
          <p className="text-gray-500 dark:text-darkSubtext mb-4">
            Câu {currentQuestionIndex + 1} / {quiz.questions.length}
          </p>

          <div className="">
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
              {["A", "B", "C", "D"].map((choiceLabel, idx) => {
                const choiceValue = currentQuestion[`answer${choiceLabel}`];
                const inputId = `choice-${currentQuestionIndex}-${choiceLabel}`;
                return (
                  <label
                    key={idx}
                    htmlFor={inputId}
                    className={`flex items-start gap-3 dark:border-darkBorder cursor-pointer border-2 rounded-xl p-4 transition-all duration-200
                    ${
                      selectedAnswers[currentQuestionIndex] === choiceValue
                        ? "bg-blue-100 dark:bg-darkBorder"
                        : "hover:bg-blue-50 dark:hover:bg-darkHover"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`answer-${currentQuestionIndex}`}
                      value={choiceValue}
                      id={inputId}
                      className="mt-1 accent-cyan-500"
                      checked={
                        selectedAnswers[currentQuestionIndex] === choiceValue
                      }
                      onChange={() =>
                        handleAnswerChange(currentQuestionIndex, choiceValue)
                      }
                    />
                    <div className="text-base">
                      <span className="font-bold">{choiceLabel}.</span>{" "}
                      {choiceValue}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <hr className="my-6 border-t" />

          <div className="navigation-buttons flex justify-between gap-4">
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="nav-button flex items-center gap-2 px-4 py-2 rounded-lg border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover disabled:opacity-50"
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
              className="nav-button flex items-center gap-2 px-4 py-2 rounded-lg border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover disabled:opacity-50"
            >
              Sau <MdNavigateNext />
            </button>
          </div>
        </div>
      </div>

      <div className="shadow h-full dark:border dark:border-darkBorder p-4 pb-2 space-y-4 mx-2 justify-between flex flex-col rounded-xl w-[250px]">
        <div className="space-y-4">
          <p className="text-2xl font-bold">Nội dung khóa học</p>
          <div className="flex gap-2 flex-wrap">
            {/* Đảm bảo các ô vuông có thể xuống dòng nếu không đủ không gian */}
            {lessons.map((lesson, index) => (
              <div
                className={`cursor-pointer flex items-center justify-center w-12 h-12 rounded-full border-2 dark:border-darkBorder hover:bg-fcolor transition-all duration-200
                  ${selectedAnswers[index] ? "bg-fcolor" : ""}
                  ${currentQuestionIndex === index ? "ring-2 ring-cyan-400" : ""}
                `}
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                <span className="text-sm font-bold">{index + 1}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmitQuiz} // Update this line
            className="mt-4 border-2 dark:border-darkBorder py-2 px-6 rounded-lg hover:bg-fcolor transition-all duration-200"
          >
            Nộp bài
          </button>
        </div>

        <p className="flex-end w-fit text-lg">1. Khái niệm kỹ thuật cần biết</p>
      </div>
    </div>
  );
}
