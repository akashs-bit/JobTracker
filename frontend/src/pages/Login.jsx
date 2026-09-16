import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Briefcase,
  ArrowRight,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://jobtrackerapp.rf.gd/backend/api/auth/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error("Invalid PHP response:", text);

        throw new Error(
          "Server returned an invalid response. Please check your PHP backend."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed.");
      }

      /*
      |--------------------------------------------------------------------------
      | Get logged-in user
      |--------------------------------------------------------------------------
      */

      const user = data.user;

      if (!user || !user.id) {
        throw new Error("Invalid user data received from server.");
      }

      /*
      |--------------------------------------------------------------------------
      | Save login information
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "jobtracker_user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "jobtracker_logged_in",
        "true"
      );

      if (rememberMe) {
        localStorage.setItem(
          "jobtracker_remember",
          "true"
        );
      } else {
        localStorage.removeItem(
          "jobtracker_remember"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | ROLE BASED REDIRECT
      |--------------------------------------------------------------------------
      */

      if (user.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        /*
        | User login
        */

        const from =
          location.state?.from || "/dashboard";

        navigate(from, {
          replace: true,
        });
      }

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 flex items-center justify-center px-4 py-10">

      {/* Background decoration */}
      <div className="fixed -top-32 -left-32 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="fixed -bottom-32 -right-32 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-7">
          <Link
            to="/"
            className="inline-flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Briefcase className="w-6 h-6 text-white" />
            </div>

            <span className="text-2xl font-black text-slate-900">
              Job<span className="text-blue-600">Tracker</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl shadow-slate-400/20 p-6 sm:p-9">

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 mb-4">
              <LogIn className="w-7 h-7 text-blue-600" />
            </div>

            <h1 className="text-3xl font-black text-slate-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-slate-500">
              Login to continue your job search.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center justify-between gap-3">

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-slate-600">
                  Remember me
                </span>
              </label>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white font-bold shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            Your account information is secure
          </div>

          {/* Register */}
          <div className="text-center mt-7 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Create Account
              </Link>
            </p>
          </div>

        </div>

        {/* Back Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;