import React from "react";
import Sidebar from "./Sidebar ";
import DashboardCard from "./DashboardCard";
import Chart from "./Chart";

const Dashboard = () => {
  return (
    <div className="d-flex m-4">
      <Sidebar />
      <div className="flex-grow-1">
        <div className="p-4">
          <DashboardCard />
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
