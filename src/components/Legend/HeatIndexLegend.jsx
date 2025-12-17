import React from "react";
import { HEAT_LEVELS } from "@constants/warningLevels";

const HeatIndexLegend = () => {
  return (
    <div className="mt-4 rounded-lg bg-white bg-opacity-60 p-3">
      <p className="text-sm font-semibold text-gray-700 mb-2">
        Heat Index Legend
      </p>

      <div className="space-y-2">
        {HEAT_LEVELS.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className={`w-4 h-4 rounded ${item.color}`} />
            <div className="text-xs text-gray-700">
              <p className="font-medium">{item.label}</p>
              <p className="text-gray-500">{item.range}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeatIndexLegend;
