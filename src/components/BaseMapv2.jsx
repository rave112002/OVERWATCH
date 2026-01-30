import React, { useRef, useEffect, useState, memo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES, MAP_OPTIONS, MAP_VIEW_MODES } from "@constants/maps";
import { Radio } from "antd";

const BaseMapv2 = memo(
  ({
    center = [121.0, 14.6],
    zoom = 12,
    onMapLoad,
    onBarangayClick,
    selectedBarangay = null,
    enableBarangayHighlight = true,
    children,
  }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const geoJSONRef = useRef(null);
    const clickHandlerRef = useRef(null);
    const hasFitBoundsRef = useRef(false);

    const [mapStyle, setMapStyle] = useState("light");
    const [mapViewMode, setMapViewMode] = useState("2d");
    const [isMapLoaded, setIsMapLoaded] = useState(false);

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
    const loadLayers = () => {
      const map = mapRef.current;
      if (!map) return;

      fetch("/data/taytay.geojson")
        .then((res) => res.json())
        .then((geojson) => {
          geoJSONRef.current = geojson;

          if (!map.getSource("taytay")) {
            map.addSource("taytay", {
              type: "geojson",
              data: geojson,
            });
          }

          if (!map.getLayer("taytay-fill")) {
            map.addLayer({
              id: "taytay-fill",
              type: "fill-extrusion",
              source: "taytay",
              paint: {
                "fill-extrusion-color": "#004aad",
                "fill-extrusion-opacity": 0.3,
                "fill-extrusion-height": 0,
              },
            });
          }

          map.setPaintProperty(
            "taytay-fill",
            "fill-extrusion-height-transition",
            {
              duration: 500,
              delay: 0,
            }
          );

          if (!map.getLayer("taytay-border")) {
            map.addLayer({
              id: "taytay-border",
              type: "line",
              source: "taytay",
              paint: {
                "line-color": "#ffffff",
                "line-width": 2,
              },
            });
          }

          if (!map.getLayer("taytay-label")) {
            map.addLayer({
              id: "taytay-label",
              type: "symbol",
              source: "taytay",
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

          // Auto-zoom ONLY once on initial load
          if (!hasFitBoundsRef.current) {
            fitToBounds(geojson);
            hasFitBoundsRef.current = true;
          }
        });
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
      mapRef.current.on("click", "taytay-fill", handleClick);
    };

    /* ───────────────────────── HIGHLIGHT EFFECT ───────────────────────── */
    useEffect(() => {
      if (!mapRef.current || !isMapLoaded) return;

      const map = mapRef.current;
      const layer = "taytay-fill";
      const psgc = selectedBarangay?.psgc ?? null;

      /* 🎯 HEIGHT RULES */
      map.setPaintProperty(layer, "fill-extrusion-height", [
        "case",

        // ❌ Not in 3D → everything flat
        ["!=", ["literal", mapViewMode], "3d"],
        0,

        // ✅ 3D + selected barangay → only selected gets height
        [
          "all",
          ["==", ["literal", mapViewMode], "3d"],
          ["!=", ["literal", psgc], null],
          ["==", ["get", "adm4_psgc"], psgc],
        ],
        500,

        // ✅ 3D + no selection → all get height
        [
          "all",
          ["==", ["literal", mapViewMode], "3d"],
          ["==", ["literal", psgc], null],
        ],
        500,

        0,
      ]);

      /* 🎨 COLOR + OPACITY */
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
          pitch: 0,
          bearing: 0,
          duration: 600,
        });
      }
    }, [selectedBarangay, mapViewMode, isMapLoaded]);

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

      map.once("styledata", () => {
        map.jumpTo({ center: currentCenter, zoom: currentZoom });
        clickHandlerRef.current = null;
        loadLayers();
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
