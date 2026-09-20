// Delivery fee tiers by distance from the store (Taguig — Central Signal
// Village) to the customer's selected city/municipality. Checkout only
// collects a city from a fixed NCR dropdown (see ncr-locations.ts), not a
// pinned GPS location, so exact routing distance isn't available — these
// are approximate road-distance estimates (km) from the store to each
// city's town center, good enough to tier a delivery fee by. Shared
// between the checkout UI (for display) and the checkout API route (for
// the GCash amount) so the two never drift apart.

export const CITY_DISTANCE_KM: Record<string, number> = {
  Taguig: 2,
  Pateros: 4,
  Makati: 7,
  Pasig: 9,
  Parañaque: 10,
  Mandaluyong: 11,
  Pasay: 12,
  Muntinlupa: 14,
  "San Juan": 14,
  Manila: 16,
  Marikina: 16,
  "Las Piñas": 17,
  "Quezon City": 20,
  Caloocan: 24,
  Malabon: 24,
  Navotas: 25,
  Valenzuela: 27,
};

type FeeTier = { maxKm: number; fee: number };

// Ascending by maxKm — the first tier a distance fits under wins.
const FEE_TIERS: FeeTier[] = [
  { maxKm: 5, fee: 49 },
  { maxKm: 10, fee: 69 },
  { maxKm: 15, fee: 99 },
  { maxKm: 20, fee: 129 },
  { maxKm: Infinity, fee: 159 },
];

export const MIN_DELIVERY_FEE_PESOS = FEE_TIERS[0].fee;
export const MAX_DELIVERY_FEE_PESOS = FEE_TIERS[FEE_TIERS.length - 1].fee;

// Cities outside the known table (shouldn't happen — checkout only offers
// cities from NCR_CITIES — but never undercharge if one slips through).
export function getDeliveryFeeForCity(city: string | undefined | null): number {
  const km = city ? CITY_DISTANCE_KM[city] : undefined;
  if (km == null) return MAX_DELIVERY_FEE_PESOS;
  const tier = FEE_TIERS.find((t) => km <= t.maxKm);
  return tier ? tier.fee : MAX_DELIVERY_FEE_PESOS;
}

export function getDeliveryDistanceKm(city: string | undefined | null): number | null {
  if (!city) return null;
  return CITY_DISTANCE_KM[city] ?? null;
}
