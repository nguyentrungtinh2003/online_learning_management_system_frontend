import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import URL from "../../config/URLconfig";
import axios from "axios";
import { TbCoin } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import { PiEyeBold } from "react-icons/pi";
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const StatisticalTable = () => {
  const { t } = useTranslation("dashboard");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [monthData, setMonthData] = useState([]);
  const [courseEnroll, setCourseEnroll] = useState([]);
  const [userTop, setUserTop] = useState([]);
  const [type, setType] = useState("coin");

  const [logData, setLogData] = useState([]);
  const [logAllData, setLogAllData] = useState([]);
  const [loginData, setLoginData] = useState([]);
  const [blogData, setBlogData] = useState([]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString(),
  }));
  const [selectedYear, setSelectedYear] = useState(years[0]);

  useEffect(() => {
    fetchMonthData();
    fetchCourseEnroll();
    fetchTopUserTop();
    fetchLog();
    fetchBlog();
    fetchLogLogin();
  }, [selectedYear, type]);

  const fetchMonthData = () => {
    axios
      .get(`${URL}/payments/monthly-amounts/${selectedYear.value}`)
      .then((response) => setMonthData(response.data.data))
      .catch((error) => console.log("Error get count course " + error.message));
  };

  const fetchCourseEnroll = () => {
    axios
      .get(`${URL}/enroll/top-enrollments`)
      .then((response) => setCourseEnroll(response.data.data))
      .catch((error) =>
        console.log("Error get course enroll " + error.message)
      );
  };

  const fetchLog = () => {
    axios
      .get(`${URL}/admin/logs/all`, { withCredentials: true })
      .then((response) => {
        const now = new Date();
        const past30Days = new Date(now);
        past30Days.setDate(now.getDate() - 30);

        const logs = response.data.data;

        setLogAllData(logs);

        // Đếm số log theo action, nhưng chỉ trong 30 ngày
        const actionCount = {};
        logs.forEach((log) => {
          const logDate = new Date(...log.timestamp); // convert mảng timestamp thành Date
          if (logDate >= past30Days) {
            const action = log.action;
            actionCount[action] = (actionCount[action] || 0) + 1;
          }
        });

        // Chuyển sang mảng để dùng cho biểu đồ
        const chartData = Object.entries(actionCount).map(
          ([action, count]) => ({
            action,
            count,
          })
        );

        setLogData(chartData);
      })
      .catch((error) =>
        console.log("Error get count logs in 30 days: " + error.message)
      );
  };

  const fetchLogLogin = () => {
    axios
      .get(`${URL}/admin/login-logs/all`, { withCredentials: true })
      .then((response) => {
        const logs = response.data.data;
        setLoginData(logs);
      })
      .catch((error) =>
        console.log("Error get count logs in 30 days: " + error.message)
      );
  };

  const fetchBlog = () => {
    axios
      .get(`${URL}/blogs/all`, { withCredentials: true })
      .then((response) => {
        const blogs = response.data.data;

        const blogData = blogs.map((blog, index) => ({
          blogName: blog.blogName,
          likedUsers: blog.likedUsers.length,
        }));

        setBlogData(blogData); // gán kết quả đã lọc
      })
      .catch((error) =>
        console.log("Error get count logs in 30 days: " + error.message)
      );
  };

  const fetchTopUserTop = () => {
    const url = type === "coin" ? `${URL}/user/coin` : `${URL}/user/point`;
    axios
      .get(url)
      .then((response) => setUserTop(response.data.data))
      .catch((error) => console.log("Error get top user " + error.message));
  };

  return (
    <div className="space-y-2">
      {/* Section 1: Thống kê bài viết */}
      <div className="bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-darkText">
          📈 {t("blogStats")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-700 dark:text-gray-300">
          {blogData.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 flex flex-col justify-between dark:bg-darkHover dark:text-darkText rounded-lg border-2 dark:border-darkBorder shadow-sm"
            >
              <p className="text-lg font-bold">{item.blogName}</p>
              <p className="text-2xl flex items-center gap-2 text-cyan-400 font-semibold">
                {item.likedUsers}
                <PiEyeBold size={30}/>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Logs + Nhật ký */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="lg:w-full bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder rounded-lg p-4">
          <div style={{ width: "100%", height: 400 }}>
            <h4 className="dark:text-darkText lg:text-xl text-5xl">
              {t("userLogs")}
            </h4>
            <ResponsiveContainer>
              <BarChart
                data={logData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="action" />
                <YAxis allowDecimals={false} />
                <Tooltip
                contentStyle={{ backgroundColor: "#334155", borderRadius: "8px", border: "none" }}
                itemStyle={{ color: "#22d3ee" }}
                labelStyle={{ color: "#FFFFFF" }} // màu cho nhãn label
                />
                <Legend />
                <Bar dataKey="count" fill="#22d3ee" name={t("count")} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-darkText">
            🧾 {t("recentActivities")}
          </h2>
          <ul className="space-y-4 max-h-[400px] overflow-auto">
            {logAllData.map((log, idx) => {
              const date = new Date(...log.timestamp);
              const formatted = date.toLocaleString("vi-VN");
              return (
                <li
                  key={idx}
                  className="border-2 dark:text-darkText rounded-lg p-4 dark:border-darkBorder bg-gray-50 dark:bg-darkHover"
                >
                  <p>
                    <span className="font-bold text-green-600">
                      {log.username}
                    </span>{" "}
                    - <span className="text-yellow-500">{log.action}</span>
                  </p>
                  <p className="text-sm">{log.details}</p>
                  <p className="text-xs dark:text-darkSubtext text-gray-500">{formatted}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Section 3: Top người dùng & Login history */}
      <div className="space-y-2">
        <div className="bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder rounded-lg pb-4 px-4">
          <div className="flex items-center justify-between py-4">
            <h4 className="dark:text-darkText lg:text-xl text-2xl">
              {t("topUsers")} {type === "coin" ? "Coin" : "Point"}
            </h4>
            <div className="flex gap-2 text-xl font-semibold">
              <button
                className={`border-2 dark:border-darkBorder font-bold rounded-xl px-4 py-2 flex items-center gap-2 ${
                  type === "coin"
                    ? "bg-darkBackground text-wcolor dark:bg-darkBorder dark:text-ficolor"
                    : "dark:text-darkText"
                }`}
                onClick={() => setType("coin")}
              >
                <TbCoin style={{ color: "gold" }} />
              </button>
              <button
                className={`dark:border-darkBorder border-2 font-bold rounded-xl px-4 py-2 flex items-center gap-2 ${
                  type === "point"
                    ? "bg-darkBackground text-wcolor dark:bg-darkBorder dark:text-darkBackground"
                    : "dark:text-darkText"
                }`}
                onClick={() => setType("point")}
              >
                <FaStar style={{ color: "gold" }} />
              </button>
            </div>
          </div>

          <div className="overflow-auto p-4 rounded-2xl border-2 dark:bg-darkSubbackground dark:text-darkText dark:border-darkBorder">
            <table className="lg:w-full w-[200%]">
              <thead>
                <tr className="lg:text-base text-xl text-center">
                  <th className="p-2">ID</th>
                  <th className="p-2">{t("avatar")}</th>
                  <th className="p-2">Username</th>
                  <th className="p-2">{type === "coin" ? "Coin" : "Point"}</th>
                </tr>
              </thead>
              <tbody>
                {userTop.map((user, index) => (
                  <tr
                    key={index}
                    className="text-center hover:bg-tcolor dark:hover:bg-darkHover"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">
                      <img
                        src={user.img || "/user.png"}
                        alt="avatar"
                        className="rounded-full lg:h-12 h-20 w-20 lg:w-12"
                      />
                    </td>
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">
                      <span className="inline-flex items-center gap-1">
                        {type === "coin" ? (
                          <>
                            {user.coin?.toLocaleString("vi-VN")}
                            <TbCoin style={{ color: "gold" }} />
                          </>
                        ) : (
                          <>
                            {user.point?.toLocaleString("vi-VN")}
                            <FaStar style={{ color: "gold" }} />
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lịch sử đăng nhập */}
        <div className="bg-wcolor dark:bg-darkSubbackground rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-darkText">
            🔐 {t("loginHistory")}
          </h2>
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full text-center text-sm dark:text-darkText">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-darkText">
                  <th className="py-2">ID</th>
                  <th>Username</th>
                  <th>IP</th>
                  <th>{t("status")}</th>
                  <th>{t("message")}</th>
                </tr>
              </thead>
              <tbody>
                {loginData.map((entry, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-darkHover"
                  >
                    <td className="py-2">{index + 1}</td>
                    <td>{entry.username}</td>
                    <td>{entry.ipAddress}</td>
                    <td
                      className={
                        entry.success ? "text-green-600" : "text-red-600"
                      }
                    >
                      {entry.success ? t("success") : t("fail")}
                    </td>
                    <td>{entry.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticalTable;
