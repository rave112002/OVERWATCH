import React, { useRef, useState } from "react";
import BaseMaptiler from "@components/BaseMaptiler";
import { Button, Tooltip } from "antd";
import {
  CloudRainWind,
  Wind,
  ThermometerSun,
  CircleGauge,
  Droplet,
} from "lucide-react";
import {
  WindLayer,
  PrecipitationLayer,
  TemperatureLayer,
  PressureLayer,
  RadarLayer,
  ColorRamp,
} from "@maptiler/weather";
import { useMapStyle } from "@helpers/useMapStyle";
import TranslucentCard from "@components/cards/TranslucentCard";
import BaseMapLibre from "@components/BaseMapLibre";

const RiskAnalysis = () => {
  const mapRef = useRef(null);
  const layersRef = useRef({});
  const [active, setActive] = useState(null);
  const { mapStyle } = useMapStyle();

  console.log(active);

  const OPACITY_BY_LAYER = {
    rain: 1,
    wind: 0.6,
    temp: 0.5,
    pressure: 1,
    radar: 0.7,
  };

  const onMapLoad = (map) => {
    mapRef.current = map;

    // re-add active weather after style reload
    if (active) {
      addWeatherLayer(active);
    }
  };

  const createLayer = (type) => {
    switch (type) {
      case "wind":
        return new WindLayer({ id: "wind" });
      case "rain":
        return new PrecipitationLayer({ id: "rain" });
      case "temp":
        return new TemperatureLayer({
          id: "temp",
          colorramp: ColorRamp.builtin.TEMPERATURE_3,
        });
      case "pressure":
        return new PressureLayer({ id: "pressure" });
      case "radar":
        return new RadarLayer({ id: "radar" });
      default:
        return null;
    }
  };

  const addWeatherLayer = (type) => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // hide previous
    if (active && map.getLayer(active)) {
      map.setLayoutProperty(active, "visibility", "none");
    }

    // create once
    if (!layersRef.current[type]) {
      const layer = createLayer(type);
      layersRef.current[type] = layer;
      if (mapStyle === "light") {
        map.setPaintProperty("Water", "fill-color", "rgba(170, 198, 238, 0.2)");
      } else if (mapStyle === "dark") {
        map.setPaintProperty("Water", "fill-color", "rgba(33, 54, 84, 0.2)");
      }
      map.addLayer(layer, "Water");

      map.once("idle", () => {
        layer.setOpacity(OPACITY_BY_LAYER[type] ?? 0.6);
      });
    } else {
      map.setLayoutProperty(type, "visibility", "visible");
    }

    setActive(type);
  };

  return (
    <div className="w-full h-full relative">
      <BaseMapLibre center={[121, 14.6]} zoom={4} onMapLoad={onMapLoad} />

      <div className="absolute top-95 right-4 bg-white/40 rounded-lg">
        <TranslucentCard className="p-0">
          <div className="p-1 flex flex-col gap-1">
            <Tooltip title="Rain" placement="left">
              <Button
                type="text"
                className={active === "rain" ? "bg-blue-500" : ""}
                onClick={() => addWeatherLayer("rain")}
              >
                <CloudRainWind size={20} />
              </Button>
            </Tooltip>

            <Tooltip title="Wind" placement="left">
              <Button
                type="text"
                className={active === "wind" ? "bg-blue-500" : ""}
                onClick={() => addWeatherLayer("wind")}
              >
                <Wind size={20} />
              </Button>
            </Tooltip>

            <Tooltip title="Temperature" placement="left">
              <Button
                type="text"
                className={active === "temp" ? "bg-blue-500" : ""}
                onClick={() => addWeatherLayer("temp")}
              >
                <ThermometerSun size={20} />
              </Button>
            </Tooltip>

            <Tooltip title="Pressure" placement="left">
              <Button
                type="text"
                className={active === "pressure" ? "bg-blue-500" : ""}
                onClick={() => addWeatherLayer("pressure")}
              >
                <CircleGauge size={20} />
              </Button>
            </Tooltip>

            <Tooltip title="Radar" placement="left">
              <Button
                type="text"
                className={active === "radar" ? "bg-blue-500" : ""}
                onClick={() => addWeatherLayer("radar")}
              >
                <Droplet size={20} />
              </Button>
            </Tooltip>
          </div>
        </TranslucentCard>
      </div>
    </div>
  );
};

export default RiskAnalysis;
