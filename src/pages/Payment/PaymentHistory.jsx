import React, { useState } from "react";

const transactions = [
  {
    id: 1,
    date: "2024-03-01",
    amount: "$99.99",
    method: "PayPal",
    status: "Completed",
  },
  {
    id: 2,
    date: "2024-02-28",
    amount: "$50.00",
    method: "VNPay",
    status: "Pending",
  },
  {
    id: 3,
    date: "2024-02-25",
    amount: "$120.00",
    method: "Momo",
    status: "Completed",
  },
  {
    id: 4,
    date: "2024-02-20",
    amount: "$75.00",
    method: "Coins",
    status: "Failed",
  },
];

export default function TransactionHistory() {
  return (
    <div className="px-3 py-4 h-full w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Transaction ID</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Payment Method</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="text-center border-t">
              <td className="border p-2">{transaction.id}</td>
              <td className="border p-2">{transaction.date}</td>
              <td className="border p-2">{transaction.amount}</td>
              <td className="border p-2">{transaction.method}</td>
              <td
                className={`border p-2 ${
                  transaction.status === "Completed"
                    ? "text-green-500"
                    : transaction.status === "Pending"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {transaction.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
