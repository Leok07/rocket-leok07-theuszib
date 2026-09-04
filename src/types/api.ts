import { AggregatedPlayerDashboard } from './dashboard';
import { ReplayListResponse, ReplaySummary } from './ballchasing';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  isMock?: boolean;
}

export interface PlayerStatsApiResponse extends ApiResponse<AggregatedPlayerDashboard> {}
export interface ReplaysApiResponse extends ApiResponse<ReplayListResponse> {}
export interface ReplayDetailApiResponse extends ApiResponse<ReplaySummary> {}
