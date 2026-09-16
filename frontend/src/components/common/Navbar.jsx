import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  Search,
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  UserPlus,
  ArrowRight,
  User,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Real login state
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("jobtracker_logged_in") === "true"
  );

  // Current logged-in user
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("jobtracker_user") || "null"
      );
    } catch {
      return null;
    }
  });

  const isAdmin = user?.role === "admin";

  /* =====================================================
     CHECK LOGIN STATUS
  ===================================================== */

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn =
        localStorage.getItem("jobtracker_logged_in") === "true";

      setIsLoggedIn(loggedIn);

      try {
        setUser(
          JSON.parse(
            localStorage.getItem("jobtracker_user") || "null"
          )
        );
      } catch {
        setUser(null);
      }
    };

    checkLoginStatus();

    // Detect localStorage changes
    window.addEventListener("storage", checkLoginStatus);

    // Check again when browser/tab gets focus
    window.addEventListener("focus", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("focus", checkLoginStatus);
    };
  }, []);

  /* =====================================================
     CHECK LOGIN WHEN ROUTE CHANGES
  ===================================================== */

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("jobtracker_logged_in") === "true";

    setIsLoggedIn(loggedIn);

    try {
      setUser(
        JSON.parse(
          localStorage.getItem("jobtracker_user") || "null"
        )
      );
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  /* =====================================================
     CLOSE MOBILE MENU
  ===================================================== */

  const closeMobile = () => {
    setMobileOpen(false);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("jobtracker_logged_in");
    localStorage.removeItem("jobtracker_user");
    localStorage.removeItem("jobtracker_remember");

    // Update navbar immediately
    setIsLoggedIn(false);
    setUser(null);

    // Close mobile menu
    setMobileOpen(false);

    // Redirect to login
    navigate("/login", { replace: true });
  };

  /* =====================================================
     NAV LINK STYLE
  ===================================================== */

  const navLinkClass = ({ isActive }) =>
    `
      relative flex items-center gap-1.5 rounded-lg
      px-3 py-2 text-sm font-medium
      transition-all duration-200
      ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
      }
    `;

  /* =====================================================
     CLOSE MOBILE MENU AFTER ROUTE CHANGE
  ===================================================== */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      {/* =================================================
          NAVBAR
      ================================================= */}

      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          onClick={closeMobile}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div
            className="
              flex h-9 w-9 items-center justify-center
              rounded-xl
              bg-gradient-to-br from-blue-500 to-blue-700
              shadow-md shadow-blue-500/20
              transition-all duration-300
              group-hover:scale-105
              group-hover:-rotate-3
            "
          >
            <BriefcaseBusiness
              size={21}
              strokeWidth={2.3}
              className="text-white"
            />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-[22px]">
            Job<span className="text-blue-600">Tracker</span>
          </span>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/jobs" className={navLinkClass}>
            Jobs
          </NavLink>

          <NavLink to="/features" className={navLinkClass}>
            Features
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>

          {/* DASHBOARD ONLY AFTER LOGIN */}

          {isLoggedIn && (
            <NavLink
              to={isAdmin ? "/admin" : "/dashboard"}
              className={({ isActive }) =>
                `
                  flex items-center gap-1.5 rounded-lg
                  px-3 py-2 text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }
                `
              }
            >
              <LayoutDashboard size={16} />
              {isAdmin ? "Admin Dashboard" : "Dashboard"}
            </NavLink>
          )}
        </nav>

        {/* =================================================
            DESKTOP RIGHT
        ================================================= */}

        <div className="hidden items-center gap-2.5 lg:flex">
          {/* SEARCH */}

          <Link
            to="/jobs/search"
            aria-label="Search jobs"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full text-slate-500
              transition-all duration-200
              hover:bg-blue-50 hover:text-blue-600
            "
          >
            <Search size={18} />
          </Link>

          <div className="mx-1 h-6 w-px bg-slate-200" />

          {/* =================================================
              LOGGED OUT
          ================================================= */}

          {!isLoggedIn && (
            <>
              {/* LOGIN */}

              <Link
                to="/login"
                className="
                  inline-flex items-center gap-2
                  rounded-xl border border-blue-200
                  bg-white px-4 py-2.5
                  text-sm font-semibold text-blue-600
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:border-blue-300
                  hover:bg-blue-50
                "
              >
                <LogIn size={16} />
                Login
              </Link>

              {/* SIGN UP */}

              <Link
                to="/register"
                className="
                  inline-flex items-center gap-2
                  rounded-xl
                  bg-gradient-to-r from-blue-600 to-blue-500
                  px-5 py-2.5
                  text-sm font-semibold text-white
                  shadow-md shadow-blue-500/20
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:from-blue-700
                  hover:to-blue-600
                  hover:shadow-lg
                  hover:shadow-blue-500/30
                "
              >
                Sign Up
                <ArrowRight size={16} />
              </Link>
            </>
          )}

          {/* =================================================
              LOGGED IN
          ================================================= */}

          {isLoggedIn && (
            <>
              {/* DASHBOARD */}

              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                className="
                  inline-flex items-center gap-2
                  rounded-xl
                  bg-blue-600 px-4 py-2.5
                  text-sm font-semibold text-white
                  shadow-md shadow-blue-500/20
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-blue-700
                "
              >
                <LayoutDashboard size={16} />
                {isAdmin ? "Admin Dashboard" : "Dashboard"}
              </Link>

              {/* PROFILE - USER ONLY */}

              {!isAdmin && (
                <Link
                  to="/dashboard/profile"
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  border border-slate-200
                  bg-slate-50
                  text-slate-600
                  transition-all duration-200
                  hover:border-blue-200
                  hover:bg-blue-50
                  hover:text-blue-600
                "
                aria-label="Profile"
              >
                <User size={18} />
                </Link>
              )}

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  inline-flex items-center gap-2
                  rounded-xl
                  px-3 py-2.5
                  text-sm font-semibold
                  text-slate-500
                  transition-all duration-200
                  hover:bg-red-50
                  hover:text-red-500
                "
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-slate-200
            bg-white text-slate-700 shadow-sm
            transition-all duration-200
            hover:border-blue-200
            hover:bg-blue-50
            hover:text-blue-600
            lg:hidden
          "
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ===================================================
          MOBILE MENU
      =================================================== */}

      <div
        className={`
          overflow-hidden border-t border-slate-200
          bg-white transition-all duration-300 lg:hidden
          ${
            mobileOpen
              ? "max-h-[700px] opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          {/* =================================================
              MOBILE LINKS
          ================================================= */}

          <div className="space-y-1">
            <NavLink
              to="/"
              onClick={closeMobile}
              className={({ isActive }) => `
                flex items-center rounded-xl
                px-4 py-3 text-sm font-semibold
                transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              Home
            </NavLink>

            <NavLink
              to="/jobs"
              onClick={closeMobile}
              className={({ isActive }) => `
                flex items-center rounded-xl
                px-4 py-3 text-sm font-semibold
                transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              <BriefcaseBusiness size={17} className="mr-2" />
              Jobs
            </NavLink>

            <NavLink
              to="/features"
              onClick={closeMobile}
              className={({ isActive }) => `
                flex items-center rounded-xl
                px-4 py-3 text-sm font-semibold
                transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              Features
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMobile}
              className={({ isActive }) => `
                flex items-center rounded-xl
                px-4 py-3 text-sm font-semibold
                transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeMobile}
              className={({ isActive }) => `
                flex items-center rounded-xl
                px-4 py-3 text-sm font-semibold
                transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              Contact
            </NavLink>

            {/* =================================================
                DASHBOARD AFTER LOGIN
            ================================================= */}

            {isLoggedIn && (
              <>
                <NavLink
                  to={isAdmin ? "/admin" : "/dashboard"}
                  onClick={closeMobile}
                  className={({ isActive }) => `
                    flex items-center gap-2
                    rounded-xl px-4 py-3
                    text-sm font-semibold transition
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }
                  `}
                >
                  <LayoutDashboard size={17} />
                  {isAdmin ? "Admin Dashboard" : "Dashboard"}
                </NavLink>

                {!isAdmin && (
                  <NavLink
                    to="/dashboard/profile"
                    onClick={closeMobile}
                  className="
                    flex items-center gap-2
                    rounded-xl px-4 py-3
                    text-sm font-semibold
                    text-slate-700 transition
                    hover:bg-slate-50
                  "
                >
                  <User size={17} />
                  Profile
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* =================================================
              MOBILE ACTIONS
          ================================================= */}

          {!isLoggedIn ? (
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
              {/* LOGIN */}

              <Link
                to="/login"
                onClick={closeMobile}
                className="
                  flex items-center justify-center gap-2
                  rounded-xl border border-blue-200
                  px-4 py-3
                  text-sm font-semibold text-blue-600
                  transition hover:bg-blue-50
                "
              >
                <LogIn size={17} />
                Login
              </Link>

              {/* SIGN UP */}

              <Link
                to="/register"
                onClick={closeMobile}
                className="
                  flex items-center justify-center gap-2
                  rounded-xl bg-blue-600
                  px-4 py-3
                  text-sm font-semibold text-white
                  shadow-md shadow-blue-500/20
                  transition hover:bg-blue-700
                "
              >
                <UserPlus size={17} />
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
              {/* OPEN DASHBOARD */}

              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                onClick={closeMobile}
                className="
                  flex items-center justify-center gap-2
                  rounded-xl bg-blue-600
                  px-4 py-3
                  text-sm font-semibold text-white
                  shadow-md shadow-blue-500/20
                  transition hover:bg-blue-700
                "
              >
                <LayoutDashboard size={17} />
                {isAdmin ? "Admin Dashboard" : "Dashboard"}
              </Link>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex items-center justify-center gap-2
                  rounded-xl border border-red-200
                  px-4 py-3
                  text-sm font-semibold text-red-500
                  transition hover:bg-red-50
                "
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;