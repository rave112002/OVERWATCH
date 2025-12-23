import React, { useRef, useEffect, useState, memo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES, MAP_OPTIONS, MAP_VIEW_MODES } from "@constants/maps";
import { Radio } from "antd";
import { getHeatIndexDataApi } from "@helpers/heat-index-helper";

const BaseMapv2 = memo(
  ({
    center = [121.0, 14.6],
    zoom = 12,
    onMapLoad,
    onBarangayClick,
    selectedBarangay = null,
    selectedParameter,
    enableBarangayHighlight = true,
    children,
  }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const geoJSONRef = useRef(null);
    const clickHandlerRef = useRef(null);
    const hasFitBoundsRef = useRef(false);
    const heatIndexLoadedRef = useRef(false);

    const [mapStyle, setMapStyle] = useState("light");
    const [mapViewMode, setMapViewMode] = useState("2d");
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const applyCurrentParameterStyle = () => {
      const map = mapRef.current;
      if (!map || !map.getLayer("taguig-fill")) return;

      if (selectedParameter === "heat-index") {
        map.setPaintProperty("taguig-fill", "fill-extrusion-color", [
          "step",
          ["get", "heat_index"],
          "#22C55E",
          27,
          "#EAB308",
          32,
          "#F97316",
          41,
          "#DC2626",
          54,
          "#7F1D1D",
        ]);
        map.setPaintProperty("taguig-fill", "fill-extrusion-opacity", 0.7);
      }
    };

    /* ───────────────────────── MAP INIT ───────────────────────── */
    useEffect(() => {
      if (mapRef.current) return;

      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLES[mapStyle],
        center,
        zoom,
        pitch: 0,
        bearing: 0,
        antialias: true,
      });

      mapRef.current.addControl(
        new maplibregl.NavigationControl(),
        "top-right"
      );

      mapRef.current.on("load", () => {
        loadLayers();
        setIsMapLoaded(true);
        onMapLoad?.(mapRef.current);
      });

      return () => {
        mapRef.current?.remove();
        mapRef.current = null;
      };
    }, []);

    /* ───────────────────────── LOAD LAYERS ───────────────────────── */
    const loadLayers = async () => {
      const map = mapRef.current;
      if (!map) return;

      try {
        const response = await fetch("/data/taguig.geojson");
        const geojson = await response.json();

        // 🔥 FETCH HEAT INDEX FOR ALL BARANGAYS
        console.log("Loading heat index data for all barangays...");

        const featuresWithHeat = await Promise.all(
          geojson.features.map(async (feature) => {
            let coords =
              feature.geometry.type === "Polygon"
                ? feature.geometry.coordinates[0]
                : feature.geometry.coordinates[0][0];

            let lonSum = 0,
              latSum = 0;
            coords.forEach(([lon, lat]) => {
              lonSum += lon;
              latSum += lat;
            });

            const centroidLon = lonSum / coords.length;
            const centroidLat = latSum / coords.length;

            try {
              const data = await getHeatIndexDataApi(
                centroidLat,
                centroidLon,
                feature.properties.adm4_en || "Unknown"
              );

              // Store heat index data in properties
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  heat_index: data.heatIndex,
                  heat_color: data.color,
                  heat_category: data.category,
                  heat_temp: data.temperature,
                  heat_humidity: data.humidity,
                },
              };
            } catch (e) {
              console.error(
                `Heat index fetch failed for ${feature.properties.adm4_en}:`,
                e
              );
              // Fallback values
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  heat_index: 27,
                  heat_color: "#22C55E",
                  heat_category: "Normal",
                  heat_temp: 25,
                  heat_humidity: 50,
                },
              };
            }
          })
        );

        geojson.features = featuresWithHeat;
        geoJSONRef.current = geojson;
        heatIndexLoadedRef.current = true;

        console.log("Heat index data loaded for all barangays");
        console.log("Sample data:", geojson.features[0]?.properties);

        // Add source
        if (!map.getSource("taguig")) {
          map.addSource("taguig", {
            type: "geojson",
            data: geojson,
          });
        }

        // Add fill-extrusion layer
        if (!map.getLayer("taguig-fill")) {
          map.addLayer({
            id: "taguig-fill",
            type: "fill-extrusion",
            source: "taguig",
            paint: {
              "fill-extrusion-color": "#004aad",
              "fill-extrusion-opacity": 0.3,
              "fill-extrusion-height": 0,
            },
          });
        }

        // Border layer
        if (!map.getLayer("taguig-border")) {
          map.addLayer({
            id: "taguig-border",
            type: "line",
            source: "taguig",
            paint: {
              "line-color": "#ffffff",
              "line-width": 2,
            },
          });
        }

        // Label layer
        if (!map.getLayer("taguig-label")) {
          map.addLayer({
            id: "taguig-label",
            type: "symbol",
            source: "taguig",
            layout: {
              "text-field": ["get", "adm4_en"],
              "text-size": 12,
            },
            paint: {
              "text-color": "#000",
              "text-halo-color": "#fff",
              "text-halo-width": 2,
            },
          });
        }

        setupClickHandler();

        // Auto-zoom once
        if (!hasFitBoundsRef.current) {
          fitToBounds(geojson);
          hasFitBoundsRef.current = true;
        }
      } catch (err) {
        console.error("Failed to load layers:", err);
      }
    };

    /* ───────────────────────── CLICK HANDLER ───────────────────────── */
    const setupClickHandler = () => {
      if (!mapRef.current || clickHandlerRef.current) return;

      const handleClick = (e) => {
        if (!enableBarangayHighlight) return;
        if (!e.features?.length) return;

        const feature = e.features[0];
        const psgc = feature.properties.adm4_psgc;
        const name = feature.properties.adm4_en;

        const geojson = geoJSONRef.current;
        const fullFeature = geojson.features.find(
          (f) => f.properties.adm4_psgc === psgc
        );
        if (!fullFeature) return;

        const coords =
          fullFeature.geometry.type === "Polygon"
            ? fullFeature.geometry.coordinates[0]
            : fullFeature.geometry.coordinates[0][0];

        const center = coords.reduce(
          (acc, [lon, lat]) => {
            acc.lon += lon;
            acc.lat += lat;
            return acc;
          },
          { lon: 0, lat: 0 }
        );

        onBarangayClick?.({
          psgc,
          barangayName: name,
          lon: center.lon / coords.length,
          lat: center.lat / coords.length,
        });
      };

      clickHandlerRef.current = handleClick;
      mapRef.current.on("click", "taguig-fill", handleClick);
    };

    /* ───────────────────────── HIGHLIGHT EFFECT ───────────────────────── */
    useEffect(() => {
      if (!mapRef.current || !isMapLoaded) return;

      const map = mapRef.current;
      const layer = "taguig-fill";
      const psgc = selectedBarangay?.psgc ?? null;

      /* 🎯 HEIGHT RULES */
      if (mapViewMode !== "3d") {
        // Not in 3D - everything flat
        map.setPaintProperty(layer, "fill-extrusion-height", 0);
      } else if (psgc) {
        // 3D with selection - only selected barangay gets height
        map.setPaintProperty(layer, "fill-extrusion-height", [
          "case",
          ["==", ["get", "adm4_psgc"], psgc],
          500,
          0,
        ]);
      } else {
        // 3D without selection - all get height
        map.setPaintProperty(layer, "fill-extrusion-height", 500);
      }

      // 🔥 HEAT INDEX MODE → COLOR ALL BARANGAYS
      if (selectedParameter === "heat-index") {
        // Use step expression for exact color boundaries matching HEAT_LEVELS
        map.setPaintProperty(layer, "fill-extrusion-color", [
          "step",
          ["get", "heat_index"],
          "#22C55E", // < 27°C: Normal (Green)
          27,
          "#EAB308", // 27-32°C: Caution (Yellow)
          32,
          "#F97316", // 32-41°C: Extreme Caution (Orange)
          41,
          "#DC2626", // 41-54°C: Danger (Red)
          54,
          "#7F1D1D", // ≥54°C: Extreme Danger (Dark Red/Purple)
        ]);

        map.setPaintProperty(layer, "fill-extrusion-opacity", 0.7);
      }

      // 🎯 NORMAL MODE → highlight selection
      else if (psgc) {
        map.setPaintProperty(layer, "fill-extrusion-color", [
          "case",
          ["==", ["get", "adm4_psgc"], psgc],
          "#B20000",
          "#004aad",
        ]);

        map.setPaintProperty(layer, "fill-extrusion-opacity", [
          "case",
          ["==", ["get", "adm4_psgc"], psgc],
          1,
          0.25,
        ]);
      }

      // 🌍 DEFAULT MODE
      else {
        map.setPaintProperty(layer, "fill-extrusion-color", "#004aad");
        map.setPaintProperty(layer, "fill-extrusion-opacity", 0.3);
      }

      /* 🎥 CAMERA */
      if (mapViewMode === "3d") {
        map.easeTo({
          center: selectedBarangay
            ? [selectedBarangay.lon, selectedBarangay.lat]
            : map.getCenter(),
          zoom: selectedBarangay ? 13.5 : map.getZoom(),
          pitch: 65,
          bearing: -17,
          duration: 700,
        });
      } else {
        map.easeTo({
          center: selectedBarangay
            ? [selectedBarangay.lon, selectedBarangay.lat]
            : map.getCenter(),

          pitch: 0,
          bearing: 0,
          duration: 600,
        });
      }
    }, [selectedBarangay, mapViewMode, selectedParameter, isMapLoaded]);

    /* ───────────────────────── VIEW MODE ───────────────────────── */
    useEffect(() => {
      if (!mapRef.current || !isMapLoaded || selectedBarangay) return;

      const map = mapRef.current;
      if (mapViewMode === "3d") {
        map.easeTo({ pitch: 60, bearing: -17, duration: 600 });
      } else {
        map.easeTo({ pitch: 0, bearing: 0, duration: 600 });
      }
    }, [mapViewMode, isMapLoaded, selectedBarangay]);

    /* ───────────────────────── STYLE SWITCH ───────────────────────── */
    useEffect(() => {
      if (!mapRef.current || !isMapLoaded) return;

      const map = mapRef.current;
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();

      map.setStyle(MAP_STYLES[mapStyle]);

      map.once("styledata", async () => {
        map.jumpTo({ center: currentCenter, zoom: currentZoom });
        clickHandlerRef.current = null;
        await loadLayers();

        applyCurrentParameterStyle();
      });
    }, [mapStyle]);

    /* ───────────────────────── FIT TO BOUNDS ───────────────────────── */
    const fitToBounds = (geojson) => {
      if (!mapRef.current || !geojson) return;

      const bounds = new maplibregl.LngLatBounds();
      const features =
        geojson.type === "FeatureCollection" ? geojson.features : [geojson];

      features.forEach((f) => {
        if (!f.geometry) return;

        if (f.geometry.type === "Polygon") {
          f.geometry.coordinates[0].forEach(([lon, lat]) =>
            bounds.extend([lon, lat])
          );
        }

        if (f.geometry.type === "MultiPolygon") {
          f.geometry.coordinates
            .flat(2)
            .forEach(([lon, lat]) => bounds.extend([lon, lat]));
        }
      });

      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, { padding: 80 });
      }
    };

    /* ───────────────────────── RENDER ───────────────────────── */
    return (
      <div className="relative w-full h-full">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Map controls */}
        <div className="absolute top-50 right-4 z-40 flex flex-col gap-2 rounded-lg shadow-lg">
          <div className="rounded-lg overflow-hidden bg-transparent">
            <Radio.Group
              options={MAP_OPTIONS}
              value={mapStyle}
              optionType="button"
              onChange={(e) => setMapStyle(e.target.value)}
              className="vertical-radio-group"
            />
          </div>
          <div className="rounded-lg overflow-hidden bg-transparent">
            <Radio.Group
              options={MAP_VIEW_MODES}
              value={mapViewMode}
              optionType="button"
              onChange={(e) => setMapViewMode(e.target.value)}
              className="vertical-radio-group"
            />
          </div>
        </div>

        {/* UI overlays */}
        {children}
      </div>
    );
  }
);

export default BaseMapv2;
