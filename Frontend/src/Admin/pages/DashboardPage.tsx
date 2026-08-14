import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  School,
  CheckCircle,
  Globe,
  MapPinOff,
  Image as ImageIcon,
  GraduationCap,
  Landmark,
  AlertCircle,
  Eye,
  Edit,
  ExternalLink,
} from "lucide-react";
import { adminApi } from "../services/adminApi";
import type { DashboardStats } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import { PageHeader } from "../components/common/PageHeader";

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setIsLoading(true);
    setError("");
    const response = await adminApi.getDashboard();
    if (response.ok) {
      setStats(response.data);
    } else {
      setError(response.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-border-light p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto mb-2 text-red-500" size={32} />
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadDashboard}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { title: "Total Schools", value: stats.totalSchools, icon: School, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Verified Schools", value: stats.verifiedSchools, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Universities", value: stats.universities, icon: Landmark, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Secondary Schools", value: stats.secondarySchools, icon: GraduationCap, color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { title: "Primary & Nursery", value: stats.primarySchools, icon: School, color: "text-cyan-600", bgColor: "bg-cyan-50" },
    { title: "Missing Website", value: stats.missingWebsite, icon: Globe, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Missing Images", value: stats.missingImages, icon: ImageIcon, color: "text-pink-600", bgColor: "bg-pink-50" },
    { title: "Missing Coordinates", value: stats.missingCoordinates, icon: MapPinOff, color: "text-slate-600", bgColor: "bg-slate-50" },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <PageHeader title="Dashboard" subtitle="Overview of the LewaHub school directory" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg border border-border-light p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
              <p className="text-sm text-text-muted font-medium mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-text-dark">{stat.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Schools */}
      <div className="bg-white rounded-lg border border-border-light">
        <div className="px-6 py-4 border-b border-border-light flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-dark">Recent Schools</h2>
          <Link
            to="/admin/schools"
            className="text-sm font-medium text-teal-primary hover:text-teal-dark transition-colors"
          >
            View All
          </Link>
        </div>

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
              {stats.recentSchools.map((school) => (
                <tr key={school.id} className="hover:bg-bg-soft transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {school.images[0] && (
                        <img
                          src={school.images[0].url}
                          alt={school.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <p className="text-sm font-medium text-text-dark">{school.name}</p>
                    </div>
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
