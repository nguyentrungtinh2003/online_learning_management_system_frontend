import { useState } from "react";

const initialComments = [
  {
    id: 1,
    user: "John Doe",
    course: "CSS Basics",
    content: "Great course!",
    time: "2 minutes ago",
  },
  {
    id: 2,
    user: "Jane Smith",
    course: "React Advanced",
    content: "Needs more real-world examples.",
    time: "10 minutes ago",
  },
  {
    id: 3,
    user: "Alice Brown",
    course: "JavaScript Essentials",
    content: "Very helpful!",
    time: "30 minutes ago",
  },
];

export default function AdminComments() {
  const [comments, setComments] = useState(initialComments);

  const deleteComment = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">📢 Comment Management</h1>
      </nav>

      {/* New Comment Notifications */}
      <div className="mt-6 p-4 bg-white shadow rounded">
        <h2 className="text-lg font-semibold">New Notifications</h2>
        <ul className="mt-2">
          {comments.slice(0, 3).map((comment) => (
            <li key={comment.id} className="border-b py-2">
              <span className="font-medium">{comment.user}</span> just commented
              on the <span className="text-blue-500">{comment.course}</span>{" "}
              course
            </li>
          ))}
        </ul>
      </div>

      {/* Comment List */}
      <div className="mt-6 p-4 bg-white shadow rounded">
        <h2 className="text-lg font-semibold">Comment List</h2>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">Comment</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id} className="text-center">
                <td className="border p-2">{comment.user}</td>
                <td className="border p-2 text-blue-500">{comment.course}</td>
                <td className="border p-2">{comment.content}</td>
                <td className="border p-2">{comment.time}</td>
                <td className="border p-2">
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => deleteComment(comment.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
