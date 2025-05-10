import React, { useState, useEffect, useRef } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { PiQuestion } from "react-icons/pi";
import { getCourseById } from "../../services/courseapi";
import SkeletonVideo from "../../components/SkeletonLoading/SkeletonVideo";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import URLSocket from "../../config/URLsocket";
import URL from "../../config/URLconfig";
import axios from "axios";
import { getAllQuizzesByLessonId } from "../../services/quizapi";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { updateLessonProcess } from "../../services/lessonapi";

export default function UserViewLesson() {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [course, setCourse] = useState({});
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [videoDurations, setVideoDurations] = useState({});
  const videoRefs = useRef([]);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const mainLayoutRef = useRef(null);
  const [mainRect, setMainRect] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [hasQuiz, setHasQuiz] = useState(false); // State kiểm tra có quiz hay không

  const [watchedPercent, setWatchedPercent] = useState(0);
  const [lastAllowedTime, setLastAllowedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const userId = parseInt(localStorage.getItem("id"));
  const handleWatchProgress = (e) => {
    const video = e.target;
    const current = video.currentTime;
    const duration = video.duration;

    if (current > lastAllowedTime) {
      setLastAllowedTime(current);
    }

    const percent = (lastAllowedTime / duration) * 100;
    setWatchedPercent(percent);

    if (percent >= 50 && !isCompleted) {
      markLessonAsCompleted();
      setIsCompleted(true);
    }
  };

  const markLessonAsCompleted = async () => {
    try {
      const lessonId = lessons[currentLessonIndex]?.id;
      const courseId = 78; // Lấy courseId từ đối tượng course
      if (!userId || !courseId || !lessonId) {
        console.warn("Thiếu thông tin để cập nhật tiến độ bài học", {
          userId,
          courseId,
          lessonId,
        });
        return;
      }

      await updateLessonProcess(userId, courseId, lessonId);
      console.log("✅ Đã cập nhật tiến độ bài học thành công");
    } catch (error) {
      console.error("❌ Lỗi khi đánh dấu bài học hoàn thành:", error);
    }
  };

  const modules = {
    toolbar: [["bold", "italic", "underline"], [{ align: [] }]],
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (currentLessonIndex !== null) {
        const lessonId = lessons[currentLessonIndex].id;
        const result = await getAllQuizzesByLessonId(lessonId);
        if (result?.statusCode === 200) {
          setQuizzes(result.data);
          setHasQuiz(result.data.length > 0); // Kiểm tra nếu có quiz
        } else {
          setQuizzes([]);
          setHasQuiz(false); // Không có quiz
        }
      }
    };

    fetchQuizzes();
  }, [currentLessonIndex, lessons]); // Đảm bảo rằng quiz được load lại khi index bài học thay đổi

  useEffect(() => {
    if (mainLayoutRef.current) {
      const updateRect = () => {
        const rect = mainLayoutRef.current.getBoundingClientRect();
        setMainRect(rect);
      };

      updateRect(); // tính ngay khi mount
      window.addEventListener("resize", updateRect);
      return () => window.removeEventListener("resize", updateRect);
    }
  }, []);
  // Fetching course and lessons data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(courseId);
        if (response && response.statusCode === 200) {
          setLessons(response.data.lessons);
        } else {
          console.error("Error loading course data", response);
        }
      } catch (error) {
        console.error("Error calling API", error);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Handling WebSocket connection for real-time comments
  useEffect(() => {
    if (!lessons || lessons.length === 0) return;
    const lessonId = lessons[currentLessonIndex]?.id;
    console.log("LessonId in socket : " + lessonId);
    if (!lessonId) return; // Không gọi nếu chưa có ID hợp lệ

    const socket = new SockJS(`${URLSocket}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        // Subscribe to the specific lesson for real-time comments
        if (lessonId) {
          client.subscribe(`/topic/lesson/${lessonId}`, (message) => {
            const newComment = JSON.parse(message.body);
            setComments((prevComments) => [...prevComments, newComment]);
          });
        }
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [currentLessonIndex, lessons]);

  // Handling comment submission
  const addLessonComment = () => {
    axios
      .post(
        `${URL}/lesson-comment/add`,
        { userId, lessonId: lessons[currentLessonIndex]?.id, content },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Comment added successfully!");
        setContent(""); // Reset comment input after successful submission
      })
      .catch((err) => {
        console.error("Error adding comment:", err.message);
      });
  };

  //
  const deleteLessonComment = (lessonCommentId, userId) => {
    axios
      .delete(
        `${URL}/lesson-comment/delete/${lessonCommentId}/${parseInt(userId)}`,

        { withCredentials: true }
      )
      .then((response) => {
        console.log("Delete comment successfully!");
        fetchComments();
      })
      .catch((err) => {
        console.error("Error delete comment:", err.message);
      });
  };
  const fetchComments = () => {
    const lessonId = lessons[currentLessonIndex]?.id;
    axios
      .get(`${URL}/lesson-comment/lesson/${lessonId}`, {
        withCredentials: true,
      })
      .then((response) => {
        setComments(response.data.data);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err.message);
      });
  };
  // Fetching comments for the current lesson
  useEffect(() => {
    const lessonId = lessons[currentLessonIndex]?.id;
    if (!lessonId) return; // Không gọi nếu chưa có ID hợp lệ
    console.log("LessonId in get comment : " + lessonId);

    fetchComments();
  }, [currentLessonIndex, lessons]);

  useEffect(() => {
    setIsCompleted(false);
    setWatchedPercent(0);
    setLastAllowedTime(0);
  }, [currentLessonIndex]);

  return (
    <div className="flex flex-1 text-sm font-semibold box-border relative">
      {/* Overlay + Form */}
      {showCommentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[95%] max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCommentForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">
              Đặt câu hỏi hoặc bình luận
            </h2>
            <div className="flex gap-3 mb-6">
              <img
                src="/logo.png"
                className="w-10 h-10 bg-gray-300 rounded-full"
              />
              <div className="flex-1 border rounded-xl">
                <ReactQuill
                  value={content}
                  onChange={(value) => setContent(value)}
                  modules={modules}
                  placeholder="Nhập bình luận..."
                  className="bg-white rounded-lg"
                />
                <div className="flex justify-end gap-2 p-2">
                  <button
                    onClick={() => setShowCommentForm(false)}
                    className="px-4 py-1 text-sm border rounded-full hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addLessonComment}
                    className="px-4 py-1 text-sm bg-scolor text-white rounded-full hover:bg-fcolor"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
            {/* Danh sách bình luận */}
            <div className="space-y-4">
              {comments?.map((cmt) => (
                <div key={cmt.id} className="border-b pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={cmt.img || "/user.png"}
                      className="w-10 h-10 bg-gray-300 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{cmt.username}</p>
                      <p className="text-xs text-gray-500">{cmt.time}</p>
                    </div>
                  </div>
                  <p
                    className="mt-2 ml-12"
                    dangerouslySetInnerHTML={{ __html: cmt.content }}
                  ></p>
                  {cmt.username === localStorage.getItem("username") ? (
                    <>
                      <button
                        onClick={() =>
                          deleteLessonComment(
                            parseInt(cmt.id),
                            localStorage.getItem("id")
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white text-sm"
                      >
                        X
                      </button>
                    </>
                  ) : (
                    ""
                  )}

                  {/* <div className="ml-12 text-sm text-blue-500 mt-1 flex gap-3">
                    <button>Thích</button>
                    <button>Phản hồi</button>
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div
        ref={mainLayoutRef}
        className="h-full flex-1 overflow-y-auto bg-wcolor border-2 dark:border-darkBorder dark:bg-darkSubbackground flex-row p-4 z-0"
      >
        <div className="flex w-full gap-4">
          <div className="flex-1 relative">
            {/* Navigation buttons */}
            {mainRect && (
              <div
                className="fixed dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText justify-between px-4 flex h-fit bottom-0 border-t-2 border-gray-300 items-center gap-14 bg-wcolor py-2 z-50"
                style={{
                  width: mainRect.width,
                  left: mainRect.left,
                }}
              >
                <div className="flex justify-center flex-1 justify-center gap-4">
                  <button
                    onClick={() =>
                      setCurrentLessonIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentLessonIndex === 0}
                    className="nav-button flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-scolor disabled:opacity-50"
                  >
                    <MdNavigateBefore /> Bài trước
                  </button>
                  <button
                    onClick={() =>
                      setCurrentLessonIndex((prev) =>
                        Math.min(lessons.length - 1, prev + 1)
                      )
                    }
                    disabled={currentLessonIndex === lessons.length - 1}
                    className="nav-button flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-scolor disabled:opacity-50"
                  >
                    Bài sau <MdNavigateNext />
                  </button>
                </div>
                <button
                  onClick={() => setShowCommentForm(true)}
                  className="bg-wcolor dark:border-darkBorder dark:bg-darkSubbackground border-2 font-semibold py-2 px-4 rounded-xl flex items-center gap-2 z-10"
                >
                  <PiQuestion size={20} />
                  <p>Hỏi Đáp</p>
                </button>
              </div>
            )}

            {/* Video */}
            <video
              ref={(el) => (videoRefs.current[currentLessonIndex] = el)}
              className={`w-full h-[70%] bg-black rounded-lg ${
                loadingVideo ? "hidden" : "block"
              }`}
              src={lessons[currentLessonIndex]?.videoURL}
              controls
              onLoadedMetadata={() => {
                setLoadingVideo(false);
                const video = videoRefs.current[currentLessonIndex];
                if (video) {
                  // Ngăn người dùng tua video
                  video.addEventListener("seeking", () => {
                    if (video.currentTime > lastAllowedTime) {
                      video.currentTime = lastAllowedTime; // quay lại phần được phép xem
                    }
                  });
                }
              }}
              onTimeUpdate={(e) => handleWatchProgress(e)}
            />

            {/* Thông tin bài học */}
            {!loadingVideo && (
              <div className="space-y-2 mb-40 dark:text-darkSubtext">
                <div className="flex w-full justify-between my-4">
                  <h1 className="text-xl font-bold dark:text-darkText">
                    {lessons[currentLessonIndex]?.lessonName}
                    {/* Hiển thị icon check nếu bài học hoàn thành */}
                  </h1>
                  <button className="bg-scolor dark:text-darkText border py-2 px-10 hover:shadow duration-700 rounded-xl">
                    Thêm ghi chú tại 00:00:00
                  </button>
                </div>
                <h2>Cập nhật tháng 11 năm 2024</h2>
                <p className="text-lg">
                  Tham gia cộng đồng để cùng học hỏi, chia sẻ và “Thám thính”
                  xem Code Arena có gì mới nhé
                </p>
                <ul>
                  <li>Fanpage: http://psdvsnv.com</li>
                  <li>Group: http://psdvsnv.com</li>
                  <li>Youtube: http://psdvsnv.com</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="shadow dark:text-darkText dark:border dark:border-darkBorder dark:bg-darkSubbackground h-full p-4 space-y-4 mx-2 justify-between flex flex-col rounded-xl">
        <div className="sticky top-5">
          <div className="space-y-6">
            <div className="text-center">Danh sách bài học</div>
            {/* Progress bar */}
            <div className="mt-4">
              <div className="text-center">
                Tiến độ video: {Math.round(watchedPercent)}%
              </div>
              <progress
                value={watchedPercent}
                max="100"
                className="w-full"
              ></progress>
            </div>
            <div>
              <ul className="flex flex-col gap-2">
                {lessons.map((lesson, index) => (
                  <li key={lesson.id}>
                    <div
                      onClick={() => setCurrentLessonIndex(index)}
                      className={`cursor-pointer py-2 px-3 rounded-xl ${
                        currentLessonIndex === index
                          ? "bg-scolor text-white shadow-lg"
                          : "hover:bg-gray-100 dark:hover:bg-darkBorder"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lesson.lessonName}</span>

                        {/* Kiểm tra nếu bài học này được chọn và đã hoàn thành */}
                        {currentLessonIndex === index && isCompleted && (
                          <FaCheckCircle className="text-green-500 ml-2" />
                        )}

                        {/* Hiển thị chữ "Quiz" bên cạnh tên bài học nếu có quiz */}
                        {lesson.quizzes && lesson.quizzes.length > 0 && (
                          <span className="text-xs text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                            Quiz
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Hiển thị danh sách quiz nếu đang chọn bài này */}
                    {currentLessonIndex === index &&
                      lesson.quizzes &&
                      lesson.quizzes.length > 0 && (
                        <ul className="ml-6 mt-2 flex flex-col gap-1">
                          {lesson.quizzes.map((quiz, qIndex) => (
                            <Link
                              to={`/view-quiz/${quiz.id}`}
                              className="hover:text-blue-500"
                            >
                              <li
                                key={quiz.id || qIndex}
                                className="text-xs text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300 px-2 py-0.5 rounded-full"
                              >
                                📝 {quiz.quizName || `Quiz ${qIndex + 1}`}
                              </li>
                            </Link>
                          ))}
                        </ul>
                      )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
