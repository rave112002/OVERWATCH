import { sampleBg } from "@assets/images";
import React from "react";

const Dashboard = () => {
  return (
    <div className="w-full h-full">
      <img src={sampleBg} alt="" className="w-full h-full object-cover" />
    </div>
  );
};

export default Dashboard;
