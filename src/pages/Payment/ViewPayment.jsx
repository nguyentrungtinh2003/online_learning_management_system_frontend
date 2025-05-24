import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";
import { Card, Spinner } from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewPayment = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${URL}/payments/${id}`, { withCredentials: true })
      .then((res) => {
        setPayment(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Lỗi khi tải chi tiết giao dịch!", {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!payment) {
    return <div className="text-center mt-5">Không tìm thấy giao dịch!</div>;
  }

  return (
    <div className="container mt-4">
      <ToastContainer />
      <Card className="p-4 shadow rounded">
        <h3 className="mb-4">Chi tiết giao dịch #{payment.id}</h3>
        <p>
          <strong>Người dùng:</strong> {payment.user?.username} (ID:{" "}
          {payment.user?.id})
        </p>
        <p>
          <strong>Số tiền:</strong> {payment.amount} VND
        </p>
        <p>
          <strong>Số coin nhận:</strong> {payment.coinAmount}
        </p>
        <p>
          <strong>Trạng thái:</strong> {payment.status}
        </p>
        <p>
          <strong>Thời gian:</strong> {new Date(payment.date).toLocaleString()}
        </p>
        <p>
          <strong>Đã xoá:</strong> {payment.deleted ? "Có" : "Không"}
        </p>
      </Card>
    </div>
  );
};

export default ViewPayment;
