import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";

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
          alert("Thanh toán thành công!");
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
    return <div>Đang xử lý thanh toán...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return null;
};

export default PaymentSuccess;
