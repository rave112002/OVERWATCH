import { Globe, Minus, Plus } from "lucide-react";
import TranslucentContainer from "./cards/TranslucentContainer";
import { Button, Divider } from "antd";

const MapControls = ({ map }) => {
  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };
  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  return (
    <TranslucentContainer
      className="w-10 flex flex-col items-center justify-center gap-1 p-1"
      children={
        <>
          <Button type="text" className="w-8 p-0" onClick={handleZoomIn}>
            <Plus size={20} />
          </Button>
          <Divider variant="solid" className="border border-gray-400 m-0" />
          <Button type="text" className="w-8 p-0" onClick={handleZoomOut}>
            <Minus size={20} />
          </Button>
          <Divider variant="solid" className="border border-gray-400 m-0" />
          <Button type="text" className="w-8 p-0">
            <Globe size={20} />
          </Button>
        </>
      }
    />
  );
};

export default MapControls;
