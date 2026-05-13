export default function LoadingCard({ text = "Loading..." }) {
  return (
    <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  );
}
