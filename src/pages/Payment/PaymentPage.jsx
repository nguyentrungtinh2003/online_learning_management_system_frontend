import { useState } from "react";
import axios from "axios";
import URL from "../../config/URLconfig";
import { FaCoins } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function PaymentPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("VNPay");
  const [amount, setAmount] = useState(1);

  const submitPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const paymentData = {
      userId: parseInt(localStorage.getItem("id")),
      amount,
      method,
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
        window.location.href = approvalUrl;
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
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full bg-wcolor dark:border dark:bg-darkBackground dark:border-darkBorder rounded-3xl shadow-2xl px-8 py-4 relative">
        <div className="flex flex-col items-center text-center">
          <FaCoins size={60} className="text-yellow-500 mb-2" />
          <h1 className="text-3xl font-bold text-fcolor mb-4">Nạp tiền vào hệ thống</h1>
          <p className="text-gray-500 text-darkSubtext mb-4">Hệ thống hỗ trợ thanh toán qua VNPay và PayPal</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submitPayment} className="">
          <div>
            <label htmlFor="amount" className="text-sm text-darkSubtext font-medium text-gray-700 mb-1">
              Số tiền muốn nạp (VND):
            </label>
            <input
              type="number"
              id="amount"
              min="1"
              step="0.1"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              required
              className="w-full dark:bg-darkSubbackground dark:text-darkText rounded-lg border-2 dark:border-darkBorder border-gray-300 p-3 focus:ring-2 focus:ring-indigo-400"
              placeholder="Ví dụ: 50000"
            />
          </div>

          <div>
            <p className="text-sm text-gray-600 text-darkSubtext mb-1 font-medium">Bạn sẽ nhận được:</p>
            <p className="text-lg font-semibold text-green-600">
              {Math.floor(amount / 1000)} Coins
            </p>
            <p className="text-sm text-gray-500 text-darkSubtext mt-1">
              Tỷ giá: 1,000 VND = 1 Coin
            </p>
          </div>

          <div>
            <label htmlFor="method" className="my-2 text-darkSubtext text-sm font-medium text-gray-700 mb-1">
              Chọn phương thức thanh toán:
            </label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full my-2 rounded-lg border-2 dark:bg-darkSubbackground dark:border-darkBorder dark:text-darkText border-gray-300 p-3 bg-wcolor focus:ring-2 focus:ring-indigo-400"
            >
              <option value="VNPay">VNPay</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin text-white" />
                Đang xử lý...
              </>
            ) : (
              <>Thanh toán bằng {method}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
