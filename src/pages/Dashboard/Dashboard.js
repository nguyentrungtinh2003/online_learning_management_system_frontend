import React from "react";
import { Box, Grid } from "@mui/material";
import Sidebar from "./Sidebar ";
import DashboardCard from "./DashboardCard";
import Chart from "./Chart";

const Dashboard = () => {
  return (
    <div className="d-flex m-4">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <div className="p-4">
          <OverviewCards />
          <Charts />
          <DetailsTable />
          <SendEmail />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
