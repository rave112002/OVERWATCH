import { STYLES_URLS } from "@constants/maps";
import { addLGUBoundary, addPAR } from "@helpers/mapLayers";
import { Button } from "antd";
import { Globe, LocateFixed } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import TranslucentContainer from "./cards/TranslucentContainer";

const MapOptimized = ({
  onMapLoad,
  center = [125.04, 15.67],
  zoom = 5,
  mapRef,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [style, setStyle] = useState(0);
  const lguID = "taytay";
  const MAX_BOUNDS = [
    [105, 2], //WEST, SOUTH
    [155, 30], // EAST, NORTH
  ];

  const handleChangeStyle = () => {
    setStyle((prev) => (prev < 2 ? prev + 1 : 0));
  };

  const panOut = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo({
      center: [129.5, 15.5],
      zoom: 4.5,
      speed: 5,
      curve: 1,
      easing(t) {
        return t;
      },
    });
  };

  useEffect(() => {
    if (mapInstanceRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: STYLES_URLS[style],
      center: center,
      zoom: zoom,
      attributionControl: false,
      maxBounds: MAX_BOUNDS,
    });
    mapInstanceRef.current = map;
    if (mapRef) mapRef.current = map;
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
        showZoom: true,
        visualizePitch: false,
      }),
      "bottom-right",
    );

    map.on("load", async () => {
      // add layers/sources here

      await addPAR(map);
      await addLGUBoundary({
        map,
        id: lguID,
        autoZoom: true,
      });

      map.setRenderWorldCopies(false);

      if (typeof onMapLoad === "function") {
        onMapLoad(map);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onStyleLoad = async () => {
      // await addLineLayer({
      //   map,
      //   id: "tcad",
      //   data: "/data/tcad.geojson",
      //   color: "#808080",
      //   width: 1,
      // });
      await addPAR(map);
      await addLGUBoundary({ map, id: lguID, autoZoom: false });
    };

    map.once("styledata", onStyleLoad);
    map.setStyle(STYLES_URLS[style]);

    return () => {
      map.off("styledata", onStyleLoad);
    };
  }, [style]);

  // useEffect(() => {
  //   const map = mapRef.current;
  //   if (map) {

  //     const logZoom = () => {
  //       console.log("Zoom level:", map.getZoom());
  //     };

  //     map.on("zoom", logZoom);

  //     // Cleanup
  //     return () => {
  //       map.off("zoom", logZoom);
  //     };
  //   }
  // }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      <div className="absolute bottom-23 right-4 flex flex-col-reverse gap-2 z-10">
        <TranslucentContainer className="w-9">
          <Button
            type="text"
            className="w-full p-0"
            onClick={handleChangeStyle}
          >
            <Globe size={18} />
          </Button>
        </TranslucentContainer>

        <TranslucentContainer className="w-9">
          <Button type="text" className="w-full p-0" onClick={panOut}>
            <LocateFixed size={18} />
          </Button>
        </TranslucentContainer>
      </div>
    </div>
  );
};

export default MapOptimized;
