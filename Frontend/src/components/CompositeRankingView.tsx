import React, { useEffect, useState } from 'react';
import type { CompositeRanking } from '../types';
import { compositeAPI } from '../services/api';
import { CollegeCard } from './CollegeCard';
import { Loader2 } from 'lucide-react';
import { ThemePreset } from './particlePresets';

interface CompositeRankingViewProps {
  region: 'INTERNATIONAL' | 'AMERICAN';
  onCollegeClick?: (collegeId: number) => void;
  theme?: ThemePreset;
}

export const CompositeRankingView: React.FC<CompositeRankingViewProps> = ({
  region,
  onCollegeClick,
  theme,
}) => {
  const [rankings, setRankings] = useState<CompositeRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDark = theme?.mode === 'dark';

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all pages of rankings
        let allRankings: CompositeRanking[] = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore) {
          const data = region === 'INTERNATIONAL'
            ? await compositeAPI.getInternational(page)
            : await compositeAPI.getAmerican(page);
          
          allRankings = [...allRankings, ...data.results];
          hasMore = data.next !== null;
          page++;
        }
        
        setRankings(allRankings);
      } catch (err) {
        setError('Failed to load rankings. Please try again later.');
        console.error('Error fetching rankings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [region]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className={`animate-spin ${theme?.accentColor || 'text-blue-600'}`} size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-6 rounded-lg text-center">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className={`${theme?.cardBg || 'bg-gray-100'} ${theme?.cardTextMuted || 'text-gray-600'} p-8 rounded-lg text-center`}>
        <p className="text-lg">No rankings data available yet.</p>
        <p className="mt-2 text-sm">Run the backend data fetcher to populate rankings.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rankings.map((ranking, idx) => (
        <div key={ranking.college.id} className="relative">
          {/* Rank badge */}
          <div className={`absolute -top-3 -left-3 ${isDark ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'} text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg z-10`}>
            {idx + 1}
          </div>
          <CollegeCard
            college={ranking.college}
            score={ranking.composite_score}
            onClick={() => onCollegeClick?.(ranking.college.id)}
            theme={theme}
          />
        </div>
      ))}
    </div>
  );
};
