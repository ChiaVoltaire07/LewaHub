import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { listSchools, deleteSchool } from "../lib/api";

interface School {
  id: string;
  name: string;
  category: string;
  offersHighSchool: boolean;
  region: string;
  city: string;
  verified: boolean;
  updatedAt?: string;
}

export default function SchoolsListPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterVerified, setFilterVerified] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const fetchSchools = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await listSchools(token, {
        search: search || undefined,
        category: filterCategory || undefined,
        region: filterRegion || undefined,
        verified: filterVerified || undefined,
        page,
        limit: pageSize,
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      const data = (response as any).data || response;
      setSchools(data.data || data || []);
      setTotalItems(data.total || 0);
      setCurrentPage(data.page || 1);
    } catch (err: any) {
      setError(err.message || "Failed to load schools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools(1);
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeleting(true);
    try {
      const response = await deleteSchool(id, token);
      if (!response.error) {
        setSchools((prev) => prev.filter((s) => s.id !== id));
        setDeleteId(null);
      } else {
        setError(response.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSchools(1);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === schools.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(schools.map((s) => s.id)));
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--ink, #14231C)", fontFamily: "Fraunces, serif" }}>
            School Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>
            Manage all schools in the database.
          </p>
        </div>
        <Link
          to="/admin/schools/new"
          className="px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors"
          style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
        >
          + New School
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)" }}>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink, #14231C)", opacity: 0.5 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg outline-none"
            style={{
              backgroundColor: "var(--paper, #F7F5EF)",
              border: "1px solid var(--line, #DCD6C6)",
              color: "var(--ink, #14231C)",
              borderRadius: "8px",
            }}
          />
        </div>
        <select
          value={filterVerified}
          onChange={(e) => setFilterVerified(e.target.value)}
          className="px-3 py-2.5 text-sm rounded-lg outline-none"
          style={{
            backgroundColor: "var(--paper, #F7F5EF)",
            border: "1px solid var(--line, #DCD6C6)",
            color: "var(--ink, #14231C)",
            borderRadius: "8px",
          }}
        >
          <option value="">All statuses</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
        <select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          className="px-3 py-2.5 text-sm rounded-lg outline-none"
          style={{
            backgroundColor: "var(--paper, #F7F5EF)",
            border: "1px solid var(--line, #DCD6C6)",
            color: "var(--ink, #14231C)",
            borderRadius: "8px",
          }}
        >
          <option value="">All regions</option>
          <option value="Centre">Centre</option>
          <option value="Littoral">Littoral</option>
          <option value="Southwest">Southwest</option>
          <option value="Northwest">Northwest</option>
          <option value="West">West</option>
          <option value="East">East</option>
          <option value="Adamawa">Adamawa</option>
          <option value="North">North</option>
          <option value="Far North">Far North</option>
          <option value="South">South</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2.5 text-sm rounded-lg outline-none"
          style={{
            backgroundColor: "var(--paper, #F7F5EF)",
            border: "1px solid var(--line, #DCD6C6)",
            color: "var(--ink, #14231C)",
            borderRadius: "8px",
          }}
        >
          <option value="">All categories</option>
          <option value="PrimaryNursery">Primary / Nursery</option>
          <option value="Secondary">Secondary</option>
          <option value="University">University</option>
        </select>
        <button
          type="submit"
          className="p-2.5 rounded-lg transition-colors"
          style={{ backgroundColor: "var(--forest, #1F5D45)", color: "white", borderRadius: "8px" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-lg text-sm mb-4" style={{ backgroundColor: "rgba(186, 26, 26, 0.1)", color: "var(--sienna, #C1572B)", borderRadius: "8px" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full" style={{ borderColor: "var(--forest, #1F5D45)", borderTopColor: "transparent" }} />
        </div>
      ) : schools.length === 0 ? (
        <div className="p-8 text-center rounded-lg" style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", borderRadius: "14px", border: "1px solid var(--line, #DCD6C6)" }}>
          <p className="text-sm" style={{ color: "var(--ink, #14231C)" }}>
            No schools yet — add the first one
          </p>
          <Link
            to="/admin/schools/new"
            className="inline-block mt-3 px-4 py-2 text-sm font-semibold text-white rounded-lg"
            style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
          >
            Add School
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-xl" style={{ border: "1px solid var(--line, #DCD6C6)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--paper-deep, #EFEBDF)" }}>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === schools.length && schools.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: "var(--forest, #1F5D45)" }}
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--ink, #14231C)" }}>School Identity</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--ink, #14231C)" }}>Region</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--ink, #14231C)" }}>Status</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--ink, #14231C)" }}>Last Updated</th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: "var(--ink, #14231C)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school, idx) => {
                  const initials = school.name.slice(0, 2).toUpperCase();
                  const badgeBg =
                    school.category === "University" ? "rgba(31,93,69,0.18)"
                    : school.category === "Secondary" ? "rgba(232,169,59,0.22)"
                    : "rgba(31,93,69,0.12)";
                  return (
                    <tr
                      key={school.id}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "var(--paper, #F7F5EF)" : "var(--paper-deep, #EFEBDF)",
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(31,93,69,0.04)")}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "var(--paper, #F7F5EF)" : "var(--paper-deep, #EFEBDF)";
                      }}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(school.id)}
                          onChange={() => toggleSelect(school.id)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: "var(--forest, #1F5D45)" }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full"
                            style={{ backgroundColor: badgeBg, color: "var(--forest, #1F5D45)" }}
                          >
                            {initials}
                          </span>
                          <div>
                            <div className="text-sm font-medium" style={{ color: "var(--ink, #14231C)" }}>{school.name}</div>
                            <div className="text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--ink, #14231C)", opacity: 0.6 }}>
                              {school.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "var(--ink, #14231C)" }}>{school.region}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: school.verified ? "rgba(31, 93, 69, 0.15)" : "rgba(193, 87, 43, 0.1)",
                            color: school.verified ? "var(--forest, #1F5D45)" : "var(--sienna, #C1572B)",
                            borderRadius: "9999px",
                          }}
                        >
                          {school.verified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--ink, #14231C)", opacity: 0.7 }}>
                        {school.updatedAt ? new Date(school.updatedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/schools/${school.id}/edit`)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: "var(--forest, #1F5D45)" }}
                            title="Edit"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteId(school.id)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: "var(--sienna, #C1572B)" }}
                            title="Delete"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {schools.map((school) => {
              const initials = school.name.slice(0, 2).toUpperCase();
              return (
                <div
                  key={school.id}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)" }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(school.id)}
                        onChange={() => toggleSelect(school.id)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: "var(--forest, #1F5D45)" }}
                      />
                      <span className="inline-flex items-center justify-center w-7 h-7 text-[10px] font-bold rounded-full" style={{ backgroundColor: "rgba(31,93,69,0.12)", color: "var(--forest, #1F5D45)" }}>
                        {initials}
                      </span>
                      <div>
                        <div className="text-sm font-medium" style={{ color: "var(--ink, #14231C)" }}>{school.name}</div>
                        <div className="text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--ink, #14231C)", opacity: 0.6 }}>
                          {school.id}
                        </div>
                      </div>
                    </div>
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: school.verified ? "rgba(31, 93, 69, 0.15)" : "rgba(193, 87, 43, 0.1)",
                        color: school.verified ? "var(--forest, #1F5D45)" : "var(--sienna, #C1572B)",
                        borderRadius: "9999px",
                      }}
                    >
                      {school.verified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigate(`/admin/schools/${school.id}/edit`)}
                      className="flex-1 py-2.5 text-xs font-medium rounded-lg text-white min-h-[44px]"
                      style={{ backgroundColor: "var(--forest, #1F5D45)", borderRadius: "8px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(school.id)}
                      className="flex-1 py-2.5 text-xs font-medium rounded-lg text-white min-h-[44px]"
                      style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <div className="text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--ink, #14231C)", opacity: 0.7 }}>
                Showing {startItem}–{endItem} of {totalItems} schools
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchSchools(page)}
                    className="w-8 h-8 text-xs font-medium rounded-lg transition-colors"
                    style={{
                      backgroundColor: page === currentPage ? "var(--forest, #1F5D45)" : "var(--paper-deep, #EFEBDF)",
                      color: page === currentPage ? "white" : "var(--ink, #14231C)",
                      borderRadius: "8px",
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-sm p-6 rounded-xl"
            style={{ backgroundColor: "var(--paper, #F7F5EF)", borderRadius: "14px" }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--ink, #14231C)" }}>Confirm Delete</h3>
            <p className="text-sm mb-6" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>
              Are you sure you want to delete this school? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg min-h-[44px]"
                style={{
                  backgroundColor: "var(--paper-deep, #EFEBDF)",
                  border: "1px solid var(--line, #DCD6C6)",
                  color: "var(--ink, #14231C)",
                  borderRadius: "8px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 py-2.5 text-sm font-medium text-white rounded-lg min-h-[44px] disabled:opacity-60"
                style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}