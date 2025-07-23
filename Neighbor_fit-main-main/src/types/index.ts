export interface UserPreferences {
  workLocation: string;
  budget: number;
  familySize: number;
  transportMode: 'walking' | 'cycling' | 'public_transport' | 'car';
  amenityPreferences: {
    restaurants: number;
    schools: number;
    hospitals: number;
    parks: number;
    shopping: number;
    entertainment: number;
    gym: number;
    publicTransport: number;
  };
  lifestyle: {
    quietness: number;
    nightlife: number;
    walkability: number;
    greenSpaces: number;
    culturalActivities: number;
    familyFriendly: number;
  };
  housingType: 'apartment' | 'house' | 'any';
  commuteTolerance: number; // in minutes
}

export interface Neighborhood {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  city: string;
  state: string;
  averageRent: number;
  amenities: {
    restaurants: number;
    schools: number;
    hospitals: number;
    parks: number;
    shopping: number;
    entertainment: number;
    gym: number;
    publicTransport: number;
  };
  lifestyle: {
    quietness: number;
    nightlife: number;
    walkability: number;
    greenSpaces: number;
    culturalActivities: number;
    familyFriendly: number;
  };
  demographics: {
    population: number;
    averageAge: number;
    familyRatio: number;
  };
  transport: {
    nearestMetro: string;
    metroDistance: number;
    busStops: number;
    averageCommute: number;
  };
  matchScore?: number;
  matchReasons?: string[];
}

export interface NeighborhoodMatch {
  neighborhood: Neighborhood;
  score: number;
  reasons: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}