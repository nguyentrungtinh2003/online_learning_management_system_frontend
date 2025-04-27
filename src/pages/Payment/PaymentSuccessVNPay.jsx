import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // React Router hook
import URL from "../../config/URLconfig";

const PaymentSuccessVNPay = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Extract query parameters from the URL
    const params = new URLSearchParams(location.search);
    const responseCode = params.get("vnp_ResponseCode");
    const userId = params.get("userId");
    const amount = params.get("vnp_Amount");

    const executePayment = async () => {
      try {
        setLoading(true);
        // Call the backend API to execute the payment
        const res = await axios.post(`${URL}/payments/execute/vnpay`, {
          responseCode,
          userId,
          amount,
        });

        if (res.data.statusCode === 200) {
          setMessage("Thanh toán thành công!");
        } else {
          setMessage("Thanh toán thất bại!");
        }
      } catch (err) {
        console.error("Error executing payment", err);
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    executePayment();
  }, [location.search]);

  return (
    <div>
      <h2>Thanh toán VNPay</h2>
      {loading ? <p>Đang xử lý...</p> : <p>{message}</p>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PaymentSuccessVNPay;
