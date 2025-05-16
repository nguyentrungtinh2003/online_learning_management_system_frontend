import { useEffect, useRef, useState } from "react";
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
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import URLSocket from "../../config/URLsocket";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Blog() {
  const { t } = useTranslation("blog"); // assuming the namespace is "blog"

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
    userId: parseInt(localStorage.getItem("id")),
  });
  const [newPostImage, setNewPostImage] = useState(null);
  const [newPostVideo, setNewPostVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [content, setcontent] = useState("");
  const [currentLikePost, setCurrentLikePost] = useState(null);
  const [likedUsersMap, setLikedUsersMap] = useState({});

  const userId = parseInt(localStorage.getItem("id"));
  const [searchParams] = useSearchParams();
  const scrollToId = searchParams.get("scrollTo");

  const navigate = useNavigate();

  const requireLogin = () => {
    const userId = localStorage.getItem("id");
    const role = localStorage.getItem("role");

    if (!userId || !role) {
      toast.warn(<p>{t("toastMessage")}</p>, {
        position: "top-right",
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate("/login"); // chuyển hướng sau 2 giây
      }, 2000);

      return false;
    }

    return true;
  };

  // Tạo map để lưu ref cho từng post
  const postRefs = useRef({});
  console.log("User id " + userId);

  useEffect(() => {
    handleGetPosts();
  }, []);

  useEffect(() => {
    handleGetPosts();
    if (selectedPost) {
      handleGetComments();
    }

    const socket = new SockJS(`${URLSocket}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/blog/${selectedPost}`, (message) => {
          const comment = JSON.parse(message.body);
          setComments((prev) => [...prev, comment]);
        });
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [selectedPost]);

  //like
  useEffect(() => {
    const socket = new SockJS(`${URLSocket}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      if (selectedPost) {
        client.subscribe(`/topic/blog/${selectedPost}`, (message) => {
          const comment = JSON.parse(message.body);
          setComments((prev) => [...prev, comment]);
        });
      }

      if (currentLikePost) {
        client.subscribe(`/topic/like/${currentLikePost}`, (message) => {
          const updateUserIds = JSON.parse(message.body);
          setLikedUsersMap((prev) => ({
            ...prev,
            [currentLikePost]: updateUserIds,
          }));
        });

        client.subscribe(`/topic/un-like/${currentLikePost}`, (message) => {
          const updateUserIds = JSON.parse(message.body);
          setLikedUsersMap((prev) => ({
            ...prev,
            [currentLikePost]: updateUserIds,
          }));
        });
      }
    };

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [selectedPost, currentLikePost]);

  //scrollToId
  useEffect(() => {
    if (scrollToId && postRefs.current[scrollToId]) {
      postRefs.current[scrollToId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [data, scrollToId]);

  const handleGetPosts = () => {
    axios
      .get(`${URL}/blogs/all`, { withCredentials: true })
      .then((response) => {
        const posts = response.data.data;
        setData(posts);
        const initialLikedMap = {};
        posts.forEach((post) => {
          initialLikedMap[post.id] = post.likedUsers.map((user) => user.id); // hoặc post.likedUsers nếu là danh sách id
        });

        setLikedUsersMap(initialLikedMap);
        setDataLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          console.log("Status code:", err.response?.status);
          console.log("Response data:", err.response?.data);
          console.log("Full error:", err);
        }
        console.log("error get blogs :" + err.message);
      });
  };

  const handleGetComments = () => {
    axios
      .get(`${URL}/blog-comments/blog/${selectedPost}`, {
        withCredentials: true,
      })
      .then((response) => {
        setComments(response.data.data);
        setDataLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          console.log("Status code:", err.response?.status);
          console.log("Response data:", err.response?.data);
          console.log("Full error:", err);
        }
        console.log("error get blogs :" + err.message);
      });
  };

  const handleCreatePost = async (event) => {
    event.preventDefault(); // Ngăn chặn trang reload

    if (!requireLogin()) return;

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

  const addBlogComment = (blogId, userId, content) => {
    if (!requireLogin()) return;
    axios
      .post(
        `${URL}/blog-comments/add`,
        { blogId, userId, content },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("add blog comment success");
      })
      .catch((error) => {
        console.log("Error add blog comment");
      });
  };

  const deleteBlogComment = (blogCommentId, userId) => {
    axios
      .delete(
        `${URL}/blog-comments/delete/${blogCommentId}/${parseInt(userId)}`,

        { withCredentials: true }
      )
      .then((response) => {
        console.log("Delete blog comment success");
        handleGetComments();
      })
      .catch((error) => {
        console.log("Error delete blog comment");
      });
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

  const postLike = (blogId) => {
    console.log("BlogId : " + blogId + " UserId " + userId);
    setCurrentLikePost(blogId);
    axios
      .post(
        `${URL}/blogs/like/${blogId}/${userId}`, // Sử dụng backtick đúng
        {}, // Kiểm tra lại body nếu cần truyền thêm dữ liệu
        {
          withCredentials: true, // Cung cấp cookie nếu cần thiết
        }
      )
      .then((response) => {
        setLikedUsersMap((prev) => ({
          ...prev,
          [blogId]: response.data.data,
        }));
        console.log("Like success !" + response.data.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log("Lỗi:", error.response.data); // Hiển thị lỗi cụ thể từ backend
        }
      });
  };

  const postUnLike = (blogId) => {
    setCurrentLikePost(blogId);
    axios
      .post(
        `${URL}/blogs/unlike/${blogId}/${userId}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setLikedUsersMap((prev) => ({
          ...prev,
          [blogId]: response.data.data,
        }));
        console.log("Un Like success !");
      })
      .catch((error) => {
        if (error.response) {
          console.log("Lỗi:", error.response.data); // Hiển thị lỗi cụ thể từ backend
        }
      });
  };

  const handleLike = (postId, post) => {
    if (!requireLogin()) return;

    const isLiked = likedUsersMap[post.id]?.includes(userId);
    isLiked ? postUnLike(postId) : postLike(postId);
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
  const handleOpenCreatePost = () => {
    if (!requireLogin()) return;
    setIsCreatingPost(true);
  };

  if (dataLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full dark:text-darkSubtext overflow-y-auto flex-1 flex flex-col">
      {/* Form tạo bài viết */}
      {isCreatingPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-wcolor dark:bg-darkBackground border-1 dark:border-darkBorder dark:text-darkText p-4 rounded-xl w-[40%] shadow-lg">
            <h2 className="text-lg border-b dark:border-darkBorder font-semibold w-full text-center pb-2">
              {t("createPost")}
            </h2>
            <div className="flex items-center gap-2 py-2">
              <img
                src={
                  localStorage.getItem("img") !== "null"
                    ? localStorage.getItem("img")
                    : "/user.png"
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">
                  {localStorage.getItem("username")}
                </p>
                <div className="flex items-center gap-1 text-sm dark:text-darkText text-gray-500">
                  <PiGlobeThin /> <span>{t("public")}</span>
                </div>
              </div>
            </div>

            <div className="border-1 p-2 rounded-lg dark:border-darkBorder">
              <input
                className="w-full border-none focus:outline-none bg-transparent"
                name="blogName"
                type="text"
                placeholder={t("placeholderTitle")}
                value={newPostContent.blogName}
                onChange={handleChange}
              ></input>
              <textarea
                name="description"
                className="w-full border-none focus:outline-none bg-transparent"
                placeholder={t("placeholderDescription", {
                  username: localStorage.getItem("username"),
                })}
                value={newPostContent.description}
                onChange={handleChange}
              />
            </div>
            <div className="w-full border-1 dark:border-darkBorder p-4 rounded-lg flex items-center mt-2">
              <div className="flex flex-col items-center w-fit">
                <PiImageDuotone size={25} />
                <lable>{t("image")}</lable>
                <input
                  name="img"
                  type="file"
                  onChange={handleImageChange}
                ></input>
              </div>
              <div className="flex flex-col items-center w-fit">
                <lable>Video</lable>
                <input
                  name="video"
                  type="file"
                  onChange={handleVideoChange}
                ></input>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-darkSubbackground rounded-lg"
                onClick={() => setIsCreatingPost(false)}
              >
                {t("cancel")}
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handleCreatePost}
              >
                {loading ? (
                  <Spinner animation="border" variant="blue" />
                ) : (
                  <p>{t("publish")}</p>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex p-4 rounded-xl space-y-4 border-1 dark:border-darkBorder flex-col">
        <div className="flex lg:h-12 h-16 items-center gap-2">
          <img
            src={
              localStorage.getItem("img") !== "null"
                ? localStorage.getItem("img")
                : "/user.png"
            }
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <input
            className="focus:outline-none h-10 border-2 dark:border-darkBorder placeholder-darkSubtext flex-1 px-4 bg-focolor dark:bg-darkSubbackground rounded-2xl"
            placeholder={t("placeholderDescription", {
              username: localStorage.getItem("username") || "Hello ",
            })}
            onClick={() => handleOpenCreatePost()}
          />
        </div>
        <div className="flex gap-2 dark:text-darkText">
          <button
            className="cursor-pointer hover:bg-focolor border-1 dark:border-darkBorder dark:hover:bg-darkSubbackground px-4 py-2 rounded-2xl"
            onClick={() => handleOpenCreatePost()}
          >
            {t("image")}/{t("video")}
          </button>
          <button
            className="cursor-pointer hover:bg-focolor border-1 dark:border-darkBorder dark:hover:bg-darkSubbackground px-4 py-2 rounded-2xl"
            onClick={() => handleOpenCreatePost()}
          >
            {t("emotion")}
          </button>
        </div>
      </div>

      {Array.isArray(data) &&
        data.map((post) => {
          const currentUserId = parseInt(localStorage.getItem("id"));
          const usersWhoLiked = likedUsersMap[post.id] || post.likedUsers;
          const isLiked = usersWhoLiked.includes(currentUserId);
          console.log(isLiked);

          return (
            <div key={post.id} ref={(el) => (postRefs.current[post.id] = el)}>
              {!hiddenPosts.includes(post.id) ? (
                <div className="pt-4 px-4 pb-2 mt-2 border-1 dark:border-darkBorder rounded-2xl">
                  <div className="flex justify-between dark:text-darkText">
                    <div className="flex items-center mb-2">
                      <img
                        src={post.userImg ? post.userImg : "/user.png"}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <Link to={`/blog/${post.id}`}>
                        <div className="ml-2">
                          <h4 className="font-bold text-gray-600 dark:text-darkText mx-1">
                            {post.username}
                          </h4>
                          <p className="text-sm text-gray-500">{post.date}</p>
                        </div>
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 relative">
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
                        <div className="absolute right-16 mt-2 bg-wcolor border-1 dark:border-darkBorder dark:bg-darkBackground shadow-md rounded-lg p-2">
                          <button
                            className="w-full whitespace-nowrap text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-darkSubbackground rounded-md"
                            onClick={() => reportPost(post.id)}
                          >
                            {t("report")}
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
                      className="w-full lg:h-60 h-96 object-cover rounded-lg mb-2"
                    />
                  )}
                  <div className="flex dark:text-darkText justify-between text-gray-600 text-sm border-t dark:border-darkBorder pt-2">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => handleLike(post.id, post)}
                    >
                      <PiHeartFill
                        size={25}
                        color={
                          post.likedUsers.includes(currentUserId) || isLiked
                            ? "red"
                            : "gray"
                        }
                      />
                      <span>
                        {likedUsersMap[post.id]?.length || 0} {t("like")}
                      </span>
                    </button>
                    <button
                      className="flex items-center space-x-1"
                      onClick={() =>
                        setSelectedPost(
                          post.id === selectedPost ? null : post.id
                        )
                      }
                    >
                      <PiChatCircle size={25} />
                      <span>
                        {post.blogComments ? post.blogComments.length : 0}
                      </span>
                    </button>
                    <button className="flex items-center space-x-1">
                      <PiShareFatLight size={25} />
                      {/* <span>{post.shares.toLocaleString()}</span> */}
                    </button>
                  </div>

                  {/* Hiển thị bình luận khi bấm vào comment */}
                  {selectedPost === post.id && (
                    <div className="mt-2 p-2 border-t dark:border-darkBorder dark:text-darkText">
                      <div className="max-h-60 overflow-y-auto">
                        {comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="flex items-center gap-3 p-3 bg-wcolor dark:bg-darkSubbackground rounded-lg shadow-sm"
                          >
                            {/* Avatar hoặc icon mặc định */}
                            <img
                              src={comment.img}
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover border"
                            />

                            {/* Nội dung comment */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm dark:text-darkText font-semibold text-gray-800">
                                  {comment.username}
                                </p>
                                {comment.username ===
                                localStorage.getItem("username") ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        deleteBlogComment(
                                          parseInt(comment.id),
                                          localStorage.getItem("id")
                                        )
                                      }
                                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white text-sm"
                                    >
                                      X
                                    </button>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>

                              {/* Nếu có ảnh trong comment
                              {comment.img && (
                                <img
                                  src={comment.img}
                                  alt="Comment"
                                  className="w-28 h-28 mt-2 object-cover rounded-lg border"
                                />
                              )} */}

                              <p className="text-sm text-gray-700 dark:text-darkSubtext mt-2 whitespace-pre-wrap">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                        {visibleComments < post?.blogComments?.length && (
                          <button
                            onClick={() =>
                              setVisibleComments(visibleComments + 3)
                            }
                            className="text-blue-500 text-sm mt-2"
                          >
                            {t("moreComments")}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center dark:border-darkBorder gap-2 mt-2 border-t pt-2">
                        <img
                          src={localStorage.getItem("img") || "/user.png"}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <input
                          type="text"
                          name="comment"
                          value={content}
                          onChange={(e) => setcontent(e.target.value)}
                          placeholder={t("writeComment")}
                          className="flex-1 px-3 py-2 dark:bg-darkSubbackground dark:border-darkBorder border-2 rounded-full focus:outline-none"
                        />
                        <button
                          onClick={() =>
                            addBlogComment(selectedPost, userId, content)
                          }
                        >
                          <PiPaperPlaneRightFill className="" size={25} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-4 py-3 border-1 dark:border-darkBorder dark:text-darkText flex justify-between items-center rounded-xl">
                  <span className="flex items-center gap-2">
                    <PiEyeClosed size={25} />
                    {t("hiddenPost")}
                  </span>
                  <button
                    onClick={() => restorePost(post.id)}
                    className="bg-scolor text-wcolor px-4 py-2 rounded-lg flex gap-2"
                  >
                    <PiArrowsClockwise size={25} />
                    {t("undo")}
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
