import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Search,
  MapPin,
  CalendarDays,
  ChevronRight,
  XCircle,
  CheckCircle2,
  CircleDot,
  Sparkles,
  BriefcaseBusiness,
  TrendingUp,
  ArrowUpRight,
  SlidersHorizontal,
  Building2,
  Clock3,
  ExternalLink,
} from "lucide-react";

/* =========================================================
   STATUS CONFIG
========================================================= */

const statusConfig = {
  Applied: {
    icon: CircleDot,
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
    progress: "25%",
    gradient: "from-blue-500 to-cyan-500",
  },

  Shortlisted: {
    icon: CheckCircle2,
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    progress: "55%",
    gradient: "from-emerald-500 to-teal-500",
  },

  Interview: {
    icon: CalendarDays,
    text: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
    progress: "80%",
    gradient: "from-violet-500 to-purple-500",
  },

  "Under Review": {
    icon: TrendingUp,
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
    progress: "40%",
    gradient: "from-amber-500 to-orange-500",
  },

  Selected: {
    icon: CheckCircle2,
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    progress: "100%",
    gradient: "from-emerald-500 to-green-500",
  },

  Rejected: {
    icon: XCircle,
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    progress: "100%",
    gradient: "from-red-500 to-orange-500",
  },
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD APPLICATIONS
  ======================================================= */

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      setError("");

      try {
        const isLoggedIn =
          localStorage.getItem("jobtracker_logged_in") === "true";

        if (!isLoggedIn) {
          setApplications([]);
          setError("Please login to view your applications.");
          return;
        }

        let user = null;

        try {
          user = JSON.parse(
            localStorage.getItem("jobtracker_user") || "null"
          );
        } catch {
          user = null;
        }

        const userId =
          user?.id ??
          user?.user_id ??
          user?.userId ??
          null;

        if (!userId) {
          setApplications([]);
          setError("Your login session is incomplete. Please login again.");
          return;
        }

        const response = await fetch(
          `https://jobtracker-w9yo.onrender.com/api/applications/get-my-applications.php?user_id=${encodeURIComponent(
            userId
          )}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load your applications."
          );
        }

        const formattedApplications = (data.applications || []).map(
          (item) => ({
            ...item,
            id: item.id,
            jobId: item.jobId,
            jobTitle: item.jobTitle || "Job Application",
            company: item.company || "Company",
            location: item.location || "India",
            appliedAt: item.appliedAt,
            status: item.status || "Applied",
            logo:
              item.logo ||
              (item.company
                ? item.company.substring(0, 2).toUpperCase()
                : "JT"),
          })
        );

        setApplications(formattedApplications);
      } catch (err) {
        console.error("Failed to load applications:", err);
        setApplications([]);
        setError(
          err.message || "Unable to load applications. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  /* =======================================================
     FILTER APPLICATIONS
  ======================================================= */

  const filteredApplications = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return applications.filter((application) => {
      const matchesSearch =
        !keyword ||
        application.jobTitle?.toLowerCase().includes(keyword) ||
        application.company?.toLowerCase().includes(keyword) ||
        application.location?.toLowerCase().includes(keyword);

      const matchesFilter = filter === "All" || application.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [applications, search, filter]);

  /* =======================================================
     DATE FORMAT
  ======================================================= */

  const formatDate = (date) => {
    if (!date) return "Recently";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =======================================================
     STATISTICS
  ======================================================= */

  const totalApplications = applications.length;

  const interviews = applications.filter(
    (item) => item.status === "Interview",
  ).length;

  const shortlisted = applications.filter(
    (item) => item.status === "Shortlisted",
  ).length;

  const rejected = applications.filter(
    (item) => item.status === "Rejected",
  ).length;

  const activeApplications = applications.filter(
    (item) => !["Rejected", "Selected"].includes(item.status)
  ).length;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef3fb] via-[#f8faff] to-[#e9eff9] text-slate-900">
      {/* ===================================================
          PREMIUM HEADER
      =================================================== */}

      <header className="relative overflow-hidden border-b border-blue-900/40 bg-gradient-to-br from-[#07152f] via-[#0d2b63] to-[#1649a3] text-white">
        {/* Decorative Glow */}
        <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="absolute top-1/2 left-1/2 w-96 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/10 blur-3xl" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "45px 45px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
          {/* Back */}
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-100 hover:text-white transition"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            Back to Dashboard
          </Link>

          {/* Header Content */}
          <div className="mt-7 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
            {/* Title Area */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-blue-400/30 blur-lg" />

                  <div className="relative w-12 h-12 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-white flex items-center justify-center shadow-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-blue-200">
                    Career Activity
                  </p>

                  <h1 className="mt-0.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                    My Applications
                  </h1>
                </div>
              </div>

              <p className="mt-4 text-sm sm:text-base leading-7 text-blue-100/75 max-w-xl">
                Keep track of your job applications, monitor progress, and stay
                organized throughout your job search.
              </p>
            </div>

            {/* CTA */}
            <Link
              to="/jobs"
              className="group inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-blue-700 text-sm font-bold shadow-xl shadow-black/10 hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Search className="w-4 h-4" />
              Find More Jobs
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Applications"
            value={totalApplications}
            subtitle="All applications"
            icon={BriefcaseBusiness}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            accent="from-blue-500 to-indigo-500"
          />

          <StatCard
            title="Active Applications"
            value={activeApplications}
            subtitle="Currently in progress"
            icon={TrendingUp}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
            accent="from-violet-500 to-purple-500"
          />

          <StatCard
            title="Interviews"
            value={interviews}
            subtitle="Interview stage"
            icon={CalendarDays}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            accent="from-emerald-500 to-teal-500"
          />

          <StatCard
            title="Rejected"
            value={rejected}
            subtitle="Keep moving forward"
            icon={XCircle}
            iconBg="bg-red-50"
            iconColor="text-red-500"
            accent="from-red-500 to-orange-500"
          />
        </section>

        {/* =================================================
            SEARCH / FILTER
        ================================================= */}

        <section className="mt-7 rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-lg shadow-slate-200/50 overflow-hidden">
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Find an application
                </h2>

                <p className="text-xs text-slate-400">
                  Search or filter your application history
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by job title, company or location..."
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none w-full lg:w-56 h-12 pl-4 pr-10 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                >
                  <option value="All">All Status</option>
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <ChevronRight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Search Result Bar */}
          <div className="px-4 sm:px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />

              <p className="text-xs sm:text-sm text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-800">
                  {filteredApplications.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-800">
                  {totalApplications}
                </span>{" "}
                applications
              </p>
            </div>

            {(search || filter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* =================================================
            HISTORY TITLE
        ================================================= */}

        <div className="mt-9 mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                Application History
              </h2>

              <span className="min-w-7 h-7 px-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                {filteredApplications.length}
              </span>
            </div>

            <p className="mt-1.5 text-sm text-slate-400">
              A complete overview of your recent job applications.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Clock3 className="w-3.5 h-3.5" />
            Application activity
          </div>
        </div>

        {/* =================================================
            APPLICATION LIST
        ================================================= */}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 py-16 px-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <span className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              Loading your applications...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fetching your latest application activity.
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-white shadow-lg shadow-slate-200/40 py-14 px-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              Unable to load applications
            </h2>

            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              {error}
            </p>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"
            >
              <Search className="w-4 h-4" />
              Browse Jobs
            </Link>
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application, index) => {
              const config =
                statusConfig[application.status] || statusConfig.Applied;

              const StatusIcon = config.icon;

              return (
                <article
                  key={application.id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Top gradient */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-4 sm:p-5 lg:p-6">
                    <div className="flex flex-col xl:flex-row xl:items-center gap-5">
                      {/* =================================================
                          JOB INFO
                      ================================================= */}

                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Logo */}
                        <div className="relative shrink-0">
                          <div className="absolute inset-0 rounded-2xl bg-blue-500/15 blur-lg group-hover:bg-blue-500/25 transition-all" />

                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-sm sm:text-base shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
                            {application.logo}
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-950 truncate group-hover:text-blue-600 transition-colors">
                              {application.jobTitle}
                            </h3>

                            {index === 0 && (
                              <span className="px-2 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wide">
                                Recent
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                            <p className="text-sm font-semibold text-slate-600 truncate">
                              {application.company}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                              <MapPin className="w-3.5 h-3.5" />
                              {application.location}
                            </span>

                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                              <CalendarDays className="w-3.5 h-3.5" />
                              Applied {formatDate(application.appliedAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* =================================================
                          STATUS SECTION
                      ================================================= */}

                      <div className="w-full xl:w-64">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] uppercase tracking-[0.12em] font-bold text-slate-400">
                            Current Status
                          </span>

                          <div
                            className={`
                              inline-flex items-center gap-1.5
                              px-3 py-1.5
                              rounded-full
                              border
                              text-xs font-bold
                              ${config.bg}
                              ${config.text}
                              ${config.border}
                            `}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />

                            {application.status}
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-semibold text-slate-400">
                              Application progress
                            </span>

                            <span
                              className={`text-[10px] font-bold ${config.text}`}
                            >
                              {config.progress}
                            </span>
                          </div>

                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-700`}
                              style={{
                                width: config.progress,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* =================================================
                          ACTION
                      ================================================= */}

                      <Link
                        to={`/jobs/${application.jobId}`}
                        className="group/action inline-flex items-center justify-center gap-2 w-full xl:w-auto h-11 px-5 rounded-2xl bg-slate-950 text-white text-sm font-bold hover:bg-blue-600 shadow-sm hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
                      >
                        View Job
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/action:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 py-16 sm:py-20 px-6 text-center">
            {/* Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-blue-100/60 blur-3xl" />

            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-slate-100 to-blue-50 border border-slate-200 flex items-center justify-center shadow-sm">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>

              <h2 className="mt-6 text-xl sm:text-2xl font-black text-slate-950">
                No applications found
              </h2>

              <p className="mt-2 text-sm sm:text-base leading-6 text-slate-500 max-w-md mx-auto">
                We couldn't find any applications matching your current search
                or filter.
              </p>

              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 mt-7 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 hover:shadow-xl transition-all"
              >
                <Search className="w-4 h-4" />
                Browse Jobs
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* =================================================
            CAREER TIP
        ================================================= */}

        {applications.length > 0 && (
          <section className="relative overflow-hidden mt-8 rounded-3xl bg-gradient-to-br from-[#07152f] via-[#103779] to-[#2055c9] text-white shadow-2xl shadow-blue-900/15">
            {/* Decorative circles */}
            <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl" />

            <div className="absolute -bottom-28 left-1/3 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative p-5 sm:p-6 lg:p-7 flex flex-col md:flex-row md:items-center gap-5">
              {/* Icon */}
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-200" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-200">
                  Career Tip
                </p>

                <h3 className="mt-1 text-base sm:text-lg font-bold">
                  Keep your applications moving
                </h3>

                <p className="mt-1 text-xs sm:text-sm leading-6 text-blue-100/75 max-w-2xl">
                  Keep your profile and resume updated, prepare for interviews,
                  and follow up professionally when appropriate.
                </p>
              </div>

              {/* CTA */}
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-slate-900 text-sm font-bold hover:bg-blue-50 hover:-translate-y-0.5 transition-all"
              >
                Explore Jobs
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  accent,
}) {
  return (
    <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300">
      {/* Accent line */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${accent}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-[11px] sm:text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

export default MyApplications;
