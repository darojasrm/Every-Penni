import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const chartColorMap = {
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  yellow: "#f59e0b",
  gray: "#6b7280",
  green: "#10b981",
  orange: "#c76b10",
  black: "#000000",
};

const groupByCategory = (expenses) => {
  const map = {};

  expenses.forEach((exp) => {
    const key = exp.category_name || "Other";

    if (!map[key]) {
      map[key] = {
        name: key,
        value: 0,
        color: exp.color || "gray",
      };
    }

    map[key].value += Number(exp.amount);
  });

  return Object.values(map);
};

const renderLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];

    return (
      <div className="bg-white p-2 rounded shadow">
        <p className="font-semibold">{item.name}</p>
        <p>${Number(item.value).toFixed(2)}</p>
        <p>{((item.percent || 0) * 100).toFixed(1)}%</p>
      </div>
    );
  }

  return null;
};

export default function CategoryPieChart({ expenses }) {
  const data = groupByCategory(Array.isArray(expenses) ? expenses : []);

  if (data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        <p className="text-gray-500">No category data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>

      <div className="w-full h-[260px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label={renderLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={chartColorMap[entry.color] || "#6b7280"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap gap-3">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: chartColorMap[entry.color] || "#6b7280",
                }}
              />
              <span className="text-sm text-gray-700">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
