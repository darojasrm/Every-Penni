export default function ExpenseFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Filters</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All categories</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
