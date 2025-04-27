import React, { useState, useEffect, useRef } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { PiQuestion } from "react-icons/pi";
import { getCourseById } from "../../services/courseapi";
import SkeletonVideo from "../../components/SkeletonLoading/SkeletonVideo";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [value, setValue] = useState('');

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
    ],
  };

  useEffect(() => {
    if (!lessons || lessons.length === 0) return;
    const loadDurations = async () => {
      const videoElements = lessons.map((lesson, i) => {
        const video = document.createElement("video");
        video.src = lesson.videoURL;
        return new Promise((resolve) => {
          video.onloadedmetadata = () => resolve({ index: i, duration: video.duration });
          video.onerror = () => resolve({ index: i, duration: 0 });
        });
      });
      const results = await Promise.all(videoElements);
      const durations = {};
      results.forEach(({ index, duration }) => {
        durations[index] = duration;
      });
      setVideoDurations(durations);
    };
    loadDurations();
  }, [lessons]);

  useEffect(() => {
    setLoadingVideo(true);
  }, [currentLessonIndex]);

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

  const handleLoadedMetadata = (index) => {
    const videoElement = videoRefs.current[index];
    if (videoElement && videoElement.duration) {
      setVideoDurations((prev) => ({
        ...prev,
        [index]: videoElement.duration,
      }));
    }
  };

  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return "Đang tải...";
    const minutes = Math.floor(duration / 60).toString().padStart(2, "0");
    const seconds = Math.floor(duration % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const [comments, setComments] = useState([
    { id: 1, user: "Văn Tân", time: "10 phút trước", content: "Khoá học rất bổ ích và dễ hiểu!" },
    { id: 2, user: "Trung Tính", time: "20 phút trước", content: "Cảm ơn thầy và Code Arena ❤️" },
    { id: 3, user: "Hiếu Trọng", time: "1 giờ trước", content: "Thầy giảng siêu dễ hiểu!" },
  ]);

  return (
    <div className="flex flex-1 py-3 text-sm font-semibold box-border relative">
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
            <h2 className="text-xl font-bold mb-4">Đặt câu hỏi hoặc bình luận</h2>
            <div className="flex gap-3 mb-6">
              <img src="/logo.png" className="w-10 h-10 bg-gray-300 rounded-full" />
              <div className="flex-1 border rounded-xl">
              <ReactQuill
                value={value}
                onChange={setValue}
                modules={modules}
                placeholder="Nhập bình luận..."
                className="bg-white rounded-lg"
                style={{
                  border: "none",
                }}
              />

              <div className="flex justify-end gap-2 p-2">
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
                    <img src="/logoCode.png" className="w-10 h-10 bg-gray-300 rounded-full" />
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

            {/* Video */}
            {lessons[currentLessonIndex]?.videoURL ? (
              <>
                {loadingVideo && <SkeletonVideo />}
                <video
                  ref={(el) => (videoRefs.current[currentLessonIndex] = el)}
                  className={`w-full h-[70%] bg-black rounded-lg ${loadingVideo ? "hidden" : "block"}`}
                  src={lessons[currentLessonIndex]?.videoURL}
                  controls
                  onLoadedMetadata={() => {
                    handleLoadedMetadata(currentLessonIndex);
                    setLoadingVideo(false);
                  }}
                />
              </>
            ) : (
              <SkeletonVideo />
            )}
            {/* Thông tin bài học - chỉ hiện sau khi load xong video */}
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
          ))}
        </div>
        <p className="flex-end w-fit whitespace-nowrap">
          1.Khái niệm kỹ thuật cần biết
        </p>
      </div>
    </div>
  );
}
