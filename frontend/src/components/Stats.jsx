import { calculateStats } from "../utils/calcStats";

export default function Stats({ expenses }) {
  const { total, count, average } = calculateStats(expenses);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Total */}
      <div className="bg-white p-4 md:p-5 rounded-xl shadow">
        <p className="text-gray-500 text-sm">Total Spent</p>
        <h2 className="text-2xl font-bold text-emerald-500">
          ${total.toFixed(2)}
        </h2>
      </div>

      {/* Count */}
      <div className="bg-white p-4 md:p-5 rounded-xl shadow">
        <p className="text-gray-500 text-sm">Transactions</p>
        <h2 className="text-2xl font-bold text-gray-800">{count}</h2>
      </div>

      {/* Average */}
      <div className="bg-white p-4 md:p-5 rounded-xl shadow">
        <p className="text-gray-500 text-sm">Average</p>
        <h2 className="text-2xl font-bold text-emerald-500">
          ${average.toFixed(2)}
        </h2>
      </div>
    </div>
  );
}
