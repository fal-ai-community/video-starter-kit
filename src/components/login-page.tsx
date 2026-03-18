"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    // If the user is already authenticated, redirect them to the app
    // so they are not logged out if they visit the outside page
    if (localStorage.getItem("gostudio_auth") === "true") {
      router.replace("/en/app");
      return;
    }

    // If the email is passed from GoStudio, auto-fill it
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }

    setIsCheckingAuth(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("gostudio_auth", "true");
        localStorage.setItem("gostudio_user", email);
        router.push("/en/app");
      } else {
        setError(data.error || "Invalid email or password. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleRequestAccess = async (e: React.MouseEvent) => {
    e.preventDefault();
    setRequestSuccess(false);

    if (!email) {
      setError("Please enter your email to request access.");
      return;
    }

    setError("");
    setRequestingAccess(true);

    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setRequestSuccess(true);
      } else {
        setError("Failed to send request. Please try again.");
      }
    } catch (err) {
      setError("Failed to send request. Server error.");
    } finally {
      setRequestingAccess(false);
    }
  };

  // Show blank screen while checking auth — prevents flash of login form
  if (isCheckingAuth) {
    return <div style={{ minHeight: "100vh", background: "#ffffff" }} />;
  }

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-blob login-bg-blob-1" />
        <div className="login-bg-blob login-bg-blob-2" />
        <div className="login-bg-blob login-bg-blob-3" />
      </div>

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-wrap">
          <Image
            src="https://gostudio-web-cdn.b-cdn.net/public/99.svg"
            alt="GoStudio"
            width={48}
            height={48}
            className="login-logo"
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="login-title">Sign In</h1>
        <p className="login-subtitle">
          Sign in to access the gostudio workflow
        </p>

        {/* Error */}
        {error && (
          <div className="login-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="login-error-icon"
            >
              <title>Error</title>
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Success */}
        {requestSuccess && (
          <div className="login-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="login-success-icon"
            >
              <title>Success</title>
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Access request sent! We will contact you shortly.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email */}
          <div className="login-field">
            <label htmlFor="login-email" className="login-label">
              Email / Username
            </label>
            <input
              id="login-email"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gostudio"
              className="login-input"
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="login-password" className="login-label">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required={!requestingAccess} // not required if just requesting access
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="login-input"
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || requestingAccess}
            className="login-btn"
          >
            {loading ? (
              <span className="login-btn-loading">
                <svg
                  className="login-spinner"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <title>Loading</title>
                  <circle
                    className="login-spinner-track"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="login-spinner-head"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Request Access */}
          <button
            type="button"
            onClick={handleRequestAccess}
            disabled={requestingAccess || loading || requestSuccess}
            className="login-btn-outline"
          >
            {requestingAccess ? (
              <span className="login-btn-loading">
                <svg
                  className="login-spinner"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <title>Loading</title>
                  <circle
                    className="login-spinner-track"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="login-spinner-head"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Requesting...
              </span>
            ) : requestSuccess ? (
              "Access Requested!"
            ) : (
              "Request Access"
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        /* ── Page ──────────────────────────────────────── */
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* ── Card ──────────────────────────────────────── */
        .login-card {
          width: 100%;
          max-width: 400px;
          background: #ffffff;
          border-radius: 12px;
          padding: 2.5rem 2.5rem;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          border: 1px solid #f0f0f0;
        }

        /* ── Logo ──────────────────────────────────────── */
        .login-logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 0.5rem;
          align-items: center;
        }

        /* ── Typography ────────────────────────────────── */
        .login-title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: #000000;
          margin: 0 0 0.5rem;
        }
        .login-subtitle {
          text-align: center;
          font-size: 0.85rem;
          color: #888888;
          margin: 0 0 1.5rem;
        }

        /* ── Error & Success ────────────────────────────── */
        .login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
          margin-bottom: 1.25rem;
          color: #dc2626;
          font-size: 0.82rem;
          font-weight: 500;
        }
        .login-error-icon {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
        }

        .login-success {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
          margin-bottom: 1.25rem;
          color: #16a34a;
          font-size: 0.82rem;
          font-weight: 500;
        }
        .login-success-icon {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
        }

        /* ── Form ──────────────────────────────────────── */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .login-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #111111;
        }
        .login-input {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1px solid #e0e5f0;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #222222;
          background: #f4f7ff;
          outline: none;
          transition: border-color 0.2s;
        }
        .login-input::placeholder {
          color: #999999;
          font-size: 1.2rem;
          transform: translateY(2px);
        }
        .login-input:focus {
          border-color: #bbccff;
          background: #f0f4ff;
        }

        /* ── Button ────────────────────────────────────── */
        .login-btn {
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.75rem;
          background: #171717;
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .login-btn:hover:not(:disabled) {
          background: #000000;
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-btn-outline {
          width: 100%;
          padding: 0.75rem;
          background: transparent;
          color: #222222;
          font-size: 0.9rem;
          font-weight: 500;
          border: 1px solid #e0e5f0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          text-decoration: none;
          display: inline-block;
        }
        .login-btn-outline:hover {
          background: #f8fafc;
          color: #000000;
          border-color: #cbd5e1;
        }

        /* ── Loading spinner ───────────────────────────── */
        .login-btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .login-spinner {
          width: 1rem;
          height: 1rem;
          animation: spin 0.8s linear infinite;
        }
        .login-spinner-track {
          opacity: 0.3;
        }
        .login-spinner-head {
          opacity: 0.9;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
