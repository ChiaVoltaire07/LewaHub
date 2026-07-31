import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../lib/api";

interface Program {
  id?: string;
  name: string;
  level: string;
  duration: string;
  tuition: number;
}

interface InstitutionData {
  name: string;
  type: string;
  level: string;
  description: string;
  region: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  website: string;
  contactEmail: string;
  contactPhone: string;
  verified: boolean;
  programs: Program[];
  imageUrl: string;
}

const emptyForm: InstitutionData = {
  name: "",
  type: "University",
  level: "University",
  description: "",
  region: "",
  city: "",
  address: "",
  latitude: 0,
  longitude: 0,
  website: "",
  contactEmail: "",
  contactPhone: "",
  verified: false,
  programs: [],
  imageUrl: "",
};

const LEVELS = ["Nursery", "Primary", "Secondary", "University"] as const;

export default function InstitutionFormPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<InstitutionData>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const data = await apiRequest<InstitutionData>(`/institutions/${id}`, {}, token || undefined);
        setForm({
          ...emptyForm,
          ...data,
          programs: data.programs || [],
        });
      } catch (err: any) {
        setError(err.message || "Failed to load institution");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, token]);

  const updateField = <K extends keyof InstitutionData>(key: K, value: InstitutionData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addProgram = () => {
    setForm((prev) => ({
      ...prev,
      programs: [...prev.programs, { name: "", level: "Bachelor", duration: "", tuition: 0 }],
    }));
  };

  const updateProgram = (idx: number, field: keyof Program, value: string | number) => {
    setForm((prev) => {
      const programs = [...prev.programs];
      programs[idx] = { ...programs[idx], [field]: value };
      return { ...prev, programs };
    });
  };

  const removeProgram = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      };
      if (isEdit) {
        await apiRequest(`/institutions/${id}`, { method: "PUT", body: payload }, token || undefined);
      } else {
        await apiRequest("/institutions", { method: "POST", body: payload }, token || undefined);
      }
      navigate("/admin/institutions");
    } catch (err: any) {
      setError(err.message || "Failed to save institution");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full" style={{ borderColor: "var(--forest, #1F5D45)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const renderAcademicFields = () => {
    if (form.level === "Nursery" || form.level === "Primary") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Age Range Accepted</label>
            <input
              type="text"
              value={(form as any).ageRange || ""}
              onChange={(e) => updateField("ageRange" as any, e.target.value)}
              placeholder="e.g. 3–6 years"
              className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Student-Teacher Ratio</label>
            <input
              type="text"
              value={(form as any).studentTeacherRatio || ""}
              onChange={(e) => updateField("studentTeacherRatio" as any, e.target.value)}
              placeholder="e.g. 1:8"
              className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Curriculum</label>
            <select
              value={(form as any).curriculum || ""}
              onChange={(e) => updateField("curriculum" as any, e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
            >
              <option value="">Select...</option>
              <option value="Anglophone">Anglophone</option>
              <option value="Francophone">Francophone</option>
              <option value="Bilingual">Bilingual</option>
            </select>
          </div>
          {(form.level === "Nursery" || form.level === "Primary") && (
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Annual Fee</label>
              <input
                type="number"
                value={(form as any).annualFee || ""}
                onChange={(e) => updateField("annualFee" as any, e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
              />
            </div>
          )}
        </div>
      );
    }

    if (form.level === "Secondary") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Classes Offered</label>
            <div className="flex flex-wrap gap-2">
              {["Form 1", "Form 2", "Form 3", "Form 4", "Form 5"].map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm" style={{ color: "var(--ink, #14231C)" }}>
                  <input
                    type="checkbox"
                    checked={((form as any).classesOffered || []).includes(c)}
                    onChange={(e) => {
                      const current = (form as any).classesOffered || [];
                      updateField("classesOffered" as any, e.target.checked ? [...current, c] : current.filter((x: string) => x !== c));
                    }}
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Curriculum</label>
            <select
              value={(form as any).curriculum || ""}
              onChange={(e) => updateField("curriculum" as any, e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
            >
              <option value="">Select...</option>
              <option value="Anglophone">Anglophone</option>
              <option value="Francophone">Francophone</option>
              <option value="Bilingual">Bilingual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Annual Fee</label>
            <input
              type="number"
              value={(form as any).annualFee || ""}
              onChange={(e) => updateField("annualFee" as any, e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Program Type</label>
            <select
              value={(form as any).programType || ""}
              onChange={(e) => updateField("programType" as any, e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
            >
              <option value="">Select...</option>
              <option value="Day">Day</option>
              <option value="Boarding">Boarding</option>
            </select>
          </div>
        </div>
      );
    }

    if (form.level === "University") {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" style={{ color: "var(--ink, #14231C)" }}>Programs</label>
            <button
              type="button"
              onClick={addProgram}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: "var(--forest, #1F5D45)", backgroundColor: "rgba(31, 93, 69, 0.1)", borderRadius: "8px" }}
            >
              + Add program
            </button>
          </div>
          {form.programs.length === 0 && (
            <p className="text-xs" style={{ color: "var(--ink, #14231C)", opacity: 0.5 }}>No programs added yet.</p>
          )}
          <div className="space-y-2">
            {form.programs.map((prog, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg"
                style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)" }}
              >
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Program name"
                    value={prog.name}
                    onChange={(e) => updateProgram(idx, "name", e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg outline-none"
                    style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                  />
                  <input
                    type="text"
                    placeholder="Level"
                    value={prog.level}
                    onChange={(e) => updateProgram(idx, "level", e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg outline-none"
                    style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Duration"
                    value={prog.duration}
                    onChange={(e) => updateProgram(idx, "duration", e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg outline-none"
                    style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Tuition"
                      value={prog.tuition}
                      onChange={(e) => updateProgram(idx, "tuition", parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg outline-none"
                      style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeProgram(idx)}
                      className="px-2 py-1.5 text-xs font-medium rounded-lg text-white"
                      style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--ink, #14231C)", fontFamily: "Fraunces, serif" }}>
            {isEdit ? form.name || "Edit Institution" : "Add New Institution"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>
            {isEdit ? "Update the details below." : "Fill in the details to create a new listing."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/institutions")}
            className="px-4 py-2 text-sm font-medium rounded-lg"
            style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-60"
            style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg text-sm mb-4" style={{ backgroundColor: "rgba(186, 26, 26, 0.1)", color: "var(--sienna, #C1572B)", borderRadius: "8px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", borderRadius: "14px" }}
          >
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--ink, #14231C)" }}>Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>School Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Level</label>
                <select
                  value={form.level}
                  onChange={(e) => updateField("level", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => updateField("type", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                >
                  <option value="University">University</option>
                  <option value="Institute">Institute</option>
                  <option value="College">College</option>
                  <option value="Polytechnic">Polytechnic</option>
                  <option value="High School">High School</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Region</label>
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => updateField("region", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm rounded-lg outline-none resize-y"
                  style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                />
              </div>
            </div>
          </div>

          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", borderRadius: "14px" }}
          >
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--ink, #14231C)" }}>Academic Details</h2>
            {renderAcademicFields()}
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", borderRadius: "14px" }}
          >
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--ink, #14231C)" }}>Media</h2>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Featured Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => updateField("imageUrl", e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
            />
          </div>

          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", borderRadius: "14px" }}
          >
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--ink, #14231C)" }}>Location</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => updateField("latitude", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => updateField("longitude", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                  style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
                />
              </div>
            </div>
          </div>

          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", borderRadius: "14px" }}
          >
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--ink, #14231C)" }}>Status</h2>
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(e) => updateField("verified", e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: "var(--forest, #1F5D45)" }}
              />
              <span className="text-sm" style={{ color: "var(--ink, #14231C)" }}>Verified</span>
            </label>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-2.5 text-sm font-semibold text-white rounded-lg disabled:opacity-60"
                style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
              >
                {saving ? "Saving..." : isEdit ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/institutions")}
                className="px-4 py-2.5 text-sm font-medium rounded-lg"
                style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}