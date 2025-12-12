import {
  CloudRain,
  Thermometer,
  ThermometerSun,
  Wind,
  Navigation,
  Waves,
  Gauge,
  CloudSun,
  Fan,
  Mountain,
} from "lucide-react";

export const PARAMETERS = [
  {
    key: "weather",
    label: "Weather",
    icon: CloudSun,
  },
  {
    key: "rain",
    label: "Rain",
    icon: CloudRain,
  },
  {
    key: "heat-index",
    label: "Heat Index",
    icon: ThermometerSun,
  },
  {
    key: "temperature",
    label: "Temperature",
    icon: Thermometer,
  },
  {
    key: "wind-speed",
    label: "Wind Speed",
    icon: Wind,
  },
  {
    key: "wind-gust",
    label: "Wind Gust",
    icon: Waves,
  },
  {
    key: "wind-direction",
    label: "Wind Direction",
    icon: Navigation,
  },
  {
    key: "pm",
    label: "PM 2.5",
    icon: Gauge,
  },
  {
    key: "elevation",
    label: "Elevation",
    icon: Mountain,
  },
  {
    key: "tropical-cyclone",
    label: "Tropical Cyclone",
    icon: Fan,
  },
];
