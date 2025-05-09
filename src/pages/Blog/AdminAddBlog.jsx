import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";
import { MdForum, MdNavigateNext } from "react-icons/md";
import { ToastContainer, toast, Slide } from "react-toastify";
import { useTranslation } from "react-i18next";

const AdminAddBlog = () => {
  const { t } = useTranslation("adminmanagement");
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
    <div className="h-full w-full">
      <div className="flex-1 flex flex-col dark:text-darkText h-full">
        <div className="flex gap-2 items-center">
          <MdForum size={30} />
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold">{t("blog.title")}</h2>
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold">{t("addBlog.title")}</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder flex-col flex-1 flex p-6 rounded-lg shadow mt-4"
        >
          <div className="space-y-4">
            {[
              { label: <p>{t("addBlog.blogTitle")}</p>, name: "title", type: "text" },
              { label: "Description", name: "description", type: "text" },
            ].map((field) => (
              <div key={field.name} className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="flex-1 px-2 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
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
                className="flex-1 border-2 dark:border-darkBorder rounded-lg px-2 py-2"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">{t("video")}</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, setVideo)}
                className="flex-1 border-2 dark:border-darkBorder rounded-lg px-2 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Link
              to="/admin/blog"
              className="px-6 py-2 dark:text-darkText border-2 border-sicolor text-ficolor rounded-lg hover:bg-opacity-80"
            >
              {t("cancel")}
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-scolor text-ficolor rounded-lg hover:bg-opacity-80"
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
