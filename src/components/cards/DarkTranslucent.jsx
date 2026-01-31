import React from "react";

const DarkTranslucent = ({ children, className = "" }) => (
  <div
    className={`bg-black/30 backdrop-blur-sm border-2 border-white/5 rounded-lg shadow-xl  ${className}`}
  >
    {children}
  </div>
);

export default DarkTranslucent;
