import { UserPreferences, Neighborhood, NeighborhoodMatch } from '../types';

export class MatchingAlgorithm {
  private static readonly WEIGHTS = {
    amenities: 0.3,
    lifestyle: 0.25,
    budget: 0.2,
    commute: 0.15,
    demographics: 0.1
  };

  static calculateMatch(
    userPreferences: UserPreferences,
    neighborhood: Neighborhood
  ): NeighborhoodMatch {
    const amenityScore = this.calculateAmenityScore(userPreferences, neighborhood);
    const lifestyleScore = this.calculateLifestyleScore(userPreferences, neighborhood);
    const budgetScore = this.calculateBudgetScore(userPreferences, neighborhood);
    const commuteScore = this.calculateCommuteScore(userPreferences, neighborhood);
    const demographicsScore = this.calculateDemographicsScore(userPreferences, neighborhood);

    const totalScore = 
      amenityScore * this.WEIGHTS.amenities +
      lifestyleScore * this.WEIGHTS.lifestyle +
      budgetScore * this.WEIGHTS.budget +
      commuteScore * this.WEIGHTS.commute +
      demographicsScore * this.WEIGHTS.demographics;

    const reasons = this.generateReasons(userPreferences, neighborhood, {
      amenityScore,
      lifestyleScore,
      budgetScore,
      commuteScore,
      demographicsScore
    });

    const { strengths, weaknesses } = this.analyzeStrengthsWeaknesses(
      userPreferences,
      neighborhood
    );

    return {
      neighborhood,
      score: Math.round(totalScore * 100),
      reasons,
      strengths,
      weaknesses
    };
  }

  private static calculateAmenityScore(
    userPreferences: UserPreferences,
    neighborhood: Neighborhood
  ): number {
    let score = 0;
    let totalWeight = 0;

    Object.entries(userPreferences.amenityPreferences).forEach(([amenity, importance]) => {
      const neighborhoodValue = neighborhood.amenities[amenity as keyof typeof neighborhood.amenities];
      const normalizedValue = Math.min(neighborhoodValue / 10, 1); // Normalize to 0-1
      score += normalizedValue * importance;
      totalWeight += importance;
    });

    return totalWeight > 0 ? score / totalWeight : 0;
  }

  private static calculateLifestyleScore(
    userPreferences: UserPreferences,
    neighborhood: Neighborhood
  ): number {
    let score = 0;
    let totalWeight = 0;

    Object.entries(userPreferences.lifestyle).forEach(([aspect, importance]) => {
      const neighborhoodValue = neighborhood.lifestyle[aspect as keyof typeof neighborhood.lifestyle];
      const normalizedValue = neighborhoodValue / 10; // Normalize to 0-1
      score += normalizedValue * importance;
      totalWeight += importance;
    });

    return totalWeight > 0 ? score / totalWeight : 0;
  }

  private static calculateBudgetScore(
    userPreferences: UserPreferences,
    neighborhood: Neighborhood
  ): number {
    const budgetRatio = neighborhood.averageRent / userPreferences.budget;
    
    if (budgetRatio <= 0.7) return 1.0; // Very affordable
    if (budgetRatio <= 0.9) return 0.8; // Affordable
    if (budgetRatio <= 1.1) return 0.6; // Slightly over budget
    if (budgetRatio <= 1.3) return 0.3; // Over budget
    return 0.1; // Way over budget
  }

  private static calculateCommuteScore(
    userPreferences: UserPreferences,
    neighborhood: Neighborhood
  ): number {
    const commuteRatio = neighborhood.transport.averageCommute / userPreferences.commuteTolerance;
    
    if (commuteRatio <= 0.5) return 1.0; // Very short commute
    if (commuteRatio <= 0.8) return 0.8; // Acceptable commute
    if (commuteRatio <= 1.0) return 0.6; // At tolerance limit
    if (commuteRatio <= 1.5) return 0.3; // Over tolerance
    return 0.1; // Way over tolerance
  }

  private static calculateDemographicsScore(
    userPreferences: UserPreferences,
    neighborhood: Neighborhood
  ): number {
    let score = 0.5; // Base score

    // Adjust based on family size and family-friendliness
    if (userPreferences.familySize > 1) {
      score += (neighborhood.demographics.familyRatio - 0.5) * 0.5;
    }

    return Math.max(0, Math.min(1, score));
  }

  private static generateReasons(
    userPreferences: UserPreferences,
    neighborhood: Neighborhood,
    scores: any
  ): string[] {
    const reasons: string[] = [];

    if (scores.budgetScore > 0.7) {
      reasons.push(`Rent is within your budget (₹${neighborhood.averageRent.toLocaleString()})`);
    }

    if (scores.commuteScore > 0.7) {
      reasons.push(`Short commute time (${neighborhood.transport.averageCommute} minutes)`);
    }

    // Check for high-priority amenities
    const topAmenities = Object.entries(userPreferences.amenityPreferences)
      .filter(([_, importance]) => importance >= 8)
      .map(([amenity, _]) => amenity);

    topAmenities.forEach(amenity => {
      const count = neighborhood.amenities[amenity as keyof typeof neighborhood.amenities];
      if (count > 5) {
        reasons.push(`Great ${amenity} availability (${count} nearby)`);
      }
    });

    return reasons;
  }

  private static analyzeStrengthsWeaknesses(
    userPreferences: UserPreferences,
    neighborhood: Neighborhood
  ): { strengths: string[]; weaknesses: string[] } {
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Analyze amenities
    Object.entries(neighborhood.amenities).forEach(([amenity, count]) => {
      if (count > 8) {
        strengths.push(`Excellent ${amenity} availability`);
      } else if (count < 2) {
        weaknesses.push(`Limited ${amenity} options`);
      }
    });

    // Analyze lifestyle factors
    Object.entries(neighborhood.lifestyle).forEach(([aspect, score]) => {
      if (score > 8) {
        strengths.push(`High ${aspect} score`);
      } else if (score < 4) {
        weaknesses.push(`Low ${aspect} score`);
      }
    });

    return { strengths, weaknesses };
  }

  static rankNeighborhoods(
    userPreferences: UserPreferences,
    neighborhoods: Neighborhood[]
  ): NeighborhoodMatch[] {
    return neighborhoods
      .map(neighborhood => this.calculateMatch(userPreferences, neighborhood))
      .sort((a, b) => b.score - a.score);
  }
}