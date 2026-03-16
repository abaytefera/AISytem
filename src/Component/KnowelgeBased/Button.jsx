export default function Button({ children, color = "blue",...prop }) {
  const styles = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    gray: "bg-gray-500 hover:bg-gray-600",
  };

  return (
    <button
    {...prop}
      className={`${styles[color]} text-white px-4 py-2 rounded-md shadow`}
    >
      {children}
    </button>
  );
}