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

export default function UserViewLesson() {
  const navigate = useNavigate();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [course, setCourse] = useState({});
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [videoDurations, setVideoDurations] = useState({});
  const videoRefs = useRef([]);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [value, setValue] = useState('');

  const modules = {
    toolbar: [["bold", "italic", "underline"], [{ align: [] }]],
  };

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

  // Fetching comments for the current lesson
  useEffect(() => {
    const lessonId = lessons[currentLessonIndex]?.id;
    if (!lessonId) return; // Không gọi nếu chưa có ID hợp lệ
    console.log("LessonId in get comment : " + lessonId);
    const fetchComments = () => {
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

    fetchComments();
  }, [currentLessonIndex, lessons]);

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

                  <div className="ml-12 text-sm text-blue-500 mt-1 flex gap-3">
                    <button>Thích</button>
                    <button>Phản hồi</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div ref={mainLayoutRef} className="h-full flex-1 overflow-y-auto bg-wcolor border-2 dark:border-darkBorder dark:bg-darkSubbackground flex-row p-4 z-0">
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
                      onClick={() => setCurrentLessonIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentLessonIndex === 0}
                      className="nav-button flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-scolor disabled:opacity-50"
                    >
                      <MdNavigateBefore /> Bài trước
                    </button>
                    <button
                      onClick={() =>
                        setCurrentLessonIndex((prev) => Math.min(lessons.length - 1, prev + 1))
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
            {lessons[currentLessonIndex]?.videoURL ? (
              <>
                {loadingVideo && <SkeletonVideo />}
                <video
                  ref={(el) => (videoRefs.current[currentLessonIndex] = el)}
                  className={`w-full h-[70%] bg-black rounded-lg ${
                    loadingVideo ? "hidden" : "block"
                  }`}
                  src={lessons[currentLessonIndex]?.videoURL}
                  controls
                  onLoadedMetadata={() => {
                    setLoadingVideo(false);
                  }}
                />
              </>
            ) : (
              <SkeletonVideo />
            )}

            {/* Thông tin bài học */}
            {!loadingVideo && (
              <>
              <div className="space-y-2">
                <div className="flex w-full justify-between my-4">
                  <h1 className="text-xl font-bold">{lessons[currentLessonIndex]?.lessonName}</h1>
                  <button className="bg-scolor border py-2 px-10 hover:shadow duration-700 rounded-xl">
                    Thêm ghi chú tại 00:00:00
                  </button>
                </div>
                <h2>Cập nhật tháng 11 năm 2024</h2>
                <p className="text-lg">
                  Tham gia cộng đồng để cùng học hỏi, chia sẻ và “Thám thính” xem Code Arena có gì mới nhé
                </p>
                <ul>
                  <li>Fanpage: http://psdvsnv.com</li>
                  <li>Group: http://psdvsnv.com</li>
                  <li>Youtube: http://psdvsnv.com</li>
                </ul>
              </div>
              {/* Navigation buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentLessonIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentLessonIndex === 0}
                  className="nav-button flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-scolor disabled:opacity-50"
                >
                  <MdNavigateBefore /> Bài trước
                </button>
                <button
                  onClick={() =>
                    setCurrentLessonIndex((prev) => Math.min(lessons.length - 1, prev + 1))
                  }
                  disabled={currentLessonIndex === lessons.length - 1}
                  className="nav-button flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-scolor disabled:opacity-50"
                >
                  Bài sau <MdNavigateNext />
                </button>
              </div></>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="shadow h-full p-4 space-y-4 mx-2 justify-between flex flex-col rounded-xl">
        <div className="space-y-4">
          <p className="text-2xl">Nội dung khóa học</p>
          {lessons.map((lesson, index) => (
            <div
              key={index}
              onClick={() => setCurrentLessonIndex(index)}
              className={`cursor-pointer p-3 rounded-xl transition-all duration-300
                ${currentLessonIndex === index ? "bg-scolor text-white" : "hover:bg-gray-100"}`}
            >
              <h1 className="truncate">{lesson.lessonName || "Không có tiêu đề"}</h1>
              <p className="text-sm opacity-80">
                {videoDurations[index] ? formatDuration(videoDurations[index]) : "Đang tải..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
