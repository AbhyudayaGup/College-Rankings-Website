import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ThemePreset } from './particlePresets';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCountryFilter?: (country: string) => void;
  placeholder?: string;
  theme?: ThemePreset;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onCountryFilter,
  placeholder = "Search colleges...",
  theme,
}) => {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Debounced search on type
    if (value.length >= 3 || value.length === 0) {
      onSearch(value);
    }
  };

  // Default to light theme styles if no theme provided
  const cardBg = theme?.cardBg || 'bg-white shadow-md';
  const inputBg = theme?.inputBg || 'bg-white';
  const inputBorder = theme?.inputBorder || 'border-gray-300 focus:border-gray-500 focus:ring-gray-500';
  const inputText = theme?.inputText || 'text-gray-900';
  const inputPlaceholder = theme?.inputPlaceholder || 'placeholder-gray-400';
  const buttonPrimary = theme?.buttonPrimary || 'bg-gray-900 hover:bg-gray-800';
  const buttonPrimaryText = theme?.buttonPrimaryText || 'text-white';
  const accentColor = theme?.accentColor || 'text-gray-400';

  return (
    <div className={`${cardBg} rounded-xl p-4 sm:p-6 mb-6`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-3 ${accentColor}`} size={20} />
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder={placeholder}
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${inputBg} ${inputBorder} ${inputText} ${inputPlaceholder}`}
          />
        </div>
        {onCountryFilter && (
          <input
            type="text"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              onCountryFilter(e.target.value);
            }}
            placeholder="Filter by country..."
            className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition sm:w-48 ${inputBg} ${inputBorder} ${inputText} ${inputPlaceholder}`}
          />
        )}
        <button
          type="submit"
          className={`px-6 py-2.5 rounded-lg transition font-medium ${buttonPrimary} ${buttonPrimaryText}`}
        >
          Search
        </button>
      </form>
    </div>
  );
};
