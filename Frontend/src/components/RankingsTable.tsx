import React from 'react';
import type { CollegeRanking } from '../types';
import { ExternalLink } from 'lucide-react';

interface RankingsTableProps {
  rankings: CollegeRanking[];
  onCollegeClick?: (collegeId: number) => void;
  showCollege?: boolean;
}

export const RankingsTable: React.FC<RankingsTableProps> = ({
  rankings,
  onCollegeClick,
  showCollege = true,
}) => {
  if (rankings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        No rankings data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full bg-white">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Rank
            </th>
            {showCollege && (
              <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                College
              </th>
            )}
            <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Country
            </th>
            <th className="px-4 sm:px-6 py-3 text-center text-sm font-semibold text-gray-700">
              Score
            </th>
            <th className="px-4 sm:px-6 py-3 text-center text-sm font-semibold text-gray-700">
              Source
            </th>
            {onCollegeClick && (
              <th className="px-4 sm:px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rankings.map((ranking, idx) => (
            <tr
              key={ranking.id || idx}
              className="border-b hover:bg-blue-50 transition"
            >
              <td className="px-4 sm:px-6 py-4 text-sm font-bold text-blue-600">
                #{ranking.rank}
              </td>
              {showCollege && (
                <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">
                  {ranking.college?.name || 'Unknown'}
                </td>
              )}
              <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                {ranking.college?.country || 'N/A'}
              </td>
              <td className="px-4 sm:px-6 py-4 text-sm text-center">
                {ranking.score ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                    {Number(ranking.score).toFixed(1)}
                  </span>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              <td className="px-4 sm:px-6 py-4 text-sm text-center">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold uppercase">
                  {ranking.source?.code || ranking.source_code}
                </span>
              </td>
              {onCollegeClick && ranking.college && (
                <td className="px-4 sm:px-6 py-4 text-center">
                  <button
                    onClick={() => onCollegeClick(ranking.college!.id)}
                    className="text-blue-600 hover:text-blue-800 transition p-2"
                    title="View Details"
                  >
                    <ExternalLink size={18} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
