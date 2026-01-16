/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES, MAP_OPTIONS } from "@constants/maps";
import { Button, Radio } from "antd";
import { MoonIcon, Satellite, Sun } from "lucide-react";

const MOCK_POINTS = [
  {
    id: 1,
    name: "Incident A",
    lat: 8.2,
    lon: 131.3,
  },
];

const BaseMapLibre = ({
  center = [121.0, 14.6],
  zoom = 12,
  onMapLoad = () => {},
  children,
}) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  const [mapStyle, setMapStyle] = useState("light");

  const fetchImageAsBlobUrl = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch image");
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  const addHimawari = async (map) => {
    try {
      const blobUrl = await fetchImageAsBlobUrl(
        "https://www.data.jma.go.jp/mscweb/data/himawari/img/se2/se2_snd_0230.jpg"
      );

      if (!map.getSource("himawari-imagery")) {
        map.addSource("himawari-imagery", {
          type: "image",
          url: blobUrl,
          coordinates: [
            [-180, 90],
            [180, 90],
            [180, -90],
            [-180, -90],
          ],
        });

        map.addLayer({
          id: "himawari-layer",
          type: "raster",
          source: "himawari-imagery",
          paint: { "raster-opacity": 0.6 },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addPointLayer = (map) => {
    if (map.getSource("points")) return;

    map.addSource("points", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    map.addLayer({
      id: "points-layer",
      type: "circle",
      source: "points",
      paint: {
        "circle-radius": 7,
        "circle-color": "#ff4d4f",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });
  };

  const loadPoints = (map, points) => {
    const source = map.getSource("points");
    if (!source) return;

    const features = points.map((p) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [p.lon, p.lat],
      },
      properties: {
        id: p.id,
        name: p.name,
      },
    }));

    source.setData({
      type: "FeatureCollection",
      features,
    });
  };

  // Setup map only once
  useEffect(() => {
    if (mapInstance.current) return;

    const styleUrl = MAP_STYLES[mapStyle] || MAP_STYLES["satellite"];
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center,
      zoom,
    });

    mapInstance.current.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    // mapInstance.current.addControl(new maplibregl.GlobeControl(), "top-right");

    // Initial sources/layers
    mapInstance.current.on("load", async () => {
      // mapInstance.current.setFog({
      //   range: [-1, 2],
      //   color: "white",
      //   "high-color": "#d8f2ff",
      //   "horizon-blend": 0.1,
      //   "space-color": "#000010",
      //   "star-intensity": 0.5,
      // });

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

      // --- Taytay boundary and auto-zoom ---
      fetch("/data/taytay.geojson")
        .then((res) => res.json())
        .then((geojson) => {
          if (!mapInstance.current) return;
          if (!mapInstance.current.getSource("taytay-boundary")) {
            mapInstance.current.addSource("taytay-boundary", {
              type: "geojson",
              data: geojson,
            });
          }
          if (!mapInstance.current.getLayer("taytz`ay-fill")) {
            mapInstance.current.addLayer({
              id: "taytay-fill",
              type: "fill",
              source: "taytay-boundary",
              paint: {
                "fill-color": "#008000",
                "fill-opacity": 0.3,
              },
            });
          }
          if (!mapInstance.current.getLayer("taytay-border")) {
            mapInstance.current.addLayer({
              id: "taytay-border",
              type: "line",
              source: "taytay-boundary",
              paint: {
                "line-color": "#fff",
                "line-width": 2.5,
              },
            });
          }
          if (!mapInstance.current.getLayer("taytay-label")) {
            mapInstance.current.addLayer({
              id: "taytay-label",
              type: "symbol",
              source: "taytay-boundary",
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
            mapInstance.current.fitBounds(bounds, { padding: 40 });
          }
        });

      mapInstance.current.setRenderWorldCopies(false);

      addPointLayer(mapInstance.current);
      loadPoints(mapInstance.current, MOCK_POINTS);

      await addHimawari(mapInstance.current);

      onMapLoad(mapInstance.current);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [mapStyle, center, zoom, onMapLoad, addHimawari]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    const handleZoom = () => {
      const zoom = map.getZoom();

      // Hide/show taguig label
      if (map.getLayer("taguig-label")) {
        map.setLayoutProperty(
          "taguig-label",
          "visibility",
          zoom > 10 ? "visible" : "none"
        );
      }

      // Hide/show taguig border
      if (map.getLayer("taguig-border")) {
        map.setLayoutProperty(
          "taguig-border",
          "visibility",
          zoom > 8 ? "visible" : "none"
        );
      }

      // Hide/show taguig fill
      if (map.getLayer("taguig-fill")) {
        map.setLayoutProperty(
          "taguig-fill",
          "visibility",
          zoom > 8 ? "visible" : "none"
        );
      }
    };

    map.on("zoom", handleZoom);

    handleZoom();

    return () => {
      map.off("zoom", handleZoom);
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      const map = mapInstance.current;

      const logZoom = () => {
        console.log("Zoom level:", map.getZoom());
      };

      map.on("zoom", logZoom);

      // Cleanup
      return () => {
        map.off("zoom", logZoom);
      };
    }
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

export default BaseMapLibre;
