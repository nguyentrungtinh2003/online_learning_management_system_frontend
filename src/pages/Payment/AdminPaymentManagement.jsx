import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

const initialTransactions = [
  {
    id: 1,
    type: "Deposit",
    amount: 5000,
    date: "2024-03-01",
    status: "Completed",
  },
  {
    id: 2,
    type: "Withdrawal",
    amount: 2000,
    date: "2024-03-03",
    status: "Pending",
  },
];

export default function TransactionAdmin() {
  const [transactions, setTransactions] = useState(initialTransactions);

  const deleteTransaction = (id) =>
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );

  return (
    <div className="px-3 py-4 w-full h-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Transaction Management</h1>

      {/* Transactions Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t">
                <td className="p-3">{transaction.id}</td>
                <td className="p-3">{transaction.type}</td>
                <td className="p-3">${transaction.amount}</td>
                <td className="p-3">{transaction.date}</td>
                <td className="p-3">{transaction.status}</td>
                <td className="p-3 flex gap-2">
                  <button className="border border-yellow-500 text-yellow-500 px-3 py-1 rounded flex items-center gap-2">
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="border border-red-500 text-red-500 px-3 py-1 rounded flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
