import React from "react";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES } from "@constants/maps";

const MapOptimized = ({
  onMapLoad,
  center = [121.0, 14.6],
  zoom = 12,
  styleUrl,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES["light"],
      center: center,
      zoom: zoom,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on("load", async () => {
      if (typeof onMapLoad === "function") {
        onMapLoad(map);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onMapLoad, center, zoom, styleUrl]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
  );
};

export default MapOptimized;
