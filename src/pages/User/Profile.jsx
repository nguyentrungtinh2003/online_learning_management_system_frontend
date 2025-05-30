import React, { useState, useEffect, useRef } from "react";
import RankLevel from "../../components/RankLevel/RankLevel";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import URL from "../../config/URLconfig";
import axios from "axios";
import { FaEdit, FaLock, FaLockOpen, FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast, Slide } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { deleteBlog, restoreBlog } from "../../services/blogapi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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
import { Link, useSearchParams } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const Profile = () => {
  const [tab, setTab] = useState("overview");
  const [user, setUser] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const formContainerRef = useRef(null);
  const [enroll, SetEnroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [weeklyPoints, setWeeklyPoints] = useState([]);
  const [topupHistory, setTopupHistory] = useState([]);
  const [myBlog, setMyBlog] = useState([]);
  const [menuOpenPost, setMenuOpenPost] = useState(null);
  const [hiddenPosts, setHiddenPosts] = useState([]);
  const postRefs = useRef({});
  const { i18n } = useTranslation("blog");

  const [searchParams] = useSearchParams();
  const scrollToId = searchParams.get("scrollTo");
  function formatPostDate(dateArray) {
    if (!Array.isArray(dateArray) || dateArray.length < 6) return "N/A";

    const postDate = new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5]
    );

    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    const secondsIn20Days = 20 * 24 * 60 * 60;

    if (diffInSeconds >= secondsIn20Days) {
      return postDate.toLocaleString(i18n.language, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (diffInSeconds < 60) {
      return t("justNow");
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t("minutesAgo", { count: minutes });
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t("hoursAgo", { count: hours });
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return t("daysAgo", { count: days });
    }
  }

  //scrollToId
  useEffect(() => {
    if (scrollToId && postRefs.current[scrollToId]) {
      postRefs.current[scrollToId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [myBlog, scrollToId]);

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

  const userId = localStorage.getItem("id");
  const { t } = useTranslation("profile");

  const fetchMyBlog = () => {
    axios
      .get(`${URL}/blogs/user/${userId}`)
      .then((response) => {
        setMyBlog(response.data.data);
      })
      .catch((error) => {
        console.log("Error get my course" + error.message);
      });
  };

  const fetchUserInfo = () => {
    axios.get(`${URL}/user/${userId}`).then((response) => {
      setUser(response.data.data);
      setPreviewImage(response.data.data.img);
      setLoading(false);
    });
  };

  const fetchUserHistory = () => {
    axios.get(`${URL}/user-point-history/${userId}`).then((response) => {
      setUserHistory(response.data.data.reverse());
    });
  };

  const fetchUserEnroll = () => {
    axios.get(`${URL}/enroll/${userId}`).then((response) => {
      SetEnroll(response.data.data);
      setLoading(false);
    });
  };

  const fetchWeeklyPoints = () => {
    const today = new Date();
    const day = today.getDay(); // 0 (Sun) -> 6 (Sat)
    const start = new Date(today);
    start.setDate(today.getDate() - day + (day === 0 ? -6 : 1)); // Monday
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Sunday

    const startDate = start.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];

    axios
      .get(
        `${URL}/user-point-history/${userId}?start=${startDate}&end=${endDate}`
      )
      .then((response) => {
        const data = response.data.data.map((item) => ({
          day: new Date(item.date).toLocaleDateString("vi-VN", {
            weekday: "short",
          }),
          point: item.point,
        }));
        setWeeklyPoints(data);
      })
      .catch((error) => {
        console.error("Error fetching weekly points:", error.message);
      });
  };

  const fetchTopupHistory = () => {
    axios
      .get(`${URL}/payments/user/${userId}`)
      .then((response) => {
        setTopupHistory(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching top-up history:", error.message);
      });
  };

  const updateUser = async () => {
    setLoadingUpdate(true);
    try {
      const formData = new FormData();
      formData.append(
        "user",
        new Blob([JSON.stringify(user)], { type: "application/json" })
      );

      if (selectedImage instanceof File) {
        formData.append("img", selectedImage);
      }

      await axios.put(`${URL}/user/update/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("Update user success");
      setLoadingUpdate(false);

      toast.success("User update successfully!", {
        position: "top-right",
        autoClose: 3000,
        transition: Slide,
      });
      setTimeout(() => {
        fetchUserInfo(); // cập nhật lại dữ liệu sau khi sửa
      }, 3000);
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      toast.error("User update fail!", {
        position: "top-right",
        autoClose: 3000,
        transition: Slide,
      });
      setTimeout(() => {
        fetchUserInfo(); // cập nhật lại dữ liệu sau khi sửa
      }, 3000);
    }
  };

  useEffect(() => {
    const formContainer = formContainerRef.current;
    formContainer?.classList.add("animate");
    setTimeout(() => {
      formContainer?.classList.remove("animate");
    }, 1000);

    fetchUserInfo();
    fetchUserEnroll();
    fetchUserHistory();
    fetchWeeklyPoints();
    fetchTopupHistory();
    fetchMyBlog();
  }, [tab]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file); // Lưu file để gửi lên server
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result); // Hiển thị preview
      reader.readAsDataURL(file);
    }
  };
  //delete/
  const handleDelete = async (id, title, userId) => {
    if (!window.confirm(`Bạn có chắc muốn xóa blog "${title}" không?`)) return;

    if (!userId) {
      toast.error("Thiếu userId! Không thể xóa blog.");
      return;
    }

    try {
      console.log("userId:", userId);
      const data = await deleteBlog(id, parseInt(userId));

      if (data.status === 200 || data.status === 204) {
        toast.success("Xóa blog thành công!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchMyBlog();
      }
    } catch (error) {
      console.error(error.message);
      fetchMyBlog();
    }
  };

  const handleRestore = async (id, name, userId) => {
    if (!window.confirm(`Bạn có chắc muốn khôi phục blog "${name}" không?`))
      return;

    if (!userId) {
      toast.error("Thiếu userId! Không thể khôi phục blog.");
      return;
    }

    try {
      const data = await restoreBlog(id, parseInt(userId));
      if (data.status === 200 || data.status === 204) {
        toast.success("Khôi phụcblog thành công!", {
          position: "top-right",
          autoClose: 1000,
        });
        fetchMyBlog();
      }
    } catch (error) {
      console.error(error.message);
      fetchMyBlog();
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto shadow flex-1">
      {/* Header Section */}
      <div className="relative h-fit mb-32">
        <div className="bg-gradient-to-b from-cyan-300 to-blue-500 items-center flex justify-center text-3xl font-bold font-serif text-white text-uppercase  h-60 rounded-2xl m-2">
          {localStorage.getItem("slogan")}
        </div>

        <div className="absolute top-40 left-10 z-10 flex items-center">
          <label className="relative cursor-pointer">
            <img
              className="profile-avatar w-48 h-48 rounded-full object-cover"
              src={previewImage || user.avatar || "/user.png"} // Ưu tiên preview trước
              alt="Profile"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <div className="mt-20 ml-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-3xl font-semibold dark:text-darkText text-gray-800">
                {user.username}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-10 flex justify-center">
        {[
          { label: t("overview"), key: "overview" },
          { label: t("introduce"), key: "introduce" },
          { label: t("rank"), key: "rank" },
          { label: t("topupHistory"), key: "topupHistory" },
          { label: t("myBlog"), key: "myBlog" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`font-semibold dark:border-darkBorder border-2 border-sicolor m-2 px-4 py-2 rounded-lg ${
              tab === item.key
                ? "bg-darkBackground text-wcolor dark:bg-wcolor dark:text-darkBackground"
                : "bg-wcolor text-black-700 dark:bg-darkBackground dark:text-wcolor"
            } transition`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {/* Content Section */}
      <div className="content-section mt-6" ref={formContainerRef}>
        {tab === "introduce" && (
          <div className="text-slate-500">
            <div className="grid grid-cols-2 dark:text-white gap-8 p-6 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-2xl shadow rounded-lg">
              <div>
                <label>{t("username")}</label>
                <TextField
                  className="mt-2 w-full text-black dark:text-gray-400"
                  required
                  value={user.username}
                  variant="outlined"
                  on
                  onChange={
                    <TextField
                      value={user.username}
                      onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                      }
                    />
                  }
                  InputProps={{
                    sx: {
                      "& fieldset": { borderColor: "rgb(75 85 99)" },
                      "& input": {
                        color: "black", // mặc định là đen
                        "&:-webkit-autofill": {
                          WebkitTextFillColor: "black", // xử lý autofill
                        },
                      },
                      ".dark & input": {
                        color: "white", // nếu dark mode thì trắng
                      },
                    },
                  }}
                />
                <label className="mt-2">{t("email")}</label>
                <TextField
                  className="mt-2 w-full dark:text-gray-400"
                  required
                  value={user.email}
                  variant="outlined"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  InputProps={{
                    sx: {
                      "& fieldset": { borderColor: "rgb(75 85 99)" },
                      "& input": {
                        color: "black", // mặc định là đen
                        "&:-webkit-autofill": {
                          WebkitTextFillColor: "black", // xử lý autofill
                        },
                      },
                      ".dark & input": {
                        color: "white", // nếu dark mode thì trắng
                      },
                    },
                  }}
                />
                <label className="mt-2">{t("phoneNumber")}</label>
                <TextField
                  className="mt-2 w-full dark:text-gray-400"
                  required
                  value={user.phoneNumber}
                  variant="outlined"
                  onChange={(e) =>
                    setUser({ ...user, phoneNumber: e.target.value })
                  }
                  InputProps={{
                    sx: {
                      "& fieldset": { borderColor: "rgb(75 85 99)" },
                      "& input": {
                        color: "black", // mặc định là đen
                        "&:-webkit-autofill": {
                          WebkitTextFillColor: "black", // xử lý autofill
                        },
                      },
                      ".dark & input": {
                        color: "white", // nếu dark mode thì trắng
                      },
                    },
                  }}
                />
              </div>
              <div>
                <label>{t("birthDay")}</label>
                <TextField
                  className="mt-2 w-full dark:text-gray-400"
                  required
                  value={user.birthDay}
                  type="date"
                  variant="outlined"
                  onChange={(e) =>
                    setUser({ ...user, birthDay: e.target.value })
                  }
                  InputProps={{
                    sx: {
                      "& fieldset": { borderColor: "rgb(75 85 99)" },
                      "& input": {
                        color: "black", // mặc định là đen
                        "&:-webkit-autofill": {
                          WebkitTextFillColor: "black", // xử lý autofill
                        },
                      },
                      ".dark & input": {
                        color: "white", // nếu dark mode thì trắng
                      },
                    },
                  }}
                />
                <label className="mt-2">{t("address")}</label>
                <TextField
                  className="mt-2 w-full dark:text-gray-400"
                  required
                  value={user.address}
                  variant="outlined"
                  onChange={(e) =>
                    setUser({ ...user, address: e.target.value })
                  }
                  InputProps={{
                    sx: {
                      "& fieldset": { borderColor: "rgb(75 85 99)" },
                      "& input": {
                        color: "black", // mặc định là đen
                        "&:-webkit-autofill": {
                          WebkitTextFillColor: "black", // xử lý autofill
                        },
                      },
                      ".dark & input": {
                        color: "white", // nếu dark mode thì trắng
                      },
                    },
                  }}
                />
                <label className="mt-2 dark:text-gray-400">{t("role")}</label>
                <TextField
                  className="mt-2 w-full dark:text-gray-400"
                  required
                  value={user.roleEnum}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      "& fieldset": { borderColor: "rgb(75 85 99)" },
                      "& input": {
                        color: "black", // mặc định là đen
                        "&:-webkit-autofill": {
                          WebkitTextFillColor: "black", // xử lý autofill
                        },
                      },
                      ".dark & input": {
                        color: "white", // nếu dark mode thì trắng
                      },
                    },
                  }}
                />
              </div>
              <div className="col-span-2 flex text-black justify-end">
                <button
                  onClick={() => updateUser()}
                  className={`px-6 py-2 rounded-lg ${
                    loadingUpdate
                      ? "bg-gray-400 text-white"
                      : "bg-scolor text-ficolor hover:bg-opacity-80"
                  }`}
                >
                  {loadingUpdate ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
                      {t("processing")}
                    </div>
                  ) : (
                    t("saveChange")
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {tab === "overview" && (
          <div className="p-6 bg-wcolor dark:bg-darkBackground shadow rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 dark:text-darkText">
              {t("weeklyPerformance")}
            </h2>
            <p className="text-lg flex items-center gap-1 font-medium mb-2 dark:text-darkText">
              {t("totalPointThisWeek")}:{" "}
              {weeklyPoints.reduce((sum, d) => sum + d.point, 0)}
              <FaStar color="gold" size={15} />
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyPoints}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="point" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === "topupHistory" && (
          <div className="p-6 bg-wcolor dark:bg-darkBackground shadow rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 dark:text-darkText">
              {t("topupHistory")}
            </h2>
            <ul className="space-y-3 h-[400px] overflow-auto">
              {topupHistory.length === 0 ? (
                <p className="dark:text-darkText">{t("noTopup")}</p>
              ) : (
                topupHistory.map((topup, index) => {
                  // Convert mảng date thành đối tượng Date
                  const formattedDate = new Date(
                    topup.date[0],
                    topup.date[1] - 1, // Tháng trong JS tính từ 0
                    topup.date[2],
                    topup.date[3],
                    topup.date[4],
                    topup.date[5]
                  ).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <li
                      key={index}
                      className="flex justify-between items-center p-4 bg-wcolor dark:bg-darkSubbackground border-2 dark:border-darkBorder rounded-lg shadow-sm"
                    >
                      <div>
                        <p className="text-lg dark:text-darkText">
                          {t("topupAmount")}:{" "}
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {topup.amount.toLocaleString()} VND
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t("coinReceived") || "Xu nhận được"}:{" "}
                          <span className="font-medium text-yellow-600 dark:text-yellow-400">
                            {topup.coinAmount.toLocaleString()} xu
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t("date")}: {formattedDate}
                        </p>
                      </div>
                      <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded dark:bg-blue-800 dark:text-white">
                        {topup.status || "Success"}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
        {tab === "rank" && (
          <div className="flex flex-1 h-[500px] w-full dark:border dark:border-darkBorder gap-6 p-6 bg-wcolor dark:bg-darkBackground dark:text-darkText shadow-lg rounded-xl">
            <RankLevel />
            <div className="flex-1 h-full overflow-auto p-4 bg-gray-50 dark:bg-darkSubbackground rounded-lg shadow-inner">
              <p className="text-2xl font-semibold text-gray-700 dark:text-darkText mb-6">
                {t("activityLog")}
              </p>
              <ul className="space-y-4 h-[340px] overflow-auto">
                {userHistory.map((uh, index) => {
                  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(uh.date));

                  return (
                    <li
                      key={index}
                      className="w-full text-gray-600 dark:text-darkSubtext font-medium flex justify-between items-center border-l-8 hover:border-cyan-400 bg-wcolor dark:bg-darkBackground px-4 py-3 rounded-md shadow-sm hover:shadow-md transition"
                    >
                      <span className="text-gray-800 dark:text-darkText">
                        Bạn đã nhận được {uh.point} điểm
                      </span>
                      <p>{formattedDate}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {tab === "myBlog" && (
          <div className="p-6 bg-wcolor dark:bg-darkBackground dark:text-darkText shadow rounded-lg">
            {myBlog.map((post) => {
              return (
                <div
                  key={post.id}
                  ref={(el) => (postRefs.current[post.id] = el)}
                >
                  {!hiddenPosts.includes(post.id) ? (
                    <div className="pt-4 px-4 pb-2 mt-2 border-1 dark:border-darkBorder rounded-2xl">
                      {/* Header */}
                      <div className="flex justify-between dark:text-darkText">
                        <div className="flex items-center mb-2">
                          <img
                            src={post.user.img || "/user.png"}
                            alt="avatar"
                            className="w-16 h-16 lg:w-10 lg:h-10 rounded-full"
                          />

                          <div className="ml-2">
                            <h4 className="font-bold text-2xl lg:text-lg text-gray-600 dark:text-darkText mx-1">
                              {post.user.username}
                            </h4>
                            <p className="text-sm ml-1 text-gray-500">
                              {formatPostDate(post.date) || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Post Menu */}
                        <div className="flex text-5xl lg:text-3xl items-center gap-2 relative">
                          <details className="relative">
                            <summary className="list-none cursor-pointer">
                              <PiDotsThreeBold />
                            </summary>
                            <div className="absolute right-16 mt-2 bg-wcolor border-1 dark:border-darkBorder dark:bg-darkBackground shadow-md rounded-lg p-2 z-50">
                              <button
                                className="w-full whitespace-nowrap text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-darkSubbackground rounded-md"
                                onClick={() => reportPost(post.id)}
                              >
                                {t("report")}
                              </button>
                            </div>
                          </details>
                          <button onClick={() => hidePost(post.id)}>
                            <PiBackspace />
                          </button>
                          <Link to={`/blog/edit-blog/${post.id}`}>
                            <button className="p-2 border-2 dark:border-darkBorder rounded bg-yellow-400 hover:bg-yellow-300 text-white">
                              <FaEdit />
                            </button>
                          </Link>
                          {post.deleted ? (
                            <button
                              className="p-2 border-2 dark:border-darkBorder rounded bg-blue-600 hover:bg-blue-500 text-white"
                              onClick={() =>
                                handleRestore(post.id, post.blogName, userId)
                              }
                              title="Khôi phục bài viết"
                            >
                              <FaLockOpen />
                            </button>
                          ) : (
                            <button
                              className="p-2 border-2 dark:border-darkBorder rounded bg-red-600 hover:bg-red-500 text-white"
                              onClick={() =>
                                handleDelete(post.id, post.blogName, userId)
                              }
                              title="Khóa bài viết"
                            >
                              <FaLock />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <h2 className="mb-2 text-3xl lg:text-base">
                        {post.blogName}
                      </h2>
                      <p className="mb-2 text-2xl lg:text-base">
                        {post.description}
                      </p>
                      {post.img && (
                        <img
                          src={post.img}
                          alt="Post"
                          className="w-full lg:h-60 object-cover rounded-lg mb-2"
                        />
                      )}

                      {/* Buttons */}
                      <div className="flex dark:text-darkText justify-between text-gray-600 text-sm border-t dark:border-darkBorder pt-2">
                        <button className="flex text-5xl lg:text-3xl items-center gap-2">
                          <PiHeartFill color={"gray"} />
                          <span className="text-3xl lg:text-lg">
                            {post.likedUsers.length} {t("like")}
                          </span>
                        </button>

                        <button
                          className="flex text-5xl lg:text-3xl items-center space-x-1"
                          onClick={() =>
                            setSelectedPost(
                              post.id === selectedPost ? null : post.id
                            )
                          }
                        >
                          <PiChatCircle />
                          <span className="text-3xl lg:text-lg">
                            {/* {selectedPost === post.id
                              ? `${comments.length} Bình luận`
                              : post.blogComments?.length ?? "Bình luận"} */}
                            {post.likedUsers.length} {t("comment")}
                          </span>
                        </button>

                        <button className="flex text-5xl lg:text-3xl items-center space-x-1">
                          <PiShareFatLight />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Nếu post bị ẩn
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
        )}
      </div>
    </div>
  );
};

export default Profile;
