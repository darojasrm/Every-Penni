import { useEffect, useState, useContext } from "react";
import { createExpense } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { getCategories } from "../api/api";

export default function AddExpense({ onExpenseAdded }) {
  const { token } = useContext(AuthContext);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        console.log("ADD EXPENSE CATEGORIES:", data);
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading categories in AddExpense:", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newExpense = {
      amount: parseFloat(amount),
      description,
      expense_date: expenseDate,
      category_id: categoryId || null,
    };

    const data = await createExpense(newExpense, token);
    console.log("CREATE EXPENSE RESPONSE:", data);

    if (data.id) {
      // clear form
      setAmount("");
      setDescription("");
      setExpenseDate("");
      setCategoryId("");

      // notify parent to refresh list
      onExpenseAdded();
    } else {
      alert(data.error || "Error creating expense");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Add Expense</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          required
        />
      </div>
      <select
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Select category</option>

        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition">
        Add Expense
      </button>
    </form>
  );
}
