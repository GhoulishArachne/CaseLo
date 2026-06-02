import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./LoginForm.css";

export const LoginForm = () => {
  const { login, signup, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Email and password are required");
      return;
    }

    const result = isSignup
      ? await signup(email, password)
      : await login(email, password);

    if (result.error) {
      setLocalError(result.error.message || "Authentication failed");
    } else {
      // Clear form on success
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Case Logger</h1>
        <p className="subtitle">Internal Affairs Investigation System</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {(error || localError) && (
            <div className="error-message">
              {error || localError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading
              ? "Loading..."
              : isSignup
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <div className="toggle-auth">
          <p>
            {isSignup ? "Already have an account?" : "Need an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setLocalError("");
              }}
              className="toggle-button"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
