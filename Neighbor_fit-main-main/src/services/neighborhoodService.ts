import { Neighborhood } from '../types';
import { apiService } from './api';

export class NeighborhoodService {
  private static readonly INDIAN_CITIES = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur'
  ];

  // Expanded neighborhood patterns for each major city
  private static readonly CITY_NEIGHBORHOODS = {
    'Delhi': [
      'Connaught Place', 'Khan Market', 'Karol Bagh', 'Lajpat Nagar', 'South Extension',
      'Vasant Kunj', 'Dwarka', 'Rohini', 'Pitampura', 'Janakpuri', 'Laxmi Nagar',
      'Preet Vihar', 'Mayur Vihar', 'Kalkaji', 'Greater Kailash', 'Defence Colony',
      'Hauz Khas', 'Saket', 'Malviya Nagar', 'Green Park', 'Nehru Place',
      'Okhla', 'Noida Sector 18', 'Gurgaon Sector 14', 'Faridabad', 'Ghaziabad'
    ],
    'Mumbai': [
      'Bandra West', 'Andheri East', 'Andheri West', 'Juhu', 'Versova', 'Powai',
      'Hiranandani Gardens', 'Thane West', 'Mulund', 'Ghatkopar', 'Kurla',
      'Santa Cruz', 'Vile Parle', 'Malad', 'Borivali', 'Kandivali', 'Dahisar',
      'Lower Parel', 'Worli', 'Prabhadevi', 'Dadar', 'Matunga', 'Sion',
      'Chembur', 'Vikhroli', 'Bhandup', 'Kanjurmarg', 'Navi Mumbai'
    ],
    'Bangalore': [
      'Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'BTM Layout',
      'HSR Layout', 'Jayanagar', 'Basavanagudi', 'Malleshwaram', 'Rajajinagar',
      'Sadashivanagar', 'RT Nagar', 'Hebbal', 'Yelahanka', 'Marathahalli',
      'Bellandur', 'Sarjapur Road', 'Bannerghatta Road', 'JP Nagar', 'Banashankari',
      'Vijayanagar', 'Nagarbhavi', 'Kengeri', 'Bommanahalli', 'Hosur Road'
    ],
    'Chennai': [
      'T Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR', 'Porur', 'Tambaram',
      'Chrompet', 'Pallikaranai', 'Sholinganallur', 'Thoraipakkam', 'Perungudi',
      'Mylapore', 'Nungambakkam', 'Egmore', 'Kilpauk', 'Aminjikarai', 'Vadapalani',
      'Ashok Nagar', 'KK Nagar', 'Saidapet', 'Guindy', 'Kodambakkam', 'West Mambalam'
    ],
    'Hyderabad': [
      'Banjara Hills', 'Jubilee Hills', 'Hitech City', 'Gachibowli', 'Kondapur',
      'Madhapur', 'Kukatpally', 'Miyapur', 'Begumpet', 'Secunderabad', 'Ameerpet',
      'Somajiguda', 'Punjagutta', 'Lakdi Ka Pul', 'Abids', 'Koti', 'Dilsukhnagar',
      'LB Nagar', 'Uppal', 'Kompally', 'Bachupally', 'Nizampet', 'Manikonda'
    ],
    'Pune': [
      'Koregaon Park', 'Viman Nagar', 'Kharadi', 'Hadapsar', 'Magarpatta',
      'Aundh', 'Baner', 'Wakad', 'Hinjewadi', 'Pimpri', 'Chinchwad', 'Akurdi',
      'Deccan', 'Shivajinagar', 'Camp', 'Kothrud', 'Karve Nagar', 'Warje',
      'Katraj', 'Kondhwa', 'Wanowrie', 'Undri', 'Pisoli', 'Wagholi'
    ]
  };

  static async generateNeighborhoodData(city: string): Promise<Neighborhood[]> {
    try {
      // Get both API data and predefined neighborhoods
      const [apiResults, predefinedNeighborhoods] = await Promise.all([
        this.getAPINeighborhoods(city),
        this.getPredefinedNeighborhoods(city)
      ]);

      // Combine and deduplicate
      const allNeighborhoods = [...apiResults, ...predefinedNeighborhoods];
      const uniqueNeighborhoods = this.deduplicateNeighborhoods(allNeighborhoods);

      // Ensure we have at least 20-25 neighborhoods
      if (uniqueNeighborhoods.length < 20) {
        const additionalNeighborhoods = this.generateSyntheticNeighborhoods(city, 25 - uniqueNeighborhoods.length);
        uniqueNeighborhoods.push(...additionalNeighborhoods);
      }

      return uniqueNeighborhoods.slice(0, 30); // Return top 30 results
    } catch (error) {
      console.error('Error generating neighborhood data:', error);
      return this.getFallbackNeighborhoods(city);
    }
  }

  private static async getAPINeighborhoods(city: string): Promise<Neighborhood[]> {
    try {
      const searchResults = await apiService.searchNeighborhoods(city, 20);
      const neighborhoods: Neighborhood[] = [];

      for (const result of searchResults.slice(0, 15)) {
        const neighborhood = await this.createNeighborhoodFromResult(result, city);
        neighborhoods.push(neighborhood);
      }

      return neighborhoods;
    } catch (error) {
      console.warn('API neighborhoods failed, using fallback');
      return [];
    }
  }

  private static async getPredefinedNeighborhoods(city: string): Promise<Neighborhood[]> {
    const cityNeighborhoods = this.CITY_NEIGHBORHOODS[city as keyof typeof this.CITY_NEIGHBORHOODS] || [];
    const neighborhoods: Neighborhood[] = [];

    for (const neighborhoodName of cityNeighborhoods) {
      const neighborhood = this.createPredefinedNeighborhood(neighborhoodName, city);
      neighborhoods.push(neighborhood);
    }

    return neighborhoods;
  }

  private static createPredefinedNeighborhood(name: string, city: string): Neighborhood {
    // Generate realistic coordinates around the city center
    const cityCoords = this.getCityCoordinates(city);
    const lat = cityCoords.lat + (Math.random() - 0.5) * 0.2; // ±0.1 degree variation
    const lng = cityCoords.lng + (Math.random() - 0.5) * 0.2;

    return {
      id: `predefined_${city}_${name.replace(/\s+/g, '_')}`,
      name,
      coordinates: { lat, lng },
      city,
      state: this.getCityState(city),
      averageRent: this.estimateRent(city, name),
      amenities: this.generateEnhancedAmenityData(city, name),
      lifestyle: this.generateLifestyleData(city, name),
      demographics: this.generateDemographicsData(city),
      transport: this.generateTransportData(city, name)
    };
  }

  private static generateSyntheticNeighborhoods(city: string, count: number): Neighborhood[] {
    const neighborhoods: Neighborhood[] = [];
    const areaTypes = ['Sector', 'Phase', 'Extension', 'Colony', 'Nagar', 'Vihar', 'Park', 'Gardens'];
    
    for (let i = 0; i < count; i++) {
      const areaType = areaTypes[Math.floor(Math.random() * areaTypes.length)];
      const number = Math.floor(Math.random() * 50) + 1;
      const name = `${areaType} ${number}`;
      
      const neighborhood = this.createPredefinedNeighborhood(name, city);
      neighborhoods.push(neighborhood);
    }

    return neighborhoods;
  }

  private static deduplicateNeighborhoods(neighborhoods: Neighborhood[]): Neighborhood[] {
    const seen = new Set<string>();
    return neighborhoods.filter(neighborhood => {
      const key = `${neighborhood.city}_${neighborhood.name.toLowerCase().replace(/\s+/g, '_')}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private static getCityCoordinates(city: string): { lat: number; lng: number } {
    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      'Delhi': { lat: 28.6139, lng: 77.2090 },
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Kolkata': { lat: 22.5726, lng: 88.3639 },
      'Hyderabad': { lat: 17.3850, lng: 78.4867 },
      'Pune': { lat: 18.5204, lng: 73.8567 },
      'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'Surat': { lat: 21.1702, lng: 72.8311 },
      'Jaipur': { lat: 26.9124, lng: 75.7873 },
      'Lucknow': { lat: 26.8467, lng: 80.9462 },
      'Kanpur': { lat: 26.4499, lng: 80.3319 }
    };
    
    return coordinates[city] || { lat: 28.6139, lng: 77.2090 };
  }

  private static async createNeighborhoodFromResult(
    result: any,
    city: string
  ): Promise<Neighborhood> {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const name = result.display_name.split(',')[0];

    const amenities = this.generateEnhancedAmenityData(city, name);
    const lifestyle = this.generateLifestyleData(city, name);
    const demographics = this.generateDemographicsData(city);
    const transport = this.generateTransportData(city, name);

    return {
      id: result.place_id || `${lat}_${lng}`,
      name,
      coordinates: { lat, lng },
      city,
      state: this.getCityState(city),
      averageRent: this.estimateRent(city, name),
      amenities,
      lifestyle,
      demographics,
      transport
    };
  }

  private static generateEnhancedAmenityData(city: string, neighborhoodName: string): Neighborhood['amenities'] {
    const isBusinessDistrict = neighborhoodName.toLowerCase().includes('business') || 
                              neighborhoodName.toLowerCase().includes('commercial') ||
                              neighborhoodName.toLowerCase().includes('central');
    
    const isResidential = neighborhoodName.toLowerCase().includes('residential') ||
                         neighborhoodName.toLowerCase().includes('colony') ||
                         neighborhoodName.toLowerCase().includes('nagar');

    const isPosh = neighborhoodName.toLowerCase().includes('hills') ||
                   neighborhoodName.toLowerCase().includes('park') ||
                   neighborhoodName.toLowerCase().includes('gardens');

    const cityMultiplier = this.getCityMultiplier(city);
    
    // Base counts with realistic variations
    let baseCounts = {
      restaurants: Math.floor(Math.random() * 12) + 8,
      schools: Math.floor(Math.random() * 6) + 3,
      hospitals: Math.floor(Math.random() * 4) + 2,
      parks: Math.floor(Math.random() * 5) + 2,
      shopping: Math.floor(Math.random() * 8) + 5,
      entertainment: Math.floor(Math.random() * 6) + 3,
      gym: Math.floor(Math.random() * 4) + 2,
      publicTransport: Math.floor(Math.random() * 10) + 5
    };

    // Adjust based on area type
    if (isBusinessDistrict) {
      baseCounts.restaurants *= 1.5;
      baseCounts.shopping *= 1.3;
      baseCounts.entertainment *= 1.4;
      baseCounts.publicTransport *= 1.2;
    }

    if (isResidential) {
      baseCounts.schools *= 1.4;
      baseCounts.parks *= 1.3;
      baseCounts.hospitals *= 1.2;
    }

    if (isPosh) {
      baseCounts.gym *= 1.5;
      baseCounts.parks *= 1.4;
      baseCounts.entertainment *= 1.2;
    }

    // Apply city multiplier
    Object.keys(baseCounts).forEach(key => {
      baseCounts[key as keyof typeof baseCounts] = Math.round(
        baseCounts[key as keyof typeof baseCounts] * cityMultiplier
      );
    });

    return baseCounts;
  }

  private static generateLifestyleData(city: string, neighborhoodName: string): Neighborhood['lifestyle'] {
    const isMetro = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'].includes(city);
    const isCentral = neighborhoodName.toLowerCase().includes('central') || 
                     neighborhoodName.toLowerCase().includes('main') ||
                     neighborhoodName.toLowerCase().includes('center') ||
                     neighborhoodName.toLowerCase().includes('business');
    
    const isPosh = neighborhoodName.toLowerCase().includes('hills') ||
                   neighborhoodName.toLowerCase().includes('park') ||
                   neighborhoodName.toLowerCase().includes('gardens');

    const isOld = neighborhoodName.toLowerCase().includes('old') ||
                  neighborhoodName.toLowerCase().includes('heritage');

    let lifestyle = {
      quietness: Math.floor(Math.random() * 3) + 5,
      nightlife: Math.floor(Math.random() * 4) + 4,
      walkability: Math.floor(Math.random() * 3) + 5,
      greenSpaces: Math.floor(Math.random() * 4) + 4,
      culturalActivities: Math.floor(Math.random() * 4) + 4,
      familyFriendly: Math.floor(Math.random() * 3) + 6
    };

    // Adjust based on area characteristics
    if (isCentral) {
      lifestyle.quietness = Math.max(2, lifestyle.quietness - 2);
      lifestyle.nightlife = Math.min(10, lifestyle.nightlife + 3);
      lifestyle.walkability = Math.min(10, lifestyle.walkability + 2);
    }

    if (isPosh) {
      lifestyle.quietness = Math.min(10, lifestyle.quietness + 2);
      lifestyle.greenSpaces = Math.min(10, lifestyle.greenSpaces + 3);
      lifestyle.familyFriendly = Math.min(10, lifestyle.familyFriendly + 1);
    }

    if (isOld) {
      lifestyle.culturalActivities = Math.min(10, lifestyle.culturalActivities + 3);
      lifestyle.walkability = Math.max(3, lifestyle.walkability - 1);
    }

    if (isMetro) {
      lifestyle.nightlife = Math.min(10, lifestyle.nightlife + 1);
      lifestyle.culturalActivities = Math.min(10, lifestyle.culturalActivities + 1);
    }

    return lifestyle;
  }

  private static generateDemographicsData(city: string): Neighborhood['demographics'] {
    const basePopulation = this.getCityPopulation(city);
    
    return {
      population: Math.floor(Math.random() * 80000) + 30000,
      averageAge: Math.floor(Math.random() * 20) + 25,
      familyRatio: Math.random() * 0.5 + 0.3 // 30-80%
    };
  }

  private static generateTransportData(city: string, neighborhoodName: string): Neighborhood['transport'] {
    const hasMetro = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'].includes(city);
    const isCentral = neighborhoodName.toLowerCase().includes('central') || 
                     neighborhoodName.toLowerCase().includes('main');
    
    let metroDistance = hasMetro ? Math.floor(Math.random() * 3000) + 200 : -1;
    let busStops = Math.floor(Math.random() * 12) + 3;
    let averageCommute = Math.floor(Math.random() * 50) + 15;

    if (isCentral) {
      metroDistance = hasMetro ? Math.floor(Math.random() * 800) + 100 : -1;
      busStops = Math.floor(Math.random() * 8) + 8;
      averageCommute = Math.floor(Math.random() * 25) + 10;
    }

    return {
      nearestMetro: hasMetro ? `${city} Metro Line ${Math.floor(Math.random() * 6) + 1}` : 'Not Available',
      metroDistance,
      busStops,
      averageCommute
    };
  }

  private static getCityState(city: string): string {
    const cityStateMap: { [key: string]: string } = {
      'Delhi': 'Delhi',
      'Mumbai': 'Maharashtra',
      'Bangalore': 'Karnataka',
      'Chennai': 'Tamil Nadu',
      'Kolkata': 'West Bengal',
      'Hyderabad': 'Telangana',
      'Pune': 'Maharashtra',
      'Ahmedabad': 'Gujarat',
      'Surat': 'Gujarat',
      'Jaipur': 'Rajasthan',
      'Lucknow': 'Uttar Pradesh',
      'Kanpur': 'Uttar Pradesh'
    };
    
    return cityStateMap[city] || 'India';
  }

  private static getCityMultiplier(city: string): number {
    const tierMultipliers: { [key: string]: number } = {
      'Delhi': 1.4,
      'Mumbai': 1.5,
      'Bangalore': 1.3,
      'Chennai': 1.2,
      'Kolkata': 1.1,
      'Hyderabad': 1.2,
      'Pune': 1.1,
      'Ahmedabad': 1.0,
      'Surat': 0.9,
      'Jaipur': 1.0,
      'Lucknow': 0.9,
      'Kanpur': 0.8
    };
    
    return tierMultipliers[city] || 1.0;
  }

  private static getCityPopulation(city: string): number {
    const cityPopulations: { [key: string]: number } = {
      'Delhi': 32000000,
      'Mumbai': 21000000,
      'Bangalore': 13000000,
      'Chennai': 11000000,
      'Kolkata': 15000000,
      'Hyderabad': 10000000,
      'Pune': 7000000,
      'Ahmedabad': 8000000,
      'Surat': 6000000,
      'Jaipur': 4000000,
      'Lucknow': 3000000,
      'Kanpur': 3000000
    };
    
    return cityPopulations[city] || 2000000;
  }

  private static estimateRent(city: string, neighborhoodName: string): number {
    const baseRents: { [key: string]: number } = {
      'Delhi': 35000,
      'Mumbai': 45000,
      'Bangalore': 30000,
      'Chennai': 25000,
      'Kolkata': 20000,
      'Hyderabad': 28000,
      'Pune': 25000,
      'Ahmedabad': 22000,
      'Surat': 18000,
      'Jaipur': 20000,
      'Lucknow': 15000,
      'Kanpur': 12000
    };
    
    let baseRent = baseRents[city] || 20000;
    
    // Adjust based on neighborhood characteristics
    const isPosh = neighborhoodName.toLowerCase().includes('hills') ||
                   neighborhoodName.toLowerCase().includes('park') ||
                   neighborhoodName.toLowerCase().includes('gardens') ||
                   neighborhoodName.toLowerCase().includes('central');
    
    if (isPosh) {
      baseRent *= 1.3;
    }
    
    const variation = Math.random() * 0.8 + 0.6; // 60-140% of base
    
    return Math.round(baseRent * variation);
  }

  private static getFallbackNeighborhoods(city: string): Neighborhood[] {
    const fallbackAreas = [
      'Central Business District', 'North Zone', 'South Extension', 'East Side', 'West End',
      'Old City', 'New Town', 'IT Hub', 'Residential Complex', 'Garden City',
      'Metro Station Area', 'Commercial Center', 'University Area', 'Industrial Zone',
      'Heritage Quarter', 'Modern Township', 'Suburban Area', 'Downtown', 'Uptown',
      'Riverside', 'Hillside', 'Market District', 'Cultural Quarter', 'Tech Park',
      'Green Belt', 'Financial District', 'Entertainment Zone', 'Shopping Complex'
    ];

    return fallbackAreas.map((area, index) => ({
      id: `fallback_${city}_${index}`,
      name: area,
      coordinates: {
        lat: 28.6139 + (Math.random() - 0.5) * 0.2,
        lng: 77.2090 + (Math.random() - 0.5) * 0.2
      },
      city,
      state: this.getCityState(city),
      averageRent: this.estimateRent(city, area),
      amenities: this.generateEnhancedAmenityData(city, area),
      lifestyle: this.generateLifestyleData(city, area),
      demographics: this.generateDemographicsData(city),
      transport: this.generateTransportData(city, area)
    }));
  }
}