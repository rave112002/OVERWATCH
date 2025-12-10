import React from "react";
import { cityBg } from "@assets/images";
import TranslucentCard from "@components/cards/TranslucentCard";
import {
  CURRENT_WEATHER,
  DAILY_OUTLOOK,
  HOURLY_FORECAST,
} from "@constants/sampleData";
import ForecastCard from "@components/cards/ForecastCard";
import OutlookCard from "@components/cards/OutlookCard";

const Public = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-position-[0%_25%] pt-16" //
      style={{
        backgroundImage: `
        linear-gradient(to right, rgba(0, 105, 110, 0.5) 0%, rgba(0, 74, 173, 0.5) 60%),
        url(${cityBg})
     `,
      }}
    >
      <div className="w-full h-full px-10 py-6 flex gap-6 justify-between text-white">
        <div className="w-2/5 flex flex-col gap-6 ">
          <TranslucentCard className="w-full p-6">
            <div className="flex flex-col gap-4">
              <span className="text-xl font-semibold text-shadow-lg">
                Current Weather in Taguig City
              </span>
              <div className="flex gap-4 justify-between">
                <div className="w-2/5 flex gap-0">
                  <div className=" w-3/5 justify-end items-center flex">
                    {CURRENT_WEATHER.icon}
                  </div>
                  <div className=" w-2/5 flex flex-col justify-center">
                    <span className="text-3xl font-semibold">
                      {CURRENT_WEATHER.temperature}
                    </span>
                    <span className="">{CURRENT_WEATHER.condition}</span>
                  </div>
                </div>
                <div className="w-3/5 border rounded-2xl p-6 grid grid-cols-2 gap-6">
                  {CURRENT_WEATHER.current.map((current, index) => {
                    return (
                      <div key={index} className=" flex gap-2 items-center">
                        <img
                          src={current.icon}
                          alt={current.name.toLowerCase()}
                          className="object-contain  h-8 w-8"
                        />
                        <div className="flex flex-col gap-0">
                          <span className="leading-none font-thin">
                            {current.name}
                          </span>
                          <span className="text-lg font-semibold leading-none">
                            {current.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TranslucentCard>

          <TranslucentCard className="w-full p-6">
            <div className="flex flex-col gap-4">
              <span className="text-xl font-semibold text-shadow-lg">
                Weather System Affecting Taguig City
              </span>
              <span className="bg-gray-300/75 rounded-2xl p-4 text-gray-900 text-justify">
                Taguig City will experience cloudy skies with scattered rains
                and isolated thunderstorms caused by Shear Line. Possible flash
                floods or landslides due to moderate to at times heavy rains.
              </span>
            </div>
          </TranslucentCard>

          <TranslucentCard className="w-full p-6">
            <div className="flex flex-col gap-4">
              <span className="text-xl font-semibold text-shadow-lg">
                Advisories / Warnings
              </span>
              <span className="bg-gray-300/75 rounded-2xl p-4 text-gray-900 text-center">
                No Advisories for Taguig City.
              </span>
            </div>
          </TranslucentCard>
        </div>
        <div className="w-3/5 flex flex-col min-h-0">
          <TranslucentCard className="w-full h-full p-6">
            <div className="flex flex-col gap-4 h-full">
              <div className="w-full h-fit flex flex-col gap-2">
                <span className="text-xl font-semibold text-shadow-lg">
                  12-Hourly Weather Forecast in Taguig City
                </span>
                <div className="w-full h-full flex gap-2 overflow-x-auto">
                  {HOURLY_FORECAST.map((forecast, index) => (
                    <ForecastCard
                      key={index}
                      time={forecast.time}
                      icon={forecast.icon}
                      condition={forecast.condition}
                      precipitationChance={forecast.precipitationChance}
                      precipitationAmount={forecast.precipitationAmount}
                      temperatureWind={forecast.temperatureWind}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full flex flex-col gap-2 flex-1 min-h-0">
                <span className="text-xl font-semibold text-shadow-lg">
                  5-Day Weather Outlook in Taguig City
                </span>
                <div className="w-full flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-2">
                  {DAILY_OUTLOOK.map((outlook, index) => (
                    <OutlookCard
                      key={index}
                      day={outlook.day}
                      date={outlook.date}
                      icon={outlook.icon}
                      condition={outlook.condition}
                      high={outlook.high}
                      low={outlook.low}
                      chance={outlook.chance}
                      windSpeedDirection={outlook.windSpeedDirection}
                      wind={outlook.wind}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TranslucentCard>
        </div>
      </div>
    </div>
  );
};

export default Public;
