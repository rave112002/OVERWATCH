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
