import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // React Router hook
import URL from "../../config/URLconfig";

import { ToastContainer, toast, Slide } from "react-toastify";

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
        const res = await axios.get(
          `${URL}/payments/execute/vnpay?vnp_ResponseCode=${responseCode}&userId=${userId}&vnp_Amount=${amount}`,
          { withCredentials: true }
        );

        if (res.data.statusCode === 200) {
          setMessage("Thanh toán thành công!");
          toast.success("Thanh toán thành công !", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });

          setTimeout(() => {
            window.location.replace("/");
          }, 3000);
        } else {
          setMessage("Thanh toán thất bại!");
        }
      } catch (err) {
        console.error("Error executing payment", err);
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
        toast.error("Thanh toán thất bại!", {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });

        setTimeout(() => {
          window.location.replace("/");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    executePayment();
  }, [location.search]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          Thanh toán VNPay
        </h2>
        {loading ? (
          <p className="text-gray-600 text-lg"> Đang xử lý thanh toán...</p>
        ) : (
          <p className="text-green-600 text-lg font-medium">{message}</p>
        )}
        {error && (
          <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessVNPay;
