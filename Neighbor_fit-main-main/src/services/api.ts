const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || 'demo_key';
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export class APIService {
  private static instance: APIService;
  private cache = new Map<string, any>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  private async fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const data = await fetcher();
      this.cache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`API Error for ${key}:`, error);
      throw error;
    }
  }

  async searchNeighborhoods(city: string, limit: number = 10): Promise<any[]> {
    const cacheKey = `neighborhoods_${city}_${limit}`;
    
    return this.fetchWithCache(cacheKey, async () => {
      // Use Nominatim to search for neighborhoods/areas in the city
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(city)}&format=json&limit=${limit}&addressdetails=1&extratags=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch neighborhood data');
      }
      
      return response.json();
    });
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    const cacheKey = `place_details_${placeId}`;
    
    return this.fetchWithCache(cacheKey, async () => {
      // In a real implementation, this would use Google Places API
      // For demo purposes, we'll simulate the response
      return {
        place_id: placeId,
        name: 'Demo Place',
        rating: 4.2,
        user_ratings_total: 150,
        vicinity: 'Demo Area',
        geometry: {
          location: { lat: 28.6139, lng: 77.2090 }
        }
      };
    });
  }

  async searchNearbyPlaces(
    lat: number, 
    lng: number, 
    type: string, 
    radius: number = 1000
  ): Promise<any[]> {
    const cacheKey = `nearby_${lat}_${lng}_${type}_${radius}`;
    
    return this.fetchWithCache(cacheKey, async () => {
      // Use Overpass API for OpenStreetMap data
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="${type}"](around:${radius},${lat},${lng});
          way["amenity"="${type}"](around:${radius},${lat},${lng});
          relation["amenity"="${type}"](around:${radius},${lat},${lng});
        );
        out center meta;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
        headers: { 'Content-Type': 'text/plain' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch nearby places');
      }
      
      const data = await response.json();
      return data.elements || [];
    });
  }

  async getCommuteTimes(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    mode: string = 'driving'
  ): Promise<number> {
    const cacheKey = `commute_${origin.lat}_${origin.lng}_${destination.lat}_${destination.lng}_${mode}`;
    
    return this.fetchWithCache(cacheKey, async () => {
      // Calculate approximate commute time using straight-line distance
      const distance = this.calculateDistance(origin, destination);
      
      // Rough estimates based on mode
      const speedKmh = {
        walking: 5,
        cycling: 15,
        public_transport: 25,
        driving: 30
      }[mode] || 30;
      
      return Math.round((distance / speedKmh) * 60); // Convert to minutes
    });
  }

  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export const apiService = APIService.getInstance();