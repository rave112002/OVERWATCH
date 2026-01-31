import MapOptimized from "@components/MapOptimized";
import { addLineLayer, addCircleLayer } from "@helpers/mapLayers";
import { useRef } from "react";
import maplibregl from "maplibre-gl";

const Sensors = () => {
  const mapRef = useRef(null);
  return (
    <div className="w-full h-full">
      <MapOptimized
        mapRef={mapRef}
        onMapLoad={async (map) => {
          await addLineLayer({
            map,
            id: "tcad",
            data: "/data/tcad.geojson",
            color: "#808080",
            width: 1,
          });

          // Add weather sensor circle
          const sensorData = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [121.1303930200288, 14.552751055472536],
                },
                properties: {
                  temperature: 28.5,
                  windGusts: 15.2,
                  windSpeed: 8.3,
                  humidity: 72,
                  pressure: 1013.25,
                  rainfall: 2.1,
                  visibility: 10,
                  uvIndex: 6,
                },
              },
            ],
          };

          await addCircleLayer({
            map,
            id: "weather-sensor",
            data: sensorData,
            color: "#ff6b6b",
            radius: 8,
            strokeColor: "#ffffff",
            strokeWidth: 2,
          });

          // Add popup on click
          map.on("click", "weather-sensor-circle", (e) => {
            const properties = e.features[0].properties;
            new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(
                `
                <div style="font-size: 14px;">
                  <h3 style="margin: 0 0 10px 0; font-size: 16px;">Taytay Municipal Weather Station</h3>
                  <p><strong>Temperature:</strong> ${properties.temperature}°C</p>
                  <p><strong>Wind Speed:</strong> ${properties.windSpeed} km/h</p>
                  <p><strong>Wind Gusts:</strong> ${properties.windGusts} km/h</p>
                  <p><strong>Humidity:</strong> ${properties.humidity}%</p>
                  <p><strong>Pressure:</strong> ${properties.pressure} hPa</p>
                  <p><strong>Rainfall:</strong> ${properties.rainfall} mm</p>
                  <p><strong>Visibility:</strong> ${properties.visibility} km</p>
                  <p><strong>UV Index:</strong> ${properties.uvIndex}</p>
                </div>
              `,
              )
              .addTo(map);
          });

          // Change cursor on hover
          map.on("mouseenter", "weather-sensor-circle", () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", "weather-sensor-circle", () => {
            map.getCanvas().style.cursor = "";
          });
        }}
      />
    </div>
  );
};

export default Sensors;
