import { useEffect, useState, useContext, useCallback } from "react";
import { getExpenses, getCategories } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import AddExpense from "../components/AddExpense";
import ExpenseItem from "../components/ExpenseItem";
import Stats from "../components/Stats";
import ExpensesChart from "../components/ExpensesChart";
import CategoryPieChart from "../components/CategoryPieChart";
import ExpenseFilters from "../components/ExpenseFilters";
import LoadingCard from "../components/LoadingCard";

export default function Dashboard() {
  const { token, logout } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshExpenses = useCallback(
    async (categoryOverride = selectedCategory) => {
      if (!token) return;

      try {
        setLoading(true);

        const data = await getExpenses(token, {
          category_id: categoryOverride || undefined,
        });

        setExpenses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading expenses:", err);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    },
    [token, selectedCategory],
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        await refreshExpenses();
      } catch (err) {
        console.error("Error loading expenses:", err);
      }
    };

    if (token) {
      loadExpenses();
    }
  }, [token, refreshExpenses]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-4 py-4 md:px-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow shrink-0">
            EP
          </div>

          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">
              Every Penni
            </h1>
            <p className="text-sm text-gray-500">Every penni counts.</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5 md:p-6">
        <Stats expenses={expenses} />
        <ExpensesChart expenses={expenses} />
        <CategoryPieChart expenses={expenses} />

        <ExpenseFilters
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <AddExpense onExpenseAdded={() => refreshExpenses()} />
        </div>

        <div className="space-y-4">
          {loading ? (
            <LoadingCard text="Loading expenses..." />
          ) : expenses.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg">No expenses yet</p>
              <p className="text-sm">Start by adding your first expense 👇</p>
            </div>
          ) : (
            expenses.map((exp) => (
              <ExpenseItem
                key={exp.id}
                expense={exp}
                categories={categories}
                onRefresh={() => refreshExpenses()}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
