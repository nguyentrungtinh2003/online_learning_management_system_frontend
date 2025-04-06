import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paymentId = searchParams.get("paymentId");
  const payerId = searchParams.get("PayerID") || searchParams.get("payerId");
  const userId = searchParams.get("userId");

  useEffect(() => {
    const executePayment = async () => {
      if (!paymentId || !payerId || !userId) {
        setError("Thiếu thông tin thanh toán. Vui lòng kiểm tra lại.");
        return;
      }

      console.log(
        "paymentId : " + paymentId,
        "payerId : " + payerId,
        "userId : " + userId
      );

      setLoading(true);
      try {
        const res = await axios.get(`${URL}/payments/execute`, {
          params: { paymentId, payerId, userId },
        });
        if (res.data.success) {
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
