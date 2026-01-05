import BaseMapHimawari from "@components/BaseMapHimawari";
import { Button } from "antd";
import React, { useRef } from "react";

const RainRadar = () => {
  const toggleRef = useRef(null);

  return (
    <BaseMapHimawari
      onMapLoad={(map, toggleLayer) => {
        toggleRef.current = toggleLayer;
      }}
    >
      <Button
        onClick={() => toggleRef.current?.("rain")}
        className="px-3 py-2 bg-white rounded shadow"
      >
        🌧️
      </Button>
    </BaseMapHimawari>
  );
};

export default RainRadar;
