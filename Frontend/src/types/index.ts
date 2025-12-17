/**
 * TypeScript type definitions for College Rankings
 */

export interface College {
  id: number;
  name: string;
  country: string;
  city?: string;
  established_year?: number;
  website_url?: string;
  logo_url?: string;
  description?: string;
}

export interface RankingSource {
  id: number;
  name: string;
  code: string;
  region: 'INTERNATIONAL' | 'AMERICAN';
  website_url: string;
  last_updated: string;
}

export interface CollegeRanking {
  id: number;
  college?: College;
  source: RankingSource;
  source_code: string;
  rank: number;
  score?: number;
  ranking_year: number;
  academic_reputation?: number;
  employer_reputation?: number;
  faculty_student_ratio?: number;
  research_impact?: number;
  international_diversity?: number;
  teaching_quality?: number;
}

export interface CollegeDetail extends College {
  rankings: CollegeRanking[];
  composite_score_international?: number;
  composite_score_american?: number;
}

export interface CompositeRanking {
  college: College;
  composite_score: number;
  region: 'INTERNATIONAL' | 'AMERICAN';
  rankings_count: number;
}

export interface StrengthAnalysis {
  college: College;
  strengths: Array<{ metric: string; score: number }>;
  weaknesses: Array<{ metric: string; score: number }>;
  all_metrics: Record<string, number>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ComparisonData {
  college: College;
  rankings: CollegeRanking[];
  composite_international?: number;
  composite_american?: number;
}

export interface RankingsBreakdown {
  college: College;
  international_rankings: CollegeRanking[];
  american_rankings: CollegeRanking[];
  composite_scores: {
    international?: number;
    american?: number;
  };
  all_rankings: CollegeRanking[];
}
