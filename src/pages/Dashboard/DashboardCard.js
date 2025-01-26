import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import { Line } from "react-chartjs-2"; // Chart.js for the line chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "@mui/material/styles"; // Import useTheme hook
import { AddBox } from "@mui/icons-material"; // Example icon (Material UI)

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardCard = ({
  title,
  secondary,
  border,
  boxShadow,
  shadow,
  content,
  children,
  sx,
  contentClass,
  headerSX,
  contentSX,
  darkTitle,
}) => {
  const theme = useTheme(); // Get theme using useTheme hook

  // Data for the Line Chart
  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"], // Example months
    datasets: [
      {
        label: "Revenue",
        data: [12, 19, 3, 5, 2, 3], // Example revenue data
        borderColor: theme.palette.blue[500], // Blue color for the line chart
        backgroundColor: theme.palette.blue[200], // Light blue background
        fill: true,
      },
    ],
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "400px", // Set a maximum width for the card
        border: border ? "1px solid" : "none",
        borderColor: theme.palette.primary[200], // Using theme for border color
        borderRadius: "16px", // Border radius for rounded corners
        boxShadow: boxShadow
          ? shadow || "0 2px 12px rgba(0, 0, 0, 0.1)"
          : "none", // Lighter shadow
        backgroundColor: theme.palette.blue[500], // Set background to blue
        color: "#fff", // Text color white to contrast with blue background
        padding: "1rem",
        marginBottom: "20px",
        ":hover": {
          boxShadow: boxShadow
            ? shadow || "0 2px 14px rgba(0, 0, 0, 0.15)"
            : "inherit",
        },
        ...sx,
      }}
    >
      {/* Card Header with Icon and Title */}
      {title && (
        <CardHeader
          sx={{
            paddingBottom: "8px",
            ...headerSX,
          }}
          title={
            darkTitle ? <Typography variant="h5">{title}</Typography> : title
          }
          action={
            secondary || (
              <IconButton sx={{ color: "white" }}>
                <AddBox /> {/* Example icon */}
              </IconButton>
            )
          }
        />
      )}

      {/* Divider if there's a title */}
      {title && (
        <Divider sx={{ marginBottom: "8px", backgroundColor: "#fff" }} />
      )}

      {/* Card Content */}
      {content && (
        <CardContent
          sx={{
            padding: "12px 16px",
            ...contentSX,
          }}
          className={contentClass}
        >
          <Typography variant="h6" sx={{ marginBottom: "12px" }}>
            Doanh Số
          </Typography>
          <Line data={chartData} options={{ responsive: true }} />
          {children}
        </CardContent>
      )}
      {!content && children}
    </Card>
  );
};

export default DashboardCard;
