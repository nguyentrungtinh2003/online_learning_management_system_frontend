import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function LessonDetail() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(
          `https://codearena-backend-dev.onrender.com/api/lessons/${lessonId}`
        );
        setLesson(response.data.data);
      } catch (err) {
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!lesson) return <div className="text-center mt-10">Lesson not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{lesson.lessonName}</h1>
      <p className="text-gray-600 mb-4">{lesson.description}</p>

      {lesson.img && (
        <img
          src={lesson.img}
          alt="Lesson"
          className="w-full max-h-[400px] object-cover rounded mb-4"
        />
      )}

      {lesson.videoURL && (
        <div className="mb-6">
          <video
            src={lesson.videoURL}
            controls
            className="w-full max-h-[500px] rounded"
          ></video>
        </div>
      )}

      <Link
        to={`/course/${lesson.course?.id || lesson.courseId}`}
        className="text-blue-500 hover:underline"
      >
        ← Back to Course
      </Link>
    </div>
  );
}
