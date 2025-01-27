import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const courses = [
  {
    id: 1,
    name: "Khóa học React cơ bản",
    status: "Hoạt động",
    date: "2025-01-01",
  },
  {
    id: 2,
    name: "Khóa học Node.js nâng cao",
    status: "Tạm ngừng",
    date: "2025-01-10",
  },
  {
    id: 3,
    name: "Khóa học TailwindCSS",
    status: "Hoạt động",
    date: "2025-01-20",
  },
];

const CourseTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal

  const handleView = (id) => {
    alert(`Xem chi tiết khóa học ID: ${id}`);
  };

  const handleEdit = (id) => {
    alert(`Chỉnh sửa khóa học ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Xóa khóa học ID: ${id}`);
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    alert("Khóa học mới đã được thêm!");
    setIsModalOpen(false); // Tắt modal sau khi thêm
  };

  return (
    <div className="p-2 w-full flex-1">
      <div className="h-fit flex items-center justify-between w-full mb-4">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <button
          onClick={() => setIsModalOpen(true)} // Mở modal
          className="hover:bg-slate-50 flex items-center space-x-2 border-2 py-1 px-4 rounded-lg"
        >
          <IoIosAdd />
          <p>New Course</p>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-500">
          <thead>
            <tr className="border-b font-semibold text-slate-600">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Course Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 text-gray-700 border-b">
                  {course.id}
                </td>
                <td className="px-6 py-4 text-gray-700 border-b">
                  {course.name}
                </td>
                <td className="px-6 py-4 text-gray-700 border-b">
                  <span
                    className={`px-3 py-1 text-sm text-white rounded-full ${
                      course.status === "Hoạt động"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700 border-b">
                  {course.date}
                </td>
                <td className="px-6 py-4 text-gray-700 border-b">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(course.id)}
                      className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-100"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEdit(course.id)}
                      className="px-4 py-2 text-sm text-yellow-600 border border-yellow-600 rounded hover:bg-yellow-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <IoClose size={24} />
            </button>

            {/* Form */}
            <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="flex w-fit space-x-4">
                <div className="w-[40%] justify-between">
                  {/* Course Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Course Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter course name"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  {/* Course Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <select
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="Hoạt động">Hoạt động</option>
                      <option value="Tạm ngừng">Tạm ngừng</option>
                    </select>
                  </div>

                  {/* Upload Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="w-[60%]">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Description
                    </label>
                    <textarea
                      placeholder="Enter course description"
                      rows="3"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    ></textarea>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Course Price (VNĐ)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter course price"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                      min="0"
                      required
                    />
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Discount (%) (optional)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter discount percentage"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Course
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTable;
