import { useState } from "react";
import { Container, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";

export default function PaymentPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(1); // số tiền mặc định

  const submitPayment = async (e) => {
    e.preventDefault(); // Ngăn submit reload trang
    setLoading(true);
    setError("");

    const paymentData = {
      userId: 1, // bạn có thể thay bằng userId từ context hoặc props
      amount: amount,
    };

    try {
      const response = await axios.post(`${URL}/payments/create`, paymentData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const approvalUrl = response.data.data;
      if (approvalUrl) {
        window.location.href = approvalUrl; // Redirect đến PayPal
      } else {
        setError("Không nhận được link thanh toán từ hệ thống.");
      }
    } catch (err) {
      setError("Lỗi khi thực hiện thanh toán: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Card
        style={{ width: "100%", maxWidth: "500px" }}
        className="p-4 shadow-lg rounded-4 border-0"
      >
        <h3 className="text-center mb-4 text-primary fw-bold">
          💰 Nạp tiền vào hệ thống
        </h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={submitPayment}>
          <Form.Group className="mb-3" controlId="formAmount">
            <Form.Label>Số tiền muốn nạp (USD):</Form.Label>
            <Form.Control
              type="number"
              placeholder="Nhập số tiền (ví dụ: 5)"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              min="1"
              step="0.1"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Bạn sẽ nhận được:</Form.Label>
            <Form.Control
              type="text"
              value={`${amount * 10} Coin`}
              readOnly
              className="bg-light"
            />
          </Form.Group>

          <div className="d-grid">
            <Button
              type="submit"
              variant="success"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang xử lý...
                </>
              ) : (
                "Thanh toán bằng PayPal"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
