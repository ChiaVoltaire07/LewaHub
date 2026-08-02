import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { recordEvaluation, verifyStudent, listSchools } from "../lib/api";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface School {
  id: string;
  name: string;
}

interface AggregateRating {
  average: number;
  count: number;
}

export default function EvaluationsPage() {
  const { token } = useAuth();

  // Step 1: Verify student
  const [studentName, setStudentName] = useState("");
  const [verificationType, setVerificationType] = useState("email");
  const [verificationValue, setVerificationValue] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  // School picker
  const [schoolSearch, setSchoolSearch] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [searchingInst, setSearchingInst] = useState(false);

  // Step 2: Record evaluation
  const [score, setScore] = useState<number>(5);
  const [notes, setNotes] = useState("");
  const [aggregate, setAggregate] = useState<AggregateRating | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerifyStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError("");
    setVerifying(true);
    setStudent(null);
    try {
      const response = await verifyStudent(
        verificationType === "email" ? verificationValue : undefined,
        verificationType === "phone" ? verificationValue : undefined
      );

      if (response.error) {
        setVerifyError(response.error);
      } else {
        setStudent({
          id: verificationValue,
          name: studentName,
          email: verificationValue === "email" ? verificationValue : "",
        });
      }
    } catch (err: any) {
      setVerifyError(err.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const searchSchools = async (query: string) => {
    setSchoolSearch(query);
    if (!query.trim()) {
      setSchools([]);
      return;
    }
    if (!token) return;

    setSearchingInst(true);
    try {
      const response = await listSchools(token, {
        search: query,
        limit: 10,
      });

      if (!response.error && response.data) {
        const data = response.data as any;
        setSchools((data.data || data || []).slice(0, 10).map((s: any) => ({
          id: s.id,
          name: s.name,
        })));
      }
    } catch {
      // silently fail
    } finally {
      setSearchingInst(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !selectedSchool || !token) return;
    setSaveError("");
    setSuccess("");
    setSaving(true);
    try {
      const response = await recordEvaluation(
        student.id,
        selectedSchool.id,
        score,
        notes,
        token
      );

      if (response.error) {
        setSaveError(response.error);
      } else {
        setSuccess("Evaluation recorded successfully!");
        setAggregate(response.aggregate);
        // Reset form
        setTimeout(() => {
          setStudent(null);
          setSelectedSchool(null);
          setScore(5);
          setNotes("");
          setSuccess("");
        }, 2000);
      }
    } catch (err: any) {
      setSaveError(err.message || "Failed to save evaluation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--ink, #14231C)", fontFamily: "Fraunces, serif" }}>
        Record Evaluation
      </h1>

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
          {aggregate && (
            <div className="mt-2 text-xs">
              School aggregate rating: <strong>{aggregate.average.toFixed(1)}</strong> ({aggregate.count} evaluations)
            </div>
          )}
        </div>
      )}

      <div className="max-w-lg space-y-8">
        {/* Step 1: Verify Student */}
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", borderRadius: "14px" }}
        >
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--ink, #14231C)" }}>
            Step 1: Verify Student
          </h2>
          <form onSubmit={handleVerifyStudent} className="space-y-4">
            {verifyError && (
              <div
                className="p-3 rounded-lg text-xs"
                style={{
                  backgroundColor: "rgba(186, 26, 26, 0.1)",
                  color: "var(--sienna, #C1572B)",
                  borderRadius: "8px",
                }}
              >
                {verifyError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>
                Student Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                style={{
                  backgroundColor: "var(--paper, #F7F5EF)",
                  border: "1px solid var(--line, #DCD6C6)",
                  color: "var(--ink, #14231C)",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>
                Verification Type
              </label>
              <select
                value={verificationType}
                onChange={(e) => setVerificationType(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                style={{
                  backgroundColor: "var(--paper, #F7F5EF)",
                  border: "1px solid var(--line, #DCD6C6)",
                  color: "var(--ink, #14231C)",
                  borderRadius: "8px",
                }}
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>
                Verification Value
              </label>
              <input
                type="text"
                value={verificationValue}
                onChange={(e) => setVerificationValue(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                style={{
                  backgroundColor: "var(--paper, #F7F5EF)",
                  border: "1px solid var(--line, #DCD6C6)",
                  color: "var(--ink, #14231C)",
                  borderRadius: "8px",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={verifying}
              className="w-full py-2.5 text-sm font-semibold text-white rounded-lg min-h-[44px] disabled:opacity-60 transition-colors"
              style={{ backgroundColor: "var(--forest, #1F5D45)", borderRadius: "8px" }}
            >
              {verifying ? "Verifying..." : "Verify Student"}
            </button>
          </form>
          {student && (
            <div
              className="mt-4 p-3 rounded-lg text-sm"
              style={{
                backgroundColor: "rgba(31, 93, 69, 0.1)",
                color: "var(--forest, #1F5D45)",
                borderRadius: "8px",
              }}
            >
              Verified: {student.name} ({student.email})
            </div>
          )}
        </div>

        <hr style={{ borderColor: "var(--line, #DCD6C6)" }} />

        {/* Step 2: Record Evaluation */}
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", borderRadius: "14px" }}
        >
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--ink, #14231C)" }}>
            Step 2: Record Score
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {saveError && (
              <div
                className="p-3 rounded-lg text-xs"
                style={{
                  backgroundColor: "rgba(186, 26, 26, 0.1)",
                  color: "var(--sienna, #C1572B)",
                  borderRadius: "8px",
                }}
              >
                {saveError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>
                School
              </label>
              <input
                type="text"
                placeholder="Search schools..."
                value={schoolSearch}
                onChange={(e) => searchSchools(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                style={{
                  backgroundColor: "var(--paper, #F7F5EF)",
                  border: "1px solid var(--line, #DCD6C6)",
                  color: "var(--ink, #14231C)",
                  borderRadius: "8px",
                }}
              />
              {searchingInst && (
                <div className="text-xs mt-1" style={{ color: "var(--ink, #14231C)", opacity: 0.5 }}>
                  Searching...
                </div>
              )}
              {schools.length > 0 && (
                <div
                  className="mt-1 rounded-lg overflow-hidden"
                  style={{ border: "1px solid var(--line, #DCD6C6)" }}
                >
                  {schools.map((school) => (
                    <button
                      key={school.id}
                      type="button"
                      onClick={() => {
                        setSelectedSchool(school);
                        setSchoolSearch(school.name);
                        setSchools([]);
                      }}
                      className="w-full text-left px-4 py-2 text-sm transition-colors"
                      style={{
                        backgroundColor: "var(--paper, #F7F5EF)",
                        color: "var(--ink, #14231C)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--paper-deep, #EFEBDF)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--paper, #F7F5EF)")}
                    >
                      {school.name}
                    </button>
                  ))}
                </div>
              )}
              {selectedSchool && (
                <div
                  className="mt-2 p-2 rounded-lg text-xs"
                  style={{
                    backgroundColor: "rgba(31, 93, 69, 0.1)",
                    color: "var(--forest, #1F5D45)",
                    borderRadius: "8px",
                  }}
                >
                  Selected: {selectedSchool.name}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>
                Score (1-10)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value) || 5)}
                className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                style={{
                  backgroundColor: "var(--paper, #F7F5EF)",
                  border: "1px solid var(--line, #DCD6C6)",
                  color: "var(--ink, #14231C)",
                  borderRadius: "8px",
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 text-sm rounded-lg outline-none resize-y"
                style={{
                  backgroundColor: "var(--paper, #F7F5EF)",
                  border: "1px solid var(--line, #DCD6C6)",
                  color: "var(--ink, #14231C)",
                  borderRadius: "8px",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={saving || !student || !selectedSchool}
              className="w-full py-2.5 text-sm font-semibold text-white rounded-lg min-h-[44px] disabled:opacity-60 transition-colors"
              style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
            >
              {saving ? "Saving..." : "Record Evaluation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}