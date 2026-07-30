import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, keepSignedIn);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message === "UNAUTHORIZED" ? "Invalid email or password" : err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--paper, #F7F5EF)" }}
    >
      <div
        className="w-full max-w-sm p-8"
        style={{
          backgroundColor: "var(--paper-deep, #EFEBDF)",
          borderRadius: "14px",
          border: "1px solid var(--line, #DCD6C6)",
        }}
      >
        <h1
          className="text-2xl font-bold mb-8 text-center"
          style={{ color: "var(--ink, #14231C)", fontFamily: "Fraunces, serif" }}
        >
          Sign in
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              className="text-sm p-3 rounded-lg"
              style={{
                backgroundColor: "rgba(186, 26, 26, 0.1)",
                color: "var(--sienna, #C1572B)",
                borderRadius: "8px",
              }}
            >
              {error}
            </div>
          )}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--ink, #14231C)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm rounded-lg outline-none transition-colors"
              style={{
                backgroundColor: "var(--paper, #F7F5EF)",
                border: "1px solid var(--line, #DCD6C6)",
                color: "var(--ink, #14231C)",
                borderRadius: "8px",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--forest, #1F5D45)")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--ink, #14231C)" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm rounded-lg outline-none transition-colors"
              style={{
                backgroundColor: "var(--paper, #F7F5EF)",
                border: "1px solid var(--line, #DCD6C6)",
                color: "var(--ink, #14231C)",
                borderRadius: "8px",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--forest, #1F5D45)")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: "var(--forest, #1F5D45)" }}
            />
            <span className="text-sm" style={{ color: "var(--ink, #14231C)" }}>
              Keep me signed in
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-60"
            style={{
              backgroundColor: "var(--sienna, #C1572B)",
              borderRadius: "8px",
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "var(--forest-dark, #163F30)")}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "var(--sienna, #C1572B)")}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}