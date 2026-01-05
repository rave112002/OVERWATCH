import Dashboard from "@pages/admin/Dashboard";
import Himawari from "@pages/admin/Himawari";
import RainRadar from "@pages/admin/RainRadar";
import RiskIntelligence from "@pages/admin/RiskIntelligence";
import TestMap from "@pages/admin/TestMap";
import {
  ActivityIcon,
  Bell,
  ChartColumn,
  CloudRainWind,
  CloudRainWindIcon,
  LayoutDashboard,
  Nfc,
  Satellite,
  Server,
  Settings2,
} from "lucide-react";

export const ADMIN_MODULES = [
  {
    type: "item",
    icon: <LayoutDashboard />,
    value: "dashboard",
    label: "Dashboard",
    link: "/admin/dashboard",
    element: <Dashboard />,
  },
  {
    type: "item",
    icon: <ActivityIcon />,
    value: "risk-intelligence",
    label: "Risk Intelligence",
    link: "/admin/risk-intelligence",
    element: <RiskIntelligence />,
  },
  {
    type: "item",
    icon: <CloudRainWindIcon />,
    value: "tropical-cyclone-intelligence",
    label: "Tropical Cyclone Intelligence",
    link: "/admin/tropical-cyclone-intelligence",
    // element: <TropicalCycloneIntelligence />,
  },
  {
    type: "item",
    icon: <Nfc />,
    value: "sensor-iot-network",
    label: "Sensor & IoT Network",
    link: "/admin/sensor-iot-network",
    // element: <SecondPage />,
  },
  {
    type: "item",
    icon: <ChartColumn />,
    value: "reports-decision-support",
    label: "Reports Decision Support",
    link: "/admin/reports-decision-support",
    // element: <Reports-decision-support />,
  },
  {
    type: "item",
    icon: <Bell />,
    value: "alerts-advisiories",
    label: "Alerts & Advisories",
    link: "/admin/alerts-advisiories",
    // element: <SecondPage />,
  },
  {
    type: "item",
    icon: <Server />,
    value: "historical-data",
    label: "Historical Data",
    link: "/admin/historical-data",
    // element: <Historical-data />,
  },
  {
    type: "item",
    icon: <Settings2 />,
    value: "system-administration",
    label: "System Administration",
    link: "/admin/system-administration",
    // element: <SecondPage />,
  },

  {
    type: "item",
    icon: <ActivityIcon />,
    value: "test-map",
    label: "Test Map",
    link: "/admin/test-map",
    element: <TestMap />,
  },
  {
    type: "item",
    icon: <Satellite />,
    value: "rain-radar",
    label: "Rain Radar",
    link: "/admin/rain-radar",
    element: <RainRadar />,
  },
  {
    type: "item",
    icon: <Satellite />,
    value: "himawari",
    label: "Himawari",
    link: "/admin/himawari",
    element: <Himawari />,
  },
  // {
  //   type: "group",
  //   // icon: <GlobalOutlined />,
  //   value: "maps",
  //   label: "Maps",
  //   children: [
  //     {
  //       value: "map1",
  //       label: "Map",
  //       // icon: <GlobalOutlined />,
  //       link: "/admin/maps/map1",
  //       // element: <Map />,
  //     },
  //     {
  //       value: "mapv2",
  //       label: "Mapv2",
  //       // icon: <GlobalOutlined />,
  //       link: "/admin/maps/mapv2",
  //       // element: <Mapv2 />,
  //     },
  //     {
  //       value: "weather",
  //       label: "Weather",
  //       // icon: <CloudOutlined />,
  //       link: "/admin/maps/weather",
  //       // element: <Weather />,
  //     },
  //   ],
  // },
];
