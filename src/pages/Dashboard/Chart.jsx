import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "react-i18next";
import URL from "../../config/URLconfig";
import axios from "axios";
import { LineChart, ResponsiveContainer } from "recharts";

const Chart = () => {
  const { t } = useTranslation("dashboard");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [monthData, setMonthData] = useState([]);
  const [courseEnroll, setCourseEnroll] = useState([]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchMonthData();
    fetchCourseEnroll();
  }, [selectedYear]);

  const fetchMonthData = () => {
    axios
      .get(`${URL}/payments/monthly-amounts/${selectedYear}`)
      .then((response) => setMonthData(response.data.data))
      .catch((error) =>
        console.log("Error get monthly data: " + error.message)
      );
  };

  const fetchCourseEnroll = () => {
    axios
      .get(`${URL}/enroll/top-enrollments`)
      .then((response) => setCourseEnroll(response.data.data))
      .catch((error) =>
        console.log("Error get course enroll: " + error.message)
      );
  };

  const lineChartOption = {
    title: {
      text: t("sales_analytic"),
      textStyle: { fontSize: isMobile ? 80 : 30 },
    },
    tooltip: { trigger: "axis", textStyle: { fontSize: isMobile ? 50 : 20 } },
    xAxis: {
      type: "category",
      data: monthData.map((md) => `Tháng ${md.month}`),
      axisLabel: { fontSize: isMobile ? 50 : 20 },
    },
    yAxis: { type: "value", axisLabel: { fontSize: isMobile ? 40 : 14 } },
    series: [
      {
        name: t("revenue"),
        type: "line",
        data: monthData.map((md) => md.amount),
        areaStyle: {},
        smooth: true,
        color: "#007bff",
        label: { show: true, fontSize: isMobile ? 40 : 20 },
      },
    ],
  };

  const pieChartOption = {
    title: {
      text: t("course_enrollments"),
      left: "center",
      textStyle: { fontSize: isMobile ? 80 : 30 },
    },
    tooltip: { trigger: "item", textStyle: { fontSize: isMobile ? 50 : 20 } },
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
        emphasis: { itemStyle: { color: "#007bff" } },
        label: { fontSize: isMobile ? 50 : 20 },
      },
    ],
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden gap-2">
      <div className="flex flex-1 lg:flex-row lg:p-0 flex-col gap-8 lg:gap-2">
        {/* Line Chart - Revenue */}
        <div className="lg:w-2/3 bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg lg:p-4 p-4">
          <div className="flex justify-between items-center mb-3">
            <h5 className="m-2 whitespace-nowrap lg:text-base text-5xl dark:text-darkText">
              Chọn năm:
            </h5>
            <select
              value={selectedYear}
              className="p-2 w-72 lg:w-full lg:h-12 h-24 lg:text-base text-5xl dark:bg-darkSubbackground dark:text-darkText border-2 dark:border-darkBorder rounded"
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {[...Array(5)].map((_, i) => {
                const year = currentYear - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="lg:w-full w-[90vw] mx-auto overflow-x-auto">
            <ReactECharts
              option={lineChartOption}
              className="lg:w-full w-[2000px]"
              style={{ height: isMobile ? 1000 : 400, filter: "invert(1)" }}
            />
          </div>
        </div>

        {/* Pie Chart - Course Enrollments */}
        <div className="lg:w-1/3 bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder rounded-lg p-4">
          <div className="lg:w-full w-[90vw] mx-auto overflow-x-auto">
            <ReactECharts
              option={pieChartOption}
              className="lg:w-full"
              style={{ height: isMobile ? 1000 : 400, filter: "invert(1)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
