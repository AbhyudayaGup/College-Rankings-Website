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
    <div className="min-h-screen bg-transparent">
      <Header currentPreset={currentPreset} onPresetChange={onPresetChange} />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className={`text-3xl sm:text-4xl font-bold ${theme.textPrimary} mb-4 drop-shadow-lg`}>
            Discover the World's Best Colleges
          </h2>
          <p className={`text-lg sm:text-xl ${theme.textSecondary} max-w-2xl mx-auto`}>
            Compare universities from 10 global ranking systems in one place
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for a university..."
          theme={theme}
        />

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`${theme.cardBg} rounded-lg p-4 text-center`}>
            <Award className={`w-8 h-8 ${theme.accentColor} mx-auto mb-2`} />
            <p className={`text-2xl font-bold ${theme.cardText}`}>10</p>
            <p className={`text-sm ${theme.cardTextMuted}`}>Ranking Systems</p>
          </div>
          <div className={`${theme.cardBg} rounded-lg p-4 text-center`}>
            <Globe className={`w-8 h-8 ${theme.accentColor} mx-auto mb-2`} />
            <p className={`text-2xl font-bold ${theme.cardText}`}>5</p>
            <p className={`text-sm ${theme.cardTextMuted}`}>International</p>
          </div>
          <div className={`${theme.cardBg} rounded-lg p-4 text-center`}>
            <Users className={`w-8 h-8 ${theme.accentColor} mx-auto mb-2`} />
            <p className={`text-2xl font-bold ${theme.cardText}`}>5</p>
            <p className={`text-sm ${theme.cardTextMuted}`}>US Rankings</p>
          </div>
          <div className={`${theme.cardBg} rounded-lg p-4 text-center`}>
            <BarChart3 className={`w-8 h-8 ${theme.accentColor} mx-auto mb-2`} />
            <p className={`text-2xl font-bold ${theme.cardText}`}>100+</p>
            <p className={`text-sm ${theme.cardTextMuted}`}>Universities</p>
          </div>
        </div>

        {/* Region Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={() => setSelectedRegion('INTERNATIONAL')}
            className={`px-6 sm:px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
              selectedRegion === 'INTERNATIONAL'
                ? `${theme.buttonPrimary} ${theme.buttonPrimaryText} shadow-lg`
                : `${theme.buttonSecondary} ${theme.buttonSecondaryText}`
            }`}
          >
            <Globe size={20} />
            International Rankings
          </button>
          <button
            onClick={() => setSelectedRegion('AMERICAN')}
            className={`px-6 sm:px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
              selectedRegion === 'AMERICAN'
                ? `${theme.buttonPrimary} ${theme.buttonPrimaryText} shadow-lg`
                : `${theme.buttonSecondary} ${theme.buttonSecondaryText}`
            }`}
          >
            <Users size={20} />
            US Colleges
          </button>
        </div>

        {/* View Mode Selector */}
        <div className={`${theme.cardBg} rounded-xl p-4 mb-8`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className={`${theme.cardTextMuted} font-medium`}>View:</span>
              <div className={`flex ${theme.mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-lg p-1`}>
                <button
                  onClick={() => setViewMode('composite')}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    viewMode === 'composite'
                      ? `${theme.buttonPrimary} ${theme.buttonPrimaryText} shadow`
                      : `${theme.cardTextMuted} hover:opacity-70`
                  }`}
                >
                  📊 Composite Average
                </button>
                <button
                  onClick={() => setViewMode('index')}
                  className={`px-4 py-2 rounded-md font-medium transition ${
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
            <div className={`mt-4 p-3 rounded-lg ${theme.mode === 'dark' ? 'bg-white/10' : 'bg-blue-50'}`}>
              <p className={`text-sm ${theme.mode === 'dark' ? 'text-white/80' : 'text-blue-800'}`}>
                <strong>📊 Composite Score Algorithm:</strong> The average is calculated from all available rankings 
                for each university. Universities with more rankings are weighted equally - missing rankings are 
                simply excluded from the average, not penalized.
              </p>
            </div>
          )}

          {/* Selected Index Info */}
          {viewMode === 'index' && selectedSource && (
            <div className={`mt-4 p-3 rounded-lg flex items-center justify-between ${theme.mode === 'dark' ? 'bg-white/10' : 'bg-green-50'}`}>
              <p className={`text-sm ${theme.mode === 'dark' ? 'text-white/80' : 'text-green-800'}`}>
                <strong>📋 {selectedSource.name}:</strong> Viewing rankings from this specific index only.
              </p>
              <a 
                href={selectedSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 font-medium text-sm ${theme.mode === 'dark' ? 'text-white/70 hover:text-white' : 'text-green-700 hover:text-green-900'}`}
              >
                Visit Official Site <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        {/* Rankings Display */}
        <section>
          <h3 className={`text-xl sm:text-2xl font-bold ${theme.textPrimary} mb-6`}>
            {viewMode === 'composite' 
              ? (selectedRegion === 'INTERNATIONAL'
                  ? 'Top International Universities (Composite Score)'
                  : 'Top US Colleges (Composite Score)')
              : `Rankings by ${selectedSource?.name || 'Selected Index'}`
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

        {/* Footer */}
        <footer className={`mt-16 pt-8 border-t ${theme.borderColor} text-center ${theme.footerText} text-sm`}>
          <p>
            Data aggregated from QS, THE, ARWU, US News, Forbes, Niche, and more.
          </p>
          <p className="mt-2">
            Rankings are updated periodically from public sources.
          </p>
        </footer>
      </main>
    </div>
  );
};
