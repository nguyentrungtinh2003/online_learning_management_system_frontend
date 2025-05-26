import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ViewUser = () => {
  const { t } = useTranslation("profile");
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${URL}/user/${userId}`, { withCredentials: true })
      .then((response) => {
        setUser(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching user data");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="h-full overflow-y-auto shadow flex-1">
      {/* Header */}
      <div className="relative h-fit mb-32">
        <div className="bg-gradient-to-b from-cyan-300 to-blue-500 items-center flex justify-center text-3xl font-bold font-serif text-white uppercase h-60 rounded-2xl m-2">
          {localStorage.getItem("slogan")}
        </div>

        <div className="absolute top-40 left-10 z-10 flex items-center">
          <img
            className="profile-avatar w-48 h-48 rounded-full object-cover"
            src={user.img || "/user.png"}
            alt="Profile"
          />

          <div className="mt-20 ml-4">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-darkText">
              {user.username}
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 px-6">
        <div className="grid grid-cols-2 gap-8 bg-wcolor dark:bg-darkBackground p-6 rounded-lg shadow-xl dark:border dark:border-darkBorder text-black">
          {/* Left Column */}
          <div>
            <label className="block font-semibold">{t("username")}</label>
            <div className="mt-2 p-2 border border-gray-300 rounded bg-white">
              {user.username}
            </div>

            <label className="block mt-4 font-semibold">{t("email")}</label>
            <div className="mt-2 p-2 border border-gray-300 rounded bg-white">
              {user.email}
            </div>

            <label className="block mt-4 font-semibold">
              {t("phoneNumber")}
            </label>
            <div className="mt-2 p-2 border border-gray-300 rounded bg-white">
              {user.phoneNumber}
            </div>
          </div>

          {/* Right Column */}
          <div>
            <label className="block font-semibold">{t("birthDay")}</label>
            <div className="mt-2 p-2 border border-gray-300 rounded bg-white">
              {user.birthDay}
            </div>

            <label className="block mt-4 font-semibold">{t("address")}</label>
            <div className="mt-2 p-2 border border-gray-300 rounded bg-white">
              {user.address}
            </div>

            <label className="block mt-4 font-semibold">{t("role")}</label>
            <div className="mt-2 p-2 border border-gray-300 rounded bg-white">
              {user.roleEnum}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
