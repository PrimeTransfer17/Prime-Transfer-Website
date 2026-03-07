/**
 * Distance calculation utilities — free, no API key required.
 *
 * Strategy:
 * 1. Geocode both locations via Nominatim (OpenStreetMap) — free, no limits for reasonable use.
 * 2. Compute straight-line (haversine) distance between the two coordinates.
 * 3. Multiply by a road factor of 1.3 to approximate actual road distance.
 *
 * Accuracy is typically within 10–15% of real road distance — good enough for price estimates.
 */

interface Coords {
    lat: number;
    lon: number;
    displayName: string;
}

/** Geocode an address/place string into lat/lon using Nominatim */
async function geocode(query: string): Promise<Coords | null> {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        const res = await fetch(url, {
            headers: {
                'Accept-Language': 'en',
                'User-Agent': 'PrimeTransfersBooking/1.0',
            },
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (!data || data.length === 0) return null;
        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            displayName: data[0].display_name,
        };
    } catch {
        return null;
    }
}

/** Haversine formula — returns straight-line distance in km */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Road factor applied to straight-line distance to approximate actual road distance.
 * Studies show European road distances average ~1.3× the straight-line distance.
 */
const ROAD_FACTOR = 1.3;

export interface DistanceResult {
    distanceKm: number;       // estimated road distance
    pickupDisplay: string;    // cleaned display name of pickup
    dropoffDisplay: string;   // cleaned display name of dropoff
}

/** Compute distance directly from pre-resolved coordinates (no geocoding needed) */
export function estimateDistanceFromCoords(
    fromLat: number, fromLon: number, fromDisplay: string,
    toLat: number, toLon: number, toDisplay: string,
): DistanceResult {
    const straightLine = haversineKm(fromLat, fromLon, toLat, toLon);
    const roadKm = straightLine * ROAD_FACTOR;
    const shorten = (name: string) => name.split(',').slice(0, 2).join(',').trim();
    return {
        distanceKm: Math.round(roadKm * 10) / 10,
        pickupDisplay: shorten(fromDisplay),
        dropoffDisplay: shorten(toDisplay),
    };
}

/**
 * Estimates road distance between two location strings.
 * Returns null if geocoding fails for either location.
 */
export async function estimateDistance(
    pickup: string,
    dropoff: string
): Promise<DistanceResult | null> {
    const [from, to] = await Promise.all([geocode(pickup), geocode(dropoff)]);
    if (!from || !to) return null;

    const straightLine = haversineKm(from.lat, from.lon, to.lat, to.lon);
    const roadKm = straightLine * ROAD_FACTOR;

    // Shorten display names: take the first two comma-separated parts
    const shorten = (name: string) => name.split(',').slice(0, 2).join(',').trim();

    return {
        distanceKm: Math.round(roadKm * 10) / 10, // 1 decimal
        pickupDisplay: shorten(from.displayName),
        dropoffDisplay: shorten(to.displayName),
    };
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

const MINIMUM_FARE = 15; // €

export interface VehicleResult {
    type: string;
    price: string;          // e.g. "€47"
    priceValue: number;     // numeric for sorting / comparison
    originalPrice?: string; // set only when a discount is applied
    distanceKm: number;
    passengers: number;
    luggage: number;
    trunk: number;
    img: string;
    ratePerKm: number;
}

const VEHICLES = [
    {
        type: 'Mercedes C Class',
        ratePerKm: 0.85,
        passengers: 3,
        luggage: 2,
        trunk: 350,
        img: 'https://drive.google.com/thumbnail?id=1Bhr6mCMwu1WRN2COW9T6-wp4i8ComRiu&sz=w1000',
    },
    {
        type: 'Mercedes Vito',
        ratePerKm: 1.20,
        passengers: 8,
        luggage: 7,
        trunk: 5000,
        img: 'https://drive.google.com/thumbnail?id=1m9xm596BVDoVwNZiZckG_2dZ21kq50ef&sz=w1000',
    },
    {
        type: 'Opel Vivaro',
        ratePerKm: 1.20,
        passengers: 8,
        luggage: 8,
        trunk: 6000,
        img: 'https://drive.google.com/thumbnail?id=1PBQujGh4PkdQaj7JKaAmRqyxlpP7ery2&sz=w1000',
    },
];

export function computeVehicleResults(distanceKm: number, isReturn = false): VehicleResult[] {
    return VEHICLES.map((v) => {
        const oneWayRaw = v.ratePerKm * distanceKm;
        const oneWayPrice = Math.max(MINIMUM_FARE, Math.round(oneWayRaw));

        if (isReturn) {
            const fullReturn = oneWayPrice * 2;
            return {
                ...v,
                distanceKm: Math.round(distanceKm),
                price: `€${fullReturn}`,
                priceValue: fullReturn,
            };
        }

        return {
            ...v,
            distanceKm: Math.round(distanceKm),
            price: `€${oneWayPrice}`,
            priceValue: oneWayPrice,
        };
    });
}
