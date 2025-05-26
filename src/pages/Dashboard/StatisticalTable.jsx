import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import URL from "../../config/URLconfig";
import axios from "axios";
import { TbCoin } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import { RiContactsBook3Fill } from "react-icons/ri";
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
  const [Alerts, setAlerts] = useState([]);

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

  useEffect(() => {
    const alertsList = [];
    const generateAlerts = () => {
      const ipMap = {};
      const failedLoginMap = {};
      const endpointMap = {};
      const userAgentMap = {};
      const geoMap = {};
      const endpointScanMap = {};
      const userAccessMap = {};
      const sensitiveEndpointMap = {};

      const now = new Date();

      loginData.forEach((log) => {
        const time = new Date(...log.timestamp);
        const diffInSeconds = (now - time) / 1000;
        const hour = time.getHours();

        if (log.username !== "Nguyễn Trung Tính") {
          // Rule 1: > 5 requests cùng IP trong 10s (Brute-force IP)
          if (diffInSeconds < 10) {
            ipMap[log.ipAddress] = (ipMap[log.ipAddress] || 0) + 1;
            if (ipMap[log.ipAddress] > 5) {
              alertsList.push({
                type: "Medium",
                message: `IP ${log.ipAddress} ${log.username} gửi > 5 request trong 10s`,
              });
            }
          }

          // Rule 2: > 10 lần thất bại liên tiếp cho 1 user
          if (!log.success) {
            failedLoginMap[log.username] =
              (failedLoginMap[log.username] || 0) + 1;
            if (failedLoginMap[log.username] > 10) {
              alertsList.push({
                type: "High",
                message: `Người dùng ${log.username} IP ${log.ipAddress} có > 10 lần login thất bại`,
              });
            }
          }

          // Rule 3: Truy cập endpoint /api/admin nhiều lần (dò quyền admin)
          if (log.message.includes("/api/admin")) {
            endpointMap[log.username] = (endpointMap[log.username] || 0) + 1;
            if (endpointMap[log.username] > 3) {
              alertsList.push({
                type: "Medium",
                message: `IP ${log.ipAddtess} ${log.username} truy cập endpoint admin nhiều lần`,
              });
            }
          }

          // Rule 4: IP không thuộc whitelist VN (IP lạ)
          const trustedIps = ["14.169.", "113.", "27."];
          if (!trustedIps.some((prefix) => log.ipAddress.startsWith(prefix))) {
            alertsList.push({
              type: "High",
              message: `IP lạ ${log.ipAddress} phát hiện từ user ${log.username}`,
            });
          }

          // Rule 5: User login từ nhiều IP khác nhau
          geoMap[log.username] = geoMap[log.username] || new Set();
          geoMap[log.username].add(log.ipAddress);
          if (geoMap[log.username].size > 3) {
            alertsList.push({
              type: "Medium",
              message: `Người dùng ${
                log.username
              } login từ nhiều IP khác nhau ${geoMap[log.username]}`,
            });
          }

          // Rule 6: Trình duyệt/trình giả lập lạ
          if (log.userAgent) {
            userAgentMap[log.username] =
              userAgentMap[log.username] || new Set();
            userAgentMap[log.username].add(log.userAgent);
            if (userAgentMap[log.username].size > 2) {
              alertsList.push({
                type: "Low",
                message: `IP ${log.ipAddtess} ${log.username} dùng nhiều thiết bị / trình duyệt khác nhau`,
              });
            }
          }

          // Rule 7: 1 IP login nhiều tài khoản khác nhau
          const usernamesFromIp = loginData
            .filter((l) => l.ipAddress === log.ipAddress)
            .map((l) => l.username);
          const uniqueUsernames = new Set(usernamesFromIp);
          if (uniqueUsernames.size > 5) {
            alertsList.push({
              type: "High",
              message: `IP ${log.ipAddress} ${log.username} login vào nhiều tài khoản khác nhau`,
            });
          }

          // Rule 8: Truy cập nhiều endpoint khác nhau liên tiếp (scan hệ thống)
          endpointScanMap[log.ipAddress] =
            endpointScanMap[log.ipAddress] || new Set();
          endpointScanMap[log.ipAddress].add(log.message);
          if (endpointScanMap[log.ipAddress].size > 10) {
            alertsList.push({
              type: "Medium",
              message: `${log.username} IP ${log.ipAddress} quét nhiều endpoint khác nhau (có thể đang scan hệ thống)`,
            });
          }

          // Rule 9: Người dùng truy cập quá nhiều endpoint trong 1 phút
          userAccessMap[log.username] = userAccessMap[log.username] || [];
          userAccessMap[log.username].push(time);
          const recentAccess = userAccessMap[log.username].filter(
            (t) => (now - t) / 1000 < 60
          );
          if (recentAccess.length > 15) {
            alertsList.push({
              type: "Medium",
              message: `${log.username} IP ${log.ipAddress} gửi > 15 request trong 1 phút`,
            });
          }

          // Rule 10: Truy cập thành công endpoint admin từ IP lạ
          if (
            log.success &&
            log.message.includes("/api/admin") &&
            !trustedIps.some((prefix) => log.ipAddress.startsWith(prefix))
          ) {
            alertsList.push({
              type: "High",
              message: `Truy cập admin thành công từ IP lạ: ${log.ipAddress} bởi ${log.username}`,
            });
          }

          // Rule 11: Truy cập vào ban đêm (0h - 5h sáng)
          if (hour >= 0 && hour <= 5) {
            alertsList.push({
              type: "Low",
              message: `${log.username} IP ${log.ipAddress} truy cập vào giờ khuya (từ ${hour}h)`,
            });
          }

          // Rule 12: IP truy cập nhiều endpoint nhạy cảm
          const sensitiveEndpoints = [
            "/api/admin",
            "/api/admin/",
            "/api/login",
            "/api/register",
            "/api/forgot-password",
            "/api/reset-password",
          ];
          sensitiveEndpoints.forEach((ep) => {
            if (log.message.includes(ep)) {
              sensitiveEndpointMap[log.ipAddress] =
                sensitiveEndpointMap[log.ipAddress] || 0;
              sensitiveEndpointMap[log.ipAddress]++;
              if (sensitiveEndpointMap[log.ipAddress] > 8) {
                alertsList.push({
                  type: "High",
                  message: `IP ${log.ipAddress} ${log.username} đang truy cập nhiều endpoint nhạy cảm`,
                });
              }
            }
          });
        }
      });
    };

    setAlerts(alertsList.reverse());

    generateAlerts();
  }, [loginData]);

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

        setLogAllData(logs.reverse());

        // Đếm số log theo action, nhưng chỉ trong 30 ngày
        const actionCount = {};
        logs.forEach((log) => {
          if (log.username !== "Nguyễn Trung Tính") {
            const logDate = new Date(...log.timestamp); // convert mảng timestamp thành Date
            if (logDate >= past30Days) {
              const action = log.action;
              actionCount[action] = (actionCount[action] || 0) + 1;
            }
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

        const filteredLogs = [];

        logs.forEach((log) => {
          if (log.username !== "Nguyễn Trung Tính") {
            filteredLogs.push(log); // Thêm vào mảng hiển thị
          }
        });

        setLoginData(filteredLogs.reverse()); // dữ liệu dùng để phân tích / render
      })
      .catch((error) =>
        console.log("Error get count logs in 30 days: " + error.message)
      );
  };

  const loginByDate = {};

  loginData.forEach((entry) => {
    const dateStr = new Date(
      entry.timestamp[0],
      entry.timestamp[1] - 1,
      entry.timestamp[2]
    ).toLocaleDateString("en-CA"); // định dạng YYYY-MM-DD

    loginByDate[dateStr] = (loginByDate[dateStr] || 0) + 1;
  });

  const timeChartData = Object.entries(loginByDate).map(([date, count]) => ({
    date,
    count,
  }));

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
        <h2 className="text-3xl lg:text-xl font-semibold mb-4 dark:text-darkText">
          📈 {t("blogStats")}
        </h2>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={blogData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="blogName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="likedUsers"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ r: 5 }}
              name={t("likedUser")}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Section 2: Logs + Nhật ký */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="lg:w-full bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder rounded-lg p-4">
          <div style={{ width: "100%", height: 400 }}>
            <h4 className="dark:text-darkText lg:text-xl text-3xl">
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
                  contentStyle={{
                    backgroundColor: "#334155",
                    borderRadius: "8px",
                    border: "none",
                  }}
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
          <h2 className="text-3xl lg:text-xl font-semibold mb-4 dark:text-darkText">
            🧾 {t("recentActivities")}
          </h2>
          <ul className="space-y-4 max-h-[400px] overflow-auto">
            {logAllData?.map((log, idx) => {
              const formattedDate = new Date(
                log?.timestamp[0],
                log.timestamp[1] - 1, // Tháng trong JS tính từ 0
                log.timestamp[2],
                log.timestamp[3],
                log.timestamp[4],
                log.timestamp[5]
              ).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <li
                  key={idx}
                  className="border-2 flex w-full justify-between items-center dark:text-darkText rounded-lg p-4 dark:border-darkBorder bg-gray-50 dark:bg-darkHover"
                >
                  <div>
                    <p>
                      <span className="font-bold text-green-600">
                        {log.username}
                      </span>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <span className="text-yellow-500 flex items-center gap-1">
                        <RiContactsBook3Fill />
                        <span className="text-gray-400">•</span>
                        {log.action}
                      </span>{" "}
                      <span className="text-gray-400">|</span> {log.details}
                    </p>
                  </div>
                  <p className="text-base dark:text-darkSubtext text-gray-500">
                    {formattedDate}
                  </p>
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
            <h4 className="dark:text-darkText lg:text-xl text-3xl">
              {t("topUsers")} {type === "coin" ? "Coin" : "Point"}
            </h4>
            <div className="flex gap-2 text-xl font-semibold">
              <button
                className={`border-2 text-4xl lg:text-base dark:border-darkBorder font-bold rounded-xl px-4 py-2 flex items-center gap-2 ${
                  type === "coin"
                    ? "bg-darkBackground text-wcolor dark:bg-darkBorder dark:text-ficolor"
                    : "dark:text-darkText"
                }`}
                onClick={() => setType("coin")}
              >
                <TbCoin style={{ color: "gold" }} />
              </button>
              <button
                className={`text-4xl lg:text-base dark:border-darkBorder border-2 font-bold rounded-xl px-4 py-2 flex items-center gap-2 ${
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

          <div className="overflow-auto max-h-[400px] rounded-2xl border-2 dark:bg-darkSubbackground dark:text-darkText dark:border-darkBorder">
            <table className="lg:w-full w-[100%]">
              <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-slate-900">
                <tr className="lg:text-base text-2xl text-center">
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
                    className="text-center text-2xl lg:text-base hover:bg-tcolor dark:hover:bg-darkHover"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2 flex justify-center">
                      <img
                        src={user.img || "/user.png"}
                        alt="avatar"
                        className="rounded-full lg:h-12 h-20 w-20 lg:w-12"
                      />
                    </td>
                    <td className="p-2 w-72">{user.username}</td>
                    <td className="p-2 w-72">
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

          {/* Cảnh báo */}
          {Alerts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2 dark:text-darkText">
                {t("alertTitle")}
              </h3>
              <div className="space-y-3 max-h-[250px] overflow-auto">
                {Alerts.map((alert, idx) => {
                  const baseStyles =
                    "p-4 rounded-lg shadow-md border-l-4 flex items-start gap-3";
                  let bgColor = "",
                    borderColor = "",
                    textColor = "",
                    icon = "";

                  switch (alert.type) {
                    case "High":
                      bgColor = "bg-red-50 dark:bg-red-100/10";
                      borderColor = "border-red-500";
                      textColor = "text-red-800 dark:text-red-400";
                      icon = "🚨";
                      break;
                    case "Medium":
                      bgColor = "bg-yellow-50 dark:bg-yellow-100/10";
                      borderColor = "border-yellow-500";
                      textColor = "text-yellow-800 dark:text-yellow-300";
                      icon = "⚠️";
                      break;
                    case "Low":
                      bgColor = "bg-blue-50 dark:bg-blue-100/10";
                      borderColor = "border-blue-500";
                      textColor = "text-blue-800 dark:text-blue-300";
                      icon = "ℹ️";
                      break;
                    default:
                      bgColor = "bg-gray-50 dark:bg-gray-800";
                      borderColor = "border-gray-400";
                      textColor = "text-gray-800 dark:text-gray-300";
                      icon = "❔";
                  }

                  return (
                    <div
                      key={idx}
                      className={`${baseStyles} ${bgColor} ${borderColor} ${textColor}`}
                    >
                      <span className="text-xl">{icon}</span>
                      <div>
                        <div className="font-semibold">
                          {alert.type === "High"
                            ? t("alertHigh")
                            : alert.type === "Medium"
                            ? t("alertMedium")
                            : alert.type === "Low"
                            ? t("alertLow")
                            : t("alertUnknown")}
                        </div>
                        <div className="text-sm">{alert.message}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={timeChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 5 }}
                name={t("chart.visits")}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Bảng lịch sử đăng nhập */}
          <div className="overflow-auto max-h-[400px]">
            <h3 className="text-lg font-medium mb-2 dark:text-darkText">
              {t("table.loginHistory")}
            </h3>
            <table className="w-full text-sm text-center dark:text-darkText">
              <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-slate-900">
                <tr className="bg-gray-100 text-base dark:bg-slate-900 text-gray-700 dark:text-darkText">
                  <th className="py-2">{t("table.id")}</th>
                  <th>{t("table.username")}</th>
                  <th>{t("table.ip")}</th>
                  <th>{t("table.status")}</th>
                  <th>{t("table.message")}</th>
                  <th>{t("table.time")}</th>
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
