import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, CompositeRankingView, SearchBar, IndexRankingView } from '../components';
import { ParticlePresetKey, PARTICLE_PRESETS, ThemePreset } from '../components/particlePresets';
import { Globe, Users, Award, BarChart3, ChevronDown, ExternalLink } from 'lucide-react';


// Define all ranking sources with metadata
const RANKING_SOURCES = {
  international: [
    { code: 'qs', name: 'QS World University Rankings', shortName: 'QS', url: 'https://www.topuniversities.com/university-rankings' },
    { code: 'the', name: 'Times Higher Education', shortName: 'THE', url: 'https://www.timeshighereducation.com/world-university-rankings' },
    { code: 'arwu', name: 'Academic Ranking of World Universities', shortName: 'ARWU', url: 'https://www.shanghairanking.com/rankings/arwu' },
    { code: 'webometrics', name: 'Webometrics Ranking', shortName: 'Webometrics', url: 'https://www.webometrics.info/en/World' },
    { code: 'leiden', name: 'CWTS Leiden Ranking', shortName: 'Leiden', url: 'https://www.leidenranking.com/ranking' },
  ],
  american: [
    { code: 'usnews', name: 'US News Best Colleges', shortName: 'US News', url: 'https://www.usnews.com/best-colleges' },
    { code: 'forbes', name: 'Forbes Top Colleges', shortName: 'Forbes', url: 'https://www.forbes.com/top-colleges' },
    { code: 'niche', name: 'Niche Best Colleges', shortName: 'Niche', url: 'https://www.niche.com/colleges/search/best-colleges' },
    { code: 'wm', name: 'Washington Monthly', shortName: 'WashMo', url: 'https://washingtonmonthly.com/2024-college-guide' },
    { code: 'wsj', name: 'Wall Street Journal/THE', shortName: 'WSJ', url: 'https://www.wsj.com/rankings/college-rankings' },
  ],
};

type ViewMode = 'composite' | 'index';

type HomeProps = {
  currentPreset: ParticlePresetKey;
  onPresetChange: (key: ParticlePresetKey) => void;
};

