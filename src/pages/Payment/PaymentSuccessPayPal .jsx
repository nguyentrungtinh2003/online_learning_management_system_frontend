import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";
import { ToastContainer, toast, Slide } from "react-toastify";
import { Container, Spinner, Alert } from "react-bootstrap";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paymentId = searchParams.get("paymentId");
  const payerId = searchParams.get("PayerID");
  const userId = searchParams.get("userId");

  useEffect(() => {
    const executePayment = async () => {
      // Kiểm tra sự tồn tại của các tham số đầu vào
      if (!paymentId || !payerId || !userId) {
        setError("Thiếu thông tin thanh toán. Vui lòng kiểm tra lại.");
        return;
      }

      // Chuyển userId từ string thành số
      const userIdLong = parseInt(userId, 10);

      // Kiểm tra xem userIdLong có phải là một số hợp lệ không
      if (isNaN(userIdLong)) {
        setError("UserId không hợp lệ. Vui lòng kiểm tra lại.");
        return;
      }

      console.log(
        "paymentId : " + paymentId,
        "payerId : " + payerId,
        "userId : " + userIdLong
      );

      setLoading(true);
      try {
        const res = await axios.get(`${URL}/payments/execute`, {
          params: { paymentId, payerId, userId: userIdLong },
        });
        if (res.data.statusCode === 200) {
          toast.success("Thanh toán thành công !", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });

          setTimeout(() => {
            window.location.replace("/");
          }, 3000);
        } else {
          setError("Thanh toán không thành công. Vui lòng thử lại.");
        }
      } catch (err) {
        console.error("Lỗi xác nhận thanh toán", err.message);
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    executePayment();
  }, [paymentId, payerId, userId]);

  if (loading) {
    return (
      <>
        <ToastContainer />
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="text-center">
            <p className="mt-3">
              <Spinner animation="border" variant="white" className="me-2" />
            </p>
          </div>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Alert variant="danger" className="text-center">
          ❌ <strong>Lỗi:</strong> {error}
        </Alert>
      </Container>
    );
  }

  return null;
};

export default PaymentSuccess;
