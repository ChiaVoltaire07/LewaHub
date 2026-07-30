import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardStats } from "../lib/api";

interface DashboardStats {
  totalInstitutions: number;
  totalEvaluations: number;
  missingSummaries: number;
  verifiedCount?: number;
  totalViews?: number;
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
          setStats(response.data || response);
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
    { label: "Total Institutions", value: stats?.totalInstitutions ?? 0, to: "/admin/institutions" },
    { label: "Total Evaluations", value: stats?.totalEvaluations ?? 0, to: "/admin/evaluations/new" },
    { label: "Missing Summaries", value: stats?.missingSummaries ?? 0, to: "/admin/institutions" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--ink, #14231C)", fontFamily: "Fraunces, serif" }}>
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="p-6 transition-shadow hover:shadow-md"
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
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/institutions"
          className="p-5 transition-shadow hover:shadow-md"
          style={{
            backgroundColor: "var(--paper-deep, #EFEBDF)",
            borderRadius: "14px",
            border: "1px solid var(--line, #DCD6C6)",
          }}
        >
          <div className="font-semibold mb-1" style={{ color: "var(--ink, #14231C)" }}>Manage Institutions</div>
          <div className="text-xs" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>Add, edit, or remove institutions</div>
        </Link>
        <Link
          to="/admin/institutions/new"
          className="p-5 transition-shadow hover:shadow-md"
          style={{
            backgroundColor: "var(--paper-deep, #EFEBDF)",
            borderRadius: "14px",
            border: "1px solid var(--line, #DCD6C6)",
          }}
        >
          <div className="font-semibold mb-1" style={{ color: "var(--ink, #14231C)" }}>Add Institution</div>
          <div className="text-xs" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>Create a new institution record</div>
        </Link>
        <Link
          to="/admin/evaluations/new"
          className="p-5 transition-shadow hover:shadow-md"
          style={{
            backgroundColor: "var(--paper-deep, #EFEBDF)",
            borderRadius: "14px",
            border: "1px solid var(--line, #DCD6C6)",
          }}
        >
          <div className="font-semibold mb-1" style={{ color: "var(--ink, #14231C)" }}>Record Evaluation</div>
          <div className="text-xs" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>Record a student evaluation</div>
        </Link>
      </div>
    </div>
  );
}