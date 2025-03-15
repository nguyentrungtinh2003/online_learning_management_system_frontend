import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";

const AddLesson = () => {
  const [lessonData, setLessonData] = useState({
    lessonName: "",
    description: "",
    date: "",
    courseId: 1, // ID của khóa học
    isDeleted: false,
  });
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);

  const handleChange = (e) => {
    setLessonData({ ...lessonData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append(
      "lesson",
      new Blob([JSON.stringify(lessonData)], { type: "application/json" })
    );
    if (img) formData.append("img", img);
    if (video) formData.append("video", video);

    try {
      const response = await axios.post(
        "https://codearena-backend-dev.onrender.com/api/lessons/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Thành công:", response.data);
      alert("Thêm bài học thành công!");
    } catch (error) {
      console.error("Lỗi:", error.response?.data || error.message);
      alert("Lỗi khi thêm bài học!");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-fit p-6">
      <AdminNavbar />
      <div className="flex gap-2">
        <FaBuffer size={30} />
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">Lesson Management</h2>
        <MdNavigateNext size={30} />
        <h2 className="text-lg font-bold mb-4">Add New Lesson</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          {[{ label: "Lesson Title:", name: "lessonName", type: "text" }].map(
            ({ label, name, type }) => (
              <div key={name} className="flex items-center space-x-4">
                <label className="w-1/4 text-gray-700 font-medium">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={lessonData[name]}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
                />
              </div>
            )
          )}
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Image:</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="flex-1 border rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Video:</label>
            <input
              type="file"
              onChange={handleVideoChange}
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
              value={lessonData.description}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            ></textarea>
          </div>
          <div className="flex items-center space-x-4">
            <label className="w-1/4 text-gray-700 font-medium">Date:</label>
            <input
              type="datetime-local"
              name="date"
              value={lessonData.date}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <Link
            to="/admin/courses/:id/lesson"
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
  );
};

export default AddLesson;
