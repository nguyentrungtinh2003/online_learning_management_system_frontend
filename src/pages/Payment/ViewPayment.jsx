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

  // if (loading) {
  //   return (
  //     <div className="text-center mt-5">
  //       <Spinner animation="border" />
  //     </div>
  //   );
  // }

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center bg-wcolor dark:bg-darkBackground">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );

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
          <strong>Thời gian:</strong>{" "}
          {payment.date
            ? new Date(
                payment.date[0],
                payment.date[1] - 1,
                payment.date[2],
                payment.date[3],
                payment.date[4],
                payment.date[5]
              ).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "N/A"}
        </p>
        <p>
          <strong>Đã xoá:</strong> {payment.deleted ? "Có" : "Không"}
        </p>
      </Card>
    </div>
  );
};

export default ViewPayment;
