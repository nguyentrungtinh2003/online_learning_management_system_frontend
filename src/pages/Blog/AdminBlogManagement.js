import { useState } from "react";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import {
  MdNavigateNext,
  MdDeleteForever,
  MdNavigateBefore,
  MdForum,
} from "react-icons/md";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import { Link } from "react-router-dom";

const initialBlogs = [
  {
    id: "001",
    title: "How blogs boost work",
    description: "Tips & tricks for using blogs...",
    image: "img1.jpg",
    video: "video1.mp4",
    createdAt: "11/01/2023",
    interactions: 325,
    views: 700,
    author: "Yuki Tam",
  },
  {
    id: "002",
    title: "Python for Beginners",
    description: "Let's write Python codes...",
    image: "img2.jpg",
    video: "video2.mp4",
    createdAt: "12/03/2023",
    interactions: 203,
    views: 512,
    author: "Tom Kha",
  },
  {
    id: "003",
    title: "Master Java",
    description: "An advanced Java tutorial...",
    image: "img3.jpg",
    video: "video3.mp4",
    createdAt: "17/05/2023",
    interactions: 121,
    views: 715,
    author: "Alice Tran",
  },
];

export default function BlogManagement() {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [search, setSearch] = useState("");

  const handleDelete = (id) => {
    const updatedBlogs = blogs.filter((blog) => blog.id !== id);
    setBlogs(updatedBlogs);
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 h-screen">
      <div className="flex-1 flex flex-col h-full py-6 px-3">
        <AdminNavbar />
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <MdForum size={30} />
            <MdNavigateNext size={30} />
            <h2 className="text-lg font-bold mb-4">Blog Management</h2>
          </div>
          <Link
            className="text-white hover:text-ficolor cursor-pointer bg-scolor px-8 drop-shadow-lg hover:scale-105 py-2 rounded-xl"
            to="/admin/blog/add-blog"
          >
            <FaPlus size={30} />
          </Link>
        </div>
        <div className="flex-1 drop-shadow-lg">
          <div className="bg-white p-4 rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className=" text-center font-bold">
                  <th className="p-2">ID</th>
                  <th className="p-2">Blog Title</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Video</th>
                  <th className="p-2 whitespace-nowrap">Created Date</th>
                  <th className="p-2">Interactions</th>
                  <th className="p-2">Views</th>
                  <th className="p-2">Author</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="text-center">
                    <td className="p-2">{blog.id}</td>
                    <td className="p-2">{blog.title}</td>
                    <td className="p-2">{blog.description}</td>
                    <td className="p-2">
                      <img
                        src={blog.image}
                        alt="blog"
                        className="w-8 h-8 rounded mx-auto"
                      />
                    </td>
                    <td className="p-2">{blog.video}</td>
                    <td className="p-2">{blog.createdAt}</td>
                    <td className="p-2">{blog.interactions}</td>
                    <td className="p-2">{blog.views}</td>
                    <td className="p-2">{blog.author}</td>
                    <td className="p-2 flex justify-center gap-1">
                      <Link
                        to="/admin/blog/edit-blog"
                        className="p-2 border rounded hover:text-fcolor hover:scale-105"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className="p-2 border rounded text-red-600 hover:scale-105"
                        onClick={() => handleDelete(blog.id)}
                      >
                        <MdDeleteForever />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-white flex justify-between mt-4">
          <p>Showing 1 of 4 pages</p>
          <div className="space-x-2">
            <button className="bg-scolor p-1 hover:scale-105 duration-500">
              <MdNavigateBefore size={30} />
            </button>
            <button className="bg-scolor p-1 hover:scale-105 duration-500 ">
              <MdNavigateNext size={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
