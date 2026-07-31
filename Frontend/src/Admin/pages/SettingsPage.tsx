import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../lib/api";

export default function SettingsPage() {
  const { token, admin } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!token) return;
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await apiRequest("/admin/settings/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      }, token);
      setSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--ink, #14231C)", fontFamily: "Fraunces, serif" }}>Settings</h1>
      <div className="max-w-lg">
        <div className="p-5 rounded-xl" style={{ backgroundColor: "var(--paper-deep, #EFEBDF)", border: "1px solid var(--line, #DCD6C6)", borderRadius: "14px" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--ink, #14231C)" }}>Change Password</h2>
          {error && (
            <div className="p-3 rounded-lg text-sm mb-4" style={{ backgroundColor: "rgba(186, 26, 26, 0.1)", color: "var(--sienna, #C1572B)", borderRadius: "8px" }}>
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-lg text-sm mb-4" style={{ backgroundColor: "rgba(31, 93, 69, 0.1)", color: "var(--forest, #1F5D45)", borderRadius: "8px" }}>
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-lg outline-none"
                style={{ backgroundColor: "var(--paper, #F7F5EF)", border: "1px solid var(--line, #DCD6C6)", color: "var(--ink, #14231C)", borderRadius: "8px" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg disabled:opacity-60"
              style={{ backgroundColor: "var(--sienna, #C1572B)", borderRadius: "8px" }}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}