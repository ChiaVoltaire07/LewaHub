import api from "../../lib/api";

export async function apiRequest<T = any>(
  endpoint: string,
  options?: { method?: string; body?: any },
  token?: string
): Promise<T> {
  const method = options?.method || "GET";
  const response = await api.request<T>(endpoint, { method, body: options?.body, token });
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data as T;
}

export async function adminLogin(email: string, password: string) {
  return api.adminLogin(email, password);
}

export async function getDashboardStats(token: string) {
  return api.getDashboardStats(token);
}

export async function listSchools(
  token: string,
  filters?: Record<string, any>
) {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.region) params.append("region", filters.region);
  if (filters?.verified !== undefined) params.append("verified", String(filters.verified));
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const queryString = params.toString() ? `?${params.toString()}` : "";
  return api.request(`/schools${queryString}`, { token });
}

export async function getSchool(id: string, token: string) {
  return api.request(`/schools/${id}`, { token });
}

export async function createSchool(data: any, token: string) {
  return api.createSchool(data, token);
}

export async function updateSchool(id: string, data: any, token: string) {
  return api.updateSchool(id, data, token);
}

export async function deleteSchool(id: string, token: string) {
  return api.deleteSchool(id, token);
}

export async function addProgram(schoolId: string, programData: any, token: string) {
  return api.addProgram(schoolId, programData, token);
}

export async function updateProgram(
  schoolId: string,
  programId: string,
  data: any,
  token: string
) {
  return api.updateProgram(schoolId, programId, data, token);
}

export async function deleteProgram(schoolId: string, programId: string, token: string) {
  return api.deleteProgram(schoolId, programId, token);
}

export async function regenerateSummary(schoolId: string, token: string) {
  return api.regenerateSummary(schoolId, token);
}

export async function listSummaryDrafts(status: string, token: string) {
  return api.listSummaryDrafts(status, token);
}

export async function approveSummaryDraft(draftId: string, token: string) {
  return api.approveSummaryDraft(draftId, token);
}

export async function rejectSummaryDraft(draftId: string, token: string) {
  return api.rejectSummaryDraft(draftId, token);
}

