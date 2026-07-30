import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { listInstitutions, deleteInstitution } from "../lib/api";

interface Institution {
  id: string;
  name: string;
  type: string;
  region: string;
  city: string;
  verified: boolean;
}

export default function InstitutionsListPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchInstitutions = async () => {
    setLoading(true);
    setError("");
    try {
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const response = await listInstitutions(token, {
        search: search || undefined,
        type: filterType || undefined,
        page: 1,
        limit: 50,
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      setInstitutions(response.data || response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load institutions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeleting(true);
    try {
      const response = await deleteInstitution(id, token);
      if (!response.error) {
        setInstitutions((prev) => prev.filter((i) => i.id !== id));
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
    fetchInstitutions();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--ink, #14231C)", fontFamily: "Fraunces, serif" }}>
          Institutions
        </h1>
        <Link
          to="/admin/institutions/new"
          className="px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors"
          style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
        >
          + Add
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm rounded-lg outline-none"
          style={{
            backgroundColor: "var(--paper-deep, #EFEBDF)",
            border: "1px solid var(--line, #DCD6C6)",
            color: "var(--ink, #14231C)",
            borderRadius: "8px",
          }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 text-sm rounded-lg outline-none"
          style={{
            backgroundColor: "var(--paper-deep, #EFEBDF)",
            border: "1px solid var(--line, #DCD6C6)",
            color: "var(--ink, #14231C)",
            borderRadius: "8px",
          }}
        >
          <option value="">All types</option>
          <option value="University">University</option>
          <option value="Institute">Institute</option>
          <option value="College">College</option>
          <option value="Polytechnic">Polytechnic</option>
          <option value="High School">High School</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors"
          style={{ backgroundColor: "var(--forest, #1F5D45)", borderRadius: "8px" }}
        >
          Search
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
      ) : institutions.length === 0 ? (
        <div className="p-8 text-center rounded-lg" style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", borderRadius: "14px", border: "1px solid var(--line, #DCD6C6)" }}>
          <p className="text-sm" style={{ color: "var(--ink, #14231C)" }}>
            No institutions yet — add the first one
          </p>
          <Link
            to="/admin/institutions/new"
            className="inline-block mt-3 px-4 py-2 text-sm font-semibold text-white rounded-lg"
            style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
          >
            Add Institution
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-xl" style={{ border: "1px solid var(--line, #DCD6C6)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--paper-deep, #EFEBDF)" }}>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--ink, #14231C)" }}>Name</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--ink, #14231C)" }}>Type</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--ink, #14231C)" }}>Region</th>
                  <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--ink, #14231C)" }}>Verified</th>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: "var(--ink, #14231C)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map((inst, idx) => (
                  <tr
                    key={inst._id}
                    style={{ backgroundColor: idx % 2 === 0 ? "var(--paper, #F7F5EF)" : "var(--paper-deep, #EFEBDF)" }}
                  >
                    <td className="px-4 py-3" style={{ color: "var(--ink, #14231C)" }}>{inst.name}</td>
                    <td className="px-4 py-3" style={{ color: "var(--ink, #14231C)" }}>{inst.type}</td>
                    <td className="px-4 py-3" style={{ color: "var(--ink, #14231C)" }}>{inst.region}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 text-xs font-medium rounded"
                        style={{
                          backgroundColor: inst.verified ? "rgba(31, 93, 69, 0.15)" : "rgba(193, 87, 43, 0.15)",
                          color: inst.verified ? "var(--forest, #1F5D45)" : "var(--sienna, #C1572B)",
                          borderRadius: "4px",
                        }}
                      >
                        {inst.verified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/institutions/${inst._id}/edit`)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors text-white"
                          style={{ backgroundColor: "var(--forest, #1F5D45)", borderRadius: "8px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/admin/institutions/${inst._id}/summary`)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                          style={{
                            backgroundColor: "var(--paper-deep, #EFEBDF)",
                            border: "1px solid var(--line, #DCD6C6)",
                            color: "var(--ink, #14231C)",
                            borderRadius: "8px",
                          }}
                        >
                          Summary
                        </button>
                        <button
                          onClick={() => setDeleteId(inst._id)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors text-white"
                          style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {institutions.map((inst) => (
              <div
                key={inst._id}
                className="p-4 rounded-xl"
                style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "var(--ink, #14231C)" }}>{inst.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>{inst.type} · {inst.region}</div>
                  </div>
                  <span
                    className="inline-block px-2 py-0.5 text-xs font-medium rounded"
                    style={{
                      backgroundColor: inst.verified ? "rgba(31, 93, 69, 0.15)" : "rgba(193, 87, 43, 0.15)",
                      color: inst.verified ? "var(--forest, #1F5D45)" : "var(--sienna, #C1572B)",
                      borderRadius: "4px",
                    }}
                  >
                    {inst.verified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/admin/institutions/${inst._id}/edit`)}
                    className="flex-1 py-2.5 text-xs font-medium rounded-lg text-white min-h-[44px]"
                    style={{ backgroundColor: "var(--forest, #1F5D45)", borderRadius: "8px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/admin/institutions/${inst._id}/summary`)}
                    className="flex-1 py-2.5 text-xs font-medium rounded-lg min-h-[44px]"
                    style={{
                      backgroundColor: "var(--paper, #F7F5EF)",
                      border: "1px solid var(--line, #DCD6C6)",
                      color: "var(--ink, #14231C)",
                      borderRadius: "8px",
                    }}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setDeleteId(inst._id)}
                    className="flex-1 py-2.5 text-xs font-medium rounded-lg text-white min-h-[44px]"
                    style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
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
              Are you sure you want to delete this institution? This action cannot be undone.
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