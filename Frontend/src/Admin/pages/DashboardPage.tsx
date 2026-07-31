import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardStats } from "../lib/api";

interface DashboardStats {
  totalInstitutions: number;
  verifiedCount: number;
  missingImage: number;
  missingDescription: number;
  totalViews?: number;
  recentActivity: Array<{ id: string; name: string; action: string; timeAgo: string }>;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const response = await getDashboardStats(token);
        if (response.error) {
          setError(response.error);
        } else {
          const payload = (response.data || response) as DashboardStats;
          setStats(payload);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full" style={{ borderColor: "var(--forest, #1F5D45)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: "rgba(186, 26, 26, 0.1)", color: "var(--sienna, #C1572B)", borderRadius: "8px" }}>
        {error}
      </div>
    );
  }

  const cards = [
    { label: "Total Institutions", value: stats?.totalInstitutions ?? 0 },
    { label: "Missing Image", value: stats?.missingImage ?? 0 },
    { label: "Missing Description", value: stats?.missingDescription ?? 0 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--ink, #14231C)", fontFamily: "Fraunces, serif" }}>
            System Overview
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>
            Live status of your institutions and data quality.
          </p>
        </div>
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full"
          style={{ backgroundColor: "rgba(31,93,69,0.12)", color: "var(--forest, #1F5D45)", borderRadius: "9999px" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--forest, #1F5D45)" }} />
          System Live
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-5"
            style={{
              backgroundColor: "var(--paper-deep, #EFEBDF)",
              borderRadius: "14px",
              border: "1px solid var(--line, #DCD6C6)",
            }}
          >
            <div className="text-3xl font-bold mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--forest, #1F5D45)" }}>
              {card.value}
            </div>
            <div className="text-sm" style={{ color: "var(--ink, #14231C)" }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link
          to="/admin/institutions/new"
          className="p-5 transition-shadow hover:shadow-md"
          style={{
            backgroundColor: "var(--forest, #1F5D45)",
            color: "white",
            borderRadius: "14px",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-sm mb-1">Add School</div>
              <div className="text-xs opacity-80">Create a new institution record</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <div className="flex items-center gap-1 mt-4 text-xs opacity-70">
            <span>New institution</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </Link>

        <Link
          to="/admin/institutions"
          className="p-5 transition-shadow hover:shadow-md"
          style={{
            backgroundColor: "var(--paper-deep, #EFEBDF)",
            borderRadius: "14px",
            border: "1px solid var(--line, #DCD6C6)",
          }}
        >
          <div className="flex items-start justify-between" style={{ color: "var(--ink, #14231C)" }}>
            <div>
              <div className="font-semibold text-sm mb-1">Manage Schools</div>
              <div className="text-xs opacity-80">Review, edit, or remove listings</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>
          <div className="flex items-center gap-1 mt-4 text-xs opacity-70" style={{ color: "var(--ink, #14231C)" }}>
            <span>All institutions</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </Link>

        <div
          className="p-5"
          style={{
            background: "linear-gradient(135deg, #14231C 0%, #1F5D45 100%)",
            color: "white",
            borderRadius: "14px",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-sm mb-1">View Public Site</div>
              <div className="text-xs opacity-80">See what visitors see on LewaHub</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <a href="/" target="_blank" className="flex items-center gap-1 mt-4 text-xs opacity-70 hover:opacity-100 transition-opacity" style={{ color: "white" }}>
            <span>lewahub.com</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", borderRadius: "14px" }}
      >
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--ink, #14231C)" }}>Recent Activity</h2>
        </div>
        <div>
          {!stats?.recentActivity || stats.recentActivity.length === 0 ? (
            <div className="px-5 py-6 text-sm" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>
              No recent changes found.
            </div>
          ) : (
            stats.recentActivity.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-5 py-3"
                style={{
                  borderTop: "1px solid var(--line, #DCD6C6)",
                  backgroundColor: idx % 2 === 0 ? "var(--paper, #F7F5EF)" : "var(--paper-deep, #EFEBDF)",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ backgroundColor: item.action === "Updated" ? "rgba(232,169,59,0.15)" : "rgba(31,93,69,0.12)" }}
                  >
                    {item.action === "Updated" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sunbeam, #E8A93B)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--forest, #1F5D45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--ink, #14231C)" }}>{item.name}</div>
                    <div className="text-xs" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>{item.action}</div>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: "'IBM Plex Mono', monospace", backgroundColor: "rgba(31,93,69,0.08)", color: "var(--forest, #1F5D45)", borderRadius: "9999px" }}>
                  {item.timeAgo}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}