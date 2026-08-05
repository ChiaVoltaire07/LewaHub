import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { listSummaryDrafts, approveSummaryDraft, rejectSummaryDraft } from "../lib/api";

interface Draft {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  school: {
    id: string;
    name: string;
    category: string;
    city: string;
    region: string;
  };
}

export default function DraftReviewPage() {
  const { token } = useAuth();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadDrafts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const response = await listSummaryDrafts("DRAFT", token);
      if (response.error) {
        setError(response.error);
      } else {
        setDrafts(response.drafts || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load drafts");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const handleApprove = async (draftId: string) => {
    if (!token) return;
    setProcessingId(draftId);
    setError("");
    setSuccess("");
    try {
      const response = await approveSummaryDraft(draftId, token);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Summary approved and published!");
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));
      }
    } catch (err: any) {
      setError(err.message || "Failed to approve draft");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (draftId: string) => {
    if (!token) return;
    setProcessingId(draftId);
    setError("");
    setSuccess("");
    try {
      const response = await rejectSummaryDraft(draftId, token);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Summary rejected.");
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));
      }
    } catch (err: any) {
      setError(err.message || "Failed to reject draft");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full" style={{ borderColor: "var(--forest, #1F5D45)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--ink, #14231C)", fontFamily: "Fraunces, serif" }}>
        AI Summary Review
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>
        Review AI-generated summaries. Approved summaries appear publicly on the school's page.
      </p>

      {error && (
        <div className="p-4 rounded-lg text-sm mb-4" style={{ backgroundColor: "rgba(186, 26, 26, 0.1)", color: "var(--sienna, #C1572B)", borderRadius: "8px" }}>
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg text-sm mb-4" style={{ backgroundColor: "rgba(31, 93, 69, 0.1)", color: "var(--forest, #1F5D45)", borderRadius: "8px" }}>
          {success}
        </div>
      )}

      {drafts.length === 0 ? (
        <div className="p-8 text-center rounded-xl" style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", borderRadius: "14px" }}>
          <p className="text-sm" style={{ color: "var(--ink, #14231C)", opacity: 0.6 }}>
            No pending drafts. Generate a summary from a school's page to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div key={draft.id} className="p-6 rounded-xl" style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", borderRadius: "14px" }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-semibold" style={{ color: "var(--ink, #14231C)" }}>{draft.school.name}</h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--ink, #14231C)", opacity: 0.6 }}>
                    {draft.school.category} · {draft.school.city}, {draft.school.region} · {new Date(draft.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(232, 169, 59, 0.15)", color: "var(--sunbeam, #E8A93B)" }}>
                  DRAFT
                </span>
              </div>

              <div className="mb-4 pl-4 py-3 pr-3 rounded-lg" style={{ borderLeft: "4px solid var(--sunbeam, #E8A93B)", backgroundColor: "var(--paper, #F7F5EF)", borderRadius: "8px" }}>
                <p className="text-sm" style={{ color: "var(--ink, #14231C)" }}>{draft.content}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(draft.id)}
                  disabled={processingId === draft.id}
                  className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg min-h-[44px] disabled:opacity-60 transition-colors"
                  style={{ backgroundColor: "var(--forest, #1F5D45)", borderRadius: "8px" }}
                >
                  {processingId === draft.id ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(draft.id)}
                  disabled={processingId === draft.id}
                  className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg min-h-[44px] disabled:opacity-60 transition-colors"
                  style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
                >
                  {processingId === draft.id ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}