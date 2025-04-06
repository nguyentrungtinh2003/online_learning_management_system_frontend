import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get("paymentId");
  const payerId = searchParams.get("PayerID") || searchParams.get("payerId");
  const userId = searchParams.get("userId");

  useEffect(() => {
    const executePayment = async () => {
      try {
        const res = await axios.get(`${URL}/payments/execute`, {
          params: { paymentId, payerId, userId },
        });
        alert("Thanh toán thành công!");
      } catch (err) {
        console.error("Lỗi xác nhận thanh toán", err);
      }
    };

    if (paymentId && payerId && userId) {
      executePayment();
    }
  }, [paymentId, payerId, userId]);

  return <div>Đang xử lý thanh toán...</div>;
};

export default PaymentSuccess;
