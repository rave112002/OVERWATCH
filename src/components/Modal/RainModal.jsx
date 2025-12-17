import { CloudRain } from "lucide-react";
import React from "react";

const RainModal = ({ locationName, data, barangay }) => {
  if (!data) return null;

  const displayName = barangay?.barangayName ?? locationName;

  return (
    <div>
      {/* Header */}
      <div className="mb-3 text-left">
        <p className="text-sm font-medium text-gray-700">{displayName}</p>
        {barangay && (
          <p className="text-xs text-gray-500">PSGC: {barangay.psgc}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex items-start justify-start gap-3 p-4 bg-white bg-opacity-50 rounded">
        <CloudRain size={40} className="text-blue-600 mt-1" />
        <div className="text-left">
          <p className="text-3xl font-bold">{data.precipitation}</p>
          <p className="text-sm text-gray-600">mm of rainfall</p>
        </div>
      </div>
    </div>
  );
};

export default RainModal;
