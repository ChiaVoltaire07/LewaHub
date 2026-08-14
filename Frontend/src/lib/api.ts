/**
 * Centralized API client for LewaHub
 * All backend requests go through this module to ensure consistency,
 * error handling, and easy refactoring
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

interface FetchOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  token?: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status?: number;
  [key: string]: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make an authenticated or unauthenticated request
   */
  async request<T>(
    path: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {}, token } = options;
    const fullUrl = `${this.baseUrl}${path}`;

    const fetchOptions: RequestInit = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If response isn't JSON, use default message
      }

      return {
        error: errorMessage,
        status: response.status,
      };
    }

    const data = await response.json();
    // Spread top-level properties for backward compatibility
    // (callers may access response.data directly, or response.total, etc.)
    return {
      data: data as T,
      ...(typeof data === "object" && data !== null ? data : {}),
    };
  }

  /**
   * Public endpoint: List all schools with filters
   */
  async getSchools(filters?: {
    search?: string;
    category?: string;
    region?: string;
    language?: string;
    ownership?: string;
    boarding?: string;
    program?: string;
    speciality?: string;
    verified?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.region) params.append("region", filters.region);
    if (filters?.language) params.append("language", filters.language);
    if (filters?.ownership) params.append("ownership", filters.ownership);
    if (filters?.boarding) params.append("boarding", filters.boarding);
    if (filters?.program) params.append("program", filters.program);
    if (filters?.speciality) params.append("speciality", filters.speciality);
    if (filters?.verified) params.append("verified", filters.verified);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return this.request(`/schools${queryString}`);
  }

  /**
   * Public endpoint: Distinct filter option values (regions, programs, specialities)
   * served from the database. `{ regions: string[], programs: string[], specialities: string[] }`
   */
  async getFilterOptions() {
    return this.request(`/schools/filters`);
  }

  /**
   * Public endpoint: Get single school by ID
   */
  async getSchool(id: string) {
    return this.request(`/schools/${id}`);
  }

  /**
   * Public endpoint: Schools within a radius (km) of a point, nearest first.
   * Returns an envelope `{ data, center, radiusKm, total, page, limit }` where
   * every school carries `distanceKm` / `distanceMeters`.
   */
  async getNearbySchools(options: {
    latitude: number;
    longitude: number;
    radius?: number;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    params.append("latitude", String(options.latitude));
    params.append("longitude", String(options.longitude));
    if (options.radius != null) params.append("radius", String(options.radius));
    if (options.page != null) params.append("page", String(options.page));
    if (options.limit != null) params.append("limit", String(options.limit));
    return this.request(`/schools/nearby?${params.toString()}`);
  }
}

// Export singleton instance
export const api = new ApiClient();

export default api;
