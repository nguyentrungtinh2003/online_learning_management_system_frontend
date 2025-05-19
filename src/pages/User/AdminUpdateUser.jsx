import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";
import { FaBuffer } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const AdminUpdateUser = () => {
  const { t } = useTranslation("adminmanagement");
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get(`${URL}/user/${userId}`)
      .then((response) => {
        setUserData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImgFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
      "user",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );
    if (imgFile) {
      formData.append("img", imgFile);
    }

    try {
      await axios.put(`${URL}/users/update/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading)
    return (
      <div className="container text-center my-5">
        <Spinner animation="border" variant="primary" />;
      </div>
    );
  if (!userData) return <div className="p-6 text-red-500">User not found!</div>;

  return (
    <div className="w-full">
      <div className="flex-1 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-xl py-4 px-6 rounded-xl">
        <div className="flex items-center mx-2 gap-2 dark:text-darkText">
          <FaBuffer size={isMobile ? 60 : 30} />
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-5xl lg:text-lg font-bold">
            {t("editUser.user_management")}
          </h2>
          <MdNavigateNext size={isMobile ? 60 : 30} />
          <h2 className="text-5xl lg:text-lg font-bold">
            {t("editUser.edit_user")}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-2 text-gray-700 dark:text-darkText"
        >
          <div className="space-y-4">
            {Object.keys(userData).map((key) =>
              key !== "rank" && key !== "img" ? (
                <div key={key} className="flex items-center space-x-4">
                  <label className="w-1/4 font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </label>
                  <input
                    type={
                      key === "email"
                        ? "email"
                        : key === "phone"
                        ? "tel"
                        : "text"
                    }
                    name={key}
                    value={userData[key] || ""}
                    onChange={handleChange}
                    readOnly={key === "userId"}
                    className="flex-1 px-2 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
                  />
                </div>
              ) : null
            )}

            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">{t("editUser.image")}</label>
              <input
                type="file"
                name="img"
                onChange={handleImageChange}
                className="flex-1 dark:file:bg-darkBackground dark:file:text-darkText file:px-4 file:py-1 dark:file:border-darkBorder file:rounded-xl border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg px-2 py-2"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-1/4 font-medium">{t("editUser.rank")}</label>
              <select
                name="rank"
                value={userData.rankEnum}
                onChange={handleChange}
                className="flex-1 px-2 py-2 border-2 dark:border-darkBorder dark:bg-darkSubbackground rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              >
                <option value="Silver">{t("editUser.silver")}</option>
                <option value="Bronze">{t("editUser.bronze")}</option>
                <option value="Gold">{t("editUser.gold")}</option>
                <option value="Diamond">{t("editUser.diamond")}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Link
              to="/admin/users"
              className="px-6 py-2 border dark:text-darkText border-gray-500 text-gray-600 rounded hover:bg-tcolor dark:hover:bg-darkHover"
            >
              {t("editUser.cancel")}
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-scolor text-wcolor rounded-lg hover:bg-opacity-80"
            >
              {t("editUser.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateUser;
