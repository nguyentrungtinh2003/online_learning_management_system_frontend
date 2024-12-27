import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaUser, FaArrowUp, FaArrowDown, FaChartLine } from "react-icons/fa";

const OverviewCards = () => {
  const cards = [
    {
      title: "Users",
      value: "14k",
      change: "+25%",
      variant: "success",
      icon: <FaUser />,
    },
    {
      title: "Income",
      value: "40000000 VND",
      change: "-25%",
      variant: "danger",
      icon: <FaArrowDown />,
    },
    {
      title: "Courses",
      value: "200",
      change: "+5%",
      variant: "info",
      icon: <FaChartLine />,
    },
  ];

  return (
    <Row>
      {cards.map((card, index) => (
        <Col md={4} sm={6} key={index}>
          <Card className="mb-4 shadow-sm border-0">
            <Card.Body className="d-flex align-items-center">
              <div
                className={`me-3 d-flex align-items-center justify-content-center text-white bg-${card.variant} rounded-circle`}
                style={{ width: "50px", height: "50px" }}
              >
                {card.icon}
              </div>
              <div>
                <Card.Title className="mb-1">{card.title}</Card.Title>
                <h3 className="mb-1">{card.value}</h3>
                <Card.Text className={`mb-0 text-${card.variant}`}>
                  {card.change}
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default OverviewCards;
