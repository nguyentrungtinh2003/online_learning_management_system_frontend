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
    comments: [
      { id: 1, author: "Nguyễn An", content: "Tuyệt vời quá!" },
      { id: 2, author: "Mai Hoa", content: "Chúc mừng bạn!" },
      { id: 3, author: "Quốc Huy", content: "Dự án rất ấn tượng." },
      { id: 4, author: "Nguyễn An", content: "Tuyệt vời quá!" },
      { id: 5, author: "Mai Hoa", content: "Chúc mừng bạn!" },
      { id: 6, author: "Quốc Huy", content: "Dự án rất ấn tượng." },
      { id: 7, author: "Nguyễn An", content: "Tuyệt vời quá!" },
      { id: 8, author: "Mai Hoa", content: "Chúc mừng bạn!" },
      { id: 9, author: "Quốc Huy", content: "Dự án rất ấn tượng." },
      // Giả sử có 100 bình luận
    ],
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
    comments: [
      { id: 4, author: "Bảo Ngọc", content: "Thông tin hữu ích!" },
      { id: 5, author: "Đức Anh", content: "Rất đáng để theo dõi." },
    ],
    shares: 2000,
  },
];

export default function Blog() {
  const [data, setData] = useState(posts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [visibleComments, setVisibleComments] = useState(3);

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
            <button
              className="flex items-center space-x-1"
              onClick={() =>
                setSelectedPost(post.id === selectedPost ? null : post.id)
              }
            >
              <span className="w-5 h-5">💬</span>
              <span>{post.comments.length.toLocaleString()}</span>
            </button>
            <button className="flex items-center space-x-1">
              <span className="w-5 h-5">🔗</span>
              <span>{post.shares.toLocaleString()}</span>
            </button>
          </div>

          {selectedPost === post.id && (
            <div className="mt-2 p-2 border-t">
              <div className="max-h-60 overflow-y-auto">
                {post.comments.slice(0, visibleComments).map((comment) => (
                  <div key={comment.id} className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-2" />
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <p className="text-sm font-semibold">{comment.author}</p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {visibleComments < post.comments.length && (
                  <button
                    onClick={() => setVisibleComments(visibleComments + 3)}
                    className="text-blue-500 text-sm mt-2"
                  >
                    Xem thêm bình luận
                  </button>
                )}
              </div>
              <div className="flex items-center mt-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full" />
                <input
                  type="text"
                  placeholder="Viết bình luận..."
                  className="flex-1 p-2 ml-2 border rounded-full focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
