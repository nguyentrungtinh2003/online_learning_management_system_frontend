import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

const Chart = () => {
  // Data for Bar Chart
  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Investment",
        data: [30, 50, 70, 90, 50, 40, 60, 80, 90, 100, 120, 110],
        backgroundColor: "rgba(135, 206, 250, 0.7)", // Light blue
      },
      {
        label: "Loss",
        data: [20, 30, 50, 60, 40, 30, 50, 70, 80, 90, 100, 90],
        backgroundColor: "rgba(30, 144, 255, 0.7)", // Blue
      },
      {
        label: "Profit",
        data: [40, 70, 90, 110, 60, 50, 70, 90, 100, 120, 130, 120],
        backgroundColor: "rgba(0, 0, 139, 0.7)", // Dark blue
      },
      {
        label: "Maintenance",
        data: [10, 20, 30, 40, 30, 20, 30, 50, 60, 70, 80, 60],
        backgroundColor: "rgba(211, 211, 255, 0.7)", // Light purple
      },
    ],
  };

  // Data for Line Chart
  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [200, 300, 500, 400, 600, 700, 500, 800, 700, 900, 1000, 1100],
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: "rgba(0, 123, 255, 1)",
      },
      {
        label: "Expenses",
        data: [150, 200, 300, 250, 400, 500, 300, 400, 500, 600, 700, 800],
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          drawBorder: false,
        },
        ticks: {
          stepSize: 100,
        },
      },
    },
  };

  return (
    <div className="p-4">
      <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Bar Chart</h3>
        <Bar data={barData} options={options} />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Line Chart</h3>
        <Line data={lineData} options={options} />
      </div>
    </div>
  );
};

export default Chart;
