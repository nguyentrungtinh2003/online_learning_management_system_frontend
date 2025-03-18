import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import { useState, useEffect } from "react";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import {
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
} from "react-icons/md";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { deleteLesson, getLesson } from "../../services/lessonapi";

export default function ManagementLesson() {
  const navigate = useNavigate();

  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`https://codearena-backend-dev.onrender.com/api/courses/${courseId}`)
    .then((response) => {
      setLessons(response.data.data.lessons);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error lessons:",error);
      setError("Không thể thêm bài học");
      setLoading(false);
    });
  }, [courseId]);


   // Lọc các khóa học theo tên
   const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.lessonName &&
    lesson.lessonName.toLowerCase().includes(search.toLowerCase())
    || lesson.description && 
    lesson.description.toLowerCase().includes(search.toLowerCase())
  );



  const handleDelete = async (id, name) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc muốn xóa bài học "${name}" không?`
    );
    if (isConfirmed) {
      try {
        const response = await deleteLesson(id);
        console.log("Delete API", response);
  
        // Gọi lại API để lấy danh sách bài học theo courseId
        const updatedResponse = await axios.get(
          `https://codearena-backend-dev.onrender.com/api/courses/${courseId}`
        );
        setLessons(updatedResponse.data.data.lessons);
  
        toast.success("Xóa bài học thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        console.error("Lỗi khi xóa bài học:", error);
        toast.error("Không thể xóa bài học!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };
  

  return (
    <div className="flex-1 h-screen">
      <div className="flex-1 flex flex-col h-full py-6 px-3">
        <AdminNavbar />
        <div className="flex justify-between mb-4">
          <Link className="flex gap-2" onClick={() => navigate(-1)}>
            <MdNavigateBefore size={30} />
            <h2 className="text-lg font-bold mb-4">Back</h2>
          </Link>
          <Link
            className="hover:text-ficolor"
            to={`/admin/courses/${courseId}/lessons/add`}
            >
            <button className="cursor-pointer bg-scolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl">
              <FaPlus size={30} />
            </button>
          </Link>
        </div>

           {/* Ô tìm kiếm */}
           <div className="mb-4">
          <input
            type="text"
            placeholder="Search courses..."
            className="p-2 border rounded w-full focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


        <div className="flex-1 drop-shadow-lg">
          <div className="bg-white p-4 rounded-2xl">
            {loading ? ( 
              <p className="text-center">Loading lessons...</p>
            ) : (
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
                {filteredLessons.length > 0 ? (
                  filteredLessons.map((lesson) => (
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
                          to={`/admin/courses/${courseId}/lesson`}
                          className="p-2 border rounded"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/courses/${courseId}/lessons/edit/${lesson.id}`}
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
            )}
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
      <ToastContainer /> 

    </div>
  );
}
