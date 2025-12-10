import { SmileOutlined } from "@ant-design/icons";
import BaseMap from "@components/BaseMap";
import { Button, Dropdown } from "antd";
import React, { useRef } from "react";
import { PARAMETERS } from "@constants/parameters";

const TestMap = () => {
  const mapRef = useRef(null);

  return (
    <div className="w-full h-full">
      <BaseMap
        center={[121, 14.6]}
        zoom={3}
        onMapLoad={(map) => {
          mapRef.current = map; // store map instance
        }}
      >
        <div className="absolute right-23 -top-30">
          <Dropdown menu={{ items: PARAMETERS }} placement="bottom">
            <Button>Parameters</Button>
          </Dropdown>
        </div>
      </BaseMap>
    </div>
  );
};

export default TestMap;
