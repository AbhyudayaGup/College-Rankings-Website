import React from 'react';
import type { College } from '../types';
import { MapPin, Globe, BookOpen } from 'lucide-react';
import { ThemePreset } from './particlePresets';

interface CollegeCardProps {
  college: College;
  score?: number;
  rank?: number;
  onClick?: () => void;
  theme?: ThemePreset;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({
  college,
  score,
  rank,
  onClick,
  theme,
}) => {
  // Default to light theme styles if no theme provided
  const cardBg = theme?.cardBg || 'bg-white shadow-lg border border-gray-100';
  const cardText = theme?.cardText || 'text-gray-900';
  const cardTextMuted = theme?.cardTextMuted || 'text-gray-500';
  const accentColor = theme?.accentColor || 'text-gray-700';
  const isDark = theme?.mode === 'dark';

  return (
    <div
      onClick={onClick}
      className={`${cardBg} rounded-xl hover:shadow-2xl transition-all duration-300 p-5 ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
    >
      {college.logo_url && (
        <img
          src={college.logo_url}
          alt={college.name}
          className={`w-full h-28 object-contain rounded-lg mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-bold ${cardText} truncate`} title={college.name}>
            {college.name}
          </h3>
          {rank && (
            <p className={`text-sm ${accentColor} font-semibold`}>Rank #{rank}</p>
          )}
        </div>
        {score !== undefined && score !== null && (
          <div className={`${isDark ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-full w-11 h-11 flex items-center justify-center font-bold text-sm ml-2 flex-shrink-0`}>
            {Number(score).toFixed(0)}
          </div>
        )}
      </div>

      <div className={`space-y-1.5 text-sm ${cardTextMuted}`}>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="truncate">
            {college.city && college.city + ', '}
            {college.country}
          </span>
        </div>
        {college.established_year && (
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="flex-shrink-0" />
            <span>Est. {college.established_year}</span>
          </div>
        )}
        {college.website_url && (
          <div className="flex items-center gap-2">
            <Globe size={14} className="flex-shrink-0" />
            <a
              href={college.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${accentColor} hover:underline truncate`}
              onClick={(e) => e.stopPropagation()}
            >
              Visit Website
            </a>
          </div>
        )}
      </div>

      {college.description && (
        <p className={`mt-3 text-sm ${cardTextMuted} line-clamp-2`}>
          {college.description}
        </p>
      )}
    </div>
  );
};