export const Home: React.FC<HomeProps> = ({ currentPreset, onPresetChange }) => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<'INTERNATIONAL' | 'AMERICAN'>('INTERNATIONAL');
  const [viewMode, setViewMode] = useState<ViewMode>('composite');
  const [selectedIndex, setSelectedIndex] = useState<string>('qs');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const theme: ThemePreset = PARTICLE_PRESETS[currentPreset];

  const currentSources = selectedRegion === 'INTERNATIONAL' 
    ? RANKING_SOURCES.international 
    : RANKING_SOURCES.american;

  const selectedSource = [...RANKING_SOURCES.international, ...RANKING_SOURCES.american]
    .find(s => s.code === selectedIndex);

  // Update selected index when region changes
  useEffect(() => {
    const firstSource = currentSources[0];
    if (firstSource && viewMode === 'index') {
      setSelectedIndex(firstSource.code);
    }
  }, [selectedRegion]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden bg-transparent flex flex-col">
      <Header currentPreset={currentPreset} onPresetChange={onPresetChange} />

      <main className="flex-1 overflow-y-auto max-w-7xl mx-auto px-4 py-4 w-full">
        {/* Hero Section - Compact */}
        <div className="text-center mb-4">
          <h2 className={`text-3xl sm:text-4xl font-bold ${theme.textPrimary} mb-2 drop-shadow-lg`}>
            Discover the World's Best Colleges
          </h2>
          <p className={`text-base sm:text-lg ${theme.textSecondary} max-w-2xl mx-auto`}>
            Compare universities from 10 global ranking systems in one place
          </p>
        </div>

        {/* Search Bar - Compact */}
        <div className="mb-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for a university..."
            theme={theme}
          />
        </div>

        {/* Stats Section - Bigger Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className={`${theme.cardBg} rounded-xl p-4 text-center transform hover:scale-105 transition-transform`}>
            <Award className={`w-12 h-12 ${theme.accentColor} mx-auto mb-2`} />
            <p className={`text-3xl font-bold ${theme.cardText}`}>10</p>
            <p className={`text-xs ${theme.cardTextMuted}`}>Ranking Systems</p>
          </div>
          <div className={`${theme.cardBg} rounded-xl p-4 text-center transform hover:scale-105 transition-transform`}>
            <Globe className={`w-12 h-12 ${theme.accentColor} mx-auto mb-2`} />
            <p className={`text-3xl font-bold ${theme.cardText}`}>5</p>
            <p className={`text-xs ${theme.cardTextMuted}`}>International</p>
          </div>
          <div className={`${theme.cardBg} rounded-xl p-4 text-center transform hover:scale-105 transition-transform`}>
            <Users className={`w-12 h-12 ${theme.accentColor} mx-auto mb-2`} />
            <p className={`text-3xl font-bold ${theme.cardText}`}>5</p>
            <p className={`text-xs ${theme.cardTextMuted}`}>US Rankings</p>
          </div>
          <div className={`${theme.cardBg} rounded-xl p-4 text-center transform hover:scale-105 transition-transform`}>
            <BarChart3 className={`w-12 h-12 ${theme.accentColor} mx-auto mb-2`} />
            <p className={`text-3xl font-bold ${theme.cardText}`}>100+</p>
            <p className={`text-xs ${theme.cardTextMuted}`}>Universities</p>
          </div>
        </div>

        {/* Region Toggle - Compact */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <button
            onClick={() => setSelectedRegion('INTERNATIONAL')}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 ${
              selectedRegion === 'INTERNATIONAL'
                ? `${theme.buttonPrimary} ${theme.buttonPrimaryText} shadow-xl`
                : `${theme.buttonSecondary} ${theme.buttonSecondaryText}`
            }`}
          >
            <Globe size={24} />
            International Rankings
          </button>
          <button
            onClick={() => setSelectedRegion('AMERICAN')}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 ${
              selectedRegion === 'AMERICAN'
                ? `${theme.buttonPrimary} ${theme.buttonPrimaryText} shadow-xl`
                : `${theme.buttonSecondary} ${theme.buttonSecondaryText}`
            }`}
          >
            <Users size={24} />
            US Colleges
          </button>
        </div>

        {/* View Mode Selector - Compact */}
        <div className={`${theme.cardBg} rounded-xl p-3 mb-4`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className={`${theme.cardTextMuted} font-medium text-sm`}>View:</span>
              <div className={`flex ${theme.mode === 'dark' ? 'bg-blue-800/30' : 'bg-purple-100'} rounded-lg p-1`}>
                <button
                  onClick={() => setViewMode('composite')}
                  className={`px-3 py-2 rounded-md font-medium transition text-sm ${
                    viewMode === 'composite'
                      ? `${theme.buttonPrimary} ${theme.buttonPrimaryText} shadow`
                      : `${theme.cardTextMuted} hover:opacity-70`
                  }`}
                >
                  📊 Composite Average
                </button>
                <button
                  onClick={() => setViewMode('index')}
                  className={`px-3 py-2 rounded-md font-medium transition text-sm ${
                    viewMode === 'index'
                      ? `${theme.buttonPrimary} ${theme.buttonPrimaryText} shadow`
                      : `${theme.cardTextMuted} hover:opacity-70`
                  }`}
                >
                  📋 Single Index
                </button>
              </div>
            </div>

            {/* Index Selector (only visible when viewMode is 'index') */}
            {viewMode === 'index' && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 px-4 py-2 ${theme.mode === 'dark' ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg font-medium transition min-w-[250px] justify-between ${theme.cardText}`}
                >
                  <span>{selectedSource?.name || 'Select Index'}</span>
                  <ChevronDown size={20} className={`transition ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border overflow-hidden">
                    <div className="p-2 bg-gray-50 border-b">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        {selectedRegion === 'INTERNATIONAL' ? 'International' : 'American'} Rankings
                      </span>
                    </div>
                    {currentSources.map((source) => (
                      <button
                        key={source.code}
                        onClick={() => {
                          setSelectedIndex(source.code);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between transition ${
                          selectedIndex === source.code ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <a 
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            View Source <ExternalLink size={12} />
                          </a>
                        </div>
                        {selectedIndex === source.code && (
                          <span className="text-blue-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Composite Algorithm Info */}
          {viewMode === 'composite' && (
            <div className={`mt-3 p-2 rounded-lg text-xs ${theme.mode === 'dark' ? 'bg-purple-900/20 text-purple-200' : 'bg-purple-50 text-purple-800'}`}>
              <p>
                <strong>📊 Composite Score:</strong> Average from all available rankings. Missing rankings are excluded, not penalized.
              </p>
            </div>
          )}

          {/* Selected Index Info */}
          {viewMode === 'index' && selectedSource && (
            <div className={`mt-3 p-2 rounded-lg flex items-center justify-between text-xs ${theme.mode === 'dark' ? 'bg-indigo-900/20 text-indigo-200' : 'bg-indigo-50 text-indigo-800'}`}>
              <p>
                <strong>📋 {selectedSource.name}:</strong> Viewing this index only.
              </p>
              <a 
                href={selectedSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 font-medium ${theme.mode === 'dark' ? 'text-purple-300 hover:text-purple-100' : 'text-purple-700 hover:text-purple-900'}`}
              >
                Visit <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Rankings Display - Compact */}
        <section className="mb-6">
          <h3 className={`text-lg sm:text-xl font-bold ${theme.textPrimary} mb-3`}>
            {viewMode === 'composite' 
              ? (selectedRegion === 'INTERNATIONAL'
                  ? 'Top International Universities'
                  : 'Top US Colleges')
              : `${selectedSource?.shortName || 'Rankings'}`
            }
          </h3>
          
          {viewMode === 'composite' ? (
            <CompositeRankingView
              region={selectedRegion}
              onCollegeClick={(id) => navigate(`/college/${id}`)}
              theme={theme}
            />
          ) : (
            <IndexRankingView
              sourceCode={selectedIndex}
              onCollegeClick={(id) => navigate(`/college/${id}`)}
              theme={theme}
            />
          )}
        </section>

        {/* Footer - Compact */}
        <footer className={`mt-6 pt-4 border-t ${theme.borderColor} text-center ${theme.footerText} text-xs`}>
          <p>Data aggregated from QS, THE, ARWU, US News, Forbes, Niche, and more • Updated periodically</p>
        </footer>
      </main>
    </div>
  );
};
