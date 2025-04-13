import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import URL from "../../config/URLconfig";
import { ToastContainer, toast, Slide } from "react-toastify";
import { Container, Spinner, Alert } from "react-bootstrap";

useEffect(() => {
  const executeVNPay = async () => {
    const queryString = window.location.search;

    try {
      const res = await axios.get(
        `${URL}/payments/execute/vnpay${queryString}`
      );
      console.log("✅ VNPay payment success:", res.data);
      toast.success("Thanh toán thành công !", {
        position: "top-right",
        autoClose: 3000,
        transition: Slide,
      });

      setTimeout(() => {
        window.location.replace("/");
      }, 3000);
      // Show success UI
    } catch (err) {
      console.error("❌ VNPay payment failed:", err);
      // Show error UI
    }
  };

  executeVNPay();
  return (
    <>
      <ToastContainer />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p className="mt-3">
            🔄 Đang xử lý thanh toán... Vui lòng đợi giây lát.
          </p>
        </div>
      </Container>
    </>
  );
}, []);
