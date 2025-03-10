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

  return (
    <div className="flex gap-4">
      {/* Line Chart - Revenue */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-4">
        <ReactECharts option={lineChartOption} style={{ height: 300 }} />
      </div>

      {/* Pie Chart - Course Enrollments */}
      <div className="w-1/3 bg-white shadow-lg rounded-lg p-4">
        <ReactECharts option={pieChartOption} style={{ height: 300 }} />
      </div>
    </div>
  );
};

export default Chart;
