import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { Row, Col, Card } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const lineData = {
    labels: ["Apr 5", "Apr 10", "Apr 15", "Apr 20", "Apr 25", "Apr 30"],
    datasets: [
      {
        label: "Sessions",
        data: [5000, 10000, 15000, 20000, 25000, 30000],
        borderColor: "#007bff", // More readable blue
        backgroundColor: "rgba(0, 123, 255, 0.1)", // Light blue fill
        fill: true,
        tension: 0.4, // Smoother line
      },
    ],
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Page Views",
        data: [12000, 15000, 13000, 17000, 14000, 11000],
        backgroundColor: "#28a745", // Green for a fresh look
        borderRadius: 10, // Rounded bar edges
      },
    ],
  };

  return (
    <Row className="mb-4">
      <Col md={6}>
        <Card className="shadow-sm">
          <Card.Body>
            <h5
              className="mb-3"
              style={{ fontSize: "1.25rem", fontWeight: "600" }}
            >
              Sessions Over Time
            </h5>
            <div style={{ position: "relative", height: "300px" }}>
              <Line
                data={lineData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="shadow-sm">
          <Card.Body>
            <h5
              className="mb-3"
              style={{ fontSize: "1.25rem", fontWeight: "600" }}
            >
              Monthly Page Views
            </h5>
            <div style={{ position: "relative", height: "300px" }}>
              <Bar
                data={barData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Charts;
