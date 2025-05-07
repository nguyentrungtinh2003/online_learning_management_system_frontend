import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function UserQuizzResult() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [questionResults, setQuestionResults] = useState([]);
  const [quizName, setQuizName] = useState("");
  const [total, setTotal] = useState(0);
  const [score, setScore] = useState(0);
  const [point, setPoint] = useState(0);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedResult = JSON.parse(localStorage.getItem("quizResult")) || {};
    const { quiz, selectedAnswers } = storedResult;

    if (quiz && selectedAnswers) {
      setQuizName(quiz.quizName);
      setTotal(quiz.questions.length);
      setPoint(storedResult.point);
      setScore(storedResult.score);

      // Lưu kết quả các câu hỏi vào state
      const answerArray = Object.values(selectedAnswers); // Chuyển đối tượng thành mảng
      const results = quiz.questions.map((q, idx) => {
        const userAnswerIndex = answerArray[idx]; // Lấy chỉ số câu trả lời của người dùng
        const userAnswerLabel = ["A", "B", "C", "D"][userAnswerIndex]; // Chuyển 0,1,2 thành A, B, C, D
        const correctLabel = Object.entries({
          A: q.answerA,
          B: q.answerB,
          C: q.answerC,
          D: q.answerD,
        }).find(([_, val]) => val === q.answerCorrect)?.[0]; // Đáp án đúng

        // Kiểm tra xem câu trả lời của người dùng có trùng với đáp án đúng không
        const isCorrect = userAnswerLabel === correctLabel;

        return {
          ...q,
          index: idx + 1,
          userAnswerLabel,
          correctLabel,
          isCorrect, // Kiểm tra xem câu trả lời có đúng không
        };
      });

      setQuestionResults(results);
    }
  }, []); // useEffect chỉ chạy một lần khi component mount

  if (!quizName || questionResults.length === 0) {
    return <p>Không có dữ liệu để hiển thị kết quả.</p>;
  }

  return (
    <div className="h-full w-full flex text-sm font-semibold box-border relative">
      <div className="flex-1 overflow-y-auto bg-white p-4 z-0">
        <div className="quiz-container px-2">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2">
            {quizName}
          </h1>
          <p className="text-lg text-gray-600 font-semibold mb-6">
            Điểm của bạn: {point} / {total} ({score}%)
          </p>

          {questionResults.map((q, idx) => (
            <div
              key={idx}
              id={`question-${idx}`}
              className="mb-6 p-4 border rounded-xl shadow-md bg-gray-50"
            >
              <p className="text-lg font-bold text-gray-800 mb-3">
                Câu {idx + 1}: {q.questionName}
              </p>
              {q.img && (
                <img
                  className="w-full h-40 object-contain mb-4"
                  src={q.img}
                  alt={`Câu hỏi ${idx + 1}`}
                />
              )}
              <div className="grid grid-cols-1 gap-3">
                {["A", "B", "C", "D"].map((label) => {
                  const answerText = q[`answer${label}`];
                  const isCorrectAnswer = q.correctLabel === label;
                  const isUserAnswer = q.userAnswerLabel === label;
                  const isUserCorrect = q.isCorrect && isUserAnswer;
                  const isUserWrong = !q.isCorrect && isUserAnswer;

                  let className = "p-3 rounded-md border text-sm ";

                  // Điều kiện đánh dấu câu trả lời đúng / sai
                  if (isCorrectAnswer && !isUserAnswer) {
                    className += "bg-green-50 border-green-400";
                  }

                  if (isUserCorrect) {
                    className += "bg-green-100 border-green-500";
                  } else if (isUserWrong) {
                    className += "bg-red-100 border-red-500";
                  } else {
                    className += "border-gray-300";
                  }

                  return (
                    <p key={label} className={className}>
                      <strong>{label}:</strong> {answerText}
                      {isUserAnswer && !isCorrectAnswer && (
                        <span className="ml-2 italic text-red-600">
                          (Câu trả lời đúng: {q[`answer${q.correctLabel}`]}; Câu
                          trả lời của bạn: {answerText})
                        </span>
                      )}
                      {isUserAnswer && isCorrectAnswer && (
                        <span className="ml-2 italic text-green-600">
                          (Bạn chọn đúng)
                        </span>
                      )}
                      {isCorrectAnswer && !isUserAnswer && (
                        <span className="ml-2 italic text-green-600">
                          (Đáp án đúng)
                        </span>
                      )}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shadow h-full p-4 pb-2 space-y-4 mx-2 justify-between flex flex-col rounded-xl w-[250px]">
        <div className="space-y-4">
          <p className="text-2xl font-bold">Nội dung khóa học</p>
          <div className="flex gap-2 flex-wrap">
            {questionResults.map((_, idx) => (
              <div
                key={idx}
                className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-blue-500 transition-all duration-200"
              >
                <button
                  onClick={() =>
                    document
                      .getElementById(`question-${idx}`)
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-sm font-bold"
                >
                  {idx + 1}
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/quizzes")}
            className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all duration-200"
          >
            Quay lại danh sách quiz
          </button>
        </div>
      </div>
    </div>
  );
}
