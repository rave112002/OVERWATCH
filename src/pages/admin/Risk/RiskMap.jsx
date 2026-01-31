import MapOptimized from "@components/MapOptimized";
import { addLineLayer } from "@helpers/mapLayers";
import { useRef } from "react";

const RiskMap = () => {
  const mapRef = useRef(null);

  return (
    <div className="w-full h-[calc(100vh-180px)]">
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
        }}
      />
    </div>
  );
};

export default RiskMap;
