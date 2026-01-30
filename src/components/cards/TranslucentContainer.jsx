import React from "react";

const TranslucentContainer = ({ children = null, className }) => {
  return (
    <div
      className={`bg-white/40 backdrop-blur-sm ring ring-white/10 rounded-lg shadow-xl ${className}`}
    >
      {children}
    </div>
  );
};

export default TranslucentContainer;
