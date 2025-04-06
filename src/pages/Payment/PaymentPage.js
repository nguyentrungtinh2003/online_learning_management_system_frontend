import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";
import URL from "../../config/URLconfig";

const paymentMethods = ["PayPal", "VNPay", "Momo", "Coins"];

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [product, setProduct] = useState({
    name: "JavaScript Pro",
    price: "$99.99",
  });

  const paymentData = {
    userId: 1,
    amount: 50.0,
  };

  const submitPayment = () => {
    axios
      .post(`${URL}/payments/create`, paymentData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Payment success" + response.data);
        const approvalUrl = response.data.data;
        if (approvalUrl) {
          window.location.href = approvalUrl; // Redirect đến PayPal
        }
      })
      .catch((error) => {
        console.log("Payment error" + error.message);
      });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Payment Methods</h1>

      {/* Product Information */}
      <div className="p-4 mb-4 border rounded bg-gray-100">
        <h2 className="text-lg font-semibold">Product: {product.name}</h2>
        <p className="text-gray-700">Price: {product.price}</p>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <label
            key={method}
            className={`block p-4 border rounded cursor-pointer flex justify-between items-center ${
              selectedMethod === method
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={method}
              checked={selectedMethod === method}
              onChange={() => setSelectedMethod(method)}
              className="hidden"
            />
            <span className="text-lg">{method}</span>
          </label>
        ))}
      </div>

      <button
        onClick={() => submitPayment()}
        className="mt-6 px-6 py-2 bg-green-500 text-white rounded"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
