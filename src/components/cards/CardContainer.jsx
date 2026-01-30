import { Divider } from "antd";
import React from "react";

const CardContainer = ({ className, children = null, title = "Title" }) => {
  return (
    <div
      className={`bg-white/6 rounded-lg overflow-hidden flex flex-col ${className}`}
    >
      {title && <h3 className="text-lg font-semibold py-4 px-6">{title}</h3>}
      <Divider className="border border-white/15 p-0 m-0" />
      {children}
    </div>
  );
};

export default CardContainer;
