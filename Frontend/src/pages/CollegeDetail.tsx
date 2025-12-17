import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, StrengthsWeaknesses } from '../components';
import { ParticlePresetKey, PARTICLE_PRESETS, ThemePreset } from '../components/particlePresets';
import type { CollegeDetail, StrengthAnalysis } from '../types';
import { collegeAPI, analysisAPI } from '../services/api';
import { Loader2, ArrowLeft, Globe, MapPin, Calendar, ExternalLink, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

// All ranking sources with metadata
const ALL_RANKING_SOURCES = {
  international: [
    { code: 'qs', name: 'QS World University Rankings', shortName: 'QS', url: 'https://www.topuniversities.com/university-rankings', color: 'blue' },
    { code: 'the', name: 'Times Higher Education', shortName: 'THE', url: 'https://www.timeshighereducation.com/world-university-rankings', color: 'purple' },
    { code: 'arwu', name: 'Academic Ranking of World Universities', shortName: 'ARWU', url: 'https://www.shanghairanking.com/rankings/arwu', color: 'red' },
    { code: 'webometrics', name: 'Webometrics Ranking', shortName: 'Webometrics', url: 'https://www.webometrics.info/en/World', color: 'green' },
    { code: 'leiden', name: 'CWTS Leiden Ranking', shortName: 'Leiden', url: 'https://www.leidenranking.com/ranking', color: 'orange' },
  ],
  american: [
    { code: 'usnews', name: 'US News Best Colleges', shortName: 'US News', url: 'https://www.usnews.com/best-colleges', color: 'blue' },
    { code: 'forbes', name: 'Forbes Top Colleges', shortName: 'Forbes', url: 'https://www.forbes.com/top-colleges', color: 'red' },
    { code: 'niche', name: 'Niche Best Colleges', shortName: 'Niche', url: 'https://www.niche.com/colleges/search/best-colleges', color: 'green' },
    { code: 'wm', name: 'Washington Monthly', shortName: 'WashMo', url: 'https://washingtonmonthly.com/2024-college-guide', color: 'purple' },
    { code: 'wsj', name: 'Wall Street Journal/THE', shortName: 'WSJ', url: 'https://www.wsj.com/rankings/college-rankings', color: 'orange' },
  ],
};

const colorClasses: Record<string, { bg: string; bgDark: string; text: string; textDark: string; border: string }> = {
  blue: { bg: 'bg-blue-100', bgDark: 'bg-blue-900/40', text: 'text-blue-700', textDark: 'text-blue-300', border: 'border-blue-500' },
  purple: { bg: 'bg-purple-100', bgDark: 'bg-purple-900/40', text: 'text-purple-700', textDark: 'text-purple-300', border: 'border-purple-500' },
  red: { bg: 'bg-red-100', bgDark: 'bg-red-900/40', text: 'text-red-700', textDark: 'text-red-300', border: 'border-red-500' },
  green: { bg: 'bg-green-100', bgDark: 'bg-green-900/40', text: 'text-green-700', textDark: 'text-green-300', border: 'border-green-500' },
  orange: { bg: 'bg-orange-100', bgDark: 'bg-orange-900/40', text: 'text-orange-700', textDark: 'text-orange-300', border: 'border-orange-500' },
};

type CollegeDetailProps = {
  currentPreset: ParticlePresetKey;
  onPresetChange: (key: ParticlePresetKey) => void;
};

export const CollegeDetailPage: React.FC<CollegeDetailProps> = ({ currentPreset, onPresetChange }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [college, setCollege] = useState<CollegeDetail | null>(null);
  const [analysis, setAnalysis] = useState<StrengthAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme: ThemePreset = PARTICLE_PRESETS[currentPreset];
  const isDark = theme.mode === 'dark';

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const collegeData = await collegeAPI.getById(parseInt(id));
        setCollege(collegeData);

        try {
          const analysisData = await analysisAPI.analyze(parseInt(id));
          setAnalysis(analysisData);
        } catch (analysisErr) {
          console.warn('Analysis not available:', analysisErr);
        }
      } catch (err) {
        setError('Failed to load college details');
        console.error('Error fetching college:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.background} flex items-center justify-center`}>
        <Loader2 className={`animate-spin ${theme.accentColor}`} size={48} />
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen bg-transparent">
        <Header currentPreset={currentPreset} onPresetChange={onPresetChange} />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-100 text-red-800 p-6 rounded-lg text-center">
            <p className="text-lg">{error || 'College not found'}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Create a map of existing rankings
  const rankingsMap = new Map(
    college.rankings?.map(r => [r.source.code, r]) || []
  );

  // Get international and American rankings
  const internationalRankings = ALL_RANKING_SOURCES.international.map(source => ({
    ...source,
    ranking: rankingsMap.get(source.code),
  }));

  const americanRankings = ALL_RANKING_SOURCES.american.map(source => ({
    ...source,
    ranking: rankingsMap.get(source.code),
  }));

  const internationalCount = internationalRankings.filter(r => r.ranking).length;
  const americanCount = americanRankings.filter(r => r.ranking).length;

  // Calculate average rankings
  const internationalAvgRank = internationalCount > 0
    ? Math.round(internationalRankings
        .filter(r => r.ranking)
        .reduce((sum, r) => sum + r.ranking!.rank, 0) / internationalCount)
    : null;
  
  const americanAvgRank = americanCount > 0
    ? Math.round(americanRankings
        .filter(r => r.ranking)
        .reduce((sum, r) => sum + r.ranking!.rank, 0) / americanCount)
    : null;

  return (
    <div className="min-h-screen bg-transparent">
      <Header currentPreset={currentPreset} onPresetChange={onPresetChange} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 ${theme.textSecondary} hover:opacity-80 mb-6 font-semibold transition`}
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* College Header */}
        <div className={`${theme.cardBg} rounded-xl p-6 sm:p-8 mb-8`}>
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
            <div className="flex-1">
              <h1 className={`text-2xl sm:text-4xl font-bold ${theme.cardText} mb-3`}>
                {college.name}
              </h1>
              <div className={`flex flex-wrap gap-4 ${theme.cardTextMuted}`}>
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {college.city && college.city + ', '}
                  {college.country}
                </span>
                {college.established_year && (
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    Est. {college.established_year}
                  </span>
                )}
              </div>
            </div>
            {college.website_url && (
              <a
                href={college.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 ${theme.buttonPrimary} ${theme.buttonPrimaryText} rounded-lg transition`}
              >
                <Globe size={18} />
                Visit Website
              </a>
            )}
          </div>

          {college.description && (
            <p className={`${theme.cardTextMuted} leading-relaxed mb-6`}>
              {college.description}
            </p>
          )}

          {/* Average Rankings */}
          <div className="grid sm:grid-cols-2 gap-4">
            {internationalAvgRank !== null && (
                <div className={`${isDark ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-l-4 border-blue-400' : 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600'} p-6 rounded-xl`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    <p className={`${theme.cardTextMuted} text-sm sm:text-base`}>
                      International Average Ranking
                    </p>
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    #{internationalAvgRank}
                  </div>
                  <p className={`text-xs sm:text-sm ${theme.cardTextMuted} mt-2`}>
                    Average of {internationalCount} international rankings
                  </p>
                </div>
              )}
            {americanAvgRank !== null && (
                <div className={`${isDark ? 'bg-gradient-to-r from-green-900/50 to-green-800/50 border-l-4 border-green-400' : 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-600'} p-6 rounded-xl`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={20} className={isDark ? 'text-green-400' : 'text-green-600'} />
                    <p className={`${theme.cardTextMuted} text-sm sm:text-base`}>
                      US Average Ranking
                    </p>
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    #{americanAvgRank}
                  </div>
                  <p className={`text-xs sm:text-sm ${theme.cardTextMuted} mt-2`}>
                    Average of {americanCount} US rankings
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        {analysis && <StrengthsWeaknesses analysis={analysis} />}

        {/* Rankings Across All Indexes */}
        <section className="mt-8">
          <h2 className={`text-2xl sm:text-3xl font-bold ${theme.cardText} mb-6 flex items-center gap-2`}>
            <span>📊</span> Rankings Across All 10 Indexes
          </h2>
          
          {/* International Rankings */}
          <div className="mb-8">
            <h3 className={`text-xl font-semibold ${isDark ? 'text-blue-400' : 'text-blue-700'} mb-4 flex items-center gap-2`}>
              <Globe size={24} />
              International Rankings ({internationalCount}/5)
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {internationalRankings.map((source) => {
                const colors = colorClasses[source.color];
                const hasRanking = !!source.ranking;
                
                return (
                  <div
                    key={source.code}
                    className={`${theme.cardBg} rounded-xl p-5 border-l-4 ${
                      hasRanking ? colors.border : (isDark ? 'border-gray-600' : 'border-gray-300')
                    } transition hover:shadow-lg`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className={`font-bold ${hasRanking ? (isDark ? colors.textDark : colors.text) : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                          {source.shortName}
                        </h4>
                        <p className={`text-xs ${theme.cardTextMuted}`}>{source.name}</p>
                      </div>
                      {hasRanking ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <XCircle className={isDark ? 'text-gray-600' : 'text-gray-300'} size={20} />
                      )}
                    </div>
                    
                    {hasRanking && source.ranking ? (
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className={`text-3xl font-bold ${isDark ? colors.textDark : colors.text}`}>
                            #{source.ranking.rank}
                          </span>
                          {source.ranking.score && (
                            <span className={`text-sm ${isDark ? colors.bgDark : colors.bg} ${isDark ? colors.textDark : colors.text} px-2 py-1 rounded`}>
                              Score: {Number(source.ranking.score).toFixed(1)}
                            </span>
                          )}
                        </div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1 text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline`}
                        >
                          View on {source.shortName} <ExternalLink size={12} />
                        </a>
                      </div>
                    ) : (
                      <div className={`${isDark ? 'text-gray-500' : 'text-gray-400'} italic text-sm`}>
                        Not ranked in this index
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* American Rankings */}
          <div>
            <h3 className={`text-xl font-semibold ${isDark ? 'text-green-400' : 'text-green-700'} mb-4 flex items-center gap-2`}>
              🇺🇸 US Rankings ({americanCount}/5)
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {americanRankings.map((source) => {
                const colors = colorClasses[source.color];
                const hasRanking = !!source.ranking;
                
                return (
                  <div
                    key={source.code}
                    className={`${theme.cardBg} rounded-xl p-5 border-l-4 ${
                      hasRanking ? colors.border : (isDark ? 'border-gray-600' : 'border-gray-300')
                    } transition hover:shadow-lg`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className={`font-bold ${hasRanking ? (isDark ? colors.textDark : colors.text) : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                          {source.shortName}
                        </h4>
                        <p className={`text-xs ${theme.cardTextMuted}`}>{source.name}</p>
                      </div>
                      {hasRanking ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <XCircle className={isDark ? 'text-gray-600' : 'text-gray-300'} size={20} />
                      )}
                    </div>
                    
                    {hasRanking && source.ranking ? (
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className={`text-3xl font-bold ${isDark ? colors.textDark : colors.text}`}>
                            #{source.ranking.rank}
                          </span>
                          {source.ranking.score && (
                            <span className={`text-sm ${isDark ? colors.bgDark : colors.bg} ${isDark ? colors.textDark : colors.text} px-2 py-1 rounded`}>
                              Score: {Number(source.ranking.score).toFixed(1)}
                            </span>
                          )}
                        </div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1 text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline`}
                        >
                          View on {source.shortName} <ExternalLink size={12} />
                        </a>
                      </div>
                    ) : (
                      <div className={`${isDark ? 'text-gray-500' : 'text-gray-400'} italic text-sm`}>
                        Not ranked in this index
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Summary Card */}
        <div className={`mt-8 ${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100'} rounded-xl p-6 ${isDark ? 'border-gray-700' : 'border'}`}>
          <h3 className={`font-bold ${theme.cardText} mb-3`}>📋 Rankings Summary</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className={theme.cardTextMuted}>
                <strong className={isDark ? 'text-blue-400' : 'text-blue-600'}>International:</strong>{' '}
                Present in {internationalCount} of 5 rankings
              </p>
              {internationalCount > 0 && (
                <p className={`${theme.cardTextMuted} mt-1`}>
                  Best rank: #{Math.min(...internationalRankings.filter(r => r.ranking).map(r => r.ranking!.rank))} 
                  ({internationalRankings.find(r => r.ranking?.rank === Math.min(...internationalRankings.filter(r => r.ranking).map(r => r.ranking!.rank)))?.shortName})
                </p>
              )}
            </div>
            <div>
              <p className={theme.cardTextMuted}>
                <strong className={isDark ? 'text-green-400' : 'text-green-600'}>US Rankings:</strong>{' '}
                Present in {americanCount} of 5 rankings
              </p>
              {americanCount > 0 && (
                <p className={`${theme.cardTextMuted} mt-1`}>
                  Best rank: #{Math.min(...americanRankings.filter(r => r.ranking).map(r => r.ranking!.rank))} 
                  ({americanRankings.find(r => r.ranking?.rank === Math.min(...americanRankings.filter(r => r.ranking).map(r => r.ranking!.rank)))?.shortName})
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
