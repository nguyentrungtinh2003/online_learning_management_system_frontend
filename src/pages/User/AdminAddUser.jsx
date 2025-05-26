import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";
import { FaUsers } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { ToastContainer, toast, Slide } from "react-toastify";
import { useTranslation } from "react-i18next";

const AdminAddUser = () => {
  const { t } = useTranslation("adminmanagement");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    birthDay: "",
    address: "",
    roleEnum: "STUDENT", // Default value
  });
  const [image, setImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append(
      "user",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    if (image) {
      data.append("img", image);
    }

    await axios
      .post(`${URL}/admin/register/user`, data, { withCredentials: true })
      .then(() => {
        toast.success(<p>{t("addUser.success")}</p>, {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
        setTimeout(() => {
          window.location.replace("/admin/users");
        }, 3000);
      })
      .catch(() => {
        toast.error(<p>{t("addUser.error")}</p>, {
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
          <FaUsers size={isMobile ? 50 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">{t("user.title")}</h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-4xl lg:text-lg font-bold">
            {t("addUser.title")}
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          <div className="space-y-4">
            {[
              {
                label: <p>{t("addUser.username")}</p>,
                name: "username",
                type: "text",
              },
              {
                label: <p>{t("addUser.password")}</p>,
                name: "password",
                type: "password",
              },
              { label: "Email", name: "email", type: "email" },
              {
                label: <p>{t("addUser.phoneNumber")}</p>,
                name: "phoneNumber",
                type: "text",
              },
              {
                label: <p>{t("addUser.birthDay")}</p>,
                name: "birthDay",
                type: "date",
              },
              {
                label: <p>{t("addUser.address")}</p>,
                name: "address",
                type: "text",
              },
            ].map((field) => (
              <div key={field.name} className="flex items-center space-x-4">
                <label className="w-1/4 font-medium">{field.label}</label>
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
              <label className="w-1/4 font-medium">
                <p>{t("addUser.role")}</p>
              </label>
              <select
                name="roleEnum"
                value={formData.roleEnum}
                onChange={handleInputChange}
                className="flex-1 px-2 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              >
                <option value="STUDENT">
                  <p>{t("addUser.student")}</p>
                </option>
                <option value="TEACHER">
                  <p>{t("addUser.teacher")}</p>
                </option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">
                <p>{t("addUser.profileImage")}</p>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl  border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-2 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Link
              to="/admin/users"
              className="px-6 py-2 border-2 dark:border-darkBorder hover:bg-tcolor dark:hover:bg-darkHover text-ficolor dark:text-darkText rounded-lg cursor-pointer"
            >
              <p>{t("cancel")}</p>
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-scolor text-wcolor rounded-lg hover:bg-opacity-80"
            >
              <p>{t("submit")}</p>
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminAddUser;
