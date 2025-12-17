import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES, MAP_OPTIONS, MAP_VIEW_MODES } from "@constants/maps";
import { Radio } from "antd";

const BaseMap = ({
  center = [121.0, 14.6],
  zoom = 12,
  onMapLoad = () => {},
  children,
}) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  const [mapStyle, setMapStyle] = useState("light");
  const [mapViewMode, setMapViewMode] = useState("2d");

  // Setup map only once (don't recreate on style change)
  useEffect(() => {
    if (mapInstance.current) return;

    const styleUrl = MAP_STYLES[mapStyle] || MAP_STYLES["satellite"];
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center,
      zoom,
      pitch: 0,
      bearing: 0,
    });

    mapInstance.current.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    // Initial sources/layers
    mapInstance.current.on("load", () => {
      loadMapLayers();
      onMapLoad(mapInstance.current);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center, zoom, onMapLoad]);

  // Function to load all map layers
  const loadMapLayers = () => {
    if (!mapInstance.current) return;

    // --- PAR BORDER ---
    fetch("/data/par.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        if (!mapInstance.current) return;
        if (!mapInstance.current.getSource("par-outline")) {
          mapInstance.current.addSource("par-outline", {
            type: "geojson",
            data: geojson,
          });
        }
        if (!mapInstance.current.getLayer("par-border")) {
          mapInstance.current.addLayer({
            id: "par-border",
            type: "line",
            source: "par-outline",
            paint: {
              "line-color": "#808080",
              "line-width": 3,
              "line-dasharray": [2, 2],
            },
          });
        }
      });

    // --- Taguig boundary and auto-zoom ---
    fetch("/data/taguig.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        if (!mapInstance.current) return;
        if (!mapInstance.current.getSource("taguig-boundary")) {
          mapInstance.current.addSource("taguig-boundary", {
            type: "geojson",
            data: geojson,
          });
        }
        if (!mapInstance.current.getLayer("taguig-fill")) {
          mapInstance.current.addLayer({
            id: "taguig-fill",
            type: "fill-extrusion",
            source: "taguig-boundary",
            paint: {
              "fill-extrusion-color": "#008000",
              "fill-extrusion-opacity": 0.7,
              "fill-extrusion-height": 0,
              "fill-extrusion-base": 0,
            },
          });
        }
        if (!mapInstance.current.getLayer("taguig-border")) {
          mapInstance.current.addLayer({
            id: "taguig-border",
            type: "line",
            source: "taguig-boundary",
            paint: {
              "line-color": "#fff",
              "line-width": 2.5,
            },
          });
        }
        if (!mapInstance.current.getLayer("taguig-label")) {
          mapInstance.current.addLayer({
            id: "taguig-label",
            type: "symbol",
            source: "taguig-boundary",
            layout: {
              "text-field": ["get", "adm4_en"],
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": 12,
              "text-anchor": "center",
              "text-allow-overlap": false,
            },
            paint: {
              "text-color": "#000",
              "text-halo-color": "#ffffff",
              "text-halo-width": 2,
            },
          });
        }
        // --- Auto zoom to show all features ---
        const bounds = new maplibregl.LngLatBounds();
        const features =
          geojson.type === "FeatureCollection" ? geojson.features : [geojson];
        features.forEach((f) => {
          if (f.geometry?.type === "Polygon") {
            f.geometry.coordinates[0].forEach(([lon, lat]) =>
              bounds.extend([lon, lat])
            );
          } else if (f.geometry?.type === "MultiPolygon") {
            f.geometry.coordinates
              .flat(2)
              .forEach(([lon, lat]) => bounds.extend([lon, lat]));
          }
        });
        if (!bounds.isEmpty()) {
          mapInstance.current.fitBounds(bounds, { padding: 80 });
        }
      });
  };

  // Handle map style changes
  useEffect(() => {
    if (!mapInstance.current) return;

    const styleUrl = MAP_STYLES[mapStyle] || MAP_STYLES["satellite"];

    // Wait for map to be ready before changing style
    const changeStyle = () => {
      if (!mapInstance.current.isStyleLoaded()) {
        setTimeout(changeStyle, 100);
        return;
      }

      // Save current camera position
      const currentCenter = mapInstance.current.getCenter();
      const currentZoom = mapInstance.current.getZoom();

      // Change style
      mapInstance.current.setStyle(styleUrl);

      // Restore camera and reload layers after style loads
      mapInstance.current.once("styledata", () => {
        // Always reset to 2D view when changing map style
        mapInstance.current.jumpTo({
          center: currentCenter,
          zoom: currentZoom,
          pitch: 0,
          bearing: 0,
        });

        // Reset view mode state to 2D
        setMapViewMode("2d");

        // Reload custom layers after style change
        loadMapLayers();
      });
    };

    changeStyle();
  }, [mapStyle]); // Only mapStyle in dependencies, NOT mapViewMode

  // Handle zoom-based visibility
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    const handleZoom = () => {
      const zoom = map.getZoom();

      if (map.getLayer("taguig-label")) {
        map.setLayoutProperty(
          "taguig-label",
          "visibility",
          zoom > 10 ? "visible" : "none"
        );
      }

      if (map.getLayer("taguig-border")) {
        map.setLayoutProperty(
          "taguig-border",
          "visibility",
          zoom > 10 ? "visible" : "none"
        );
      }

      if (map.getLayer("taguig-fill")) {
        map.setLayoutProperty(
          "taguig-fill",
          "visibility",
          zoom > 10 ? "visible" : "none"
        );
      }
    };

    map.on("zoom", handleZoom);
    handleZoom();

    return () => {
      map.off("zoom", handleZoom);
    };
  }, []);

  // Handle view mode changes (2D/3D)
  useEffect(() => {
    if (!mapInstance.current) return;

    if (mapViewMode === "3d") {
      const currentZoom = mapInstance.current.getZoom();
      mapInstance.current.easeTo({
        pitch: 60,
        bearing: -17.6,
        zoom: currentZoom + 0.5,
        duration: 1000,
      });

      // Extrude the polygon in 3D
      if (mapInstance.current.getLayer("taguig-fill")) {
        mapInstance.current.setPaintProperty(
          "taguig-fill",
          "fill-extrusion-height",
          500
        );
        mapInstance.current.setPaintProperty(
          "taguig-fill",
          "fill-extrusion-opacity",
          0.7
        );
      }
    } else if (mapViewMode === "2d") {
      const currentZoom = mapInstance.current.getZoom();
      mapInstance.current.easeTo({
        pitch: 0,
        bearing: 0,
        zoom: currentZoom - 0.5,
        duration: 1000,
      });

      // Flatten the polygon in 2D
      if (mapInstance.current.getLayer("taguig-fill")) {
        mapInstance.current.setPaintProperty(
          "taguig-fill",
          "fill-extrusion-height",
          0
        );
        mapInstance.current.setPaintProperty(
          "taguig-fill",
          "fill-extrusion-opacity",
          0.3
        );
      }
    }
  }, [mapViewMode]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <div className="absolute top-50 right-4 flex flex-col gap-2 shadow-lg rounded-lg">
        {/* Map Style Selection */}
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

        {/* 2D/3D View Mode Selection */}
        <div className="rounded-lg overflow-hidden bg-transparent">
          <Radio.Group
            options={MAP_VIEW_MODES}
            defaultValue="2d"
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => setMapViewMode(e.target.value)}
            value={mapViewMode}
            className="vertical-radio-group"
          />
        </div>

        {children}
      </div>
    </div>
  );
};

export default BaseMap;
