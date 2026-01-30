import maplibregl from "maplibre-gl";

export const addLineLayer = async ({
  map,
  id,
  data, // GeoJSON object or URL
  color = "#808080",
  width = 3,
  dasharray,
}) => {
  const sourceId = `${id}-source`;
  const layerId = `${id}-line`;

  if (map.getSource(sourceId)) return;

  const geojson =
    typeof data === "string" ? await fetch(data).then((r) => r.json()) : data;

  map.addSource(sourceId, {
    type: "geojson",
    data: geojson,
  });

  map.addLayer({
    id: layerId,
    type: "line",
    source: sourceId,
    paint: {
      "line-color": color,
      "line-width": width,
      ...(dasharray && { "line-dasharray": dasharray }),
    },
  });
};

export const addCircleLayer = async ({
  map,
  id,
  data, // GeoJSON object or URL
  color = "red",
  radius = 6,
  strokeColor = "#ffffff",
  strokeWidth = 2,
}) => {
  const sourceId = `${id}-source`;
  const layerId = `${id}-circle`;

  // If you want it to re-add after style changes, this should be:
  // if (map.getLayer(layerId)) return;
  // and re-add the source/layer each time after setStyle.
  if (map.getSource(sourceId)) return;

  const geojson =
    typeof data === "string" ? await fetch(data).then((r) => r.json()) : data;

  map.addSource(sourceId, {
    type: "geojson",
    data: geojson,
  });

  map.addLayer({
    id: layerId,
    type: "circle",
    source: sourceId,
    paint: {
      "circle-color": color,
      "circle-radius": radius,
      "circle-stroke-color": strokeColor,
      "circle-stroke-width": strokeWidth,
    },
  });
};

export const addPolygonLayer = async ({
  map,
  id,
  data, // GeoJSON object or URL
  fillColor = "#0080ff",
  fillOpacity = 0.4,
  outlineColor = "#0055aa",
  outlineWidth = 2,
}) => {
  const sourceId = `${id}-source`;
  const fillLayerId = `${id}-fill`;
  const lineLayerId = `${id}-outline`;

  if (map.getSource(sourceId)) return;

  const geojson =
    typeof data === "string" ? await fetch(data).then((r) => r.json()) : data;

  map.addSource(sourceId, {
    type: "geojson",
    data: geojson,
  });

  map.addLayer({
    id: fillLayerId,
    type: "fill",
    source: sourceId,
    paint: {
      "fill-color": fillColor,
      "fill-opacity": fillOpacity,
    },
  });

  map.addLayer({
    id: lineLayerId,
    type: "line",
    source: sourceId,
    paint: {
      "line-color": outlineColor,
      "line-width": outlineWidth,
    },
  });
};

// export const addDynamicLayer = async (map, id, layerType, layerOptions) => {
//   if (map.getSource(id)) return;

//   map.add
// };

export const addPAR = async (map) => {
  await addLineLayer({
    map,
    id: "par",
    data: "/data/par.geojson",
    color: "#808080",
    width: 3,
    dasharray: [2, 2],
  });
};

export const addLGUBoundary = async ({
  map,
  id,
  fillColor = "#008000",
  fillOpacity = 0.3,
  outlineColor = "#ffffff",
  outlineWidth = 2,
  autoZoom = false,
}) => {
  const data = `/data/${id}.geojson`;

  await fetch(data)
    .then((res) => res.json())
    .then(async (geojson) => {
      if (!map) return;

      if (!map.getSource(`${id}-source`)) {
        map.addSource(`${id}-source`, {
          type: "geojson",
          data: geojson,
        });
      }
      if (!map.getLayer(`${id}-fill`)) {
        map.addLayer({
          id: `${id}-fill`,
          type: "fill",
          source: `${id}-source`,
          paint: {
            "fill-color": fillColor,
            "fill-opacity": fillOpacity,
          },
        });
      }
      if (!map.getLayer(`${id}-border`)) {
        map.addLayer({
          id: `${id}-border`,
          type: "line",
          source: `${id}-source`,
          paint: {
            "line-color": outlineColor,
            "line-width": outlineWidth,
          },
        });
      }
      if (!map.getLayer(`${id}-label`)) {
        map.addLayer({
          id: `${id}-label`,
          type: "symbol",
          source: `${id}-source`,
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

      // --- Auto zoom to show all features (only if enabled) ---
      if (autoZoom) {
        const bounds = new maplibregl.LngLatBounds();
        const features =
          geojson.type === "FeatureCollection" ? geojson.features : [geojson];
        features.forEach((f) => {
          if (f.geometry?.type === "Polygon") {
            f.geometry.coordinates[0].forEach(([lon, lat]) =>
              bounds.extend([lon, lat]),
            );
          } else if (f.geometry?.type === "MultiPolygon") {
            f.geometry.coordinates
              .flat(2)
              .forEach(([lon, lat]) => bounds.extend([lon, lat]));
          }
        });
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 40 });
        }
      }
    });
};

export const addCycloneTrack = async (map, data) => {
  // Sort data by issued_datetime ascending for proper track order
  const sortedData = data.sort(
    (a, b) => new Date(a.issued_datetime) - new Date(b.issued_datetime),
  );

  // Create GeoJSON for the track line
  const coordinates = sortedData.map((d) => [
    parseFloat(d.lon),
    parseFloat(d.lat),
  ]);
  const lineGeojson = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates,
    },
  };

  await addLineLayer({
    map,
    id: "cyclone-track",
    data: lineGeojson,
    color: "#ff0000",
    width: 3,
  });

  // Create GeoJSON for the points
  const pointsGeojson = {
    type: "FeatureCollection",
    features: sortedData.map((d) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [parseFloat(d.lon), parseFloat(d.lat)],
      },
      properties: d,
    })),
  };

  await addCircleLayer({
    map,
    id: "cyclone-points",
    data: pointsGeojson,
    color: "#ff0000",
    radius: 6,
  });

  // Add popup on click
  map.on("click", "cyclone-points-circle", (e) => {
    const properties = e.features[0].properties;
    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(
        `
        <div>
          <h3>${properties.cyclone_name}</h3>
          <p><strong>Type:</strong> ${properties.cyclone_type}</p>
          <p><strong>Bulletin:</strong> ${properties.bulletin_number}</p>
          <p><strong>Intensity:</strong> ${properties.intensity_msw} km/h</p>
          <p><strong>Category:</strong> ${properties.intensity_category}</p>
          <p><strong>Direction:</strong> ${properties.movement_direction}</p>
          <p><strong>Speed:</strong> ${properties.movement_speed} km/h</p>
          <p><strong>Issued:</strong> ${new Date(properties.issued_datetime).toLocaleString()}</p>
          <p><strong>Forecast Hour:</strong> ${properties.forecast_hour}</p>
        </div>
      `,
      )
      .addTo(map);
  });

  // Change cursor on hover
  map.on("mouseenter", "cyclone-points-circle", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "cyclone-points-circle", () => {
    map.getCanvas().style.cursor = "";
  });
};
