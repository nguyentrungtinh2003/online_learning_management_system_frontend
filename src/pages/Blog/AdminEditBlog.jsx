import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdForum, MdNavigateNext } from "react-icons/md";
import { useTranslation } from "react-i18next";

const AdminEditBlog = () => {
  const { t } = useTranslation("adminmanagement");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [blogData, setBlogData] = useState({
    blogId: "001",
    createdDate: "12/03/2023",
    blogTitle: "How React Hooks Work",
    description: "This course helps you grasp ...",
    image: "img1.jpg",
    video: "video.mp4",
    interactions: "300",
    views: "1200",
    avatar: "Min Tae",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData({ ...blogData, [name]: value });
  };

  return (
    <div className="w-full">
      <div className="flex-1 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
        {/* Breadcrumb */}
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <MdForum size={isMobile ? 60 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-5xl lg:text-lg font-bold">{t("editBlog.blog_management")}</h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-5xl lg:text-lg font-bold">{t("editBlog.edit_blog")}</h2>
        </div>

        {/* Form */}
        <form className="space-y-4 p-2 text-gray-700 dark:text-darkText">
          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("editBlog.blog_id")}:</label>
            <input
              type="text"
              name="blogId"
              value={blogData.blogId}
              readOnly
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("editBlog.created_date")}:</label>
            <input
              type="text"
              name="createdDate"
              value={blogData.createdDate}
              readOnly
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("editBlog.blog_title")}:</label>
            <input
              type="text"
              name="blogTitle"
              value={blogData.blogTitle}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("editBlog.description")}:</label>
            <textarea
              name="description"
              rows={3}
              value={blogData.description}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            ></textarea>
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("editBlog.image")}:</label>
            <input
              type="file"
              name="image"
              className="flex-1 border-2 px-3 py-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 file:rounded-xl"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("editBlog.video")}:</label>
            <input
              type="file"
              name="video"
              className="flex-1 border-2 px-3 py-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 file:rounded-xl"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="w-1/4 font-medium">{t("editBlog.interactions")}:</label>
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
              name="avatar"
              value={blogData.avatar}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border-2 rounded-lg dark:border-darkBorder dark:bg-darkSubbackground"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Link
              to="/admin/blog"
              className="px-6 py-2 border-2 border-sicolor text-ficolor rounded-lg hover:bg-opacity-80 dark:text-darkText"
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
