export interface ApiErrorResponse {
  message?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiError extends Error {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
  };
}
