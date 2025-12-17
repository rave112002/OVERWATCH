import { Thermometer } from "lucide-react";
import React from "react";

const TemperatureModal = ({ locationName, data, barangay }) => {
  if (!data) return null;

  const displayName = barangay?.barangayName ?? locationName;
  return (
    <div>
      <div className="mb-3 text-center">
        <p className="text-sm font-medium text-gray-700">{displayName}</p>
        {barangay && (
          <p className="text-xs text-gray-500">PSGC: {barangay.psgc}</p>
        )}
      </div>
      <div className="flex items-center justify-center gap-3 p-6 bg-white bg-opacity-50 rounded">
        <Thermometer size={48} className="text-red-500" />
        <div className="text-center">
          <p className="text-3xl font-bold">{data.temperature}°C</p>
          <p className="text-sm text-gray-600">Current Temperature</p>
        </div>
      </div>
    </div>
  );
};

export default TemperatureModal;
