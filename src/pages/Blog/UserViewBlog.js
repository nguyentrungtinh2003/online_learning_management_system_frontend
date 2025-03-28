import { useState } from "react";
import { PiDotsThreeBold, PiBackspace } from "react-icons/pi";

const posts = [
  {
    id: 1,
    author: "Văn Tân",
    time: "15 phút trước",
    content:
      "Nguyễn Trung Tín - Thần đồng IT Việt Nam 2025 với dự án AI khiến cả Google phải dè chừng...",
    image: "/code-image.png",
    likes: 620000,
    comments: 30000,
    shares: 1000000,
  },
  {
    id: 2,
    author: "Lê Minh",
    time: "30 phút trước",
    content:
      "Công nghệ blockchain đang thay đổi thế giới tài chính như thế nào? Những ứng dụng thực tế...",
    image: "/blockchain.png",
    likes: 50000,
    comments: 1000,
    shares: 2000,
  },
];

export default function Blog() {
  const [data, setData] = useState(posts);

  return (
    <div className="h-screen overflow-y-auto flex-1 mx-auto p-4 space-y-2 bg-white">
      <div className="flex p-4 bg-white border flex-col">
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
          <input
            className="focus:outline-none flex-1 px-4 bg-focolor rounded-2xl"
            placeholder="Bạn đang nghĩ gì thế?"
          />
        </div>
        <div className="flex py-4 gap-10">
            <p>Ảnh / Video</p>
            <p>Cảm xúc / Hoạt động</p>
        </div>
      </div>
      {data.map((post) => (
        <div
          key={post.id}
          className="p-4 border rounded-2xl border border-gray-200"
        >
          <div className="flex justify-between">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div className="ml-2">
                <h4 className="font-bold">{post.author}</h4>
                <p className="text-sm text-gray-500">{post.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PiDotsThreeBold size={25} />
              <PiBackspace size={25} />
            </div>
          </div>
          <p className="mb-2">{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-full h-60 object-cover rounded-lg mb-2"
            />
          )}
          <div className="flex justify-between text-gray-600 text-sm border-t-2 pt-2">
            <button className="flex items-center space-x-1">
              <span className="w-5 h-5">❤️</span>
              <span>{post.likes.toLocaleString()}</span>
            </button>
            <button className="flex items-center space-x-1">
              <span className="w-5 h-5">💬</span>
              <span>{post.comments.toLocaleString()}</span>
            </button>
            <button className="flex items-center space-x-1">
              <span className="w-5 h-5">🔗</span>
              <span>{post.shares.toLocaleString()}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
