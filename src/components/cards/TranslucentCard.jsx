import React from "react";

const TranslucentCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/15 backdrop-blur-sm border-2 border-white/5 rounded-lg shadow-xl p-6 ${className}`}
  >
    {children}
  </div>
);

export default TranslucentCard;
