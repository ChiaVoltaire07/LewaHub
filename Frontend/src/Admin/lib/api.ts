import api from "../../lib/api";

export async function apiRequest<T = any>(
  endpoint: string,
  options?: { method?: string; body?: string },
  token?: string
): Promise<T> {
  const method = options?.method || "GET";
  return api.request(endpoint, { method, body: options?.body, token });
}

export async function adminLogin(email: string, password: string) {
  return api.adminLogin(email, password);
}

export async function getDashboardStats(token: string) {
  return api.getDashboardStats(token);
}

export async function listInstitutions(
  token: string,
  filters?: { search?: string; type?: string; region?: string; page?: number; limit?: number }
) {
  // For admin, we use authenticated endpoint
  return api.request("/institutions", { token, ...filters });
}

export async function getInstitution(id: string, token: string) {
  return api.request(`/institutions/${id}`, { token });
}

export async function createInstitution(data: any, token: string) {
  return api.createInstitution(data, token);
}

export async function updateInstitution(id: string, data: any, token: string) {
  return api.updateInstitution(id, data, token);
}

export async function deleteInstitution(id: string, token: string) {
  return api.deleteInstitution(id, token);
}

export async function recordEvaluation(
  studentId: string,
  institutionId: string,
  score: number,
  notes: string,
  token: string
) {
  return api.recordEvaluation(studentId, institutionId, score, notes, token);
}

export async function addProgram(institutionId: string, programData: any, token: string) {
  return api.addProgram(institutionId, programData, token);
}

export async function updateProgram(
  institutionId: string,
  programId: string,
  data: any,
  token: string
) {
  return api.updateProgram(institutionId, programId, data, token);
}

export async function deleteProgram(institutionId: string, programId: string, token: string) {
  return api.deleteProgram(institutionId, programId, token);
}

export async function regenerateSummary(institutionId: string, token: string) {
  return api.regenerateSummary(institutionId, token);
}

export async function verifyStudent(email?: string, phone?: string) {
  return api.verifyStudent(email, phone);
}