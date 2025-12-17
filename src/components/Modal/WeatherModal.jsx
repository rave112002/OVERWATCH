import { CloudRain, Droplets, Thermometer, Wind } from "lucide-react";
import React from "react";

const WeatherModal = ({
  barangay,
  locationName,
  data,
  getWeatherDescription,
}) => {
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

      {/* Weather grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-start gap-2 p-2 bg-white bg-opacity-50 rounded">
          <Thermometer size={20} className="text-red-500 mt-0.5" />
          <div>
            <p className="text-xs text-gray-600">Temperature</p>
            <p className="font-semibold">{data.temperature}°C</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 bg-white bg-opacity-50 rounded">
          <Droplets size={20} className="text-blue-500 mt-0.5" />
          <div>
            <p className="text-xs text-gray-600">Humidity</p>
            <p className="font-semibold">{data.humidity}%</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 bg-white bg-opacity-50 rounded">
          <Wind size={20} className="text-gray-600 mt-0.5" />
          <div>
            <p className="text-xs text-gray-600">Wind Speed</p>
            <p className="font-semibold">{data.windSpeed} km/h</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2 bg-white bg-opacity-50 rounded">
          <CloudRain size={20} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-xs text-gray-600">Precipitation</p>
            <p className="font-semibold">{data.precipitation} mm</p>
          </div>
        </div>
      </div>

      {/* Weather description */}
      <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-left">
        <p className="text-sm font-medium text-gray-700">
          {getWeatherDescription(data.weatherCode)}
        </p>
      </div>
    </div>
  );
};

export default WeatherModal;
