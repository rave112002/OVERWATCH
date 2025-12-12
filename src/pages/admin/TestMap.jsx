import { Button } from "antd";
import React, { useRef, useState, useCallback, memo, useEffect } from "react";
import { PARAMETERS } from "@constants/parameters";
import TranslucentCard from "@components/cards/TranslucentCard";
import BaseMapv2 from "../../components/BaseMapv2";

const TestMap = memo(() => {
  const mapRef = useRef(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState("weather");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = useCallback(async (location) => {
    setLoading(true);
    try {
      // Using Open-Meteo API (free, no API key required)
      const { lat, lon } = location;
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia/Manila`
      );
      const data = await response.json();

      setWeatherData({
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        locationName: location.name,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedParameter === "weather" && !selectedBarangay) {
      fetchWeather({
        lat: 14.5176,
        lon: 121.0509,
        name: "Taguig City",
      });
    }
  }, [selectedParameter, selectedBarangay, fetchWeather]);

  useEffect(() => {
    if (selectedParameter === "weather" && selectedBarangay) {
      fetchWeather({
        lat: selectedBarangay.lat,
        lon: selectedBarangay.lon,
        name: selectedBarangay.barangayName,
      });
    }
  }, [selectedBarangay, selectedParameter, fetchWeather]);

  const handleParameterClick = useCallback(
    (key) => {
      setSelectedParameter(key);

      if (key === "tropical-cyclone" && mapRef.current) {
        mapRef.current.flyTo({
          center: [121, 14.6],
          zoom: 4.5,
          duration: 1000,
        });
      }

      if (key === "weather") {
        // Reset to Taguig weather if no barangay selected
        if (!selectedBarangay) {
          fetchWeather({
            lat: 14.5176,
            lon: 121.0509,
            name: "Taguig City",
          });
        }
      }
    },
    [selectedBarangay, fetchWeather]
  );

  const handleBarangayClick = useCallback((barangayData) => {
    setSelectedBarangay(barangayData);
  }, []);

  // const handleReset = useCallback(() => {
  //   setSelectedBarangay(null);
  //   if (selectedParameter === "weather") {
  //     fetchWeather({
  //       lat: 14.5176,
  //       lon: 121.0509,
  //       name: "Taguig City",
  //     });
  //   }
  // }, [selectedParameter, fetchWeather]);

  // const handleReset = useCallback(() => {
  //   setSelectedBarangay(null);
  // }, []);

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
        <div className="hidden md:block absolute top-50 right-0 rounded-lg max-w-xs">
          <TranslucentCard className="flex flex-col py-1">
            <h1 className="font-semibold text-2xl text-right pr-4 mb-2">
              PARAMETERS
            </h1>
            {PARAMETERS.map((item) => {
              const Icon = item.icon;

              return (
                <Button
                  key={item.key}
                  type="text"
                  className="py-5 flex justify-end items-center w-full"
                  onClick={() => handleParameterClick(item.key)}
                >
                  <span className="font-semibold">{item.label}</span>
                  <Icon size={30} />
                </Button>
              );
            })}
          </TranslucentCard>
        </div>

        {/* Display selected barangay info
        {selectedBarangay && (
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold mb-2">Selected Barangay</h3>
            <p className="text-sm mb-1">
              <strong>Name:</strong> {selectedBarangay.barangayName}
            </p>
            <p className="text-sm mb-1">
              <strong>PSGC:</strong> {selectedBarangay.psgc}
            </p>
            <p className="text-sm mb-3">
              <strong>Coordinates:</strong> {selectedBarangay.lat.toFixed(4)},{" "}
              {selectedBarangay.lon.toFixed(4)}
            </p>
            <Button type="primary" onClick={handleReset} className="w-full">
              Reset View
            </Button>
          </div>
        )} */}
      </BaseMapv2>
    </div>
  );
});

TestMap.displayName = "TestMap";

export default TestMap;
