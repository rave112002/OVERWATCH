import { Navigation } from "lucide-react";
import React from "react";

const WindModal = ({ data, barangay, getWindDirection }) => {
  if (!data) return null;

  const displayName = barangay?.barangayName;
  return (
    <div>
      <div className="mb-3 text-center">
        <p className="text-sm font-medium text-gray-700">{displayName}</p>
        {barangay && (
          <p className="text-xs text-gray-500">PSGC: {barangay.psgc}</p>
        )}
      </div>
      <div className="flex items-center justify-center gap-3 p-6 bg-white bg-opacity-50 rounded">
        <Navigation
          size={48}
          className="text-blue-600"
          style={{
            transform: `rotate(${data.windDirection}deg)`,
          }}
        />
        <div className="text-center">
          <p className="text-3xl font-bold">
            {getWindDirection(data.windDirection)}
          </p>
          <p className="text-sm text-gray-600">{data.windDirection}°</p>
        </div>
      </div>
    </div>
  );
};

export default WindModal;
