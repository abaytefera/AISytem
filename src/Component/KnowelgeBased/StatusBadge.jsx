export default function StatusBadge({ status }) {
  const map = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-600",
    Training: "bg-yellow-100 text-yellow-700",
    Trained: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${map[status]}`}>
      {status}
    </span>
  );
}