export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface ApiRequestConfig {
  skipAuth?: boolean;
  retries?: number;
}
