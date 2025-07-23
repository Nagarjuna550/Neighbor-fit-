import React from 'react';
import { NeighborhoodMatch, UserPreferences } from '../types';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Home,
  Car,
  Building,
  TreePine,
  Utensils,
  GraduationCap,
  Heart,
  ShoppingBag,
  Dumbbell,
  Bus,
  ArrowLeft
} from 'lucide-react';

interface NeighborhoodDetailsProps {
  match: NeighborhoodMatch;
  userPreferences: UserPreferences;
  onBack: () => void;
}

export const NeighborhoodDetails: React.FC<NeighborhoodDetailsProps> = ({ 
  match, 
  userPreferences, 
  onBack 
}) => {
  const { neighborhood, score, reasons, strengths, weaknesses } = match;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const amenityIcons = {
    restaurants: Utensils,
    schools: GraduationCap,
    hospitals: Heart,
    parks: TreePine,
    shopping: ShoppingBag,
    entertainment: Star,
    gym: Dumbbell,
    publicTransport: Bus
  };

  const getAmenityRating = (count: number) => {
    if (count >= 10) return { rating: 'Excellent', color: 'text-green-600 bg-green-100' };
    if (count >= 5) return { rating: 'Good', color: 'text-blue-600 bg-blue-100' };
    if (count >= 2) return { rating: 'Fair', color: 'text-yellow-600 bg-yellow-100' };
    return { rating: 'Limited', color: 'text-red-600 bg-red-100' };
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {neighborhood.name}
            </h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg">{neighborhood.city}, {neighborhood.state}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-gray-400 mr-1" />
                <span className="text-lg font-semibold text-gray-900">
                  ₹{neighborhood.averageRent.toLocaleString()}/month
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-1" />
                <span className="text-lg text-gray-600">
                  {neighborhood.transport.averageCommute} min commute
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getScoreColor(score)}`}>
              {score}% Match
            </div>
            <div className="mt-4 w-32">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Match Score</span>
                <span>{score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(score)} transition-all duration-300`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Why This Neighborhood */}
          {reasons.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Why This Neighborhood?</h2>
              <div className="space-y-3">
                {reasons.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities & Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(neighborhood.amenities).map(([amenity, count]) => {
                const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                const { rating, color } = getAmenityRating(count);
                return (
                  <div key={amenity} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900 capitalize">
                          {amenity.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm text-gray-500">{count} nearby</div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                      {rating}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lifestyle Factors */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Lifestyle Factors</h2>
            <div className="space-y-4">
              {Object.entries(neighborhood.lifestyle).map(([aspect, value]) => (
                <div key={aspect} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 capitalize mb-1">
                      {aspect.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                        style={{ width: `${value * 10}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-600">
                    {value}/10
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strengths.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Strengths
                </h3>
                <div className="space-y-2">
                  {strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-green-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {weaknesses.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Areas to Consider
                </h3>
                <div className="space-y-2">
                  {weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-red-700">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Population</span>
                </div>
                <span className="font-medium text-gray-900">
                  {neighborhood.demographics.population.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Average Age</span>
                </div>
                <span className="font-medium text-gray-900">
                  {neighborhood.demographics.averageAge} years
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Family Ratio</span>
                </div>
                <span className="font-medium text-gray-900">
                  {Math.round(neighborhood.demographics.familyRatio * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Transportation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transportation</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Nearest Metro</span>
                </div>
                <div className="text-gray-900 font-medium">
                  {neighborhood.transport.nearestMetro}
                </div>
                {neighborhood.transport.metroDistance > 0 && (
                  <div className="text-sm text-gray-500">
                    {neighborhood.transport.metroDistance}m away
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Bus className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Bus Connectivity</span>
                </div>
                <div className="text-gray-900 font-medium">
                  {neighborhood.transport.busStops} bus stops nearby
                </div>
              </div>
            </div>
          </div>

          {/* Budget Comparison */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Your Budget</span>
                <span className="font-medium text-gray-900">
                  ₹{userPreferences.budget.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Rent</span>
                <span className="font-medium text-gray-900">
                  ₹{neighborhood.averageRent.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Savings</span>
                  <span className={`font-medium ${
                    userPreferences.budget - neighborhood.averageRent >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    ₹{(userPreferences.budget - neighborhood.averageRent).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onBack}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Results</span>
            </button>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
              Save to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};