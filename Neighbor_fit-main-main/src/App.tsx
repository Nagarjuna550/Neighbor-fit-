import React, { useState } from 'react';
import { UserPreferences, NeighborhoodMatch } from './types';
import { PreferenceForm } from './components/PreferenceForm';
import { NeighborhoodCard } from './components/NeighborhoodCard';
import { NeighborhoodDetails } from './components/NeighborhoodDetails';
import { NeighborhoodService } from './services/neighborhoodService';
import { MatchingAlgorithm } from './services/matchingAlgorithm';
import { MapPin, ArrowLeft, Heart, Users, TrendingUp, Filter, Grid, List } from 'lucide-react';

type AppState = 'preferences' | 'results' | 'details';
type ViewMode = 'grid' | 'list';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('preferences');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<NeighborhoodMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<NeighborhoodMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<NeighborhoodMatch | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [scoreFilter, setScoreFilter] = useState<number>(0);
  const [budgetFilter, setBudgetFilter] = useState<boolean>(false);

  const handlePreferencesSubmit = async (preferences: UserPreferences) => {
    setLoading(true);
    setUserPreferences(preferences);
    
    try {
      // Generate neighborhood data for the selected city
      const neighborhoods = await NeighborhoodService.generateNeighborhoodData(preferences.workLocation);
      
      // Calculate matches using the matching algorithm
      const neighborhoodMatches = MatchingAlgorithm.rankNeighborhoods(preferences, neighborhoods);
      
      setMatches(neighborhoodMatches);
      setFilteredMatches(neighborhoodMatches);
      setCurrentState('results');
    } catch (error) {
      console.error('Error finding neighborhoods:', error);
      // Handle error gracefully
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMatch = (match: NeighborhoodMatch) => {
    setSelectedMatch(match);
    setCurrentState('details');
  };

  const handleBackToResults = () => {
    setCurrentState('results');
    setSelectedMatch(null);
  };

  const handleBackToPreferences = () => {
    setCurrentState('preferences');
    setMatches([]);
    setFilteredMatches([]);
    setSelectedMatch(null);
    setUserPreferences(null);
    setScoreFilter(0);
    setBudgetFilter(false);
  };

  const applyFilters = () => {
    let filtered = [...matches];

    // Score filter
    if (scoreFilter > 0) {
      filtered = filtered.filter(match => match.score >= scoreFilter);
    }

    // Budget filter
    if (budgetFilter && userPreferences) {
      filtered = filtered.filter(match => match.neighborhood.averageRent <= userPreferences.budget);
    }

    setFilteredMatches(filtered);
  };

  React.useEffect(() => {
    applyFilters();
  }, [scoreFilter, budgetFilter, matches]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Finding Perfect Neighborhoods</h2>
          <p className="text-gray-600">Analyzing {userPreferences?.workLocation} areas based on your preferences...</p>
          <div className="mt-4 text-sm text-gray-500">
            Searching through 25+ neighborhoods with real-time data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">NeighborFit</h1>
                <p className="text-sm text-gray-500">Find Your Perfect Neighborhood</p>
              </div>
            </div>
            
            {currentState !== 'preferences' && (
              <div className="flex items-center space-x-4">
                {currentState === 'details' && (
                  <button
                    onClick={handleBackToResults}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Results</span>
                  </button>
                )}
                <button
                  onClick={handleBackToPreferences}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  New Search
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentState === 'preferences' && (
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Discover Your Perfect Neighborhood
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tell us about your lifestyle preferences, budget, and priorities. Our advanced algorithm will match you with neighborhoods that fit your unique needs.
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">12+ Cities</h3>
                <p className="text-gray-600">Covering major Indian metropolitan areas</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Matching</h3>
                <p className="text-gray-600">Advanced algorithm considers 15+ factors</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">25+ Results</h3>
                <p className="text-gray-600">Comprehensive neighborhood analysis with real data</p>
              </div>
            </div>

            <PreferenceForm onSubmit={handlePreferencesSubmit} />
          </div>
        )}

        {currentState === 'results' && (
          <div>
            {/* Results Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Best Neighborhoods in {userPreferences?.workLocation}
                </h2>
                <p className="text-gray-600">
                  Found {filteredMatches.length} of {matches.length} neighborhoods based on your preferences. Results are ranked by match score.
                </p>
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Match Score: {scoreFilter}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={scoreFilter}
                    onChange={(e) => setScoreFilter(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="budgetFilter"
                    checked={budgetFilter}
                    onChange={(e) => setBudgetFilter(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="budgetFilter" className="ml-2 text-sm font-medium text-gray-700">
                    Within my budget (₹{userPreferences?.budget.toLocaleString()})
                  </label>
                </div>

                <div className="flex items-center justify-end">
                  <span className="text-sm text-gray-600">
                    Showing {filteredMatches.length} results
                  </span>
                </div>
              </div>
            </div>

            {/* Results Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredMatches.map((match) => (
                <NeighborhoodCard
                  key={match.neighborhood.id}
                  match={match}
                  onSelect={handleSelectMatch}
                />
              ))}
            </div>

            {filteredMatches.length === 0 && matches.length > 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Match Your Filters</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more neighborhoods.</p>
                <button
                  onClick={() => {
                    setScoreFilter(0);
                    setBudgetFilter(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {matches.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600">Try adjusting your preferences or selecting a different city.</p>
              </div>
            )}
          </div>
        )}

        {currentState === 'details' && selectedMatch && (
          <NeighborhoodDetails
            match={selectedMatch}
            userPreferences={userPreferences!}
            onBack={handleBackToResults}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">NeighborFit</span>
            </div>
            <p className="text-gray-600 mb-2">
              Powered by real-time data from OpenStreetMap and location services
            </p>
            <p className="text-sm text-gray-500">
              © 2025 NeighborFit. Built with ❤️ for finding the perfect home.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;