import BaseMap from "@components/BaseMap";
import TranslucentCard from "@components/cards/TranslucentCard";
import { Button, Tooltip } from "antd";
import {
  CircleGauge,
  CloudRainWind,
  Droplet,
  ThermometerSun,
  Wind,
} from "lucide-react";
import React from "react";

const RiskIntelligence = () => {
  return (
    <div className="w-full h-full relative">
      <BaseMap center={[121, 14.6]} zoom={4} />
      <div className="absolute top-[45%] right-4 bg-white/30 rounded-lg">
        <TranslucentCard className="p-1 flex flex-col gap-1">
          {/* rain */}
          <Tooltip placement="left" title={"Rain"}>
            <Button type="text" className="py-5">
              <CloudRainWind size={20} />
            </Button>
          </Tooltip>

          {/* wind */}
          <Tooltip placement="left" title={"Wind"}>
            <Button type="text" className="py-5">
              <Wind size={20} />
            </Button>
          </Tooltip>

          {/* temp */}
          <Tooltip placement="left" title={"Temperature"}>
            <Button type="text" className="py-5">
              <ThermometerSun size={20} />
            </Button>
          </Tooltip>

          {/* humidity */}
          <Tooltip placement="left" title={"Humidity"}>
            <Button type="text" className="py-5">
              <Droplet size={20} />
            </Button>
          </Tooltip>

          {/* pressure */}
          <Tooltip placement="left" title={"Pressure"}>
            <Button type="text" className="py-5">
              <CircleGauge size={20} />
            </Button>
          </Tooltip>
        </TranslucentCard>
      </div>
    </div>
  );
};

export default RiskIntelligence;
