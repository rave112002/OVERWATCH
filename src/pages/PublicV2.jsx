import CardContainer from "@components/cards/CardContainer";
import { WEATHER_BACKGROUNDS } from "@constants/backgrounds";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const PublicV2 = () => {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const formattedDay = now.format("dddd");
  const formattedDate = now.format("MMMM D, YYYY");
  const formattedTime = now.format("hh:mm:ss A");

  const bg = "clear";
  return (
    <div
      className="w-full h-full"
      style={
        bg
          ? {
              backgroundImage: `url(${WEATHER_BACKGROUNDS[bg]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { background: "transparent" }
      }
    >
      <div
        className="h-full pt-20 text-white px-6 flex flex-col gap-4"
        style={
          bg
            ? { backgroundColor: "rgba(31, 41, 55, 0.9)" }
            : { background: "transparent" }
        }
      >
        <div className="w-full flex justify-between mt-6">
          <div className="flex flex-col gap-1">
            <span className="font-semibold">
              Hello Good Day, Raven! Have a great day!
            </span>
            <span>Open Weather and Environmental Reporting</span>
          </div>
          <div className="flex flex-col gap-1">
            <span>
              {formattedDay}, {formattedDate}
            </span>
            <span className="justify-end flex">{formattedTime}</span>
          </div>
        </div>

        <div className="flex gap-4 w-full ">
          <CardContainer
            title="Weather System Affecting City"
            className={"w-96"}
          >
            <div className="p-4"></div>
          </CardContainer>
          <CardContainer
            title="Current Weather in Taguig City"
            className={"w-96 flex-1"}
          >
            <div className="p-4"></div>
          </CardContainer>
          <CardContainer
            title="Current Weather in Taguig City"
            className={"w-96"}
          >
            <div className="p-4"></div>
          </CardContainer>
        </div>

        <CardContainer
          title="12-Hourly Weather Forecast in Taguig City"
          className={"w-full"}
        >
          <div className="p-4"></div>
        </CardContainer>

        <CardContainer
          title="5-Day Weather Outlook in Taguig City"
          className={"w-full"}
        >
          <div className="p-4"></div>
        </CardContainer>
      </div>
    </div>
  );
};

export default PublicV2;
