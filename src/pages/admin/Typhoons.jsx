import MapOptimized from "@components/MapOptimized";
import { addCycloneTrack, addLineLayer } from "@helpers/mapLayers";
import React, { useEffect, useRef, useState } from "react";

const Typhoons = () => {
  const [cycloneHistory, setCycloneHistory] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const getCycloneHistory = async () => {
      try {
        const res = await fetch(
          "http://192.168.2.204:5000/api/cyclone/getCycloneHistory",
        );
        const data = await res.json();
        setCycloneHistory(data);
      } catch (err) {
        console.error(err);
      }
    };

    getCycloneHistory();
  }, []);

  useEffect(() => {
    if (
      mapRef.current &&
      cycloneHistory.data &&
      cycloneHistory.data.length > 0
    ) {
      addCycloneTrack(mapRef.current, cycloneHistory.data);
    }
  }, [cycloneHistory]);

  console.log("cycloneHistory", cycloneHistory.data);
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
        }}
      />
    </div>
  );
};

export default Typhoons;
