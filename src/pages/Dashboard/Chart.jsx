import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "react-i18next";
import URL from "../../config/URLconfig";
import axios from "axios";
import Select from "react-select";
import { Button, ButtonGroup, Table } from "react-bootstrap";
import { FaCoins, FaStar } from "react-icons/fa";

const Chart = () => {
  const { t } = useTranslation("dashboard");

  const [monthData, setMonthData] = useState([]);
  const [courseEnroll, setCourseEnroll] = useState([]);
  const [userTop, setUserTop] = useState([]);
  const [type, setType] = useState("coin"); // "coin" hoặc "point"

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
      .then((response) => {
        setMonthData(response.data.data);
      })
      .catch((error) => {
        console.log("Error get count course " + error.message);
      });
  };

  const fetchCourseEnroll = () => {
    axios
      .get(`${URL}/enroll/top-enrollments`)
      .then((response) => {
        setCourseEnroll(response.data.data);
      })
      .catch((error) => {
        console.log("Error get course enroll " + error.message);
      });
  };

  const fetchTopUserTop = () => {
    const url = type === "coin" ? `${URL}/user/coin` : `${URL}/user/point`;
    axios
      .get(url)
      .then((response) => {
        setUserTop(response.data.data);
        console.log("Data top " + response.data.data);
      })
      .catch((error) => {
        console.log("Error get top user " + error.message);
      });
  };

  const courseNames = [
    t("web_development"),
    t("data_science"),
    t("ai_ml"),
    t("cybersecurity"),
  ];

  const lineChartOption = {
    title: { text: t("sales_analytic") },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: monthData.map((md) => `Tháng ${md.month}`), // hoặc md.month nếu không cần chữ "Tháng"
    },
    yAxis: { type: "value" },
    series: [
      {
        name: t("revenue"),
        type: "line",
        data: monthData.map((md) => md.amount),
        areaStyle: {},
        smooth: true,
        color: "#007bff",
      },
    ],
  };

  const pieChartOption = {
    title: { text: t("course_enrollments"), left: "center" },
    tooltip: { trigger: "item" },
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
      },
    ],
  };

  const barChartOption = {
    title: { text: t("user_points_by_course") },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: courseNames },
    yAxis: { type: "value" },
    series: [
      {
        name: t("points"),
        type: "bar",
        data: [200, 300, 250, 150],
        color: "#f39c12",
      },
    ],
  };

  const radarChartOption = {
    title: { text: t("user_progress") },
    tooltip: { trigger: "item" },
    radar: {
      indicator: courseNames.map((name) => ({
        name,
        max: 100,
      })),
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
      },
    ],
  };
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex flex-1 lg:flex-row flex-col gap-2">
        {/* Line Chart - Revenue */}
        <div className="lg:w-2/3 bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg p-4">
          <h5 className="m-2">Chọn năm:</h5>
          <Select
            options={years}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e)} // e là object { value, label }
          />

          <ReactECharts
            option={lineChartOption}
            style={{ height: 400, filter: "invert(1)" }}
          />
        </div>

        {/* Pie Chart - Course Enrollments */}
        <div className="lg:w-1/3 bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg p-4">
          <ReactECharts
            option={pieChartOption}
            style={{ height: 400, filter: "invert(1)" }}
          />
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
        <div className="w-full bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg p-4">
          <div className="">
            <h4 className=" text-black dark:text-darkText">
              Top 5 người dùng theo {type === "coin" ? "Coin" : "Point"}
            </h4>
            <ButtonGroup className="m-3">
              <Button
                variant={
                  type === "coin" ? "primary text-white" : "outline-primary"
                }
                onClick={() => setType("coin")}
                className="text-black dark:text-darkText"
              >
                <FaCoins style={{ color: "gold" }} size={30} />
              </Button>
              <Button
                variant={
                  type === "point" ? "primary text-white" : "outline-primary"
                }
                onClick={() => setType("point")}
                className="text-black dark:text-darkText"
              >
                <FaStar style={{ color: "gold" }} size={30} />
              </Button>
            </ButtonGroup>

            <Table
              striped
              bordered
              hover
              responsive
              className=" dark:bg-darkBackground dark:text-darkText border dark:border-darkBorder"
            >
              <thead className="dark:bg-darkBackground dark:text-darkText">
                <tr className="dark:bg-darkBackground dark:hover:bg-darkHover dark:hover:text-darkBackground">
                  <th>ID</th>
                  <th>Ảnh</th>
                  <th>Username</th>
                  <th>{type === "coin" ? "Coin" : "Point"}</th>
                </tr>
              </thead>
              <tbody className="dark:bg-darkBackground dark:text-darkText dark:hover:bg-darkHover dark:hover:text-darkBackground">
                {userTop.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={user.img || "/user.png"}
                        alt="avatar"
                        width="40"
                        height="40"
                        className="rounded-full"
                      />
                    </td>
                    <td>{user.username}</td>
                    <td>
                      <span className="inline-flex items-center gap-1">
                        {type === "coin" ? (
                          <>
                            {user.coin?.toLocaleString("vi-VN")}
                            <FaCoins style={{ color: "gold" }} size={20} />
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
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
