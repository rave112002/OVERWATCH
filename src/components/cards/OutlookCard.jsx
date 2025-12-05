import React from "react";
import { down, up } from "@assets/icons";
import { MoveDown } from "lucide-react";
import { CloudLine } from "@assets/weather-icons";

const OutlookCard = ({
  day,
  date,
  condition,
  icon,
  high,
  low,
  chance,
  windSpeedDirection,
  wind,
}) => {
  return (
    <div className="bg-white/80 h-fit w-full text-gray-700 text-base rounded-lg py-2 px-4 gap-2 flex items-center justify-between shadow-xl">
      <div className="flex flex-col w-130">
        <span className="text-lg font-medium">{day}</span>
        <span className="text-sm">{date}</span>
      </div>

      <div className="flex gap-2 items-center w-full">
        {icon}
        <span>{condition}</span>
      </div>

      <div className="flex flex-col gap-0 w-80">
        <div className="flex gap-2 items-center p-0">
          <img src={up} alt="up" className="w-4 h-4 object-cover " />
          <span className="text-[#d5260f] leading-none">{high}</span>
        </div>
        <div className="flex gap-2 items-center">
          <img src={down} alt="down" className="w-4 h-4 object-cover" />
          <span className="leading-none">{low}</span>
        </div>
      </div>

      <div className="w-120 flex justify-center">
        <span>{chance}</span>
      </div>

      <div className="flex flex-col gap-0 text-sm w-80">
        <span className="flex items-center gap-1 justify-end">
          {windSpeedDirection} <MoveDown size={12} />
        </span>
        <span className="flex items-center gap-1 justify-end">{wind}</span>
      </div>
    </div>
  );
};

export default OutlookCard;
