import { useState } from "react";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import {
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
} from "react-icons/md";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { Link } from "react-router-dom";

export default function ManagementLesson() {
  const [lessons, setLessons] = useState([]);

  const handleDelete = (id, name) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc muốn xóa bài học "${name}" không?`
    );
    if (isConfirmed) {
      setLessons((prevLessons) =>
        prevLessons.filter((lesson) => lesson.id !== id)
      );
      alert("Xóa thành công!");
    }
  };

  return (
    <div className="flex-1 h-screen">
      <div className="flex-1 flex flex-col h-full py-6 px-3">
        <AdminNavbar />
        <div className="flex justify-between mb-4">
          <Link className="flex gap-2" to="/admin/courses/edit-course/:id">
            <MdNavigateBefore size={30} />
            <h2 className="text-lg font-bold mb-4">Back</h2>
          </Link>
          <Link
            className="hover:text-ficolor"
            to="/admin/courses/:id/lesson/add-lesson"
          >
            <button className="cursor-pointer bg-scolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl">
              <FaPlus size={30} />
            </button>
          </Link>
        </div>

        <div className="flex-1 drop-shadow-lg">
          <div className="bg-white p-4 rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="text-center font-bold">
                  <th className="p-2">ID</th>
                  <th className="p-2">Lesson Name</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Created Date</th>
                  <th className="p-2">Video URL</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {lessons.length > 0 ? (
                  lessons.map((lesson) => (
                    <tr key={lesson.id} className="text-center">
                      <td className="p-2">{lesson.id}</td>
                      <td className="p-2">{lesson.lessonName || "N/A"}</td>
                      <td className="p-2">
                        {lesson.description || "No description"}
                      </td>
                      <td className="p-2">
                        {lesson.img ? (
                          <img
                            src={lesson.img}
                            alt="lesson"
                            className="w-8 h-8 rounded mx-auto"
                          />
                        ) : (
                          "No image"
                        )}
                      </td>
                      <td className="p-2">
                        {lesson.date
                          ? new Date(lesson.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-2">
                        {lesson.videoURL ? (
                          <a
                            href={lesson.videoURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            View Video
                          </a>
                        ) : (
                          "No video"
                        )}
                      </td>
                      <td className="p-2 flex justify-center gap-1">
                        <Link
                          to={`/admin/lessons/view-lesson/${lesson.id}`}
                          className="p-2 border rounded"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/lessons/edit-lesson/${lesson.id}`}
                          className="p-2 border rounded"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="p-2 border rounded"
                          onClick={() =>
                            handleDelete(lesson.id, lesson.lessonName)
                          }
                        >
                          <MdDeleteForever />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      No lessons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <p>Showing 1 of 4 pages</p>
          <div className="space-x-2">
            <button className="bg-scolor p-1 hover:scale-105 duration-500">
              <MdNavigateBefore size={30} />
            </button>
            <button className="bg-scolor p-1 hover:scale-105 duration-500">
              <MdNavigateNext size={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
