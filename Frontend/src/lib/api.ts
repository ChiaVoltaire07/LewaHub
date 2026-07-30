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
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    // Add authorization token if provided
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Add body for POST/PUT requests
    if (body && (method === "POST" || method === "PUT")) {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(fullUrl, fetchOptions);

      if (!response.ok) {
        // Try to parse error response
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response isn't JSON, use default message
        }

        return {
          error: errorMessage,
        };
      }

      const data = await response.json();
      return {
        data: data as T,
        ...data, // Spread response for backward compatibility
      };
    } catch (err: any) {
      console.error("API request failed:", err);
      return {
        error: err.message || "Network error",
      };
    }
  }

  /**
   * Public endpoint: List all institutions with filters
   */
  async getInstitutions(filters?: {
    search?: string;
    type?: string;
    region?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.region) params.append("region", filters.region);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return this.request(`/institutions${queryString}`);
  }

  /**
   * Public endpoint: Get single institution by ID
   */
  async getInstitution(id: string) {
    return this.request(`/institutions/${id}`);
  }

  /**
   * Public endpoint: Search institutions
   */
  async search(query: string, filters?: {
    type?: string;
    region?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams({ q: query });
    if (filters?.type) params.append("type", filters.type);
    if (filters?.region) params.append("region", filters.region);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    return this.request(`/search?${params.toString()}`);
  }

  /**
   * Public endpoint: Find nearby institutions
   */
  async findNearby(latitude: number, longitude: number, radius: number = 50) {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
    });
    return this.request(`/geolocation/nearby?${params.toString()}`);
  }

  /**
   * Public endpoint: Get evaluation aggregate for institution
   */
  async getEvaluationAggregate(institutionId: string) {
    return this.request(`/evaluations/${institutionId}/aggregate`);
  }

  /**
   * Public endpoint: Verify student email/phone for evaluation
   */
  async verifyStudent(email?: string, phone?: string, verificationToken?: string) {
    return this.request("/evaluations/verify-student", {
      method: "POST",
      body: { email, phone, verificationToken },
    });
  }

  /**
   * Public endpoint: Get programs for an institution
   */
  async getPrograms(institutionId: string) {
    return this.request(`/institutions/${institutionId}/programs`);
  }

  // ============ ADMIN ENDPOINTS ============

  /**
   * Public endpoint: Admin login
   */
  async adminLogin(email: string, password: string) {
    return this.request("/admin/login", {
      method: "POST",
      body: { email, password },
    });
  }

  /**
   * Protected endpoint: Get admin dashboard stats
   */
  async getDashboardStats(token: string) {
    return this.request("/admin/dashboard", { token });
  }

  /**
   * Protected endpoint: Create institution
   */
  async createInstitution(data: any, token: string) {
    return this.request("/institutions", {
      method: "POST",
      body: data,
      token,
    });
  }

  /**
   * Protected endpoint: Update institution
   */
  async updateInstitution(id: string, data: any, token: string) {
    return this.request(`/institutions/${id}`, {
      method: "PUT",
      body: data,
      token,
    });
  }

  /**
   * Protected endpoint: Delete institution
   */
  async deleteInstitution(id: string, token: string) {
    return this.request(`/institutions/${id}`, {
      method: "DELETE",
      token,
    });
  }

  /**
   * Protected endpoint: Record evaluation (admin)
   */
  async recordEvaluation(
    studentId: string,
    institutionId: string,
    score: number,
    notes: string,
    token: string
  ) {
    return this.request("/evaluations", {
      method: "POST",
      body: { studentId, institutionId, score, notes },
      token,
    });
  }

  /**
   * Protected endpoint: Add program to institution
   */
  async addProgram(institutionId: string, programData: any, token: string) {
    return this.request(`/institutions/${institutionId}/programs`, {
      method: "POST",
      body: programData,
      token,
    });
  }

  /**
   * Protected endpoint: Update program
   */
  async updateProgram(
    institutionId: string,
    programId: string,
    data: any,
    token: string
  ) {
    return this.request(`/institutions/${institutionId}/programs/${programId}`, {
      method: "PUT",
      body: data,
      token,
    });
  }

  /**
   * Protected endpoint: Delete program
   */
  async deleteProgram(institutionId: string, programId: string, token: string) {
    return this.request(`/institutions/${institutionId}/programs/${programId}`, {
      method: "DELETE",
      token,
    });
  }

  /**
   * Protected endpoint: Regenerate AI summary for institution
   */
  async regenerateSummary(institutionId: string, token: string) {
    return this.request(`/ai-summary/${institutionId}/regenerate`, {
      method: "POST",
      token,
    });
  }
}

// Export singleton instance
export const api = new ApiClient();

export default api;
