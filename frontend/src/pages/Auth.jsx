import { useContext, useMemo, useState } from "react";
import { login, register } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function AuthPage() {
  const { saveToken } = useContext(AuthContext);

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const passwordMinLength = 6;
  const passwordLongEnough = password.length >= passwordMinLength;
  const passwordsMatch = password === confirmPassword;

  const signupDisabled = useMemo(() => {
    if (loading) return true;
    if (!email || !password || !confirmPassword) return true;
    if (!passwordLongEnough) return true;
    if (!passwordsMatch) return true;
    return false;
  }, [
    loading,
    email,
    password,
    confirmPassword,
    passwordLongEnough,
    passwordsMatch,
  ]);

  const loginDisabled = useMemo(() => {
    return loading || !email || !password;
  }, [loading, email, password]);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    resetMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!isLogin && !passwordLongEnough) {
      setError(
        `Password must be at least ${passwordMinLength} characters long.`,
      );
      return;
    }

    if (!isLogin && !passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        const data = await login({ email, password });

        if (data.token) {
          saveToken(data.token);
        } else {
          setError(data.error || "Login failed.");
        }
      } else {
        const data = await register({ email, password });

        if (data.user?.id || data.id) {
          setSuccess("Account created successfully. Please log in.");
          setMode("login");
          setPassword("");
          setConfirmPassword("");
          setShowPassword(false);
          setShowConfirmPassword(false);
        } else {
          setError(data.error || "Sign up failed.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordInputClasses = `w-full border rounded-lg p-3 pr-20 focus:outline-none focus:ring-2 ${
    !isLogin && password && !passwordLongEnough
      ? "border-red-300 focus:ring-red-300"
      : "border-gray-300 focus:ring-emerald-400"
  }`;

  const confirmPasswordInputClasses = `w-full border rounded-lg p-3 pr-20 focus:outline-none focus:ring-2 ${
    !isLogin && confirmPassword && !passwordsMatch
      ? "border-red-300 focus:ring-red-300"
      : "border-gray-300 focus:ring-emerald-400"
  }`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Brand / Logo Area */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-bold shadow">
            EP
          </div>

          <h1 className="text-3xl font-bold text-gray-800">Every Penni</h1>
          <p className="text-gray-500 mt-2">Every penni counts.</p>
        </div>

        {/* Mode Switch */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => handleModeChange("login")}
            className={`w-1/2 py-2 rounded-md text-sm font-medium transition ${
              isLogin ? "bg-white shadow text-gray-800" : "text-gray-500"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("signup")}
            className={`w-1/2 py-2 rounded-md text-sm font-medium transition ${
              !isLogin ? "bg-white shadow text-gray-800" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={passwordInputClasses}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-emerald-500 hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {!isLogin && (
              <p
                className={`mt-2 text-xs ${password && !passwordLongEnough ? "text-red-500" : "text-gray-500"}`}
              >
                Password must be at least {passwordMinLength} characters.
              </p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={confirmPasswordInputClasses}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-emerald-500 hover:underline"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {confirmPassword && (
                <p
                  className={`mt-2 text-xs ${passwordsMatch ? "text-green-600" : "text-red-500"}`}
                >
                  {passwordsMatch
                    ? "Passwords match."
                    : "Passwords do not match."}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLogin ? loginDisabled : signupDisabled}
            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-medium hover:bg-emerald-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Creating account..."
              : isLogin
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => handleModeChange(isLogin ? "signup" : "login")}
            className="text-emerald-500 hover:underline font-medium"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
