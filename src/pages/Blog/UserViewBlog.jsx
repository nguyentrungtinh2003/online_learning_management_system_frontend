import { useEffect, useState } from "react";
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
import URL from "../../config/URLconfig";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Blog() {
  const [data, setData] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [visibleComments, setVisibleComments] = useState(3);
  const [hiddenPosts, setHiddenPosts] = useState([]);
  const [menuOpenPost, setMenuOpenPost] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState({
    blogName: "",
    description: "",
    user: { id: localStorage.getItem("id") },
  });
  const [newPostImage, setNewPostImage] = useState(null);
  const [newPostVideo, setNewPostVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    handleGetPosts();
  }, []);

  const handleGetPosts = () => {
    axios
      .get(`${URL}/blogs/all`, { withCredentials: true })
      .then((response) => {
        setData(response.data.data);
        setDataLoading(false);
      })
      .catch((error) => {
        console.log("error get blogs :" + error.message);
      });
  };

  const handleCreatePost = async (event) => {
    event.preventDefault(); // Ngăn chặn trang reload
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "blog",
      new Blob([JSON.stringify(newPostContent)], { type: "application/json" })
    );

    if (newPostImage) {
      formData.append("img", newPostImage);
    }

    if (newPostVideo) {
      formData.append("video", newPostVideo);
    }

    try {
      const response = await axios.post(`${URL}/blogs/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // Cho phép gửi cookies, session
      });
      console.log("Thành công:", response.data);
      // alert("Thêm khóa học thành công!");

      toast.success("Thêm blog thành công!", {
        position: "top-right",
        autoClose: 3000, // 4 giây
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Lỗi:", error.response?.data || error.message);
      // alert("Lỗi khi thêm khóa học!");
      toast.error("Không thể tạo blog !", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPostContent({
      ...newPostContent,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setNewPostImage(e.target.files[0]);
  };

  const handleVideoChange = (e) => {
    setNewPostVideo(e.target.files[0]);
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

  if (dataLoading) {
    return (
      <div className="flex h-full w-full place-items-center justify-center">
        <Spinner animation="border" variant="blue" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto flex-1 px-2 space-y-2 bg-white">
      <ToastContainer />
      {/* Form tạo bài viết */}
      {isCreatingPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-xl w-[40%] shadow-lg">
            <h2 className="text-lg border-b font-semibold w-full text-center pb-2">
              Tạo bài viết
            </h2>
            <div className="flex items-center gap-2 py-2">
              <img
                src={
                  localStorage.getItem("img") !== "null"
                    ? localStorage.getItem("img")
                    : "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">
                  {localStorage.getItem("username")}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <PiGlobeThin /> <span>Công khai</span>
                </div>
              </div>
            </div>

            <input
              className="w-full border-none focus:outline-none"
              name="blogName"
              type="text"
              placeholder="Nhập tên blog ?"
              value={newPostContent.blogName}
              onChange={handleChange}
            ></input>
            <textarea
              type="text"
              name="description"
              className="w-full border-none focus:outline-none"
              placeholder="Văn Tấn ơi, bạn đang nghĩ gì thế?"
              value={newPostContent.description}
              onChange={handleChange}
            ></textarea>
            <div className="w-full border p-4 rounded-lg flex flex-col justify-center items-center mt-2">
              <PiImageDuotone size={25} />
              <lable>Img</lable>
              <input
                name="img"
                type="file"
                onChange={handleImageChange}
              ></input>
              <lable>Video</lable>
              <input
                name="video"
                type="file"
                onChange={handleVideoChange}
              ></input>
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
                {loading ? (
                  <Spinner animation="border" variant="white" />
                ) : (
                  "Đăng"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex p-4 rounded-xl space-y-4 bg-white border flex-col">
        <div className="flex gap-2">
          <img
            src={
              localStorage.getItem("img") !== "null"
                ? localStorage.getItem("img")
                : "https://cdn-icons-png.flaticon.com/512/219/219970.png"
            }
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
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

      {Array.isArray(data) &&
        data.map((post) => (
          <div key={post.id}>
            {!hiddenPosts.includes(post.id) ? (
              <div className="pt-4 px-4 pb-2 border rounded-2xl border border-gray-200">
                <div className="flex justify-between">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <Link to={`/blog/${post.id}`}>
                      <div className="ml-2">
                        <h4 className="font-bold">{post.user.username}</h4>
                        <p className="text-sm text-gray-500">{post.date}</p>
                      </div>
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setMenuOpenPost(
                          menuOpenPost === post.id ? null : post.id
                        )
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
                <h2 className="mb-2">{post.blogName}</h2>
                <p className="mb-2">{post.description}</p>
                {post.img && (
                  <img
                    src={post.img}
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
                    <span>{post.views ? post.views : 0}</span>
                  </button>
                  <button
                    className="flex items-center space-x-1"
                    onClick={() =>
                      setSelectedPost(post.id === selectedPost ? null : post.id)
                    }
                  >
                    <PiChatCircle size={25} />
                    <span>{post.blogComments ? post.blogComments : 0}</span>
                  </button>
                  <button className="flex items-center space-x-1">
                    <PiShareFatLight size={25} />
                    {/* <span>{post.shares.toLocaleString()}</span> */}
                  </button>
                </div>

                {/* Hiển thị bình luận khi bấm vào comment */}
                {selectedPost === post.id && (
                  <div className="mt-2 p-2 border-t">
                    <div className="max-h-60 overflow-y-auto">
                      {post.blogComments
                        .slice(0, visibleComments)
                        .map((comment) => (
                          <div
                            key={comment.id}
                            className="flex items-center mb-2"
                          >
                            <div className="w-8 h-8 bg-gray-300 rounded-full mr-2" />
                            <div className="bg-gray-100 p-2 rounded-lg">
                              <p className="text-sm font-semibold">
                                {comment.user.username}
                              </p>
                              <img
                                src={comment.user.img}
                                alt="Post"
                                className="w-full h-60 object-cover rounded-lg mb-2"
                              />
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      {visibleComments < post.blogComments.length && (
                        <button
                          onClick={() =>
                            setVisibleComments(visibleComments + 3)
                          }
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
