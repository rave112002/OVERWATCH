const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
import { Tooltip } from "antd";
import { MoonIcon, Satellite, Sun } from "lucide-react";

export const MAP_STYLES = {
  satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`,
  light: `https://api.maptiler.com/maps/019abfa7-5268-7354-984b-b7222cce4e44/style.json?key=${MAPTILER_KEY}`,
  dark: `https://api.maptiler.com/maps/019abfaa-a3df-7750-9413-2d94e96af2f4/style.json?key=${MAPTILER_KEY}`,
};

export const STYLES_URLS = [
  MAP_STYLES.light,
  MAP_STYLES.dark,
  MAP_STYLES.satellite,
];

export const MAP_OPTIONS = [
  {
    label: (
      <Tooltip
        placement="left"
        title={"Light Mode"}
        styles={{ arrow: { marginRight: 10 } }}
      >
        <span className="flex items-center h-full">
          <Sun size={20} />
        </span>
      </Tooltip>
    ),
    value: "light",
  },
  {
    label: (
      <Tooltip
        placement="left"
        title={"Dark Mode"}
        styles={{ arrow: { marginRight: 10 } }}
      >
        <span className="flex items-center h-full">
          <MoonIcon size={20} />
        </span>
      </Tooltip>
    ),
    value: "dark",
  },
  {
    label: (
      <Tooltip
        placement="left"
        title={"Satellite"}
        styles={{ arrow: { marginRight: 10 } }}
      >
        <span className="flex items-center h-full">
          <Satellite size={20} />
        </span>
      </Tooltip>
    ),
    value: "satellite",
  },
];

export const MAP_VIEW_MODES = [
  {
    label: (
      <Tooltip
        placement="left"
        title={"2D"}
        styles={{ arrow: { marginRight: 10 } }}
      >
        <span className="flex items-center h-full font-semibold">2D</span>
      </Tooltip>
    ),
    value: "2d",
  },
  {
    label: (
      <Tooltip
        placement="left"
        title={"3D"}
        styles={{ arrow: { marginRight: 10 } }}
      >
        <span className="flex items-center h-full font-semibold">3D</span>
      </Tooltip>
    ),
    value: "3d",
  },
];
