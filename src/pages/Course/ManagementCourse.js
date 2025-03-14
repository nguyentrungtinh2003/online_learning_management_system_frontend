import { useEffect, useState } from "react";
import { FaUsers, FaBuffer, FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { MdNavigateNext, MdDeleteForever, MdNavigateBefore } from "react-icons/md";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { Link } from "react-router-dom";
import { getCourses,deleteCourse } from "../../services/courseapi";


export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        console.log("API Response:", data);

        if (Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Lọc các khóa học theo tên
  const filteredCourses = courses.filter(course =>
    course.courseName && course.courseName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id, name) => {
    const isConfirmed = window.confirm(`Bạn có chắc muốn xóa khóa học "${name}" không?`);
    if (isConfirmed) {
      try {
        const response = await deleteCourse(id);
        console.log("Delete API Response:", response);
  
        // Gọi API để lấy danh sách mới nhất
        const updatedCourses = await getCourses();
        setCourses(updatedCourses.data);

        alert("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa khóa học:", error);
        alert("Xóa thất bại, vui lòng thử lại.");
      }
    }
  };
  
  
  


  return (
    <div className="flex-1 h-screen">
      <div className="flex-1 flex flex-col h-full p-6">
        <AdminNavbar />
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <FaBuffer size={30} />
            <MdNavigateNext size={30} />
            <h2 className="text-lg font-bold mb-4">Course Management</h2>
          </div>
          <Link className="hover:text-ficolor" to="/admin/courses/add-course">
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
            className="p-2 border rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 drop-shadow-lg">
          <div className="bg-white p-4 rounded-2xl">
            {loading ? (
              <p className="text-center">Loading courses...</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-center font-bold">
                    <th className="p-2">ID</th>
                    <th className="p-2">Course Name</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Image</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Created Date</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <tr key={course.id} className="text-center">
                        <td className="p-2">{course.id}</td>
                        <td className="p-2">{course.courseName || "N/A"}</td>
                        <td className="p-2">{course.description || "No description"}</td>
                        <td className="p-2">
                          {course.img ? (
                            <img src={course.img} alt="course" className="w-8 h-8 rounded mx-auto" />
                          ) : (
                            "No image"
                          )}
                        </td>
                        <td className="p-2">{course.price || "Free"}</td>
                        <td className="p-2">
                          {course.date ? new Date(course.date).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-2">{course.deleted ? "False" : "True"}</td>
                     
                        <td className="p-2 flex justify-center gap-1">
                          <Link
                            to={`/admin/courses/edit-course/${course.id}`}
                            className="p-2 border rounded"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            className="p-2 border rounded"
                            onClick={() => handleDelete(course.id,course.courseName)}
                          >
                            <MdDeleteForever />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center p-4">
                        No courses found.
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
    </div>
  );
}
