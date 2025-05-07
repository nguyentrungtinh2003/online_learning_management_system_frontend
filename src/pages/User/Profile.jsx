import React, { useState, useEffect, useRef } from "react";
import RankLevel from "../../components/RankLevel/RankLevel";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import URL from "../../config/URLconfig";
import axios from "axios";

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
  const [tab, setTab] = useState("introduce");
  const [user, setUser] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const formContainerRef = useRef(null);
  const [enroll, SetEnroll] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("id");

  const fetchUserInfo = () => {
    axios.get(`${URL}/user/${userId}`).then((response) => {
      setUser(response.data.data);
      setLoading(false);
    });
  };

  const fetchUserEnroll = () => {
    axios.get(`${URL}/enroll/${userId}`).then((response) => {
      SetEnroll(response.data.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    const formContainer = formContainerRef.current;
    formContainer?.classList.add("animate");
    setTimeout(() => {
      formContainer?.classList.remove("animate");
    }, 1000);

    fetchUserInfo();
    fetchUserEnroll();
  }, [tab]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(event.target.files[0]);
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
      <div className="relative h-[50%]">
        <div className="bg-gradient-to-b from-cyan-300 to-blue-500 h-60 rounded-2xl m-2"></div>
        <div className="absolute top-40 left-10 z-1 flex items-center">
          <img
            className="profile-avatar bg-wcolor dark:bg-darkBackground dark:border-darkBorder border-8 border-slate-50 w-48 rounded-full h-48 shadow-lg"
            src={selectedImage || "/user.png"}
            alt="Profile"
          />
          <div className="mt-20">
            <div className="flex items-center space-x-4">
              <h2 className="text-3xl ml-4 font-semibold dark:text-darkText text-gray-800">
                {user.username}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-10 flex justify-center">
        {[
          { label: "Introduce", key: "introduce" },
          { label: "Rank", key: "rank" },
        ].map((item) => (
          <button
            key={item.key}
            className={`font-semibold dark:border-darkBorder border-2 border-sicolor m-2 px-4 py-2 rounded-lg ${
              tab === item.key
                ? "bg-darkBackground text-wcolor dark:bg-wcolor dark:text-darkBackground"
                : "bg-wcolor text-black-700 dark:bg-darkBackground dark:text-wcolor"
            } transition`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="content-section mt-6" ref={formContainerRef}>
        {tab === "introduce" && (
          <div className="text-slate-500">
            <div className="grid grid-cols-2 dark:text-darkText gap-8 p-6 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkBackground drop-shadow-2xl shadow rounded-lg">
              <div>
                <label>Username</label>
                <TextField
                  className="mt-2 w-full dark:text-gray-400"
                  required
                  value={user.username}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      "& fieldset": {
                        borderColor: "rgb(75 85 99)", // Tailwind gray-600
                      },
                      "& input": {
                        color: "rgb(107 114 128)", // Tailwind gray-400
                      },
                    },
                  }}
                />
                <label className="mt-2">Email</label>
                <TextField
                  className="mt-2 w-full dark:text-gray-400"
                  required
                  value={user.email}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      "& fieldset": {
                        borderColor: "rgb(75 85 99)", // Tailwind gray-600
                      },
                      "& input": {
                        color: "rgb(107 114 128)", // Tailwind gray-400
                      },
                    },
                  }}
                />
                <label className="mt-2">Phone Number</label>
                <TextField
                  className="mt-2 w-full dark:text-gray-400"
                  required
                  value={user.phoneNumber}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      "& fieldset": {
                        borderColor: "rgb(75 85 99)", // Tailwind gray-600
                      },
                      "& input": {
                        color: "rgb(107 114 128)", // Tailwind gray-400
                      },
                    },
                  }}
                />
              </div>
              <div>
                <label>Birth Day</label>
                <TextField
                  className="mt-2 w-full dark:text-gray-400"
                  required
                  value={user.birthDay}
                  variant="outlined"
                  type="date"
                  InputProps={{
                    sx: {
                      "& fieldset": {
                        borderColor: "rgb(75 85 99)", // Tailwind gray-600
                      },
                      "& input": {
                        color: "rgb(107 114 128)", // Tailwind gray-400
                      },
                    },
                  }}
                />
                <label className="mt-2">Address</label>
                <TextField
                  className="mt-2 w-full dark:text-gray-400"
                  required
                  value={user.address}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      "& fieldset": {
                        borderColor: "rgb(75 85 99)", // Tailwind gray-600
                      },
                      "& input": {
                        color: "rgb(107 114 128)", // Tailwind gray-400
                      },
                    },
                  }}
                />
                <label className="mt-2">Role</label>
                <h3 className="mt-2">{user.roleEnum}</h3>
              </div>
              <div className="col-span-2 flex text-black justify-end">
                <button className="border-2 border-sicolor dark:bg-darkText dark:hover:text-darkText dark:hover:bg-darkSubbackground hover:bg-sicolor hover:text-darkText rounded font-semibold py-2 px-4">
                  Save Change
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "rank" && (
          <div className="flex flex-1 w-full dark:border dark:border-darkBorder gap-6 p-6 bg-wcolor dark:bg-darkBackground dark:text-darkText shadow-lg rounded-xl">
            <RankLevel />
            <div className="flex-1 p-4 bg-gray-50 dark:bg-darkSubbackground rounded-lg shadow-inner">
              <p className="text-2xl font-semibold text-gray-700 dark:text-darkText mb-6">
                Activity Log
              </p>
              <ul className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <li
                    key={index}
                    className="w-full flex items-center border-l-8 border-cyan-400 bg-wcolor dark:bg-darkBackground px-4 py-3 rounded-md shadow-sm hover:shadow-md transition"
                  >
                    <span className="text-gray-600 dark:text-darkSubtext font-medium">
                      Watched Video +8 points
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
