/**
 * API Service Layer
 */

import axios, { AxiosInstance } from 'axios';
import type {
  College,
  CollegeRanking,
  RankingSource,
  CollegeDetail,
  CompositeRanking,
  StrengthAnalysis,
  PaginatedResponse,
  ComparisonData,
  RankingsBreakdown,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * College API endpoints
 */
export const collegeAPI = {
  // Get all colleges with pagination
  getAll: async (page = 1, pageSize = 20): Promise<PaginatedResponse<College>> => {
    const response = await api.get<PaginatedResponse<College>>('/colleges/', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  // Get college by ID with full details
  getById: async (id: number): Promise<CollegeDetail> => {
    const response = await api.get<CollegeDetail>(`/colleges/${id}/`);
    return response.data;
  },

  // Search colleges
  search: async (
    query: string,
    country?: string,
    source?: string
  ): Promise<PaginatedResponse<College>> => {
    const response = await api.get<PaginatedResponse<College>>('/colleges/search/', {
      params: {
        q: query,
        country,
        source,
      },
    });
    return response.data;
  },

  // Get rankings breakdown for a college
  getRankingsBreakdown: async (id: number): Promise<RankingsBreakdown> => {
    const response = await api.get<RankingsBreakdown>(`/colleges/${id}/rankings_breakdown/`);
    return response.data;
  },
};

/**
 * Rankings API endpoints
 */
export const rankingsAPI = {
  // Get all rankings
  getAll: async (page = 1): Promise<PaginatedResponse<CollegeRanking>> => {
    const response = await api.get<PaginatedResponse<CollegeRanking>>('/rankings/', {
      params: { page },
    });
    return response.data;
  },

  // Get rankings by specific source
  getBySource: async (
    sourceCode: string,
    page = 1,
    pageSize = 100
  ): Promise<PaginatedResponse<CollegeRanking> & { source?: RankingSource }> => {
    const response = await api.get<PaginatedResponse<CollegeRanking> & { source?: RankingSource }>('/rankings/by_source/', {
      params: { source: sourceCode, page, page_size: pageSize },
    });
    return response.data;
  },

  // Get all available ranking sources
  getAllSources: async (): Promise<RankingSource[]> => {
    const response = await api.get<RankingSource[]>('/rankings/all_sources/');
    return response.data;
  },
};

/**
 * Composite Rankings API endpoints
 */
export const compositeAPI = {
  // Get international composite rankings
  getInternational: async (page = 1, pageSize = 100): Promise<PaginatedResponse<CompositeRanking>> => {
    const response = await api.get<PaginatedResponse<CompositeRanking>>(
      '/composite-rankings/international/',
      { params: { page, page_size: pageSize } }
    );
    return response.data;
  },

  // Get American composite rankings
  getAmerican: async (page = 1, pageSize = 100): Promise<PaginatedResponse<CompositeRanking>> => {
    const response = await api.get<PaginatedResponse<CompositeRanking>>(
      '/composite-rankings/american/',
      { params: { page, page_size: pageSize } }
    );
    return response.data;
  },
};

/**
 * Comparison API endpoints
 */
export const comparisonAPI = {
  // Compare multiple colleges
  compare: async (ids: number[]): Promise<ComparisonData[]> => {
    const response = await api.get<ComparisonData[]>('/comparison/compare/', {
      params: { ids: ids.join(',') },
    });
    return response.data;
  },
};

/**
 * Analysis API endpoints
 */
export const analysisAPI = {
  // Analyze college strengths and weaknesses
  analyze: async (collegeId: number): Promise<StrengthAnalysis> => {
    const response = await api.get<StrengthAnalysis>('/analysis/analyze/', {
      params: { college_id: collegeId },
    });
    return response.data;
  },
};

/**
 * Ranking Sources API endpoints
 */
export const sourcesAPI = {
  // Get all ranking sources
  getAll: async (): Promise<RankingSource[]> => {
    const response = await api.get<RankingSource[]>('/sources/');
    return response.data;
  },
};

export default api;
