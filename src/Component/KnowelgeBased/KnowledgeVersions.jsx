import { useState } from "react";
import StatusBadge from "./StatusBadge";
import Button from "./Button";

const VERSIONS_DATA = [
  { id: 1, version: "v1.0", status: "Active", training: "Trained", isActive: true },
  { id: 2, version: "v1.1 (Draft)", status: "Inactive", training: "Training", isActive: false },
];

export default function KnowledgeVersions() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 tracking-tight">
          Knowledge Versions
        </h2>
        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
          {VERSIONS_DATA.length} Total
        </span>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 font-medium uppercase text-[11px] tracking-wider">
              <th className="px-6 py-3 border-b border-gray-100">Version</th>
              <th className="px-6 py-3 border-b border-gray-100">Status</th>
              <th className="px-6 py-3 border-b border-gray-100">Training</th>
              <th className="px-6 py-3 border-b border-gray-100 text-center">Active</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {VERSIONS_DATA.map((item) => (
              <tr 
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`transition-colors cursor-pointer hover:bg-blue-50/30 ${
                  selectedId === item.id ? "bg-blue-50/50" : ""
                }`}
              >
                <td className="px-6 py-4 font-medium text-gray-700">
                  {item.version}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.training} />
                </td>
                <td className="px-6 py-4 text-center">
                  {item.isActive ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-xs">
                      ✔
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {selectedId ? `Selected Version ID: ${selectedId}` : "Select a version to manage"}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            className="text-xs px-4 py-2"
            disabled={!selectedId}
          >
            Activate
          </Button>
          <Button 
            className="text-xs px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            Create New Version
          </Button>
        </div>
      </div>
    </div>
  );
}