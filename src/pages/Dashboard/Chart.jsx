import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "react-i18next";
import URL from "../../config/URLconfig";
import axios from "axios";
import { TbCoin } from "react-icons/tb";
import { FaStar } from "react-icons/fa";

const Chart = () => {
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
      .catch((error) => console.log("Error get course enroll " + error.message));
  };

  const fetchTopUserTop = () => {
    const url = type === "coin" ? `${URL}/user/coin` : `${URL}/user/point`;
    axios
      .get(url)
      .then((response) => setUserTop(response.data.data))
      .catch((error) => console.log("Error get top user " + error.message));
  };

  const courseNames = [
    t("web_development"),
    t("data_science"),
    t("ai_ml"),
    t("cybersecurity"),
  ];

  const lineChartOption = {
    title: {
      text: t("sales_analytic"),
      textStyle: {
        fontSize: isMobile ? 80 : 30,
      },
    },
    tooltip: {
      trigger: "axis",
      textStyle: {
        fontSize: isMobile ? 50 : 20,
      },
    },
    xAxis: {
      type: "category",
      data: monthData.map((md) => `Tháng ${md.month}`),
      axisLabel: {
        fontSize: isMobile ? 50 : 20,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: isMobile ? 40 : 14,
      },
    },
    series: [
      {
        name: t("revenue"),
        type: "line",
        data: monthData.map((md) => md.amount),
        areaStyle: {},
        smooth: true,
        color: "#007bff",
        label: {
          show: true,
          fontSize: isMobile ? 40 : 20,
        },
      },
    ],
  };

  const pieChartOption = {
    title: {
      text: t("course_enrollments"),
      left: "center",
      textStyle: {
        fontSize: isMobile ? 80 : 30,
      },
    },
    tooltip: {
      trigger: "item",
      textStyle: {
        fontSize: isMobile ? 50 : 20,
      },
    },
    series: [
      {
        name: t("enrollments"),
        type: "pie",
        radius: "50%",
        data:
          courseEnroll.length > 0
            ? courseEnroll.map((ce) => ({
                name: ce.course.courseName,
                value: ce.enrollmentCount,
              }))
            : [],
        emphasis: {
          itemStyle: {
            color: "#007bff",
          },
        },
        label: {
          fontSize: isMobile ? 50 : 20,
        },
      },
    ],
  };

  const barChartOption = {
    title: {
      text: t("user_points_by_course"),
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "axis",
      textStyle: {
        fontSize: 14,
      },
    },
    xAxis: {
      type: "category",
      data: courseNames,
      axisLabel: {
        fontSize: 14,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 14,
      },
    },
    series: [
      {
        name: t("points"),
        type: "bar",
        data: [200, 300, 250, 150],
        color: "#f39c12",
        label: {
          show: true,
          fontSize: 14,
        },
      },
    ],
  };

  const radarChartOption = {
    title: {
      text: t("user_progress"),
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "item",
      textStyle: {
        fontSize: 14,
      },
    },
    radar: {
      indicator: courseNames.map((name) => ({
        name,
        max: 100,
      })),
      name: {
        textStyle: {
          fontSize: 14,
        },
      },
    },
    series: [
      {
        name: t("user_progress"),
        type: "radar",
        data: [
          { value: [80, 90, 85, 70], name: t("user_a") },
          { value: [60, 70, 65, 50], name: t("user_b") },
        ],
        areaStyle: {},
        color: "#e74c3c",
        label: {
          fontSize: 14,
        },
      },
    ],
  };
  return (
    <div className="flex flex-1 flex-col overflow-hidden gap-2">
      <div className="flex flex-1 lg:flex-row lg:p-0 py-4 flex-col gap-8 lg:gap-2">
        {/* Line Chart - Revenue */}
        <div className="lg:w-2/3 bg-wcolor lg:gap-4 gap-16 flex flex-col w-full dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg lg:p-4">
          <div className="flex justify-between items-center">
            <h5 className="m-2 whitespace-nowrap lg:text-base text-5xl dark:text-darkText">Chọn năm:</h5>
          <select
            value={selectedYear}
            className="p-2 w-72 lg:w-full lg:h-12 h-24 lg:text-base text-5xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
            onChange={(e) => setSelectedYear(e)} // e là object { value, label }
          >
            <option>2025</option>
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
            <option>2021</option>
          </select>
          </div>

          <div className="lg:w-full w-[90vw] mx-auto overflow-x-auto">
            <ReactECharts
            option={lineChartOption}
            className="lg:w-full w-[2000px]"
            style={{ height: isMobile? 1000 : 400, filter: "invert(1)" }}
          />
          </div>
        </div>

        {/* Pie Chart - Course Enrollments */}
        <div className="lg:w-1/3 bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg p-4">
          <div className="lg:w-full w-[90vw] mx-auto overflow-x-auto">
            <ReactECharts
            option={pieChartOption}
            className="lg:w-full"
            style={{ height: isMobile? 1000 : 400, filter: "invert(1)" }}
          />
          </div>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col gap-2">
        {/* Bar Chart - User Points by Course */}
        {/* <div className="lg:w-1/2 bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg p-4">
          <ReactECharts
            option={barChartOption}
            style={{ height: 300, filter: "invert(1)" }}
          />
        </div> */}

        {/* Radar Chart - User Progress */}
        <div className="w-full bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg pb-4 px-4">
          <div className="">
            <div className="flex items-center justify-between py-4">
              <h4 className="dark:text-darkText lg:text-xl text-5xl">
              Top 5 người dùng theo {type === "coin" ? "Coin" : "Point"}
            </h4>
            <div className="flex gap-2 text-3xl lg:text-base font-semibold">
              <button
                className={`border-2 dark:border-darkBorder font-bold rounded-xl px-4 py-2 flex items-center gap-2 ${
                  type === "coin"
                    ? "bg-darkBackground text-wcolor dark:bg-darkBorder dark:text-ficolor"
                    : "dark:text-darkText"
                }`}
                onClick={() => setType("coin")}
              >
                <TbCoin style={{ color: "gold" }} size={isMobile ? 55 : 25} />
              </button>
              <button
                className={`dark:border-darkBorder border-2 font-bold rounded-xl px-4 py-2 flex items-center gap-2 ${
                  type === "point"
                    ? "bg-darkBackground text-wcolor dark:bg-darkBorder dark:text-darkBackground"
                    : "dark:text-darkText"
                }`}
                onClick={() => setType("point")}
              >
                <FaStar style={{ color: "gold" }} size={isMobile ? 55 : 25} />
              </button>
            </div>
            </div>
            <div className="bg-wcolor h-fit overflow-auto p-4 rounded-2xl border-2 dark:bg-darkSubbackground dark:text-darkText dark:border-darkBorder">
              <table
              className="lg:w-full w-[200%] px-4 bg-wcolor dark:bg-darkSubbackground dark:text-darkText dark:border-darkBorder"
              >
                <thead className="dark:text-darkText">
                  <tr className="lg:text-2xl text-6xl text-center">
                    <th className="p-2">ID</th>
                    <th className="p-2">Ảnh</th>
                    <th className="p-2">Username</th>
                    <th className="p-2">{type === "coin" ? "Coin" : "Point"}</th>
                  </tr>
                </thead>
                <tbody className="dark:text-darkText">
                  {userTop.map((user, index) => (
                    <tr key={index} className="lg:text-xl text-5xl text-center  dark:hover:bg-darkHover hover:bg-tcolor">
                      <td className="lg:h-16 h-[11vh] p-2 w-32">{index + 1}</td>
                      <td className="p-2 place-items-center">
                        <img
                          src={user.img || "/user.png"}
                          alt="avatar"
                          className="rounded-full lg:h-12 h-32 w-32 lg:w-12"
                        />
                      </td>
                      <td className="p-2 w-72 whitespace-nowrap">{user.username}</td>
                      <td className="w-[400px] p-2">
                        <span className="inline-flex items-center gap-1">
                          {type === "coin" ? (
                            <>
                              {user.coin?.toLocaleString("vi-VN")}
                              <TbCoin style={{ color: "gold" }} size={20} />
                            </>
                          ) : (
                            <>
                              {user.point?.toLocaleString("vi-VN")}
                              <FaStar style={{ color: "gold" }} size={20} />
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
        </div>
      </div>
    </div>
  );
};

export default Chart;
