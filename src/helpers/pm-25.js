// Get PM2.5 quality level
export const getPM25Quality = (value) => {
  if (value <= 12) return { level: "Good", color: "text-green-600" };
  if (value <= 35.4) return { level: "Moderate", color: "text-yellow-600" };
  if (value <= 55.4)
    return {
      level: "Unhealthy for Sensitive Groups",
      color: "text-orange-600",
    };
  if (value <= 150.4) return { level: "Unhealthy", color: "text-red-600" };
  if (value <= 250.4)
    return { level: "Very Unhealthy", color: "text-purple-600" };
  return { level: "Hazardous", color: "text-red-900" };
};
