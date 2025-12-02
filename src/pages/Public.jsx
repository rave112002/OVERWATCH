import React from "react";
import { horizonImg } from "@assets/images";

const Public = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-position-[0%_75%]"
      style={{
        backgroundImage: `
        linear-gradient(to right, rgba(0, 105, 110, 0.6), rgba(0, 74, 173, 0.6)),
        url(${horizonImg})
     `,
      }}
    >
      <div className="w-20 h-20 pt-20 bg-white/50">hi</div>
    </div>
  );
};

export default Public;
