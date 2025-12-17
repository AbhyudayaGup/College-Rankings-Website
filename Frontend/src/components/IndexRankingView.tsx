import React, { useState, useEffect } from 'react';
import { ExternalLink, MapPin, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { rankingsAPI } from '../services/api';
import type { CollegeRanking, RankingSource } from '../types';
import { ThemePreset } from './particlePresets';

interface IndexRankingViewProps {
  sourceCode: string;
  onCollegeClick: (id: number) => void;
  theme?: ThemePreset;
}

export const IndexRankingView: React.FC<IndexRankingViewProps> = ({ 
  sourceCode, 
  onCollegeClick,
  theme,
}) => {
  const [rankings, setRankings] = useState<CollegeRanking[]>([]);
  const [source, setSource] = useState<RankingSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 25;

  const isDark = theme?.mode === 'dark';

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await rankingsAPI.getBySource(sourceCode, currentPage, pageSize);
        setRankings(data.results);
        setTotalCount(data.count);
        if (data.source) {
          setSource(data.source);
        }
      } catch (err) {
        console.error('Error fetching rankings:', err);
        setError('Failed to load rankings');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [sourceCode, currentPage]);

  // Reset page when source changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sourceCode]);

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? 'border-gray-300' : 'border-blue-600'}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={`mt-4 px-4 py-2 ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg`}
        >
          Retry
        </button>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className={`text-center py-12 ${theme?.cardTextMuted || 'text-gray-500'}`}>
        No rankings found for this index.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Source Header */}
      {source && (
        <div className={`${isDark ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white rounded-xl p-4 flex items-center justify-between`}>
          <div>
            <h4 className="text-xl font-bold">{source.name}</h4>
            <p className={`${isDark ? 'text-gray-300' : 'text-blue-100'} text-sm`}>
              {source.region === 'INTERNATIONAL' ? '🌍 International' : '🇺🇸 United States'} Rankings
            </p>
          </div>
          <a
            href={source.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
          >
            <span className="font-medium">Official Site</span>
            <ExternalLink size={16} />
          </a>
        </div>
      )}

      {/* Rankings Table */}
      <div className={`${theme?.cardBg || 'bg-white shadow-lg'} rounded-xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'} border-b`}>
              <tr>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme?.cardTextMuted || 'text-gray-600'} w-20`}>Rank</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme?.cardTextMuted || 'text-gray-600'}`}>University</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme?.cardTextMuted || 'text-gray-600'} hidden md:table-cell`}>Location</th>
                <th className={`px-4 py-3 text-right text-sm font-semibold ${theme?.cardTextMuted || 'text-gray-600'} w-24`}>Score</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {rankings.map((ranking) => (
                <tr 
                  key={ranking.id}
                  onClick={() => ranking.college && onCollegeClick(ranking.college.id)}
                  className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} cursor-pointer transition`}
                >
                  <td className="px-4 py-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                      ${ranking.rank <= 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' :
                        ranking.rank <= 10 ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                        ranking.rank <= 25 ? (isDark ? 'bg-gray-600 text-gray-200' : 'bg-blue-100 text-blue-700') :
                        (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}
                    `}>
                      {ranking.rank}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {ranking.college?.logo_url ? (
                        <img 
                          src={ranking.college.logo_url} 
                          alt="" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-600' : 'bg-blue-100'} flex items-center justify-center`}>
                          <Award className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-blue-600'}`} />
                        </div>
                      )}
                      <div>
                        <p className={`font-semibold ${theme?.cardText || 'text-gray-900'}`}>{ranking.college?.name || 'Unknown'}</p>
                        <p className={`text-sm ${theme?.cardTextMuted || 'text-gray-500'} md:hidden`}>
                          {ranking.college?.city && `${ranking.college.city}, `}
                          {ranking.college?.country}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className={`flex items-center gap-1 ${theme?.cardTextMuted || 'text-gray-600'}`}>
                      <MapPin size={14} />
                      <span>
                        {ranking.college?.city && `${ranking.college.city}, `}
                        {ranking.college?.country}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {ranking.score ? (
                      <span className={`
                        font-bold px-2 py-1 rounded
                        ${Number(ranking.score) >= 90 ? (isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700') :
                          Number(ranking.score) >= 70 ? (isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700') :
                          Number(ranking.score) >= 50 ? (isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700') :
                          (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}
                      `}>
                        {Number(ranking.score).toFixed(1)}
                      </span>
                    ) : (
                      <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`px-4 py-3 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'} border-t flex items-center justify-between`}>
            <p className={`text-sm ${theme?.cardTextMuted || 'text-gray-600'}`}>
              Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount} universities
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} disabled:opacity-50 disabled:cursor-not-allowed ${theme?.cardText || ''}`}
              >
                <ChevronLeft size={20} />
              </button>
              <span className={`px-3 py-1 ${isDark ? 'bg-gray-600' : 'bg-blue-600'} text-white rounded-lg font-medium`}>
                {currentPage}
              </span>
              <span className={theme?.cardTextMuted || 'text-gray-500'}>of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} disabled:opacity-50 disabled:cursor-not-allowed ${theme?.cardText || ''}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
