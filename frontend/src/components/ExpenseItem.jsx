import { useState, useContext } from "react";
import { updateExpense, deleteExpense } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function ExpenseItem({ expense, categories, onRefresh }) {
  const { token } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(expense.amount);
  const [description, setDescription] = useState(expense.description);
  const [date, setDate] = useState(expense.expense_date);
  const [categoryId, setCategoryId] = useState(expense.category_id || "");

  const handleUpdate = async () => {
    await updateExpense(
      expense.id,
      {
        amount: parseFloat(amount),
        description,
        expense_date: date,
        category_id: categoryId || null,
      },
      token,
    );

    setIsEditing(false);
    onRefresh();
  };

  const handleDelete = async () => {
    await deleteExpense(expense.id, token);
    onRefresh();
  };

  const categoryColorMap = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
    gray: "bg-gray-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    black: "bg-black-500",
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "CAD",
    }).format(value);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      {isEditing ? (
        <div className="flex flex-col gap-3 w-full">
          <input
            className="w-full border p-3 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            className="w-full border p-3 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full border p-3 rounded"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            className="w-full border p-3 rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleUpdate}
            >
              Save
            </button>

            <button
              className="w-full sm:w-auto bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 break-words">
              {expense.description || "No description"}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-sm text-gray-500">{expense.expense_date}</p>

              {expense.category_name && (
                <span
                  className={`inline-block text-white px-2 py-1 rounded text-xs ${
                    categoryColorMap[expense.color] || "bg-gray-500"
                  }`}
                >
                  {expense.category_name}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <p className="text-lg font-bold text-gray-700">
              {formatCurrency(expense.amount)}
            </p>

            <div className="flex gap-4">
              <button
                className="text-emerald-500 hover:underline"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>

              <button
                className="text-red-500 hover:underline"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
