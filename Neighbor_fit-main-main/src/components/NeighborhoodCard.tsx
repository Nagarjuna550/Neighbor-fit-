import React from 'react';
import { NeighborhoodMatch } from '../types';
import { MapPin, DollarSign, Clock, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface NeighborhoodCardProps {
  match: NeighborhoodMatch;
  onSelect: (match: NeighborhoodMatch) => void;
}

export const NeighborhoodCard: React.FC<NeighborhoodCardProps> = ({ match, onSelect }) => {
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {neighborhood.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {neighborhood.city}, {neighborhood.state}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
            {score}% Match
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">₹{neighborhood.averageRent.toLocaleString()}/month</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">{neighborhood.transport.averageCommute} min commute</span>
          </div>
        </div>

        {/* Score Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Match Score</span>
            <span>{score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(score)} transition-all duration-300`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Reasons */}
        {reasons.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Why this neighborhood?</h4>
            <ul className="space-y-1">
              {reasons.slice(0, 3).map((reason, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <Star className="w-3 h-3 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Strengths
              </h4>
              <ul className="space-y-1">
                {strengths.slice(0, 2).map((strength, index) => (
                  <li key={index} className="text-xs text-green-600">
                    • {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {weaknesses.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                Areas to Consider
              </h4>
              <ul className="space-y-1">
                {weaknesses.slice(0, 2).map((weakness, index) => (
                  <li key={index} className="text-xs text-red-600">
                    • {weakness}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelect(match)}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};