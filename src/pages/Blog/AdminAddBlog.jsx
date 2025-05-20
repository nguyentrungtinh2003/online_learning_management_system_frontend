import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";
import { MdForum, MdNavigateNext } from "react-icons/md";
import { ToastContainer, toast, Slide } from "react-toastify";
import { useTranslation } from "react-i18next";

const AdminAddBlog = () => {
  const { t } = useTranslation("adminmanagement");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append(
      "blog",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    if (image) {
      data.append("image", image);
    }
    if (video) {
      data.append("video", video);
    }

    await axios
      .post(`${URL}/blogs/create`, data)
      .then(() => {
        toast.success("Blog added successfully!", {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
        setTimeout(() => {
          window.location.replace("/admin/blog");
        }, 3000);
      })
      .catch(() => {
        toast.error("Failed to add blog!", {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
      });
  };

  return (
    <div className="w-full">
      <div className="flex-1 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <MdForum size={isMobile ? 50 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">{t("blog.title")}</h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">{t("addBlog.title")}</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          <div className="space-y-4">
            {[
              {
                label: <p>{t("addBlog.blogTitle")}</p>,
                name: "title",
                type: "text",
              },
              { label: "Description", name: "description", type: "text" },
            ].map((field) => (
              <div key={field.name} className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}

            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">{t("image")}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setImage)}
                className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">{t("video")}</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, setVideo)}
                className="flex-1 px-4 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Link
              to="/admin/blog"
              className="px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer"
            >
              {t("cancel")}
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-fcolor dark:hover:text-darkBackground text-ficolor rounded-lg hover:bg-opacity-80"
            >
              {t("submit")}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminAddBlog;
