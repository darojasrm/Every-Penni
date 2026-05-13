import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const groupByDate = (expenses) => {
  const map = {};

  expenses.forEach((exp) => {
    const date = exp.expense_date;

    if (!map[date]) {
      map[date] = 0;
    }

    map[date] += Number(exp.amount);
  });

  return Object.keys(map).map((date) => ({
    date,
    total: map[date],
  }));
};

export default function ExpensesChart({ expenses }) {
  const data = groupByDate(expenses);

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Spending Over Time</h3>

      <div className="w-full h-[260px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#10b981"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
