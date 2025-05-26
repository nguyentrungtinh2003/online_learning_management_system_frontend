import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdForum, MdNavigateNext } from "react-icons/md";
import { useTranslation } from "react-i18next";
import axios from "axios";
import URL from "../../config/URLconfig";

const AdminEditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("adminmanagement");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [blogData, setBlogData] = useState({
    id: "",
    blogName: "",
    description: "",
    userId: "",
    username: "",
    img: null,
    video: null,
    date: "",
    interactions: 0,
    views: 0,
  });

  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${URL}/blogs/${id}`, {
        withCredentials: true,
      });
      const data = res.data.data;
      setBlogData({
        id: data.id,
        blogName: data.blogName,
        description: data.description,
        userId: data.user?.id,
        username: data.user?.username,

        date: data.date,
        interactions: data.interactions,
        views: data.views,
      });
      setImg(data.img);
      setVideo(data.video);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData({ ...blogData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: blogData.id,
      blogName: blogData.blogName,
      description: blogData.description,
      userId: blogData.userId,
    };

    const formData = new FormData();
    if (img) formData.append("img", img);
    formData.append(
      "blog",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    try {
      await axios.put(`${URL}/blogs/update/${id}`, formData, {
        withCredentials: true,
      });
      alert("Cập nhật blog thành công!");
      navigate("/admin/blog");
    } catch (error) {
      alert("Lỗi khi cập nhật blog!");
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex-1 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
        {/* Breadcrumb */}
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <MdForum size={isMobile ? 60 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("editBlog.blog_management")}
          </h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("editBlog.edit_blog")}
          </h2>
        </div>

        {/* Form */}
        <form
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("editBlog.blog_id")}:
            </label>
            <input
              type="text"
              name="id"
              value={blogData.id}
              readOnly
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("editBlog.created_date")}:
            </label>
            <input
              type="text"
              name="date"
              value={blogData.date}
              readOnly
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("editBlog.blog_title")}:
            </label>
            <input
              type="text"
              name="blogName"
              value={blogData.blogName}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("editBlog.description")}:
            </label>
            <textarea
              name="description"
              rows={3}
              value={blogData.description}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            ></textarea>
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("editBlog.image")} (URL):
            </label>
            <input
              type="text"
              name="img"
              value={img}
              onChange={handleImageChange}
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            />
            <img src={img} className="w-20 h-20" alt="" />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("editBlog.video")} (URL):
            </label>
            <input
              type="text"
              name="video"
              value={blogData.video}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">
              {t("editBlog.interactions")}:
            </label>
            <input
              type="number"
              name="interactions"
              value={blogData.interactions}
              readOnly
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("editBlog.views")}:</label>
            <input
              type="number"
              name="views"
              value={blogData.views}
              readOnly
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("editBlog.actor")}:</label>
            <input
              type="text"
              name="username"
              value={blogData.username}
              readOnly
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Link
              to="/admin/blog"
              className="px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer"
            >
              {t("editBlog.cancel")}
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-scolor text-ficolor rounded-lg hover:bg-opacity-80"
            >
              {t("editBlog.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditBlog;
