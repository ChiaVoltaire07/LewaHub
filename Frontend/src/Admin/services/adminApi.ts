/**
 * Admin API Client for LewaHub
 * Centralized service for all admin backend requests.
 *
 * Every method returns an `AdminApiResult`:
 *   { ok: true,  data: T,  message?: string }  on success
 *   { ok: false, error, status, code? }        on failure
 */

import type {
  LoginCredentials,
  AuthResponse,
  AdminUser,
  AdminApiResult,
  DashboardStats,
  PaginatedSchools,
  AdminSchoolDetail,
  AdminSchoolInput,
  SchoolFilters,
  SchoolImage,
  AddImageInput,
  UpdateImageInput,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

class AdminApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = `${API_BASE_URL}/admin`) {
    this.baseUrl = baseUrl;
  }

  /**
   * Perform an authenticated request. Response bodies come in two shapes:
   *  - success: { success: true, data: T, message?: string }
   *  - failure: { success: false, error: { code, message } | string }
   * Public endpoints outside this client may return legacy `{ error: string }`.
   */
  private async request<T>(path: string, options: RequestInit = {}): Promise<AdminApiResult<T>> {
    const fullUrl = `${this.baseUrl}${path}`;

    const fetchOptions: RequestInit = {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    let response: Response;
    try {
      response = await fetch(fullUrl, fetchOptions);
    } catch (error) {
      console.error("Admin API request failed:", error);
      return { ok: false, error: "Network error. Please check your connection.", status: 0 };
    }

    let body: any = {};
    try {
      body = await response.json();
    } catch {
      // Non-JSON response — fall through with an empty body.
    }

    if (!response.ok) {
      const rawError = body?.error;
      const message =
        typeof rawError === "string"
          ? rawError
          : (typeof rawError === "object" && rawError?.message) || `HTTP ${response.status}`;
      const code = typeof rawError === "object" ? rawError?.code : undefined;
      return { ok: false, error: message, status: response.status, code };
    }

    return {
      ok: true,
      data: (body?.data ?? body) as T,
      raw: body as Record<string, any>,
      message: typeof body?.message === "string" ? body.message : undefined,
    };
  }

  /** Build a query string from a set of string/number filters. */
  private buildQuery(filters: Record<string, string | number | undefined | null>): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    }
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  }

  /**
   * Authentication
   */
  login(credentials: LoginCredentials): Promise<AdminApiResult<AuthResponse>> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  logout(): Promise<AdminApiResult<{ message: string }>> {
    return this.request("/auth/logout", { method: "POST" });
  }

  getMe(): Promise<AdminApiResult<{ admin: AdminUser }>> {
    return this.request("/auth/me");
  }

  /**
   * Dashboard
   */
  getDashboard(): Promise<AdminApiResult<DashboardStats>> {
    return this.request<DashboardStats>("/dashboard");
  }

  /**
   * Schools Management
   */
  async getSchools(filters: SchoolFilters = {}): Promise<AdminApiResult<PaginatedSchools>> {
    const queryString = this.buildQuery({
      search: filters.search,
      category: filters.category,
      region: filters.region,
      verificationStatus: filters.verificationStatus,
      page: filters.page,
      limit: filters.limit,
    });
    const result = await this.request<PaginatedSchools>(`/schools${queryString}`);
    if (!result.ok) return result;
    // The backend returns `{ data: [...rows], total, page, limit, totalPages }`
    // at the top level; reassemble into a single PaginatedSchools payload.
    const raw = result.raw ?? {};
    return {
      ok: true,
      data: {
        data: result.data as any,
        total: raw.total ?? 0,
        page: raw.page ?? 1,
        limit: raw.limit ?? filters.limit ?? 20,
        totalPages: raw.totalPages ?? 0,
      },
      message: result.message,
    };
  }

  getSchool(id: string): Promise<AdminApiResult<AdminSchoolDetail>> {
    return this.request<AdminSchoolDetail>(`/schools/${id}`);
  }

  createSchool(input: AdminSchoolInput): Promise<AdminApiResult<AdminSchoolDetail>> {
    return this.request<AdminSchoolDetail>("/schools", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  updateSchool(id: string, input: Partial<AdminSchoolInput>): Promise<AdminApiResult<AdminSchoolDetail>> {
    return this.request<AdminSchoolDetail>(`/schools/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  deleteSchool(id: string): Promise<AdminApiResult<{ id: string; deleted: boolean }>> {
    return this.request(`/schools/${id}`, { method: "DELETE" });
  }

  /**
   * Image management (URL-based; no file storage).
   */
  addImage(schoolId: string, input: AddImageInput): Promise<AdminApiResult<SchoolImage>> {
    return this.request<SchoolImage>(`/schools/${schoolId}/images`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  deleteImage(schoolId: string, imageId: string): Promise<AdminApiResult<{ id: string; deleted: boolean }>> {
    return this.request(`/schools/${schoolId}/images/${imageId}`, { method: "DELETE" });
  }

  updateImage(schoolId: string, imageId: string, input: UpdateImageInput): Promise<AdminApiResult<SchoolImage>> {
    return this.request<SchoolImage>(`/schools/${schoolId}/images/${imageId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }
}

export const adminApi = new AdminApiClient();
export default adminApi;
