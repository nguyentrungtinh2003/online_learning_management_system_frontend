import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";

const EditCourse = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState({
    courseId: "",
    createdDate: "",
    courseName: "",
    description: "",
    price: "",
    type: "",
    lecturer: "",
  });
  const [img, setImg] = useState(null);

  useEffect(() => {
    axios
      .get(`${URL}/api/courses/${id}`)
      .then((response) => {
        const course = response.data;
        setCourseData({
          courseId: course.courseId,
          createdDate: course.createdDate,
          courseName: course.courseName,
          description: course.description,
          price: course.price,
          type: course.type,
          lecturer: course.lecturer,
        });
      })
      .catch((error) => {
        console.error("Error fetching course:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append(
      "course",
      new Blob([JSON.stringify(courseData)], { type: "application/json" })
    );
    if (img) {
      data.append("img", img);
    }
    axios
      .put(`${URL}/api/courses/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        alert("Course updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating course:", error);
      });
  };

  return (
    <div className="flex-1">
      <div className="flex-1 flex flex-col h-fit p-6">
        <AdminNavbar />
        <div className="flex gap-2">
          <FaBuffer size={30} />
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold mb-4">Course Management</h2>
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold mb-4">Edit Course</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                Course ID:
              </label>
              <input
                type="text"
                name="courseId"
                value={courseData.courseId}
                readOnly
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                Created Date:
              </label>
              <input
                type="text"
                name="createdDate"
                value={courseData.createdDate}
                readOnly
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                Course Title:
              </label>
              <input
                type="text"
                name="courseName"
                value={courseData.courseName}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">Image:</label>
              <input
                type="file"
                name="img"
                onChange={handleImageChange}
                className="flex-1 border rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                Description:
              </label>
              <textarea
                name="description"
                rows={3}
                value={courseData.description}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              ></textarea>
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">Price:</label>
              <input
                type="number"
                name="price"
                value={courseData.price}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">Type:</label>
              <select
                name="type"
                value={courseData.type}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              >
                <option>Select Type</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Link
              to="/admin/courses"
              className="px-6 py-2 border-2 border-sicolor text-ficolor rounded-lg hover:bg-opacity-80"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-scolor text-ficolor rounded-lg hover:bg-opacity-80"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
