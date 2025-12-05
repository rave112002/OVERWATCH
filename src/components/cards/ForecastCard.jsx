import React from "react";

const ForecastCard = ({
  time,
  icon,
  condition,
  precipitationChance,
  precipitationAmount,
  temperatureWind,
}) => {
  return (
    <div className="py-2">
      <center className="w-36 h-full bg-white/80 text-gray-900 text-base rounded-2xl p-2 gap-2 flex flex-col items-center justify-between shadow-xl">
        <div className="flex flex-col w-full items-center">
          <span>{time}</span>
          {icon}
          <span>{condition}</span>
        </div>
        <div className="flex flex-col w-full gap-1">
          <span className="text-blue-500">{precipitationChance}</span>
          <span className="text-blue-500">{precipitationAmount}</span>
          <span className="">{temperatureWind}</span>
        </div>
      </center>
    </div>
  );
};

export default ForecastCard;
