import { useState } from "react";
import {
  PiDotsThreeBold,
  PiBackspace,
  PiHeartFill,
  PiChatCircle,
  PiShareFatLight,
  PiPaperPlaneRightFill,
  PiEyeClosed,
  PiArrowsClockwise,
  PiGlobeThin,
  PiImageDuotone,
} from "react-icons/pi";

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
      { id: 6, author: "Bảo Ngọc", content: "Thông tin hữu ích!" },
      { id: 7, author: "Đức Anh", content: "Rất đáng để theo dõi." },
      { id: 8, author: "Bảo Ngọc", content: "Thông tin hữu ích!" },
      { id: 9, author: "Đức Anh", content: "Rất đáng để theo dõi." },
      { id: 10, author: "Bảo Ngọc", content: "Thông tin hữu ích!" },
      { id: 11, author: "Đức Anh", content: "Rất đáng để theo dõi." },
    ],
    shares: 2000,
  },
  {
    id: 3,
    author: "Lê Đức",
    time: "30 phút trước",
    content:
      "Công nghệ blockchain đang thay đổi thế giới tài chính như thế nào? Những ứng dụng thực tế...",
    image: "/blockchain.png",
    likes: 50000,
    comments: [
      { id: 12, author: "Bảo Ngọc", content: "Thông tin hữu ích!" },
      { id: 13, author: "Đức Anh", content: "Rất đáng để theo dõi." },
      { id: 14, author: "Bảo Ngọc", content: "Thông tin hữu ích!" },
    ],
    shares: 2000,
  },
];

export default function Blog() {
  const [data, setData] = useState(posts);
  const [likedPosts, setLikedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [visibleComments, setVisibleComments] = useState(3);
  const [hiddenPosts, setHiddenPosts] = useState([]);
  const [menuOpenPost, setMenuOpenPost] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState("");

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    console.log("Bài viết mới:", {
      content: newPostContent,
      image: newPostImage,
    });
    setIsCreatingPost(false);
    setNewPostContent("");
    setNewPostImage("");
  };

  const toggleLike = (postId) => {
    setLikedPosts((prevLikedPosts) =>
      prevLikedPosts.includes(postId)
        ? prevLikedPosts.filter((id) => id !== postId)
        : [...prevLikedPosts, postId]
    );
  };

  const hidePost = (postId) => {
    setHiddenPosts((prevHiddenPosts) => [...prevHiddenPosts, postId]);
  };

  const restorePost = (postId) => {
    setHiddenPosts((prevHiddenPosts) =>
      prevHiddenPosts.filter((id) => id !== postId)
    );
  };

  const reportPost = (postId) => {
    alert("Bài viết đã được báo cáo.");
    setMenuOpenPost(null); // Đóng menu sau khi báo cáo
  };

  return (
    <div className="h-screen overflow-y-auto flex-1 mx-auto p-4 space-y-2 bg-white">
      {/* Form tạo bài viết */}
      {isCreatingPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-xl w-[40%] shadow-lg">
            <h2 className="text-lg border-b font-semibold w-full text-center pb-2">
              Tạo bài viết
            </h2>
            <div className="flex items-center gap-2 py-2">
              <img
                src="https://via.placeholder.com/40"
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">Nguyễn Văn Tấn</p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <PiGlobeThin /> <span>Công khai</span>
                </div>
              </div>
            </div>
            <textarea
              className="w-full border-none focus:outline-none"
              placeholder="Văn Tấn ơi, bạn đang nghĩ gì thế?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            ></textarea>
            <div className="w-full border p-4 rounded-lg flex flex-col justify-center items-center mt-2">
              <PiImageDuotone size={25} />
              <span className="">Thêm ảnh/video</span>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setIsCreatingPost(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handleCreatePost}
              >
                Đăng
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex p-4 rounded-xl space-y-4 bg-white border flex-col">
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
          <input
            className="focus:outline-none flex-1 px-4 bg-focolor rounded-2xl"
            placeholder="Bạn đang nghĩ gì thế?"
            onClick={() => setIsCreatingPost(true)}
          />
        </div>
        <div className="flex gap-2">
          <p
            className="cursor-pointer hover:bg-focolor border px-4 py-2 rounded-2xl"
            onClick={() => setIsCreatingPost(true)}
          >
            Ảnh / Video
          </p>
          <p
            className="cursor-pointer hover:bg-focolor border px-4 py-2 rounded-2xl"
            onClick={() => setIsCreatingPost(true)}
          >
            Cảm xúc / Hoạt động
          </p>
        </div>
      </div>

      {data.map((post) => (
        <div key={post.id}>
          {!hiddenPosts.includes(post.id) ? (
            <div className="pt-4 px-4 pb-2 border rounded-2xl border border-gray-200">
              <div className="flex justify-between">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  <div className="ml-2">
                    <h4 className="font-bold">{post.author}</h4>
                    <p className="text-sm text-gray-500">{post.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setMenuOpenPost(menuOpenPost === post.id ? null : post.id)
                    }
                  >
                    <PiDotsThreeBold size={25} />
                  </button>
                  {menuOpenPost === post.id && (
                    <div className="absolute right-40 mt-2 bg-white border shadow-md rounded-lg p-2">
                      <button
                        className="w-full whitespace-nowrap text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                        onClick={() => reportPost(post.id)}
                      >
                        Báo cáo bài viết
                      </button>
                    </div>
                  )}
                  <button onClick={() => hidePost(post.id)}>
                    <PiBackspace size={25} />
                  </button>
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
                <button
                  className="flex items-center gap-2"
                  onClick={() => toggleLike(post.id)}
                >
                  <PiHeartFill
                    size={25}
                    color={likedPosts.includes(post.id) ? "red" : "gray"}
                  />
                  <span>{post.likes.toLocaleString()}</span>
                </button>
                <button
                  className="flex items-center space-x-1"
                  onClick={() =>
                    setSelectedPost(post.id === selectedPost ? null : post.id)
                  }
                >
                  <PiChatCircle size={25} />
                  <span>{post.comments.length.toLocaleString()}</span>
                </button>
                <button className="flex items-center space-x-1">
                  <PiShareFatLight size={25} />
                  <span>{post.shares.toLocaleString()}</span>
                </button>
              </div>

              {/* Hiển thị bình luận khi bấm vào comment */}
              {selectedPost === post.id && (
                <div className="mt-2 p-2 border-t">
                  <div className="max-h-60 overflow-y-auto">
                    {post.comments.slice(0, visibleComments).map((comment) => (
                      <div key={comment.id} className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2" />
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <p className="text-sm font-semibold">
                            {comment.author}
                          </p>
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
                  <div className="flex items-center gap-2 mt-2 border-t pt-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    <input
                      type="text"
                      placeholder="Viết bình luận..."
                      className="flex-1 px-3 py-2 border rounded-full focus:outline-none"
                    />
                    <PiPaperPlaneRightFill className="" size={25} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-3 border flex justify-between items-center rounded-xl">
              <span className="flex items-center gap-2">
                <PiEyeClosed size={25} />
                Bài viết đã được ẩn
              </span>
              <button
                onClick={() => restorePost(post.id)}
                className="bg-scolor text-wcolor px-4 py-2 rounded-lg flex gap-2"
              >
                <PiArrowsClockwise size={25} />
                Hoàn tác
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
