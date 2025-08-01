export const calculateDeliveryFee = (params: {
  weight: number;
  deliveryType: "STANDARD" | "EXPRESS";
  pickupCity: string;
  deliveryCity: string;
}): number => {
  const { weight, deliveryType, pickupCity, deliveryCity } = params;

  const isInterCity =
    pickupCity.trim().toLowerCase() !== deliveryCity.trim().toLowerCase();

  // Base rates for intra-city and inter-city
  const rateConfig = {
    INTRA_CITY: { base: 40, perKg: 10 },
    INTER_CITY: { base: 60, perKg: 15 },
  };

  const rates = isInterCity ? rateConfig.INTER_CITY : rateConfig.INTRA_CITY;

  // Calculate base + weight fee
  const weightFee = weight > 1 ? (weight - 1) * rates.perKg : 0;
  let fee = rates.base + weightFee;

  // Express delivery multiplier
  if (deliveryType === "EXPRESS") {
    fee *= 1.5;
  }

  return Math.round(fee);
};
