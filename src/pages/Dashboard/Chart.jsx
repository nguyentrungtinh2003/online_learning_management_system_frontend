import React from "react";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "react-i18next";

const Chart = () => {
  const { t } = useTranslation("dashboard");

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
      data: [
        t("week_1"),
        t("week_2"),
        t("week_3"),
        t("week_4")
      ],
    },
    
    yAxis: { type: "value" },
    series: [
      {
        name: t("revenue"),
        type: "line",
        data: [5000, 8000, 7000, 12000],
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
        data: [
          { value: 150, name: courseNames[0] },
          { value: 200, name: courseNames[1] },
          { value: 180, name: courseNames[2] },
          { value: 120, name: courseNames[3] },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
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
        <div className="lg:w-2/3 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText shadow-lg rounded-lg p-4">
          <ReactECharts option={lineChartOption} style={{ height: 300, filter: 'invert(1)'  }} />
        </div>

        {/* Pie Chart - Course Enrollments */}
        <div className="lg:w-1/3 bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg p-4">
          <ReactECharts option={pieChartOption} style={{ height: 300, filter: 'invert(1)' }} />
        </div>
      </div>
      <div className="flex lg:flex-row flex-col gap-2">
        {/* Bar Chart - User Points by Course */}
        <div className="lg:w-1/2 bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg p-4">
          <ReactECharts option={barChartOption} style={{ height: 300, filter: 'invert(1)' }} />
        </div>

        {/* Radar Chart - User Progress */}
        <div className="lg:w-1/2 bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg p-4">
          <ReactECharts option={radarChartOption} style={{ height: 300, filter: 'invert(1)' }} />
        </div>
      </div>
    </div>
  );
};

export default Chart;
