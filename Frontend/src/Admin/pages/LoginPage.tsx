import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="w-full max-w-[420px]">
        {/* Wordmark above card */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--forest, #1F5D45)", fontFamily: "Fraunces, serif" }}>
            LewaHub
          </h1>
          <div className="w-12 h-1 mx-auto mt-2" style={{ backgroundColor: "var(--forest, #1F5D45)" }} />
        </div>

        <div
          className="w-full p-8"
          style={{
            backgroundColor: "var(--paper-deep, #EFEBDF)",
            borderRadius: "14px",
            border: "1px solid var(--line, #DCD6C6)",
          }}
        >
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--ink, #14231C)", fontFamily: "Fraunces, serif" }}
          >
            Staff Access
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--ink, #14231C)", opacity: 0.7 }}>
            Sign in to manage your institutions
          </p>

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
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>
                Institutional Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink, #14231C)", opacity: 0.5 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4L12 13L2 4" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-3 text-sm rounded-lg outline-none transition-colors"
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
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink, #14231C)" }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink, #14231C)", opacity: 0.5 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-3 text-sm rounded-lg outline-none transition-colors"
                  style={{
                    backgroundColor: "var(--paper, #F7F5EF)",
                    border: "1px solid var(--line, #DCD6C6)",
                    color: "var(--ink, #14231C)",
                    borderRadius: "8px",
                  }}
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px var(--forest, #1F5D45)")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--ink, #14231C)", opacity: 0.5 }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
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
                Keep me signed in for 30 days
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

          {/* Security note */}
          <div className="flex items-center gap-2 mt-6 text-xs" style={{ color: "var(--ink, #14231C)", opacity: 0.6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Your connection is encrypted. Never share your credentials.</span>
          </div>
        </div>
      </div>
    </div>
  );
}