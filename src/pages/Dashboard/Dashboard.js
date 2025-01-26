import React from "react";
import { Box, Grid } from "@mui/material";
import Sidebar from "./Sidebar ";
import DashboardCard from "./DashboardCard";
import Chart from "./Chart";

const Dashboard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        marginTop: "10vh",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          {/* Top Section */}
          {/* <Grid item xs={12}>
            <DashboardCard
              title="Doanh Số"
              border={true}
              boxShadow={true}
              content={true}
            />
          </Grid> */}
          {/* Bottom Section with Chart */}
          <Grid item xs={12} md={8}>
            <Chart />
          </Grid>

          {/* <Grid item xs={12} md={4}>
            <ManagementCourse />
          </Grid> */}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
