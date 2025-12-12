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
    const mapInstance = useRef(null);
    const combinedGeoJSONRef = useRef(null);
    const clickHandlerRef = useRef(null);
    const isAnimatingRef = useRef(false);
    const currentSelectionRef = useRef(null);

    const [mapStyle, setMapStyle] = useState("light");
    const [mapViewMode, setMapViewMode] = useState("2d");
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // ✅ Setup map ONCE
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
        antialias: true,
      });

      mapInstance.current.addControl(
        new maplibregl.NavigationControl(),
        "top-right"
      );

      mapInstance.current.on("load", () => {
        loadMapLayers();
        setIsMapLoaded(true);
        if (onMapLoad) onMapLoad(mapInstance.current);
      });

      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    }, []);

    // ✅ Load map layers
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
        })
        .catch((err) => console.error("Error loading PAR:", err));

      // --- Taguig boundary ---
      fetch("/data/taguig.geojson")
        .then((res) => res.json())
        .then((geojson) => {
          if (!mapInstance.current) return;

          combinedGeoJSONRef.current = geojson;

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
                "fill-extrusion-color": "#004aad",
                "fill-extrusion-opacity": 0.3,
                "fill-extrusion-height": 0,
                "fill-extrusion-base": 0,
              },
            });

            // ✅ Enable smooth transitions for paint properties
            mapInstance.current.setPaintProperty(
              "taguig-fill",
              "fill-extrusion-height-transition",
              { duration: 300, delay: 0 }
            );

            mapInstance.current.setPaintProperty(
              "taguig-fill",
              "fill-extrusion-opacity-transition",
              { duration: 200, delay: 0 }
            );
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

          setupClickHandler();

          // Cursor changes
          mapInstance.current.on("mouseenter", "taguig-fill", () => {
            if (mapInstance.current && !isAnimatingRef.current) {
              mapInstance.current.getCanvas().style.cursor = "pointer";
            }
          });
          mapInstance.current.on("mouseleave", "taguig-fill", () => {
            if (mapInstance.current) {
              mapInstance.current.getCanvas().style.cursor = "";
            }
          });

          // Auto zoom
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
        })
        .catch((err) => console.error("Error loading Taguig:", err));
    };

    // ✅ Setup click handler ONCE with debouncing
    const setupClickHandler = () => {
      if (!mapInstance.current || clickHandlerRef.current) return;

      const handleClick = (e) => {
        // Prevent clicks during animation
        if (isAnimatingRef.current || !enableBarangayHighlight) return;

        if (e.features && e.features.length > 0) {
          const clickedFeature = e.features[0];
          const clickedPsgc = clickedFeature.properties.adm4_psgc;
          const barangayName = clickedFeature.properties.adm4_en || "Unknown";

          // Don't re-select if already selected
          if (currentSelectionRef.current === clickedPsgc) return;

          const geojson = combinedGeoJSONRef.current;
          if (!geojson) return;

          const features =
            geojson.type === "FeatureCollection" ? geojson.features : [geojson];

          const fullFeature = features.find(
            (f) => f.properties.adm4_psgc === clickedPsgc
          );

          if (!fullFeature) return;

          let coords = [];
          if (fullFeature.geometry.type === "Polygon") {
            coords = fullFeature.geometry.coordinates[0];
          } else if (fullFeature.geometry.type === "MultiPolygon") {
            coords = fullFeature.geometry.coordinates[0][0];
          }

          let centerLon = 0,
            centerLat = 0;
          coords.forEach(([lon, lat]) => {
            centerLon += lon;
            centerLat += lat;
          });
          centerLon /= coords.length;
          centerLat /= coords.length;

          const barangayData = {
            psgc: clickedPsgc,
            barangayName: barangayName,
            lat: centerLat,
            lon: centerLon,
          };

          currentSelectionRef.current = clickedPsgc;

          if (onBarangayClick) {
            onBarangayClick(barangayData);
          }
        }
      };

      clickHandlerRef.current = handleClick;
      mapInstance.current.on("click", "taguig-fill", handleClick);
    };

    // Handle selected barangay
    useEffect(() => {
      if (!mapInstance.current || !isMapLoaded) return;

      const map = mapInstance.current;
      const layer = "taguig-fill";

      if (!map.getLayer(layer)) return;

      if (!selectedBarangay || !enableBarangayHighlight) {
        // Reset to default
        currentSelectionRef.current = null;
        isAnimatingRef.current = false;

        map.setPaintProperty(
          layer,
          "fill-extrusion-height",
          mapViewMode === "3d" ? 500 : 0
        );
        map.setPaintProperty(layer, "fill-extrusion-color", "#004aad");
        map.setPaintProperty(
          layer,
          "fill-extrusion-opacity",
          mapViewMode === "3d" ? 1.0 : 0.3
        );

        // ✅ Return to default view when deselecting in 2D mode
        if (mapViewMode === "2d") {
          const geojson = combinedGeoJSONRef.current;
          if (geojson) {
            const bounds = new maplibregl.LngLatBounds();
            const features =
              geojson.type === "FeatureCollection"
                ? geojson.features
                : [geojson];
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
              map.fitBounds(bounds, {
                padding: 80,
                pitch: 0,
                bearing: 0,
                duration: 800,
              });
            }
          }
        }

        return;
      }
      const clickedPsgc = selectedBarangay.psgc;
      isAnimatingRef.current = true;

      map.setPaintProperty(layer, "fill-extrusion-color", [
        "case",
        ["==", ["get", "adm4_psgc"], clickedPsgc],
        "#B20000",
        "#004aad",
      ]);

      // ✅ In 3D: selected is 800, others are 0 (flat)
      // ✅ In 2D: everything is 0 (flat)
      map.setPaintProperty(layer, "fill-extrusion-height", [
        "case",
        ["==", ["get", "adm4_psgc"], clickedPsgc],
        mapViewMode === "3d" ? 800 : 0,
        0, // Others stay flat at 0
      ]);

      map.setPaintProperty(layer, "fill-extrusion-opacity", [
        "case",
        ["==", ["get", "adm4_psgc"], clickedPsgc],
        1.0,
        0.15,
      ]);

      map.triggerRepaint();

      if (mapViewMode === "3d") {
        requestAnimationFrame(() => {
          if (!mapInstance.current) return;

          map.easeTo({
            center: [selectedBarangay.lon, selectedBarangay.lat],
            zoom: 14.5,
            pitch: 65,
            bearing: -17.6,
            duration: 700,
            easing: (t) => t * (2 - t),
          });

          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 700);
        });
      } else {
        if (!mapInstance.current) return;

        map.easeTo({
          pitch: 0,
          bearing: 0,
          duration: 1000,
        });
        isAnimatingRef.current = false;
      }
    }, [
      selectedBarangay?.psgc,
      enableBarangayHighlight,
      isMapLoaded,
      mapViewMode,
    ]);
    // Handle map style changes
    useEffect(() => {
      if (!mapInstance.current || !isMapLoaded) return;

      const styleUrl = MAP_STYLES[mapStyle] || MAP_STYLES["satellite"];

      const changeStyle = () => {
        if (!mapInstance.current.isStyleLoaded()) {
          setTimeout(changeStyle, 100);
          return;
        }

        const currentCenter = mapInstance.current.getCenter();
        const currentZoom = mapInstance.current.getZoom();

        mapInstance.current.setStyle(styleUrl);

        mapInstance.current.once("styledata", () => {
          mapInstance.current.jumpTo({
            center: currentCenter,
            zoom: currentZoom,
            pitch: 0,
            bearing: 0,
          });

          setMapViewMode("2d");
          clickHandlerRef.current = null;
          currentSelectionRef.current = null;
          loadMapLayers();
        });
      };

      changeStyle();
    }, [mapStyle]);

    // Handle zoom-based visibility
    useEffect(() => {
      if (!mapInstance.current || !isMapLoaded) return;
      const map = mapInstance.current;

      const handleZoom = () => {
        const zoom = map.getZoom();
        const visibility = zoom > 10 ? "visible" : "none";

        ["taguig-label", "taguig-border", "taguig-fill"].forEach((layerId) => {
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, "visibility", visibility);
          }
        });
      };

      map.on("zoom", handleZoom);
      handleZoom();

      return () => {
        map.off("zoom", handleZoom);
      };
    }, [isMapLoaded]);

    // Handle view mode changes (2D/3D)
    useEffect(() => {
      if (!mapInstance.current || !isMapLoaded) return;
      if (selectedBarangay && enableBarangayHighlight) return;

      const layer = "taguig-fill";
      if (!mapInstance.current.getLayer(layer)) return;

      if (mapViewMode === "3d") {
        mapInstance.current.setPaintProperty(
          layer,
          "fill-extrusion-height",
          500
        );
        mapInstance.current.setPaintProperty(
          layer,
          "fill-extrusion-opacity",
          1.0
        );

        mapInstance.current.easeTo({
          pitch: 60,
          bearing: -17.6,
          zoom: mapInstance.current.getZoom() + 0.5,
          duration: 800,
        });
      } else if (mapViewMode === "2d") {
        mapInstance.current.setPaintProperty(layer, "fill-extrusion-height", 0);
        mapInstance.current.setPaintProperty(
          layer,
          "fill-extrusion-opacity",
          0.3
        );

        // ✅ Return to default view with proper bounds
        const geojson = combinedGeoJSONRef.current;
        if (geojson) {
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
            mapInstance.current.fitBounds(bounds, {
              padding: 80,
              pitch: 0,
              bearing: 0,
              duration: 800,
            });
          }
        }
      }
    }, [mapViewMode, selectedBarangay, enableBarangayHighlight, isMapLoaded]);

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
  },
  (prevProps, nextProps) => {
    // Only re-render if these specific values change
    return (
      prevProps.selectedBarangay?.psgc === nextProps.selectedBarangay?.psgc &&
      prevProps.enableBarangayHighlight === nextProps.enableBarangayHighlight &&
      prevProps.center[0] === nextProps.center[0] &&
      prevProps.center[1] === nextProps.center[1] &&
      prevProps.zoom === nextProps.zoom
    );
  }
);

export default BaseMapv2;
