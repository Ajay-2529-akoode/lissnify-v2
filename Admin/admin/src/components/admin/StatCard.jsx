export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className="bg-indigo-600 p-3 rounded-full mr-4">
          {icon} {/* Pass an SVG icon as a prop */}
        </div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}