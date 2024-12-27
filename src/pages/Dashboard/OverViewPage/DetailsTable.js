import React from "react";
import { Table, Badge } from "react-bootstrap";
import { FaCircle } from "react-icons/fa";

const DetailsTable = () => {
  const data = [
    {
      title: "Homepage Overview",
      status: "Online",
      users: 212423,
      events: 8345,
    },
    {
      title: "Product Details - Gadgets",
      status: "Online",
      users: 172240,
      events: 5653,
    },
    {
      title: "Checkout Process - Step 1",
      status: "Offline",
      users: 58240,
      events: 3455,
    },
    {
      title: "User Profile Dashboard",
      status: "Online",
      users: 96240,
      events: 112543,
    },
  ];

  const formatNumber = (num) => num.toLocaleString();

  return (
    <div>
      <h5 className="mb-3">Details</h5>
      <Table striped bordered hover responsive="sm">
        <thead className="table-dark">
          <tr>
            <th>Page Title</th>
            <th>Status</th>
            <th>Users</th>
            <th>Event Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td className="text-center">
                <Badge
                  bg={item.status === "Online" ? "success" : "danger"}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FaCircle
                    style={{
                      fontSize: "0.6rem",
                      marginRight: "5px",
                    }}
                  />
                  {item.status}
                </Badge>
              </td>
              <td>{formatNumber(item.users)}</td>
              <td>{formatNumber(item.events)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DetailsTable;
