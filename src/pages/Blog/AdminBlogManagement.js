import { useState } from "react";
import { PlusCircle, Trash2, Edit } from "lucide-react";

const initialPosts = [
  {
    id: 1,
    title: "Introduction to Real Estate",
    category: "Investment",
    content: "Basic guide on real estate investments.",
  },
  {
    id: 2,
    title: "Top 10 Property Insurance Tips",
    category: "Insurance",
    content: "Important things to know about property insurance.",
  },
];

export default function BlogAdmin() {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState({
    title: "",
    category: "",
    content: "",
  });

  const addPost = () => {
    if (!newPost.title || !newPost.content) return;
    setPosts([...posts, { id: posts.length + 1, ...newPost }]);
    setNewPost({ title: "", category: "", content: "" });
  };

  const deletePost = (id) => setPosts(posts.filter((post) => post.id !== id));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Blog Management</h1>

      {/* Add New Post */}
      <div className="p-4 border border-gray-300 rounded-lg mb-6">
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={newPost.category}
          onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <textarea
          placeholder="Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        ></textarea>
        <button
          onClick={addPost}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PlusCircle size={16} /> Add Post
        </button>
      </div>

      {/* List of Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 border border-gray-300 rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-600">Category: {post.category}</p>
              <p className="text-gray-700">{post.content}</p>
            </div>
            <div className="flex gap-2">
              <button className="border border-yellow-500 text-yellow-500 px-3 py-1 rounded flex items-center gap-2">
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={() => deletePost(post.id)}
                className="border border-red-500 text-red-500 px-3 py-1 rounded flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
