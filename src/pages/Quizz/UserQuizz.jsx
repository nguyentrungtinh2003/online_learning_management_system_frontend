import { useState, useEffect } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById } from "../../services/quizapi";
import { PiYoutubeLogo } from "react-icons/pi";

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

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <p>Đang tải quiz hoặc không có câu hỏi nào.</p>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="h-screen flex flex-1 py-3 text-sm font-semibold box-border relative">
      <div className="h-full flex-1 overflow-y-auto bg-white flex-row p-4 z-0">
        <div className="quiz-container px-2">
          <h2 className="text-xl font-bold mb-2">{quiz.quizName}</h2>
          <p className="text-gray-500 mb-4">
            Câu {currentQuestionIndex + 1} / {quiz.questions.length}
          </p>

          <div className="">
            <p className="text-lg font-semibold mb-4">{currentQuestion.questionName}</p>
            {currentQuestion.img && (
            <img
              className="w-full h-40 object-contain mb-4"
              src={currentQuestion.img}
              alt="Hình minh họa"
            />)}

            <div className="grid grid-cols-1 gap-4">
              {["A", "B", "C", "D"].map((choiceLabel, idx) => {
                const choiceValue = currentQuestion[`answer${choiceLabel}`];
                const inputId = `choice-${currentQuestionIndex}-${choiceLabel}`;
                return (
                  <label
                    key={idx}
                    htmlFor={inputId}
                    className={`flex items-start gap-3 cursor-pointer border rounded-xl p-4 transition-all duration-200
                      ${
                        selectedAnswers[currentQuestionIndex] === choiceValue
                          ? "bg-blue-100 border-blue-500"
                          : "hover:bg-blue-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`answer-${currentQuestionIndex}`}
                      value={choiceValue}
                      id={inputId}
                      className="mt-1 accent-blue-500"
                      checked={selectedAnswers[currentQuestionIndex] === choiceValue}
                      onChange={() => handleAnswerChange(currentQuestionIndex, choiceValue)}
                    />
                    <div className="text-sm">
                      <span className="font-bold">{choiceLabel}:</span> {choiceValue}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <hr className="my-6 border-t" />

          <div className="navigation-buttons flex justify-between gap-4">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="nav-button flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-scolor disabled:opacity-50"
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
              className="nav-button flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-scolor disabled:opacity-50"
            >
              Sau <MdNavigateNext />
            </button>
          </div>
        </div>
      </div>

      <div className="shadow h-full p-4 pb-2 space-y-4 mx-2 justify-between flex flex-col rounded-xl w-[250px]">
        <div className="space-y-4">
          <p className="text-2xl font-bold">Nội dung khóa học</p>
          {lessons.map((lesson, index) => (
            <div className="cursor-pointer" key={index}>
              <h1 className="text-lg">{lesson.title}</h1>
              <div className="flex items-center gap-1">
                <PiYoutubeLogo size={18}/>
              <p className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-gray-600">
                {lesson.duration}
              </p>
              </div>
            </div>
          ))}
        </div>
        <p className="flex-end w-fit text-lg">1. Khái niệm kỹ thuật cần biết</p>
      </div>
    </div>
  );
}
