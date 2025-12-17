import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header, SearchBar, CollegeCard } from '../components';
import { ParticlePresetKey, PARTICLE_PRESETS, ThemePreset } from '../components/particlePresets';
import type { College } from '../types';
import { collegeAPI } from '../services/api';
import { Loader2 } from 'lucide-react';

type SearchPageProps = {
  currentPreset: ParticlePresetKey;
  onPresetChange: (key: ParticlePresetKey) => void;
};

export const SearchPage: React.FC<SearchPageProps> = ({ currentPreset, onPresetChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme: ThemePreset = PARTICLE_PRESETS[currentPreset];

  useEffect(() => {
    const searchColleges = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await collegeAPI.search(query);
        setResults(data.results);
      } catch (err) {
        setError('Failed to search colleges');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    searchColleges();
  }, [query]);

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header currentPreset={currentPreset} onPresetChange={onPresetChange} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className={`text-2xl sm:text-3xl font-bold ${theme.textPrimary} mb-6`}>
          Search Colleges
        </h2>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by name, country..."
          theme={theme}
        />

        {query && (
          <p className={`${theme.textSecondary} mb-6`}>
            Showing results for: <strong>"{query}"</strong>
          </p>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className={`animate-spin ${theme.accentColor}`} size={48} />
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-800 p-6 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && results.length === 0 && query && (
          <div className={`${theme.cardBg} ${theme.cardTextMuted} p-8 rounded-lg text-center`}>
            <p className="text-lg">No colleges found for "{query}"</p>
            <p className="mt-2">Try a different search term</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onClick={() => navigate(`/college/${college.id}`)}
                theme={theme}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
