import React from "react";
import ReactECharts from "echarts-for-react";

const Chart = () => {
  // Line Chart - Revenue
  const lineChartOption = {
    title: { text: "Sales Analytic" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: ["Week 1", "Week 2", "Week 3", "Week 4"] },
    yAxis: { type: "value" },
    series: [
      {
        name: "Revenue",
        type: "line",
        data: [5000, 8000, 7000, 12000],
        areaStyle: {},
        smooth: true,
        color: "#007bff",
      },
    ],
  };

  // Pie Chart - Course Enrollments
  const pieChartOption = {
    title: { text: "Course Enrollments", left: "center" },
    tooltip: { trigger: "item" },
    series: [
      {
        name: "Enrollments",
        type: "pie",
        radius: "50%",
        data: [
          { value: 150, name: "Web Development" },
          { value: 200, name: "Data Science" },
          { value: 180, name: "AI & ML" },
          { value: 120, name: "Cybersecurity" },
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

  // Bar Chart - User Points by Course
  const barChartOption = {
    title: { text: "User Points by Course" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: ["Web Development", "Data Science", "AI & ML", "Cybersecurity"] },
    yAxis: { type: "value" },
    series: [
      {
        name: "Points",
        type: "bar",
        data: [200, 300, 250, 150],
        color: "#f39c12",
      },
    ],
  };

  // Radar Chart - User Progress
  const radarChartOption = {
    title: { text: "User Progress" },
    tooltip: { trigger: "item" },
    radar: {
      indicator: [
        { name: "Web Development", max: 100 },
        { name: "Data Science", max: 100 },
        { name: "AI & ML", max: 100 },
        { name: "Cybersecurity", max: 100 },
      ],
    },
    series: [
      {
        name: "User Progress",
        type: "radar",
        data: [
          { value: [80, 90, 85, 70], name: "User A" },
          { value: [60, 70, 65, 50], name: "User B" },
        ],
        areaStyle: {},
        color: "#e74c3c",
      },
    ],
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {/* Line Chart - Revenue */}
        <div className="flex-1 bg-wcolor dark:border dark:border-darkBorder dark:bg-darkSubbackground dark:text-darkText shadow-lg rounded-lg p-4">
          <ReactECharts option={lineChartOption} style={{ height: 300, filter: 'invert(1)'  }} />
        </div>

        {/* Pie Chart - Course Enrollments */}
        <div className="w-1/3 bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg p-4">
          <ReactECharts option={pieChartOption} style={{ height: 300, filter: 'invert(1)' }} />
        </div>
      </div>
      <div className="flex gap-2">
        {/* Bar Chart - User Points by Course */}
        <div className="w-full bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg p-4">
          <ReactECharts option={barChartOption} style={{ height: 300, filter: 'invert(1)' }} />
        </div>

        {/* Radar Chart - User Progress */}
        <div className="w-full bg-wcolor dark:bg-darkSubbackground dark:border dark:border-darkBorder shadow-lg rounded-lg p-4">
          <ReactECharts option={radarChartOption} style={{ height: 300, filter: 'invert(1)' }} />
        </div>
      </div>
    </div>
  );
};

export default Chart;
