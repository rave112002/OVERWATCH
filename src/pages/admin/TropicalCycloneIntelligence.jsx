import BaseMapv2 from "@components/BaseMapv2";
import React, { useRef } from "react";

const TropicalCycloneIntelligence = () => {
  const mapRef = useRef(null);

  return (
    <div className="w-full h-full">
      <BaseMapv2
        center={[121, 14.6]}
        zoom={4}
        enableBarangays={false}
        enableAutoFitBounds={false}
        enableBarangayHighlight={false}
        onMapLoad={(map) => {
          mapRef.current = map;
        }}
      ></BaseMapv2>
    </div>
  );
};

export default TropicalCycloneIntelligence;
