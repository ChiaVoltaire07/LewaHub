import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye, Edit, ExternalLink, Trash2, Plus, AlertCircle } from "lucide-react";
import { adminApi } from "../services/adminApi";
import type { AdminSchoolListItem, SchoolFilters } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { PageHeader } from "../components/common/PageHeader";

const PAGE_SIZE = 20;

export function SchoolsPage() {
  const [schools, setSchools] = useState<AdminSchoolListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<SchoolFilters>({
    search: "",
    category: "",
    region: "",
    verificationStatus: "",
    page: 1,
    limit: PAGE_SIZE,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const [schoolToDelete, setSchoolToDelete] = useState<AdminSchoolListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Debounce the search input so we don't hit the API on every keystroke.
  const searchRef = useRef<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadSchools = async (currentFilters: SchoolFilters) => {
    setIsLoading(true);
    setError("");
    const response = await adminApi.getSchools(currentFilters);
    if (response.ok) {
      setSchools(response.data.data);
      setPagination({
        page: response.data.page,
        total: response.data.total,
        totalPages: response.data.totalPages,
      });
    } else {
      setError(response.error);
      setSchools([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadSchools(filters);
  }, [filters]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearchChange = (value: string) => {
    searchRef.current = value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchRef.current.trim(), page: 1 }));
    }, 400);
  };

  const handleFilterChange = (key: keyof SchoolFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const confirmDelete = async () => {
    if (!schoolToDelete) return;
    setDeleting(true);
    setDeleteError("");
    const result = await adminApi.deleteSchool(schoolToDelete.id);
    setDeleting(false);
    if (!result.ok) {
      setDeleteError(result.error);
      return;
    }
    setSchoolToDelete(null);
    // Reload the current page (which may now have fewer rows).
    loadSchools(filters);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <PageHeader
        title="Schools"
        subtitle={`${pagination.total} ${pagination.total === 1 ? "school" : "schools"} found`}
        actions={
          <Link
            to="/admin/schools/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-primary text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors"
          >
            <Plus size={18} />
            Add School
          </Link>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border-light p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-text-dark mb-2">
              Search Schools
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                id="search"
                type="text"
                defaultValue={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name, city or region..."
                className="w-full pl-10 pr-4 py-2.5 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-dark mb-2">
              Education Level
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-4 py-2.5 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent bg-white"
            >
              <option value="">All Levels</option>
              <option value="NURSERY">Nursery</option>
              <option value="PRIMARY">Primary</option>
              <option value="SECONDARY">Secondary</option>
              <option value="HIGHER">Higher</option>
            </select>
          </div>

          <div>
            <label htmlFor="verification" className="block text-sm font-medium text-text-dark mb-2">
              Status
            </label>
            <select
              id="verification"
              value={filters.verificationStatus}
              onChange={(e) => handleFilterChange("verificationStatus", e.target.value)}
              className="w-full px-4 py-2.5 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent bg-white"
            >
              <option value="">All Status</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
              <option value="NEEDS_UPDATE">Needs Update</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg border border-border-light p-12 text-center">
          <div className="w-12 h-12 border-4 border-teal-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading schools...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto mb-2 text-red-500" size={32} />
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => loadSchools(filters)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && schools.length === 0 && (
        <div className="bg-white rounded-lg border border-border-light p-12 text-center">
          <Filter className="mx-auto mb-4 text-text-muted" size={48} />
          <h3 className="text-lg font-medium text-text-dark mb-2">No schools found</h3>
          <p className="text-text-muted">Try adjusting your filters or search query</p>
        </div>
      )}

      {/* Schools Table */}
      {!isLoading && !error && schools.length > 0 && (
        <div className="bg-white rounded-lg border border-border-light overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-soft border-b border-border-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">School</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Levels</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {schools.map((school) => (
                  <tr key={school.id} className="hover:bg-bg-soft transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/admin/schools/${school.id}`} className="flex items-center gap-3 group">
                        {school.images[0] && (
                          <img
                            src={school.images[0].url}
                            alt={school.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-text-dark group-hover:text-teal-primary transition-colors">
                            {school.name}
                          </p>
                          <p className="text-xs text-text-muted truncate max-w-xs">
                            {school.description.substring(0, 60)}
                            {school.description.length > 60 ? "..." : ""}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-text-muted">
                        {school.location.city}, {school.location.region}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {school.levels.slice(0, 2).map((level) => (
                          <span
                            key={level}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
                          >
                            {level}
                          </span>
                        ))}
                        {school.levels.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            +{school.levels.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={school.verificationStatus} />
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {new Date(school.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/school/${school.id}`}
                          target="_blank"
                          className="p-1.5 text-text-muted hover:text-teal-primary hover:bg-teal-light rounded transition-colors"
                          title="View Public Page"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link
                          to={`/admin/schools/${school.id}`}
                          className="p-1.5 text-text-muted hover:text-teal-primary hover:bg-teal-light rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/schools/${school.id}/edit`}
                          className="p-1.5 text-text-muted hover:text-teal-primary hover:bg-teal-light rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => {
                            setDeleteError("");
                            setSchoolToDelete(school);
                          }}
                          className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border-light flex items-center justify-between">
              <p className="text-sm text-text-muted">
                Showing {(pagination.page - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(pagination.page * PAGE_SIZE, pagination.total)} of {pagination.total} results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium text-text-dark hover:bg-bg-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-text-muted">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-border-light rounded-lg text-sm font-medium text-text-dark hover:bg-bg-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={schoolToDelete !== null}
        title="Delete school"
        message={
          deleteError
            ? deleteError
            : `"${schoolToDelete?.name}" and all of its associated data will be permanently deleted. This action cannot be undone.`
        }
        confirmLabel="Delete"
        danger
        isSubmitting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setSchoolToDelete(null)}
      />
    </div>
  );
}
