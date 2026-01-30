import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import CardContainer from "@components/cards/CardContainer";

const Dashboard = () => {
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

  return (
    <div className="w-full h-full pt-20 text-white px-4 flex flex-col gap-4">
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
        <CardContainer title="Weather System Affecting City" className={"w-96"}>
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

      <CardContainer title="12-Hourly Weather Forecast in Taguig City" className={"w-full"}>
        <div className="p-4"></div>
      </CardContainer>

      <CardContainer title="5-Day Weather Outlook in Taguig City" className={"w-full"}>
        <div className="p-4"></div>
      </CardContainer>
    </div>
  );
};

export default Dashboard;
