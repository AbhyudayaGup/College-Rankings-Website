import React from 'react';
import type { StrengthAnalysis } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StrengthsWeaknessesProps {
  analysis: StrengthAnalysis;
}

const formatMetricName = (metric: string): string => {
  return metric
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({
  analysis,
}) => {
  if (!analysis.strengths?.length && !analysis.weaknesses?.length) {
    return (
      <div className="bg-gray-100 text-gray-600 p-6 rounded-lg text-center">
        <p>No analysis data available for this college.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {/* Strengths */}
      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-600" size={24} />
          <h3 className="text-xl font-bold text-green-900">Top Strengths</h3>
        </div>
        <div className="space-y-3">
          {analysis.strengths?.length > 0 ? (
            analysis.strengths.map((strength, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">
                  {formatMetricName(strength.metric)}
                </span>
                <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full font-semibold">
                  {Number(strength.score).toFixed(1)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No strength data available</p>
          )}
        </div>
      </div>

      {/* Weaknesses */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="text-orange-600" size={24} />
          <h3 className="text-xl font-bold text-orange-900">Areas to Improve</h3>
        </div>
        <div className="space-y-3">
          {analysis.weaknesses?.length > 0 ? (
            analysis.weaknesses.map((weakness, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">
                  {formatMetricName(weakness.metric)}
                </span>
                <span className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full font-semibold">
                  {Number(weakness.score).toFixed(1)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No weakness data available</p>
          )}
        </div>
      </div>
    </div>
  );
};
