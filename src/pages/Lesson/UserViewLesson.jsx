import React, { useState, useEffect, useRef } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { PiQuestion } from "react-icons/pi";
import { getCourseById } from "../../services/courseapi";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { useParams, useNavigate } from "react-router-dom";

export default function UserViewLesson() {
  const navigate = useNavigate();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [course, setCourse] = useState({});

  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const [videoDurations, setVideoDurations] = useState({});
  const videoRefs = useRef([]);
  const hiddenVideoRef = useRef(null);

  useEffect(() => {
    if (!lessons || lessons.length === 0) return;

    const loadDurations = async () => {
      const durations = {};
      for (let i = 0; i < lessons.length; i++) {
        const video = hiddenVideoRef.current;
        if (video) {
          video.src = lessons[i].videoURL;
          await new Promise((resolve) => {
            video.onloadedmetadata = () => {
              durations[i] = video.duration;
              resolve();
            };
            video.onerror = () => {
              durations[i] = 0; // set 0 if video metadata can't be loaded
              resolve();
            };
          });
        }
      }
      setVideoDurations(durations);
    };

    loadDurations();
  }, [lessons]);

  const handleLoadedMetadata = (index) => {
    const videoElement = videoRefs.current[index];
    if (videoElement && videoElement.duration) {
      setVideoDurations((prev) => ({
        ...prev,
        [index]: videoElement.duration,
      }));
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(courseId);
        if (response && response.statusCode === 200) {
          setLessons(response.data.lessons);
        } else {
          console.error("Lỗi khi tải dữ liệu khóa học", response);
        }
      } catch (error) {
        console.error("Lỗi gọi API", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return "Đang tải...";
    const minutes = Math.floor(duration / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Văn Tân",
      time: "10 phút trước",
      content: "Khoá học rất bổ ích và dễ hiểu!",
    },
    {
      id: 2,
      user: "Trung Tính",
      time: "20 phút trước",
      content: "Cảm ơn thầy và Code Arena ❤️",
    },
    {
      id: 3,
      user: "Hiếu Trọng",
      time: "1 giờ trước",
      content: "Thầy giảng siêu dễ hiểu!",
    },
  ]);

  return (
    <div className="h-screen flex flex-1 py-3 text-sm font-semibold box-border relative">
      {/* Overlay + Form */}
      {showCommentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[95%] max-w-3xl relative max-h-[90vh] overflow-y-auto">
            {/* Nút X */}
            <button
              onClick={() => setShowCommentForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-4">Đặt câu hỏi hoặc bình luận</h2>

            {/* Ô comment mới */}
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div className="flex-1 border rounded-xl p-3">
                <div className="flex gap-3 border-b pb-2 mb-2 text-gray-500 text-lg">
                  <button><b>B</b></button>
                  <button><i>I</i></button>
                  <button><u>U</u></button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Nhập bình luận mới của bạn"
                  className="w-full resize-none outline-none"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setShowCommentForm(false)}
                    className="px-4 py-1 text-sm border rounded-full hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-1 text-sm bg-scolor text-white rounded-full hover:bg-fcolor">
                    Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Danh sách bình luận */}
            <div className="space-y-4">
              {comments.map((cmt) => (
                <div key={cmt.id} className="border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div>
                      <p className="font-semibold">{cmt.user}</p>
                      <p className="text-xs text-gray-500">{cmt.time}</p>
                    </div>
                  </div>
                  <p className="mt-2 ml-12">{cmt.content}</p>
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
      <div className="h-full flex-1 overflow-y-auto bg-white flex-row p-4 z-0">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <button
              onClick={() => setShowCommentForm(true)}
              className="fixed right-80 bottom-4 bg-white border-2 font-semibold py-2 px-4 rounded-xl flex items-center gap-2 z-10"
            >
              <PiQuestion size={20} />
              <p>Hỏi Đáp</p>
            </button>
            {/* Check if video is available before rendering */}
            {lessons[currentLessonIndex]?.videoURL ? (
              <video
                ref={(el) => (videoRefs.current[currentLessonIndex] = el)}
                className="w-full h-[400px] bg-black rounded-lg"
                src={lessons[currentLessonIndex]?.videoURL}
                controls
                onLoadedMetadata={() => handleLoadedMetadata(currentLessonIndex)}
              />
            ) : (
              <p>Không thể tải video, vui lòng thử lại sau.</p>
            )}

            <div className="space-y-2">
              <div className="flex w-full justify-between my-4">
                <h1 className="text-xl font-bold">{lessons[currentLessonIndex]?.lessonName}</h1>
                <button className="bg-scolor border py-2 px-10 hover:shadow duration-700 rounded-xl">
                  Thêm ghi chú tại 00:00:00
                </button>
              </div>
              <h2>Cập nhật tháng 11 năm 2024</h2>
              <p className="text-lg">
                Tham gia cộng đồng để cùng học hỏi, chia sẻ và “Thám thính” xem
                Code Arena có gì mới nhé
              </p>
              <ul>
                <li>Fanpage: http://psdvsnv.com</li>
                <li>Group: http://psdvsnv.com</li>
                <li>Youtube: http://psdvsnv.com</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <div className="font-bold flex gap-4 w-full justify-center">
            <button
              disabled={currentLessonIndex === 0}
              onClick={() => setCurrentLessonIndex((prev) => prev - 1)}
            >
              Bài trước
            </button>
            <button
              disabled={currentLessonIndex === lessons.length - 1}
              onClick={() => setCurrentLessonIndex((prev) => prev + 1)}
            >
              Bài sau
            </button>
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
              ${currentLessonIndex === index
                ? "bg-scolor text-white"
                : "hover:bg-gray-100"
              }`}
          >
            <h1 className="truncate">{lesson.lessonName || "Không có tiêu đề"}</h1>
            <p className="text-sm opacity-80">
              {videoDurations[index]
                ? formatDuration(videoDurations[index])
                : "Đang tải..."}
            </p>
          </div>
        ))}

        </div>
        <p className="flex-end w-fit whitespace-nowrap">
          1.Khái niệm kỹ thuật cần biết
        </p>
      </div>
    </div>
  );
}
  