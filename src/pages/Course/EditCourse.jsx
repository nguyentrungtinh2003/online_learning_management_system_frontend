import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import URL from "../../config/URLconfig";

const EditCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [course, setCourse] = useState({
    courseName: "",
    description: "",
    price: "",
    img: "",
    courseEnum: "FREE",
    userId: localStorage.getItem("id")
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://codearena-backend-dev.onrender.com/api/courses/${id}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setCourse(data.data);
      })
      .catch(() => setError("Không thể tải dữ liệu khóa học"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "price") {
      const parsedPrice = parseFloat(value);
      setCourse((prev) => ({
        ...prev,
        price: value,
        courseEnum: parsedPrice === 0 ? "FREE" : "PAID",
      }));
    }
  };

  const handleEnumChange = (e) => {
    const selectedType = e.target.value;

    setCourse((prev) => {
      let newPrice = prev.price;

      if (selectedType === "FREE") {
        newPrice = "0";
      } else if (parseFloat(prev.price) <= 0) {
        newPrice = "1";
      }

      return {
        ...prev,
        courseEnum: selectedType,
        price: newPrice,
      };
    });
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(course.price) <= 0 && course.courseEnum === "PAID") {
      toast.error("❌ Vui lòng nhập giá lớn hơn 0 cho khóa học trả phí.", { autoClose: 1000 });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append(
      "course",
      new Blob([JSON.stringify(course)], { type: "application/json" })
    );
    if (file) formData.append("img", file);

    try {
      const response = await axios.put(
        `${URL}/teacher/courses/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success("Cập nhật khóa học thành công!", { autoClose: 1000 });
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      toast.error("Không thể cập nhật khóa học!", { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = () => {
    window.location.href = `/admin/courses/${id}/lesson`;
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex dark:text-darkText gap-2">
        <FaBuffer size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">Course Management</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">Edit Course</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-wcolor dark:bg-darkSubbackground dark:text-darkText text-gray-700 p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">Course Title:</label>
            <input
              type="text"
              name="courseName"
              value={course.courseName}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 dark:bg-darkSubbackground dark:border-darkBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">Price:</label>
            <input
              type="number"
              name="price"
              value={course.price}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 dark:bg-darkSubbackground dark:border-darkBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">Image:</label>
            <div className="flex-1">
              {course.img && (
                <img
                  src={course.img}
                  alt="Course"
                  className="w-40 h-40 object-cover rounded-md mb-2"
                />
              )}
              <input
                type="file"
                onChange={handleFileChange}
                className="border-2 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground dark:bg-darkSubbackground dark:border-darkBorder rounded-lg px-3 py-2 w-full"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">Description:</label>
            <textarea
              name="description"
              rows={3}
              value={course.description}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 dark:bg-darkSubbackground dark:border-darkBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            ></textarea>
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">Type:</label>
            <select
              name="courseEnum"
              value={course.courseEnum}
              onChange={handleEnumChange}
              className="flex-1 px-4 py-2 border-2 dark:bg-darkSubbackground dark:border-darkBorder rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            >
              <option value="FREE">Free</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Link
            onClick={() => navigate(-1)}
            className="px-6 py-2 border-2 border-sicolor dark:text-darkText text-ficolor rounded-lg hover:bg-opacity-80"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg ${loading ? "bg-gray-400" : "bg-scolor text-ficolor hover:bg-opacity-80"}`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditCourse;
