import { Mountain } from "lucide-react";
import React from "react";

const ElevationModal = ({ locationName, data, barangay }) => {
  if (!data) return null;

  const displayName = barangay?.barangayName ?? locationName;
  return (
    <div>
      <div className="mb-3 text-left">
        <p className="text-sm font-medium text-gray-700">{displayName}</p>
        {barangay && (
          <p className="text-xs text-gray-500">PSGC: {barangay.psgc}</p>
        )}
      </div>
      <div className="flex items-center justify-center gap-3 p-6 bg-white bg-opacity-50 rounded">
        <Mountain size={48} className="text-green-700" />
        <div className="text-center">
          <p className="text-3xl font-bold">{data.elevation}</p>
          <p className="text-sm text-gray-600">meters above sea level</p>
        </div>
      </div>
    </div>
  );
};

export default ElevationModal;
