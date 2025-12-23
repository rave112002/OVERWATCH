export const calculateHeatIndex = (tempC, humidity) => {
  const tempF = (tempC * 9) / 5 + 32;
  const hi =
    -42.379 +
    2.04901523 * tempF +
    10.14333127 * humidity -
    0.22475541 * tempF * humidity -
    0.00683783 * tempF * tempF -
    0.05481717 * humidity * humidity +
    0.00122874 * tempF * tempF * humidity +
    0.00085282 * tempF * humidity * humidity -
    0.00000199 * tempF * tempF * humidity * humidity;
  return (((hi - 32) * 5) / 9).toFixed(1);
};

// Helper function to get heat index color
export const getHeatIndexColor = (heatIndex) => {
  if (heatIndex < 27) return "#22C55E"; // Normal - Green
  if (heatIndex < 32) return "#EAB308"; // Caution - Yellow
  if (heatIndex < 41) return "#F97316"; // Extreme Caution - Orange
  if (heatIndex < 54) return "#DC2626"; // Danger - Red
  return "#7F1D1D"; // Extreme Danger - Dark Red
};

// Helper function to get heat index category
export const getHeatIndexCategory = (heatIndex) => {
  if (heatIndex < 27) return "Normal";
  if (heatIndex < 32) return "Caution";
  if (heatIndex < 41) return "Extreme Caution";
  if (heatIndex < 54) return "Danger";
  return "Extreme Danger";
};

// API call to fetch heat index data
export const getHeatIndexDataApi = async (lat, lon, barangayName) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&timezone=Asia/Manila`
    );

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();
    const temp = data.current.temperature_2m;
    const humidity = data.current.relative_humidity_2m;
    const heatIndex = parseFloat(calculateHeatIndex(temp, humidity));

    return {
      temperature: temp,
      humidity: humidity,
      heatIndex: heatIndex,
      color: getHeatIndexColor(heatIndex),
      category: getHeatIndexCategory(heatIndex),
      barangayName: barangayName,
    };
  } catch (error) {
    console.error(`Heat index API error for ${barangayName}:`, error);
    // Return fallback data
    return {
      temperature: 25,
      humidity: 50,
      heatIndex: 27,
      color: "#22C55E",
      category: "Normal",
      barangayName: barangayName,
    };
  }
};
