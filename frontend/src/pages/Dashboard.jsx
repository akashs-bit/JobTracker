import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  FileText,
  BarChart3,
  CalendarDays,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  MapPin,
  Clock3,
  CheckCircle2,
  CircleDot,
  XCircle,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  BriefcaseBusiness,
  Target,
  Zap,
  Settings,
  Loader2,
  RefreshCw,
} from "lucide-react";

const APPLICATIONS_API =
  "https://jobtracker-w9yo.onrender.com/api/applications/get-my-applications.php";

const INTERVIEWS_API =
  "https://jobtracker-w9yo.onrender.com/api/interviews/get-my-interviews.php";

const menuItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Browse Jobs", icon: Search, path: "/jobs" },
  { label: "Saved Jobs", icon: Bookmark, path: "/dashboard/saved" },
  { label: "My Applications", icon: FileText, path: "/dashboard/applications" },
  { label: "Interviews", icon: CalendarDays, path: "/dashboard/interviews" },
  { label: "Profile", icon: User, path: "/dashboard/profile" },
];

const statusConfig = {
  Applied: {
    icon: CircleDot,
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  "Under Review": {
    icon: Clock3,
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
  },
  Interview: {
    icon: CalendarDays,
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
  },
  Shortlisted: {
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  Selected: {
    icon: CheckCircle2,
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-100",
  },
  Rejected: {
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-100",
  },
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, text, iconBg, iconColor }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-slate-50 hover:shadow-md"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
          {title}
        </p>
        <p className="mt-1 truncate text-xs text-slate-400">{text}</p>
      </div>

      <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
    </Link>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getLoggedInUser = () => {
    try {
      return JSON.parse(localStorage.getItem("jobtracker_user") || "null");
    } catch {
      return null;
    }
  };

  const loggedInUser = getLoggedInUser();
  const userId = loggedInUser?.id;

  const loadSavedJobs = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("jobtracker_saved_jobs") || "[]"
      );
      setSavedJobs(Array.isArray(saved) ? saved : []);
    } catch {
      setSavedJobs([]);
    }
  };

  const loadProfile = () => {
    try {
      const savedProfile = localStorage.getItem("jobtracker_profile");
      setProfile(savedProfile ? JSON.parse(savedProfile) : {});
    } catch {
      setProfile({});
    }
  };

  const loadDashboardData = async () => {
    if (!userId) {
      setApplications([]);
      setInterviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [applicationsResponse, interviewsResponse] = await Promise.all([
        fetch(`${APPLICATIONS_API}?user_id=${encodeURIComponent(userId)}`),
        fetch(`${INTERVIEWS_API}?user_id=${encodeURIComponent(userId)}`),
      ]);

      if (!applicationsResponse.ok) {
        throw new Error("Could not load your applications.");
      }

      if (!interviewsResponse.ok) {
        throw new Error("Could not load your interviews.");
      }

      const applicationsJson = await applicationsResponse.json();
      const interviewsJson = await interviewsResponse.json();

      if (applicationsJson.success === false) {
        throw new Error(
          applicationsJson.message || "Could not load applications."
        );
      }

      if (interviewsJson.success === false) {
        throw new Error(
          interviewsJson.message || "Could not load interviews."
        );
      }

      const applicationRows = Array.isArray(applicationsJson.applications)
        ? applicationsJson.applications
        : [];

      const interviewRows = Array.isArray(interviewsJson.interviews)
        ? interviewsJson.interviews
        : [];

      setApplications(
        applicationRows.map((item) => ({
          ...item,
          id: Number(item.id),
          title: item.title || item.jobTitle || "Job",
          company: item.company || "Company",
          location: item.location || item.jobLocation || "Location not specified",
          date: item.appliedAt || item.applied_at || item.date || "",
          status: item.status || "Applied",
        }))
      );

      setInterviews(interviewRows);
    } catch (err) {
      console.error("Dashboard data error:", err);
      setError(err.message || "Failed to load dashboard data.");
      setApplications([]);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadSavedJobs();
    loadDashboardData();

    const handleStorage = () => {
      loadProfile();
      loadSavedJobs();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("jobtracker-profile-updated", handleStorage);
    window.addEventListener("jobtracker-saved-jobs-updated", loadSavedJobs);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("jobtracker-profile-updated", handleStorage);
      window.removeEventListener("jobtracker-saved-jobs-updated", loadSavedJobs);
    };
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("jobtracker_logged_in");
    localStorage.removeItem("jobtracker_user");
    localStorage.removeItem("jobtracker_remember");
    navigate("/login", { replace: true });
  };

  const profileName =
    profile?.name?.trim() || loggedInUser?.name?.trim() || "User";

  const profileInitial = profileName.charAt(0).toUpperCase();
  const profilePhoto = profile?.photo || "";
  const profileHeadline = profile?.headline || "Job Seeker";

  const upcomingInterviews = useMemo(() => {
    const now = new Date();

    return [...interviews]
      .filter((item) => {
        if (item.status && item.status !== "Upcoming") return false;

        const dateTime = new Date(
          `${item.date || item.interview_date}T${
            item.time || item.interview_time || "00:00:00"
          }`
        );

        return Number.isNaN(dateTime.getTime()) || dateTime >= now;
      })
      .sort((a, b) => {
        const aDate = new Date(
          `${a.date || a.interview_date}T${
            a.time || a.interview_time || "00:00:00"
          }`
        );
        const bDate = new Date(
          `${b.date || b.interview_date}T${
            b.time || b.interview_time || "00:00:00"
          }`
        );
        return aDate - bDate;
      });
  }, [interviews]);

  const nextInterview = upcomingInterviews[0] || null;

  const shortlistedCount = applications.filter(
    (item) =>
      item.status === "Shortlisted" ||
      item.status === "Interview" ||
      item.status === "Selected"
  ).length;

  const progressPercent =
    applications.length > 0
      ? Math.min(
          100,
          Math.round((shortlistedCount / applications.length) * 100)
        )
      : 0;

  const stats = [
    {
      title: "Applications",
      value: applications.length,
      subtitle: "Total applications",
      icon: FileText,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Interviews",
      value: upcomingInterviews.length,
      subtitle: "Upcoming interviews",
      icon: CalendarDays,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Saved Jobs",
      value: savedJobs.length,
      subtitle: "Jobs you saved",
      icon: Bookmark,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Shortlisted",
      value: shortlistedCount,
      subtitle: "Active opportunities",
      icon: Target,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  const formatApplicationDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatInterviewDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatInterviewTime = (value) => {
    if (!value) return "Time unavailable";

    const date = new Date(`1970-01-01T${value}`);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const ProfileAvatar = ({ size = "h-10 w-10", textSize = "text-sm" }) => (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-md`}
    >
      {profilePhoto ? (
        <img
          src={profilePhoto}
          alt={profileName}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className={textSize}>{profileInitial}</span>
      )}
    </div>
  );

  const closeMobile = () => setSidebarOpen(false);

  const Sidebar = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-[76px] items-center border-b border-white/10 px-5">
        <Link to="/" onClick={closeMobile} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-950/40">
            <BriefcaseBusiness className="h-5 w-5 text-white" />
          </div>

          <div>
            <p className="text-lg font-extrabold tracking-tight text-white">
              JobTracker
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Career Hub
            </p>
          </div>
        </Link>
      </div>

      <div className="p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
          <div className="flex items-center gap-3">
            <ProfileAvatar />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">
                {profileName}
              </p>
              <p className="truncate text-xs text-slate-500">
                {profileHeadline}
              </p>
            </div>

            <Link
              to="/dashboard/profile"
              className="text-slate-500 transition hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
          Workspace
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = item.path === "/dashboard";

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={closeMobile}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/30"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${
                    active
                      ? "text-white"
                      : "text-slate-500 group-hover:text-blue-400"
                  }`}
                />
                <span>{item.label}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-2xl border border-blue-400/10 bg-gradient-to-br from-blue-600/15 to-indigo-600/10 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <p className="text-xs font-bold text-blue-300">Career tip</p>
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Apply consistently and keep your profile updated.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-[#08152f] lg:block">
        <Sidebar />
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#08152f] shadow-2xl transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={closeMobile}
          className="absolute right-4 top-5 z-10 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <Sidebar />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="flex h-[68px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <p className="text-sm font-bold text-slate-800">Dashboard</p>
                <p className="hidden text-xs text-slate-400 sm:block">
                  Your career overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/jobs/search"
                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 md:flex"
              >
                <Search className="h-4 w-4" />
                Search jobs
              </Link>

              <button
                type="button"
                className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <Bell className="h-5 w-5" />
                {upcomingInterviews.length > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </button>

              <Link
                to="/dashboard/profile"
                className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 pr-2.5 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <ProfileAvatar size="h-8 w-8" textSize="text-xs" />

                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">
                    {profileName}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {profileHeadline}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <section className="relative mb-7 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0b1d41] via-[#123d88] to-[#2563eb] p-6 shadow-2xl shadow-blue-900/10 sm:p-8">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
              <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

              <div className="relative flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">
                    <Zap className="h-3.5 w-3.5" />
                    Live career overview
                  </div>

                  <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Welcome back, {profileName}
                    <span className="ml-2">👋</span>
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                    Your dashboard is connected to your real applications,
                    interviews, saved jobs, and profile data.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to="/jobs"
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                    >
                      <Search className="h-4 w-4" />
                      Find Jobs
                    </Link>

                    <Link
                      to="/dashboard/applications"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                    >
                      View Applications
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">
                        Application Progress
                      </p>
                      <p className="mt-1 text-xs text-blue-200">
                        Based on your current applications
                      </p>
                    </div>

                    <span className="text-2xl font-extrabold text-white">
                      {progressPercent}%
                    </span>
                  </div>

                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-300 to-white transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-blue-200">
                      {applications.length} application
                      {applications.length !== 1 ? "s" : ""}
                    </span>
                    <span className="font-semibold text-white">
                      {shortlistedCount > 0
                        ? `${shortlistedCount} active`
                        : "Keep applying!"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {error && (
              <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={loadDashboardData}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 font-bold text-red-600 shadow-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </button>
              </div>
            )}

            <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-950">
                      Recent Applications
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Your latest application activity
                    </p>
                  </div>

                  <Link
                    to="/dashboard/applications"
                    className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                {loading ? (
                  <div className="flex min-h-52 items-center justify-center">
                    <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
                  </div>
                ) : applications.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <FileText className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 font-bold text-slate-700">
                      No applications yet
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Apply for a job and it will appear here.
                    </p>
                    <Link
                      to="/jobs"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"
                    >
                      <Search className="h-4 w-4" />
                      Browse Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {applications.slice(0, 5).map((application) => {
                      const config =
                        statusConfig[application.status] ||
                        statusConfig.Applied;
                      const StatusIcon = config.icon;

                      return (
                        <div
                          key={application.id}
                          className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-extrabold text-white shadow-md transition-transform group-hover:scale-105">
                              {(application.company || "CO")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-bold text-slate-950 group-hover:text-blue-600">
                                {application.title}
                              </h3>

                              <p className="mt-1 truncate text-sm text-slate-500">
                                {application.company}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {application.location}
                                </span>

                                <span className="flex items-center gap-1">
                                  <CalendarDays className="h-3.5 w-3.5" />
                                  {formatApplicationDate(application.date)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 sm:justify-end">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold ${config.bg} ${config.text} ${config.border}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {application.status}
                            </span>

                            <Link
                              to="/dashboard/applications"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-950">
                      Application Progress
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Based on real application statuses
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                </div>

                <div className="mt-7 flex justify-center">
                  <div
                    className="relative flex h-44 w-44 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#2563eb ${
                        progressPercent * 3.6
                      }deg, #e8eef8 ${progressPercent * 3.6}deg)`,
                    }}
                  >
                    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                      <p className="text-4xl font-extrabold text-slate-950">
                        {progressPercent}%
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-400">
                        Active
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Applications</span>
                    <span className="font-bold text-slate-900">
                      {applications.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Interviews</span>
                    <span className="font-bold text-slate-900">
                      {upcomingInterviews.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Shortlisted</span>
                    <span className="font-bold text-slate-900">
                      {shortlistedCount}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-950">
                      Upcoming Interview
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Your next scheduled interview
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                    <CalendarDays className="h-5 w-5 text-violet-600" />
                  </div>
                </div>

                <div className="p-6">
                  {!nextInterview ? (
                    <div className="rounded-2xl bg-slate-50 p-8 text-center">
                      <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />
                      <p className="mt-3 font-bold text-slate-700">
                        No upcoming interview
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Scheduled interviews will appear here automatically.
                      </p>
                      <Link
                        to="/dashboard/interviews"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-blue-600"
                      >
                        View Interviews
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-gradient-to-br from-violet-50 via-blue-50 to-white p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-xs font-extrabold text-white shadow-lg">
                          {(nextInterview.company || "CO")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-extrabold text-slate-950">
                            {nextInterview.jobTitle ||
                              nextInterview.role ||
                              "Interview"}
                          </h3>
                          <p className="mt-1 truncate text-sm text-slate-500">
                            {nextInterview.company || "Company"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-white bg-white/80 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Date
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {formatInterviewDate(
                              nextInterview.date || nextInterview.interview_date
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white bg-white/80 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Time
                          </p>
                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {formatInterviewTime(
                              nextInterview.time || nextInterview.interview_time
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <Clock3 className="h-4 w-4 text-violet-500" />
                        {nextInterview.duration || "Duration not specified"}{" "}
                        ·{" "}
                        {nextInterview.interviewType ||
                          nextInterview.type ||
                          "Interview"}
                      </div>

                      <Link
                        to="/dashboard/interviews"
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        View Interview
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-950">
                      Saved Jobs
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      Opportunities you saved
                    </p>
                  </div>

                  <Link
                    to="/dashboard/saved"
                    className="text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </Link>
                </div>

                <div className="p-5">
                  {savedJobs.length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 p-8 text-center">
                      <Bookmark className="mx-auto h-9 w-9 text-slate-300" />
                      <p className="mt-3 font-bold text-slate-700">
                        No saved jobs
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Save jobs from the Jobs page to see them here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedJobs.slice(0, 4).map((job) => (
                        <Link
                          key={job.id}
                          to={`/jobs/${job.id}`}
                          className="group flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-xs font-extrabold text-blue-700">
                            {(job.company || "CO").slice(0, 2).toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-600">
                              {job.title || "Job"}
                            </h3>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {job.company || "Company"}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location || "Location not specified"}
                              </span>
                              {job.salary && <span>{job.salary}</span>}
                            </div>
                          </div>

                          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-blue-600" />
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link
                    to="/jobs"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-bold text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Search className="h-4 w-4" />
                    Discover More Jobs
                  </Link>
                </div>
              </section>
            </div>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-extrabold text-slate-950">
                  Quick Actions
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Everything you need to manage your job search
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <QuickAction
                  to="/jobs"
                  icon={Search}
                  title="Find Jobs"
                  text="Explore new opportunities"
                  iconBg="bg-blue-50"
                  iconColor="text-blue-600"
                />

                <QuickAction
                  to="/dashboard/applications"
                  icon={FileText}
                  title="Applications"
                  text={`${applications.length} total application${
                    applications.length !== 1 ? "s" : ""
                  }`}
                  iconBg="bg-indigo-50"
                  iconColor="text-indigo-600"
                />

                <QuickAction
                  to="/dashboard/interviews"
                  icon={CalendarDays}
                  title="Interviews"
                  text={`${upcomingInterviews.length} upcoming interview${
                    upcomingInterviews.length !== 1 ? "s" : ""
                  }`}
                  iconBg="bg-violet-50"
                  iconColor="text-violet-600"
                />

                <QuickAction
                  to="/dashboard/profile"
                  icon={User}
                  title="My Profile"
                  text="Update your information"
                  iconBg="bg-emerald-50"
                  iconColor="text-emerald-600"
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
