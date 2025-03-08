import { useState } from "react";
import { FaSearch, FaCog, FaEdit, FaEye } from "react-icons/fa";
import {
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
} from "react-icons/md";

const courses = [
  {
    id: "001",
    name: "Basic JavaScript",
    description: "This course helps you grasp...",
    image: "img1.jpg",
    price: "30€",
    createdAt: "11/01/2023",
    status: "Free",
  },
  {
    id: "002",
    name: "Python for Beginners",
    description: "Learn to write Python code...",
    image: "img2.jpg",
    price: "60€",
    createdAt: "12/03/2023",
    status: "Paid",
  },
  {
    id: "003",
    name: "Master Java",
    description: "An advanced Java course...",
    image: "img3.jpg",
    price: "50€",
    createdAt: "17/05/2023",
    status: "Free",
  },
];

export default function CourseManagement() {
  const [search, setSearch] = useState("");
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col h-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 flex justify-center">
            <div className="flex w-[40%] items-center gap-2 px-3 py-2 rounded-2xl bg-gray-100">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="focus:outline-none bg-gray-100"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Welcome back!</span>
            <FaCog className="cursor-pointer" />
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <p>Admin</p>
          </div>
        </div>
        <div className="flex gap-2 items-center mb-4">
          <h2 className="text-lg font-bold">Course Management</h2>
        </div>
        <div className="bg-gray-100 p-4 rounded-2xl">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 text-center font-bold">
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
              {filteredCourses.map((course) => (
                <tr key={course.id} className="text-center">
                  <td className="p-2">{course.id}</td>
                  <td className="p-2">{course.name}</td>
                  <td className="p-2">{course.description}</td>
                  <td className="p-2">
                    <img
                      src={course.image}
                      alt="course"
                      className="w-8 h-8 rounded mx-auto"
                    />
                  </td>
                  <td className="p-2">{course.price}</td>
                  <td className="p-2">{course.createdAt}</td>
                  <td className="p-2">{course.status}</td>
                  <td className="p-2 flex justify-center gap-1">
                    <button className="p-2 border rounded">
                      <FaEye />
                    </button>
                    <button className="p-2 border rounded">
                      <FaEdit />
                    </button>
                    <button className="p-2 border rounded">
                      <MdDeleteForever />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <p>Showing 1 of 4 pages</p>
          <div className="space-x-2">
            <button className="bg-gray-300 p-1">
              <MdNavigateBefore size={30} />
            </button>
            <button className="bg-gray-300 p-1">
              <MdNavigateNext size={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
