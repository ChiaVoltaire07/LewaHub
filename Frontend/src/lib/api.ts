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
   * Public endpoint: List all schools with filters
   */
  async getSchools(filters?: {
    search?: string;
    category?: string;
    region?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.region) params.append("region", filters.region);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return this.request(`/schools${queryString}`);
  }

  /**
   * Public endpoint: Get single school by ID
   */
  async getSchool(id: string) {
    return this.request(`/schools/${id}`);
  }

  /**
   * Public endpoint: Search schools
   */
  async search(query: string, filters?: {
    category?: string;
    region?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams({ q: query });
    if (filters?.category) params.append("category", filters.category);
    if (filters?.region) params.append("region", filters.region);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    return this.request(`/search?${params.toString()}`);
  }

  /**
   * Public endpoint: Find nearby schools
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
   * Public endpoint: Get evaluation aggregate for school
   */
  async getEvaluationAggregate(schoolId: string) {
    return this.request(`/evaluations/${schoolId}/aggregate`);
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
   * Public endpoint: Get programs for a school
   */
  async getPrograms(schoolId: string) {
    return this.request(`/schools/${schoolId}/programs`);
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
   * Protected endpoint: Create school
   */
  async createSchool(data: any, token: string) {
    return this.request("/schools", {
      method: "POST",
      body: data,
      token,
    });
  }

  /**
   * Protected endpoint: Update school
   */
  async updateSchool(id: string, data: any, token: string) {
    return this.request(`/schools/${id}`, {
      method: "PUT",
      body: data,
      token,
    });
  }

  /**
   * Protected endpoint: Delete school
   */
  async deleteSchool(id: string, token: string) {
    return this.request(`/schools/${id}`, {
      method: "DELETE",
      token,
    });
  }

  /**
   * Protected endpoint: Record evaluation (admin)
   */
  async recordEvaluation(
    studentId: string,
    schoolId: string,
    score: number,
    notes: string,
    token: string
  ) {
    return this.request("/evaluations", {
      method: "POST",
      body: { studentId, schoolId, score, notes },
      token,
    });
  }

  /**
   * Protected endpoint: Add program to school
   */
  async addProgram(schoolId: string, programData: any, token: string) {
    return this.request(`/schools/${schoolId}/programs`, {
      method: "POST",
      body: programData,
      token,
    });
  }

  /**
   * Protected endpoint: Update program
   */
  async updateProgram(
    schoolId: string,
    programId: string,
    data: any,
    token: string
  ) {
    return this.request(`/schools/${schoolId}/programs/${programId}`, {
      method: "PUT",
      body: data,
      token,
    });
  }

  /**
   * Protected endpoint: Delete program
   */
  async deleteProgram(schoolId: string, programId: string, token: string) {
    return this.request(`/schools/${schoolId}/programs/${programId}`, {
      method: "DELETE",
      token,
    });
  }

  /**
   * Protected endpoint: Regenerate AI summary for school
   */
  async regenerateSummary(schoolId: string, token: string) {
    return this.request(`/ai-summary/${schoolId}/regenerate`, {
      method: "POST",
      token,
    });
  }
}

// Export singleton instance
export const api = new ApiClient();

export default api;
