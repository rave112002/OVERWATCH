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
    key: "1",
    label: "Weather",
    icon: <CloudSun />,
  },
  {
    key: "2",
    label: "Rain",
    icon: <CloudRain />,
  },
  {
    key: "3",
    label: "Heat Index",
    icon: <ThermometerSun />,
  },
  {
    key: "4",
    label: "Temperature",
    icon: <Thermometer />,
  },
  {
    key: "5",
    label: "Wind Speed",
    icon: <Wind />,
  },
  {
    key: "6",
    label: "Wind Gust",
    icon: <Waves />,
  },
  {
    key: "7",
    label: "Wind Direction",
    icon: <Navigation />,
  },
  {
    key: "8",
    label: "PM 2.5",
    icon: <Gauge />,
  },
  {
    key: "9",
    label: "Elevation",
    icon: <Mountain />,
  },
  {
    key: "1",
    label: "Tropical Cyclone",
    icon: <Fan />,
  },
];
