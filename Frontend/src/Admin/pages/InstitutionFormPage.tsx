import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../lib/api";

interface Program {
  name: string;
  level: string;
  duration: string;
  tuition: number;
}

interface InstitutionData {
  name: string;
  type: string;
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
}

const emptyForm: InstitutionData = {
  name: "",
  type: "University",
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
};

export default function InstitutionFormPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<InstitutionData>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const data = await apiRequest<InstitutionData>(`/institutions/${id}`, {}, token || undefined);
        setForm(data);
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
      programs: [...prev.programs, { name: "", level: "", duration: "", tuition: 0 }],
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
      if (isEdit) {
        await apiRequest(`/institutions/${id}`, { method: "PUT", body: JSON.stringify(form) }, token || undefined);
      } else {
        await apiRequest("/institutions", { method: "POST", body: JSON.stringify(form) }, token || undefined);
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--ink, #14231C)", fontFamily: "Fraunces, serif" }}>
        {isEdit ? "Edit Institution" : "Add Institution"}
      </h1>

      {error && (
        <div className="p-4 rounded-lg text-sm mb-4" style={{ backgroundColor: "rgba(186, 26, 26, 0.1)", color: "var(--sienna, #C1572B)", borderRadius: "8px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
            className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
            style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Type</label>
          <select
            value={form.type}
            onChange={(e) => updateField("type", e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
            style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
          >
            <option value="University">University</option>
            <option value="Institute">Institute</option>
            <option value="College">College</option>
            <option value="Polytechnic">Polytechnic</option>
            <option value="High School">High School</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 text-sm rounded-lg outline-none resize-y"
            style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Region</label>
            <input
              type="text"
              value={form.region}
              onChange={(e) => updateField("region", e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
            style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Latitude</label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => updateField("latitude", parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
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
              style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Website</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => updateField("website", e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
            style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Contact Email</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Contact Phone</label>
            <input
              type="tel"
              value={form.contactPhone}
              onChange={(e) => updateField("contactPhone", e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
              style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.verified}
            onChange={(e) => updateField("verified", e.target.checked)}
            className="w-4 h-4 rounded"
            style={{ accentColor: "var(--forest, #1F5D45)" }}
          />
          <span className="text-sm" style={{ color: "var(--ink, #14231C)" }}>Verified</span>
        </label>

        {/* Programs section */}
        <div>
          <div className="flex items-center justify-between mb-2">
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

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg min-h-[44px] disabled:opacity-60 transition-colors"
            style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/institutions")}
            className="px-6 py-2.5 text-sm font-medium rounded-lg min-h-[44px] transition-colors"
            style={{
              backgroundColor: "var(--paper-deep, #EFEBDF)",
              border: "1px solid var(--line, #DCD6C6)",
              color: "var(--ink, #14231C)",
              borderRadius: "8px",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}