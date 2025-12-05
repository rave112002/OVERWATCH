import BaseMap from "@components/BaseMap";
import React from "react";

const RiskIntelligence = () => {
  return (
    <div className="w-full h-full">
      <BaseMap center={[121, 14.6]} zoom={4} />
    </div>
  );
};

export default RiskIntelligence;
