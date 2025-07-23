import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { MapPin, DollarSign, Users, Car, Home, Clock } from 'lucide-react';

interface PreferenceFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  loading?: boolean;
}

const INDIAN_CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
  'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur'
];

export const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSubmit, loading = false }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    workLocation: '',
    budget: 25000,
    familySize: 1,
    transportMode: 'public_transport',
    amenityPreferences: {
      restaurants: 7,
      schools: 5,
      hospitals: 8,
      parks: 6,
      shopping: 7,
      entertainment: 5,
      gym: 6,
      publicTransport: 8
    },
    lifestyle: {
      quietness: 6,
      nightlife: 4,
      walkability: 7,
      greenSpaces: 6,
      culturalActivities: 5,
      familyFriendly: 5
    },
    housingType: 'apartment',
    commuteTolerance: 45
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  const updateAmenityPreference = (amenity: string, value: number) => {
    setPreferences(prev => ({
      ...prev,
      amenityPreferences: {
        ...prev.amenityPreferences,
        [amenity]: value
      }
    }));
  };

  const updateLifestylePreference = (aspect: string, value: number) => {
    setPreferences(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [aspect]: value
      }
    }));
  };

  const SliderInput = ({ 
    label, 
    value, 
    onChange, 
    min = 1, 
    max = 10, 
    step = 1 
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Basic Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Location (City)
            </label>
            <select
              value={preferences.workLocation}
              onChange={(e) => setPreferences(prev => ({ ...prev, workLocation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select your city</option>
              {INDIAN_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Budget (₹)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={preferences.budget}
                onChange={(e) => setPreferences(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="5000"
                max="200000"
                step="1000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Family Size
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <select
                value={preferences.familySize}
                onChange={(e) => setPreferences(prev => ({ ...prev, familySize: parseInt(e.target.value) }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>Just me</option>
                <option value={2}>2 people</option>
                <option value={3}>3 people</option>
                <option value={4}>4 people</option>
                <option value={5}>5+ people</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Transport Mode
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <select
                value={preferences.transportMode}
                onChange={(e) => setPreferences(prev => ({ ...prev, transportMode: e.target.value as any }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="walking">Walking</option>
                <option value="cycling">Cycling</option>
                <option value="public_transport">Public Transport</option>
                <option value="car">Car</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Housing Type
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <select
                value={preferences.housingType}
                onChange={(e) => setPreferences(prev => ({ ...prev, housingType: e.target.value as any }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="any">Any</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commute Tolerance (minutes)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={preferences.commuteTolerance}
                onChange={(e) => setPreferences(prev => ({ ...prev, commuteTolerance: parseInt(e.target.value) }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="10"
                max="120"
                step="5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Amenity Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Amenity Preferences
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Rate how important each amenity is to you (1 = not important, 10 = very important)
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(preferences.amenityPreferences).map(([amenity, value]) => (
            <SliderInput
              key={amenity}
              label={amenity.charAt(0).toUpperCase() + amenity.slice(1).replace(/([A-Z])/g, ' $1')}
              value={value}
              onChange={(newValue) => updateAmenityPreference(amenity, newValue)}
            />
          ))}
        </div>
      </div>

      {/* Lifestyle Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Lifestyle Preferences
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Rate how important each lifestyle aspect is to you (1 = not important, 10 = very important)
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(preferences.lifestyle).map(([aspect, value]) => (
            <SliderInput
              key={aspect}
              label={aspect.charAt(0).toUpperCase() + aspect.slice(1).replace(/([A-Z])/g, ' $1')}
              value={value}
              onChange={(newValue) => updateLifestylePreference(aspect, newValue)}
            />
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Finding Neighborhoods...' : 'Find My Perfect Neighborhood'}
        </button>
      </div>
    </form>
  );
};