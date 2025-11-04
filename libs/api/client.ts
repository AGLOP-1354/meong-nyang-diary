import logger from '@/libs/utils/logger';
import { getItem } from '@/libs/utils/storage';

const TOKEN_STORAGE_KEY = 'auth_token';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type QueryParams = Record<string, string | number | boolean | null | undefined | (string | number | boolean)[]>;

export interface ApiRequestOptions extends RequestInit {
  timeout?: number;
  retry?: {
    maxAttempts: number;
    delay: number;
    backoff?: number;
  };
  query?: QueryParams;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY = 1000;
const DEFAULT_BACKOFF = 2;

export const getApiBaseUrl = (): string => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!apiUrl) {
    logger.error('[API] API URL이 설정되지 않았습니다.');
    throw new Error('API URL이 설정되지 않았습니다. 환경 변수를 확인해주세요.');
  }

  return apiUrl;
};

const buildUrl = (endpoint: string, query?: QueryParams) => {
  const url = new URL(`${getApiBaseUrl()}${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === null || value === undefined || value === 'null' || value === 'undefined') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== null && v !== undefined) {
            url.searchParams.append(key, String(v));
          }
        });
      } else {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

const fetchWithTimeout = async (url: string, options: ApiRequestOptions = {}, timeout: number): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if ((error as Error).name === 'AbortError') {
      throw new ApiError(408, '요청 시간이 초과되었습니다.');
    }
    throw error;
  }
};

const fetchWithRetry = async (url: string, options: ApiRequestOptions = {}): Promise<Response> => {
  const { retry, timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
  const maxAttempts = retry?.maxAttempts ?? DEFAULT_RETRY_ATTEMPTS;
  const delay = retry?.delay ?? DEFAULT_RETRY_DELAY;
  const backoff = retry?.backoff ?? DEFAULT_BACKOFF;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions, timeout);

      if (!response.ok && attempt < maxAttempts && isRetriableStatusCode(response.status)) {
        await sleep(delay * Math.pow(backoff, attempt - 1));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts && isRetriableError(error)) {
        await sleep(delay * Math.pow(backoff, attempt - 1));
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error('알 수 없는 오류');
};

const isRetriableStatusCode = (statusCode: number): boolean => {
  return [408, 429, 500, 502, 503, 504].includes(statusCode);
};

const isRetriableError = (error: unknown): boolean => {
  if (error instanceof ApiError) {
    return isRetriableStatusCode(error.statusCode);
  }

  const errorMessage = (error as Error).message?.toLowerCase() || '';
  return (
    errorMessage.includes('network') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('connection')
  );
};

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const createHeaders = async (options?: ApiRequestOptions): Promise<HeadersInit> => {
  const token = await getItem<string>(TOKEN_STORAGE_KEY);

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };
};

export const apiClient = {
  async get<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const { query } = options;
    const url = buildUrl(endpoint, query);
    console.log('url', url);

    try {
      const headers = await createHeaders(options);

      const response = await fetchWithRetry(url, {
        ...options,
        method: 'GET',
        headers,
      });

      const data = await apiClient.handleResponse<T>(response);

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      logger.error(`[API] GET ${endpoint} 실패:`, error);
      throw error;
    }
  },

  async post<T, D = unknown>(endpoint: string, data?: D, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const url = `${getApiBaseUrl()}${endpoint}`;

    try {
      const headers = await createHeaders(options);

      const response = await fetchWithRetry(url, {
        ...options,
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      const responseData = await apiClient.handleResponse<T>(response);

      return {
        data: responseData,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      logger.error(`[API] POST ${endpoint} 실패:`, error);
      throw error;
    }
  },

  async put<T, D = unknown>(endpoint: string, data?: D, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const url = `${getApiBaseUrl()}${endpoint}`;

    try {
      const headers = await createHeaders(options);

      const response = await fetchWithRetry(url, {
        ...options,
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      const responseData = await apiClient.handleResponse<T>(response);

      return {
        data: responseData,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      logger.error(`[API] PUT ${endpoint} 실패:`, error);
      throw error;
    }
  },

  async delete<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const url = `${getApiBaseUrl()}${endpoint}`;

    try {
      const headers = await createHeaders(options);

      const response = await fetchWithRetry(url, {
        ...options,
        method: 'DELETE',
        headers,
      });

      const data = await apiClient.handleResponse<T>(response);

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      logger.error(`[API] DELETE ${endpoint} 실패:`, error);
      throw error;
    }
  },

  async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = isJson ? await response.json() : await response.text();
      } catch {
        errorData = null;
      }

      const errorMessage = this.getErrorMessage(errorData) || `HTTP ${response.status}: ${response.statusText}`;

      throw new ApiError(response.status, errorMessage, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }

    try {
      return isJson ? await response.json() : ((await response.text()) as T);
    } catch (error) {
      logger.error('[API] 응답 파싱 실패:', error);
      throw new ApiError(500, '응답 데이터를 파싱할 수 없습니다.', error);
    }
  },

  getErrorMessage: (errorData: unknown): string | null => {
    if (!errorData || typeof errorData !== 'object') {
      return null;
    }

    const data = errorData as Record<string, unknown>;

    return (
      (data.message as string) || (data.error as string) || (data.msg as string) || (data.detail as string) || null
    );
  },
};
