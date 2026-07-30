import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getInstitution, updateInstitution, regenerateSummary } from "../lib/api";

export default function SummaryReviewPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [aiSummary, setAiSummary] = useState("");
  const [originalSummary, setOriginalSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id || !token) return;
    (async () => {
      try {
        const response = await getInstitution(id, token);
        if (response.error) {
          setError(response.error);
        } else {
          const data = response.data || response;
          setAiSummary(data.aiSummary || "");
          setOriginalSummary(data.aiSummary || "");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load institution");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  const handleSave = async () => {
    if (!id || !token) return;
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const response = await updateInstitution(id, { aiSummary }, token);
      if (response.error) {
        setError(response.error);
      } else {
        setOriginalSummary(aiSummary);
        setSuccess("Summary saved successfully!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save summary");
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!id || !token) return;
    setError("");
    setSuccess("");
    setRegenerating(true);
    try {
      const response = await regenerateSummary(id, token);
      if (response.error) {
        setError(response.error);
      } else {
        const newSummary = response.aiSummary;
        setAiSummary(newSummary);
        setSuccess("Summary regenerated!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to regenerate summary");
    } finally {
      setRegenerating(false);
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

      {error && (
        <div
          className="p-4 rounded-lg text-sm mb-4"
          style={{
            backgroundColor: "rgba(186, 26, 26, 0.1)",
            color: "var(--sienna, #C1572B)",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="p-4 rounded-lg text-sm mb-4"
          style={{
            backgroundColor: "rgba(31, 93, 69, 0.1)",
            color: "var(--forest, #1F5D45)",
            borderRadius: "8px",
          }}
        >
          {success}
        </div>
      )}

      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", borderRadius: "14px" }}
      >
        <div
          className="mb-4 pl-4 py-3 pr-3 rounded-lg"
          style={{
            borderLeft: "4px solid var(--sunbeam, #E8A93B)",
            backgroundColor: "var(--paper, #F7F5EF)",
            borderRadius: "8px",
          }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: "var(--sunbeam, #E8A93B)" }}>
            AI-drafted
          </p>
          <p className="text-xs" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>
            {originalSummary || "No AI summary has been generated yet."}
          </p>
        </div>

        <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>
          Edit Summary
        </label>
        <textarea
          value={aiSummary}
          onChange={(e) => setAiSummary(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 text-sm rounded-lg outline-none resize-y"
          style={{
            backgroundColor: "var(--paper, #F7F5EF)",
            border: "1px solid var(--line, #DCD6C6)",
            color: "var(--ink, #14231C)",
            borderRadius: "8px",
          }}
          placeholder="Enter or edit the AI-generated summary for this institution..."
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg min-h-[44px] disabled:opacity-60 transition-colors"
            style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg min-h-[44px] disabled:opacity-60 transition-colors"
            style={{ backgroundColor: "var(--forest, #1F5D45)", borderRadius: "8px" }}
          >
            {regenerating ? "Regenerating..." : "Regenerate"}
          </button>
          <button
            onClick={() => navigate("/admin/institutions")}
            className="px-5 py-2.5 text-sm font-medium rounded-lg min-h-[44px] transition-colors"
            style={{
              backgroundColor: "var(--paper, #F7F5EF)",
              border: "1px solid var(--line, #DCD6C6)",
              color: "var(--ink, #14231C)",
              borderRadius: "8px",
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}