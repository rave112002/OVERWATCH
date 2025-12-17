import { useState } from "react";
import { MapStyleContext } from "./MapStyleContext";

export const MapStyleProvider = ({ children }) => {
  const [mapStyle, setMapStyle] = useState("light");
  return (
    <MapStyleContext.Provider value={{ mapStyle, setMapStyle }}>
      {children}
    </MapStyleContext.Provider>
  );
};
