import { Gauge } from "lucide-react";
import React from "react";

const PM25Modal = ({ locationName, data, barangay, getPM25Quality }) => {
  const quality = getPM25Quality(data.pm25);
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
      <div className="p-6 bg-white bg-opacity-50 rounded">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Gauge size={48} className="text-purple-600" />
          <div className="text-center">
            <p className="text-3xl font-bold">{data.pm25}</p>
            <p className="text-sm text-gray-600">µg/m³</p>
          </div>
        </div>
        <div className={`text-center p-2 rounded ${quality.color}`}>
          <p className="font-semibold">{quality.level}</p>
        </div>
      </div>
    </div>
  );
};

export default PM25Modal;
