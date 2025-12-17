import { useContext } from "react";
import { MapStyleContext } from "./MapStyleContext";

export const useMapStyle = () => useContext(MapStyleContext);
