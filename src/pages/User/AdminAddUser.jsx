import React, { useState } from "react";
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
      .post(`${URL}/api/auth/admin-register-user`, data)
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
    <div className="h-full w-full">
      <div className="flex-1 flex flex-col h-fit">
        <div className="flex gap-2 dark:text-darkText items-center mb-2">
          <FaUsers size={30} />
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold">{t("user.title")}</h2>
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold ">{t("addUser.title")}</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-wcolor dark:border dark:text-darkText dark:border-darkBorder dark:bg-darkSubbackground py-6 px-3 rounded-lg shadow"
        >
          <div className="space-y-4">
            {[
              { label: <p>{t("addUser.username")}</p>, name: "username", type: "text" },
              { label: <p>{t("addUser.password")}</p>, name: "password", type: "password" },
              { label: "Email", name: "email", type: "email" },
              { label: <p>{t("addUser.phoneNumber")}</p>, name: "phoneNumber", type: "text" },
              { label: <p>{t("addUser.birthDay")}</p>, name: "birthDay", type: "date" },
              { label: <p>{t("addUser.address")}</p>, name: "address", type: "text" },
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
              <label className="w-1/4 font-medium"><p>{t("addUser.role")}</p></label>
              <select
                name="roleEnum"
                value={formData.roleEnum}
                onChange={handleInputChange}
                className="flex-1 px-2 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              >
                <option value="STUDENT"><p>{t("addUser.student")}</p></option>
                <option value="TEACHER"><p>{t("addUser.teacher")}</p></option>
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
              className="px-6 py-2 dark:text-darkText border-2 border-sicolor text-ficolor rounded-lg hover:bg-opacity-80"
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
