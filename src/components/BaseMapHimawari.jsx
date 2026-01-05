import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES, MAP_OPTIONS } from "@constants/maps";
import { Radio } from "antd";

const RAIN_INTERVAL_MS = 1000;

const BaseMapHimawari = ({
  center = [121, 14.6],
  zoom = 12,
  onMapLoad = () => {},
  children,
}) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  const [mapStyle, setMapStyle] = useState("light");

  const rainTimerRef = useRef(null);

  const layerRegistry = {
    rain: { ids: [], animating: false },
    wind: { id: "weather-wind-tile" },
    temp: { id: "weather-temp-tile" },
    pressure: { id: "weather-pressure-tile" },
    clouds: { id: "weather-clouds-tile" },
  };

  const toggleLayer = (key) => {
    const map = mapInstance.current;
    if (!map) return;

    if (key === "rain") {
      const reg = layerRegistry.rain;
      if (!reg.ids.length) return;

      if (reg.animating) {
        stopRainAnimation();
        reg.animating = false;
        reg.ids.forEach((id) =>
          map.setLayoutProperty(id, "visibility", "none")
        );
      } else {
        startRainAnimation();
        reg.animating = true;
      }
      return;
    }

    const id = layerRegistry[key]?.id;
    if (!id || !map.getLayer(id)) return;
    const current = map.getLayoutProperty(id, "visibility") || "visible";
    map.setLayoutProperty(
      id,
      "visibility",
      current === "visible" ? "none" : "visible"
    );
  };

  const startRainAnimation = () => {
    const map = mapInstance.current;
    const ids = layerRegistry.rain.ids;
    if (!map || !ids.length) return;

    let idx = 0;
    ids.forEach((id, i) =>
      map.setLayoutProperty(id, "visibility", i === 0 ? "visible" : "none")
    );

    rainTimerRef.current = setInterval(() => {
      idx = (idx + 1) % ids.length;
      ids.forEach((id, i) =>
        map.setLayoutProperty(id, "visibility", i === idx ? "visible" : "none")
      );
    }, RAIN_INTERVAL_MS);
  };

  const stopRainAnimation = () => {
    if (rainTimerRef.current) {
      clearInterval(rainTimerRef.current);
      rainTimerRef.current = null;
    }
  };

  const addTileOverlay = (map, key, urlTemplate, paint = {}) => {
    const id = layerRegistry[key].id;
    const sourceId = `${id}-source`;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "raster",
        tiles: [urlTemplate],
        tileSize: 256,
      });
    }

    if (!map.getLayer(id)) {
      map.addLayer(
        {
          id,
          type: "raster",
          source: sourceId,
          layout: { visibility: "none" },
          paint,
        },
        "taguig-border"
      );
    }
  };

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[mapStyle],
      center,
      zoom,
    });

    const map = mapInstance.current;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", async () => {
      // === PAR outline ===
      try {
        const parGeo = await (await fetch("/data/par.geojson")).json();
        if (!map.getSource("par-outline"))
          map.addSource("par-outline", { type: "geojson", data: parGeo });
        if (!map.getLayer("par-border"))
          map.addLayer({
            id: "par-border",
            type: "line",
            source: "par-outline",
            paint: {
              "line-color": "#808080",
              "line-width": 3,
              "line-dasharray": [2, 2],
            },
          });
      } catch {}

      // === Taguig boundary ===
      try {
        const tag = await (await fetch("/data/taguig.geojson")).json();
        if (!map.getSource("taguig-boundary"))
          map.addSource("taguig-boundary", { type: "geojson", data: tag });

        if (!map.getLayer("taguig-fill"))
          map.addLayer({
            id: "taguig-fill",
            type: "fill",
            source: "taguig-boundary",
            paint: { "fill-color": "#008000", "fill-opacity": 0.28 },
          });

        if (!map.getLayer("taguig-border"))
          map.addLayer({
            id: "taguig-border",
            type: "line",
            source: "taguig-boundary",
            paint: { "line-color": "#fff", "line-width": 2.5 },
          });

        if (!map.getLayer("taguig-label"))
          map.addLayer({
            id: "taguig-label",
            type: "symbol",
            source: "taguig-boundary",
            layout: { "text-field": ["get", "adm4_en"], "text-size": 12 },
            paint: {
              "text-color": "#000",
              "text-halo-color": "#fff",
              "text-halo-width": 2,
            },
          });
      } catch {}

      // === RainViewer animation ===
      try {
        const rv = await (
          await fetch("https://api.rainviewer.com/public/weather-maps.json")
        ).json();
        const frames = rv.radar.past.slice(-8);

        const ids = [];
        frames.forEach((f) => {
          const srcId = `rain-src-${f.time}`;
          const layerId = `rain-layer-${f.time}`;
          const url = `https://tilecache.rainviewer.com/v2/radar/${f.time}/256/{z}/{x}/{y}.png`;

          if (!map.getSource(srcId))
            map.addSource(srcId, {
              type: "raster",
              tiles: [url],
              tileSize: 256,
            });

          if (!map.getLayer(layerId))
            map.addLayer(
              {
                id: layerId,
                type: "raster",
                source: srcId,
                layout: { visibility: "none" },
                paint: { "raster-opacity": 0.7 },
              },
              "taguig-border"
            );

          ids.push(layerId);
        });

        layerRegistry.rain.ids = ids;
      } catch (e) {
        console.warn("RainViewer failed", e);
      }

      // === Other weather overlays ===
      addTileOverlay(
        map,
        "wind",
        "https://tile.open-meteo.com/v1/wind/{z}/{x}/{y}.png",
        { "raster-opacity": 0.8 }
      );
      addTileOverlay(
        map,
        "temp",
        "https://tile.open-meteo.com/v1/temperature/{z}/{x}/{y}.png",
        { "raster-opacity": 0.7 }
      );
      addTileOverlay(
        map,
        "pressure",
        "https://tile.open-meteo.com/v1/pressure/{z}/{x}/{y}.png",
        { "raster-opacity": 0.8 }
      );
      addTileOverlay(
        map,
        "clouds",
        "https://tile.open-meteo.com/v1/clouds/{z}/{x}/{y}.png",
        { "raster-opacity": 0.6 }
      );

      onMapLoad(map, toggleLayer);
    });

    return () => {
      stopRainAnimation();
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <div className="absolute top-50 right-4 flex flex-col gap-2 shadow-lg rounded-lg">
        <div className="rounded-lg overflow-hidden bg-transparent">
          <Radio.Group
            options={MAP_OPTIONS}
            defaultValue="light"
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => setMapStyle(e.target.value)}
            value={mapStyle}
            className="vertical-radio-group"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default BaseMapHimawari;
