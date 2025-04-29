import { useState } from "react";
import { Container, Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";
import { FaCoins } from "react-icons/fa";

export default function PaymentPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("VNPay");
  const [amount, setAmount] = useState(1); // số tiền mặc định

  const submitPayment = async (e) => {
    e.preventDefault(); // Ngăn submit reload trang
    console.log("Phuong thuc payment : " + method);
    setLoading(true);
    setError("");

    const paymentData = {
      userId: parseInt(localStorage.getItem("id")), // bạn có thể thay bằng userId từ context hoặc props
      amount: amount,
      method: method,
    };

    console.log("Payload payment : " + paymentData);

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
        style={{ width: "100%", maxWidth: "800px" }}
        className="p-4 shadow-lg rounded-4 border-4"
      >
        <FaCoins style={{ color: "gold" }} size={30} />
        <h1 className="text-center mb-8 text-primary fw-bold">
          Nạp tiền vào hệ thống
        </h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={submitPayment}>
          <Form.Group className="mb-3" controlId="formAmount">
            <Form.Label>Số tiền muốn nạp :</Form.Label>
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
            <Form.Label>Bạn sẽ nhận được :</Form.Label>
            <br></br>
            {/* <Form.Control
              type="text"
              value={`${amount * 10} Coin`}
              readOnly
              className="bg-light"
            /> */}
            <Form.Label>
              1 USD = 25.000 VND , 25.000 / 100 = 250 Coins
            </Form.Label>
            <br></br>
            <Form.Label>25.000 VND , 25.000 / 100 = 250 Coins</Form.Label>
            <br></br>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Chọn phương thức thanh toán:</Form.Label>
            <Form.Select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="bg-light"
            >
              <option value="VNPay">VNPay</option>
              <option value="PayPal">PayPal</option>
            </Form.Select>
          </Form.Group>

          <div className="d-grid">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    animation="border"
                    variant="white"
                    className="me-2"
                  />
                </>
              ) : (
                `Thanh toán bằng ${method}`
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
