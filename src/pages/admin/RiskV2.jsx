import { Radio, Tabs } from "antd";
import React from "react";
import RiskMap from "./Risk/RiskMap";
import Dashboard from "./Dashboard";
import RiskAnalysis from "./RiskAnalysis";
import TestMap from "./TestMap";

const RiskV2 = () => {
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "riskmap",
      label: "Risk Map",
      children: <RiskMap />,
    },
    {
      key: "localanalysis",
      label: "Local Analysis",
      children: <TestMap />,
    },
    {
      key: "nationalanalysis",
      label: "National Analysis",
      children: <RiskAnalysis />,
    },
  ];
  return (
    <div className="w-full h-full pt-20 flex flex-col">
      <div className="px-8 py-4 flex-1 flex flex-col">
        <Tabs
          defaultActiveKey="riskmap"
          items={items}
          onChange={onChange}
          className="text-white flex-1 flex flex-col"
        />
      </div>
    </div>
  );
};

export default RiskV2;
