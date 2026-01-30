import { Button } from "antd";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { PARAMETERS } from "@constants/parameters";
import TranslucentCard from "@components/cards/TranslucentCard";
import BaseMapv2 from "../../components/BaseMapv2";
import { calculateHeatIndex } from "../../helpers/heat-index-helper";
import { getWeatherDescription } from "@helpers/weather-helper";
import HeatIndexModal from "@components/Modal/HeatIndexModal";
import { CloudSun, Waves, Wind } from "lucide-react";
import { getWindDirection } from "@helpers/wind-helper";
import PM25Modal from "@components/Modal/PM25Modal";
import { getPM25Quality } from "@helpers/pm-25";
import ElevationModal from "@components/Modal/ElevationModal";
import WeatherModal from "@components/Modal/WeatherModal";
import RainModal from "@components/Modal/RainModal";
import TemperatureModal from "@components/Modal/TemperatureModal";
import WindModal from "@components/Modal/WindModal";
import HeatIndexLegend from "@components/Legend/HeatIndexLegend";

const TestMap = () => {
  const mapRef = useRef(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState("weather");
  const [parameterData, setParameterData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchParameterData = useCallback(async (location, parameter) => {
    setLoading(true);
    try {
      const { lat, lon } = location;

      if (parameter === "weather") {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=Asia/Manila`,
        );
        const data = await response.json();

        const temp = data.current.temperature_2m;
        const humidity = data.current.relative_humidity_2m;
        const heatIndex = calculateHeatIndex(temp, humidity);

        setParameterData({
          type: "weather",
          temperature: temp,
          humidity: humidity,
          precipitation: data.current.precipitation,
          windSpeed: data.current.wind_speed_10m,
          windDirection: data.current.wind_direction_10m,
          windGust: data.current.wind_gusts_10m,
          weatherCode: data.current.weather_code,
          heatIndex: heatIndex,
          locationName: location.name,
        });
      } else if (parameter === "pm") {
        const response = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5&timezone=Asia/Manila`,
        );
        const data = await response.json();

        setParameterData({
          type: "pm",
          pm25: data.current.pm2_5,
          locationName: location.name,
        });
      } else if (parameter === "elevation") {
        const response = await fetch(
          `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`,
        );
        const data = await response.json();

        setParameterData({
          type: "elevation",
          elevation: data.elevation[0],
          locationName: location.name,
        });
      } else {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=Asia/Manila`,
        );
        const data = await response.json();

        const temp = data.current.temperature_2m;
        const humidity = data.current.relative_humidity_2m;

        setParameterData({
          type: parameter,
          temperature: temp,
          humidity: humidity,
          precipitation: data.current.precipitation,
          windSpeed: data.current.wind_speed_10m,
          windDirection: data.current.wind_direction_10m,
          windGust: data.current.wind_gusts_10m,
          heatIndex: calculateHeatIndex(temp, humidity),
          locationName: location.name,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setParameterData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const location = selectedBarangay
      ? {
          lat: selectedBarangay.lat,
          lon: selectedBarangay.lon,
          name: selectedBarangay.barangayName,
        }
      : { lat: 14.552740670846099, lon: 121.13040374776895, name: "Taytay" };
    fetchParameterData(location, selectedParameter);
  }, [selectedParameter, selectedBarangay, fetchParameterData]);

  const handleParameterClick = (key) => {
    console.log("Parameter clicked:", key); // Debug log
    setSelectedParameter(key);

    if (key === "tropical-cyclone" && mapRef.current) {
      mapRef.current.flyTo({
        center: [121, 14.6],
        zoom: 4.5,
        duration: 1000,
      });
    }
  };

  const handleBarangayClick = useCallback((barangayData) => {
    setSelectedBarangay(barangayData);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedBarangay(null);
  }, []);

  const renderParameterDisplay = () => {
    if (loading) {
      return (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading data...</p>
        </div>
      );
    }

    if (!parameterData) {
      return (
        <p className="text-sm text-gray-600 text-center py-4">
          Unable to load data - No parameter data
        </p>
      );
    }

    const { type } = parameterData;

    const displayLocationName = selectedBarangay
      ? selectedBarangay.barangayName
      : "Taytay";

    const locationInfo = {
      barangayName: displayLocationName,
      lat: selectedBarangay ? selectedBarangay.lat : 14.552740670846099,
      lon: selectedBarangay ? selectedBarangay.lon : 121.13040374776895,
      psgc: selectedBarangay ? selectedBarangay.psgc : null,
    };

    try {
      switch (type) {
        case "weather":
          return (
            <WeatherModal
              barangay={locationInfo}
              locationName={displayLocationName}
              data={parameterData}
              getWeatherDescription={getWeatherDescription}
            />
          );

        case "rain":
          return (
            <RainModal
              barangay={locationInfo}
              locationName={displayLocationName}
              data={parameterData}
            />
          );

        case "temperature":
          return (
            <TemperatureModal
              barangay={locationInfo}
              locationName={displayLocationName}
              data={parameterData}
            />
          );

        case "heat-index":
          return (
            <HeatIndexModal
              barangay={locationInfo}
              locationName={displayLocationName}
              data={parameterData}
            />
          );

        case "wind-speed":
          return (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                {displayLocationName}
              </p>
              <div className="flex items-center justify-center gap-3 p-6 bg-white bg-opacity-50 rounded">
                <Wind size={48} className="text-gray-600" />
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {parameterData.windSpeed}
                  </p>
                  <p className="text-sm text-gray-600">km/h</p>
                </div>
              </div>
            </div>
          );

        case "wind-gust":
          return (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                {displayLocationName}
              </p>
              <div className="flex items-center justify-center gap-3 p-6 bg-white bg-opacity-50 rounded">
                <Waves size={48} className="text-cyan-600" />
                <div className="text-center">
                  <p className="text-3xl font-bold">{parameterData.windGust}</p>
                  <p className="text-sm text-gray-600">km/h</p>
                  <p className="text-xs text-gray-500 mt-1">Peak wind gust</p>
                </div>
              </div>
            </div>
          );

        case "wind-direction":
          return (
            <WindModal
              barangay={locationInfo}
              locationName={displayLocationName}
              data={parameterData}
              getWindDirection={getWindDirection}
            />
          );

        case "pm":
          return (
            <PM25Modal
              barangayName={locationInfo}
              locationName={displayLocationName}
              data={parameterData}
              getPM25Quality={getPM25Quality}
            />
          );

        case "elevation":
          return (
            <ElevationModal
              barangayName={locationInfo}
              locationName={displayLocationName}
              data={parameterData}
            />
          );

        case "tropical-cyclone":
          return (
            <div className="text-center p-6">
              <CloudSun size={48} className="text-blue-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Tropical Cyclone tracking</p>
              <p className="text-xs text-gray-500 mt-2">Feature coming soon</p>
            </div>
          );

        default:
          return (
            <p className="text-sm text-gray-600 text-center py-4">
              Data not available for this parameter
            </p>
          );
      }
    } catch (error) {
      console.error("Error rendering parameter display:", error);
      return (
        <div className="text-center py-4">
          <p className="text-sm text-red-600">Error displaying data</p>
          <p className="text-xs text-gray-500 mt-1">{error.message}</p>
        </div>
      );
    }
  };

  const getParameterTitle = () => {
    const param = PARAMETERS.find((p) => p.key === selectedParameter);
    return param ? param.label : "Data";
  };

  const getParameterIcon = () => {
    const param = PARAMETERS.find((p) => p.key === selectedParameter);
    return param ? param.icon : CloudSun;
  };

  const Icon = getParameterIcon();

  return (
    <div className="w-full h-full">
      <BaseMapv2
        center={[121, 14.6]}
        zoom={3}
        onMapLoad={(map) => {
          mapRef.current = map;
        }}
        onBarangayClick={handleBarangayClick}
        selectedBarangay={selectedBarangay}
        enableBarangayHighlight={true}
      >
        {/* Desktop - Right side */}
        <div className="hidden md:block absolute top-24 left-5 rounded-lg max-w-xs z-50 pointer-events-auto">
          <TranslucentCard className="flex flex-col py-1">
            <h1 className="font-semibold text-2xl text-right pr-4 mb-2">
              PARAMETERS
            </h1>
            {PARAMETERS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedParameter === item.key;

              return (
                <Button
                  key={item.key}
                  type={isSelected ? "primary" : "text"}
                  style={
                    isSelected
                      ? {
                          backgroundColor: "#2563eb",
                          color: "white",
                          borderColor: "#2563eb",
                        }
                      : {}
                  }
                  className={`py-5 flex justify-end items-center w-full transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600! text-white! hover:bg-blue-700!"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleParameterClick(item.key)}
                >
                  <span className="font-semibold">{item.label}</span>
                  <Icon size={30} />
                </Button>
              );
            })}
          </TranslucentCard>
        </div>

        {/* Always show parameter data modal */}
        <div className="absolute top-24 right-20 w-80 z-50 pointer-events-auto">
          <TranslucentCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Icon size={24} />
                {getParameterTitle()}
              </h3>
              {selectedBarangay && (
                <Button
                  className="bg-red-500 text-white"
                  size="small"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              )}
            </div>
            {renderParameterDisplay()}
          </TranslucentCard>
        </div>
        {selectedParameter === "heat-index" && (
          <div className="absolute bottom-5 left-5 z-50 pointer-events-auto">
            <HeatIndexLegend />
          </div>
        )}
      </BaseMapv2>
    </div>
  );
};

TestMap.displayName = "TestMap";

export default TestMap;
