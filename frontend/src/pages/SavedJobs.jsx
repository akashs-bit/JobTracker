import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Search,
  MapPin,
  Briefcase,
  ArrowUpRight,
  Trash2,
  SlidersHorizontal,
  Clock3,
  Sparkles,
  X,
  Building2,
  ChevronRight,
  Heart,
} from "lucide-react";

const SAVED_JOBS_API =
  "http://localhost/backend/api/saved-jobs/get-my-saved-jobs.php";

const REMOVE_SAVED_JOB_API =
  "http://localhost/backend/api/saved-jobs/remove.php";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("All");
  const [removingId, setRemovingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("jobtracker_user") || "null");
    } catch {
      return null;
    }
  };

  const user = getUser();
  const userId = user?.id;

  const loadSavedJobs = async () => {
    if (!userId) {
      setSavedJobs([]);
      setLoading(false);
      setError("Please login to view your saved jobs.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${SAVED_JOBS_API}?user_id=${encodeURIComponent(userId)}`,
      );

      if (!response.ok) {
        throw new Error("Could not load saved jobs.");
      }

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message || "Could not load saved jobs.");
      }

      const rows = Array.isArray(data.savedJobs)
        ? data.savedJobs
        : Array.isArray(data.jobs)
          ? data.jobs
          : [];

      const normalized = rows.map((job) => ({
        id: Number(job.jobId ?? job.job_id ?? job.id),
        savedId: Number(job.savedId ?? job.saved_id ?? job.id),
        title: job.title || job.jobTitle || "Job",
        company: job.company || "Company",
        location: job.location || job.jobLocation || "Location not specified",
        type: job.type || job.jobType || "Not specified",
        experience: job.experience || "Not specified",
        salary: job.salary || "Not specified",
        mode: job.mode || job.workMode || "Not specified",
        skills: Array.isArray(job.skills)
          ? job.skills
          : typeof job.skills === "string"
            ? job.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : [],
        logo: job.logo || (job.company || "CO").slice(0, 2).toUpperCase(),
        logoStyle: job.logoStyle || "from-blue-500 to-indigo-600",
        savedDate:
          job.savedDate ||
          job.saved_date ||
          job.createdAt ||
          job.created_at ||
          "",
      }));

      setSavedJobs(normalized);
    } catch (err) {
      console.error("Saved jobs error:", err);
      setSavedJobs([]);
      setError(err.message || "Failed to load saved jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedJobs();

    const refresh = () => loadSavedJobs();

    window.addEventListener("jobtracker-saved-jobs-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("jobtracker-saved-jobs-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [userId]);

  const filteredJobs = useMemo(() => {
    return savedJobs.filter((job) => {
      const keyword = search.toLowerCase().trim();

      const matchesSearch =
        !keyword ||
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.location.toLowerCase().includes(keyword) ||
        job.skills.some((skill) => skill.toLowerCase().includes(keyword));

      const matchesMode = modeFilter === "All" || job.mode === modeFilter;

      return matchesSearch && matchesMode;
    });
  }, [savedJobs, search, modeFilter]);

  const removeJob = async (job) => {
    if (!job?.id || !userId) return;

    setRemovingId(job.id);

    try {
      const response = await fetch(REMOVE_SAVED_JOB_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(userId),
          job_id: Number(job.id),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Could not remove saved job.");
      }

      setSavedJobs((prev) => prev.filter((item) => item.id !== job.id));

      window.dispatchEvent(new Event("jobtracker-saved-jobs-updated"));
    } catch (err) {
      console.error("Remove saved job error:", err);
      setError(err.message || "Could not remove saved job.");
    } finally {
      setRemovingId(null);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setModeFilter("All");
  };

  const formatSavedDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 text-slate-900">
      {/* =====================================================
          PREMIUM HEADER
      ===================================================== */}

      <header className="relative overflow-hidden bg-gradient-to-br from-[#07152f] via-[#0d2b63] to-[#1649a3] text-white">
        {/* Glow */}
        <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="absolute top-1/2 left-1/4 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "45px 45px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* Back */}
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">
              ←
            </span>
            Back to Dashboard
          </Link>

          {/* Header Content */}
          <div className="mt-7 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-blue-400/30 blur-lg" />

                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-xl backdrop-blur-md">
                    <Bookmark className="h-6 w-6 fill-white text-white" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200 sm:text-sm">
                    Career Activity
                  </p>

                  <h1 className="mt-0.5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Saved Jobs
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/75 sm:text-base">
                Keep your favorite opportunities in one place and come back
                whenever you're ready to apply.
              </p>
            </div>

            {/* Header Right */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                    <Heart className="h-4 w-4 text-blue-200" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-200">
                      Saved Jobs
                    </p>

                    <p className="text-xl font-black text-white">
                      {savedJobs.length}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/jobs"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-blue-700 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <Search className="h-4 w-4" />
                Find More Jobs
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        {/* =====================================================
            QUICK STATS
        ===================================================== */}

        <section className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Total Saved
                </p>

                <p className="mt-1 text-2xl font-black text-slate-950">
                  {savedJobs.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
                <Bookmark className="h-5 w-5 fill-blue-600" />
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Remote Jobs
                </p>

                <p className="mt-1 text-2xl font-black text-slate-950">
                  {savedJobs.filter((job) => job.mode === "Remote").length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="group col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-1 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Internships
                </p>

                <p className="mt-1 text-2xl font-black text-slate-950">
                  {savedJobs.filter((job) => job.type === "Internship").length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-transform group-hover:scale-110">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH / FILTER
        ===================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
                <SlidersHorizontal className="h-4 w-4 text-blue-600" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Find a saved job
                </h2>

                <p className="text-xs text-slate-400">
                  Search by role, company, location or skills
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search saved jobs, companies or skills..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter */}
              <div className="relative lg:w-56">
                <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="All">All Work Modes</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-4 py-3.5 sm:px-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <p className="text-xs text-slate-500 sm:text-sm">
                Showing{" "}
                <span className="font-bold text-slate-800">
                  {filteredJobs.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-800">
                  {savedJobs.length}
                </span>{" "}
                saved jobs
              </p>
            </div>

            {(search || modeFilter !== "All") && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-xs font-bold text-blue-600 transition hover:text-blue-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* =====================================================
            RESULTS HEADER
        ===================================================== */}

        <div className="mb-5 mt-9 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                Your Saved Opportunities
              </h2>

              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-blue-100 px-2 text-xs font-bold text-blue-700">
                {filteredJobs.length}
              </span>
            </div>

            <p className="mt-1.5 text-sm text-slate-400">
              Jobs you've saved for later.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex">
            <Clock3 className="h-3.5 w-3.5" />
            Recently saved
          </div>
        </div>

        {/* =====================================================
            JOB LIST
        ===================================================== */}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-lg shadow-slate-200/40">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="mt-4 font-bold text-slate-700">
              Loading your saved jobs...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-16 text-center shadow-sm">
            <X className="mx-auto h-10 w-10 text-red-400" />
            <h2 className="mt-4 text-xl font-black text-red-800">
              Could not load saved jobs
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-red-600">
              {error}
            </p>
            <button
              type="button"
              onClick={loadSavedJobs}
              className="mt-6 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className={`
                  group relative overflow-hidden rounded-3xl
                  border border-slate-200 bg-white
                  shadow-sm
                  hover:border-blue-200
                  hover:shadow-2xl hover:shadow-blue-100/40
                  hover:-translate-y-0.5
                  transition-all duration-300
                  ${
                    removingId === job.id
                      ? "translate-x-5 scale-[0.98] opacity-0"
                      : "translate-x-0 scale-100 opacity-100"
                  }
                `}
              >
                {/* Top Gradient */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                    {/* =================================================
                        COMPANY / JOB
                    ================================================= */}

                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      {/* Logo */}
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 rounded-2xl bg-blue-500/15 blur-lg transition-all group-hover:bg-blue-500/25" />

                        <div
                          className={`
                            relative flex h-14 w-14 items-center justify-center
                            rounded-2xl bg-gradient-to-br ${job.logoStyle}
                            text-base font-black text-white
                            shadow-lg shadow-blue-600/10
                            transition-transform duration-300
                            group-hover:scale-105
                            sm:h-16 sm:w-16
                          `}
                        >
                          {job.logo}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-extrabold text-slate-950 transition-colors group-hover:text-blue-600 sm:text-lg">
                            {job.title}
                          </h3>

                          <span className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600">
                            Saved
                          </span>
                        </div>

                        <div className="mt-1.5 flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                          <p className="truncate text-sm font-semibold text-slate-600">
                            {job.company}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>

                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Briefcase className="h-3.5 w-3.5" />
                            {job.type}
                          </span>

                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Clock3 className="h-3.5 w-3.5" />
                            {job.experience}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* =================================================
                        JOB INFO
                    ================================================= */}

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:w-[390px]">
                      {/* Salary */}
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Salary
                        </p>

                        <p className="mt-1 text-sm font-black text-emerald-600">
                          {job.salary}
                        </p>
                      </div>

                      {/* Mode */}
                      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Work Mode
                        </p>

                        <p className="mt-1 text-sm font-bold text-blue-600">
                          {job.mode}
                        </p>
                      </div>

                      {/* Saved */}
                      <div className="col-span-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:col-span-1">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Saved On
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-700">
                          {formatSavedDate(job.savedDate)}
                        </p>
                      </div>
                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="flex items-center gap-2 border-t border-slate-100 pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                      <button
                        type="button"
                        onClick={() => removeJob(job.id)}
                        title="Remove from saved jobs"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <Link
                        to={`/jobs/${job.id}`}
                        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 xl:flex-none"
                      >
                        Details
                        <ChevronRight className="h-4 w-4" />
                      </Link>

                      <Link
                        to={`/jobs/${job.id}/apply`}
                        className="group/apply inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg xl:flex-none"
                      >
                        Apply
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/apply:-translate-y-0.5 group-hover/apply:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>

                  {/* =================================================
                      SKILLS
                  ================================================= */}

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                    <span className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
                      {job.mode}
                    </span>

                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* =====================================================
              EMPTY STATE
          ===================================================== */

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-lg shadow-slate-200/40">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />

            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
                <Bookmark className="h-8 w-8 text-blue-500" />
              </div>

              <h2 className="mt-6 text-xl font-black text-slate-950 sm:text-2xl">
                No saved jobs found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                {search || modeFilter !== "All"
                  ? "We couldn't find any saved jobs matching your current search or filter."
                  : "You haven't saved any jobs yet. Start exploring opportunities and save the ones you like."}
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {(search || modeFilter !== "All") && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Clear Filters
                  </button>
                )}

                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Search className="h-4 w-4" />
                  Browse Jobs
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            BOTTOM TIP
        ===================================================== */}

        {savedJobs.length > 0 && (
          <section className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#07152f] via-[#103779] to-[#2055c9] text-white shadow-2xl shadow-blue-900/15">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

            <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center lg:p-7">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md">
                <Sparkles className="h-5 w-5 text-blue-200" />
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-200">
                  Quick Tip
                </p>

                <h3 className="mt-1 text-base font-bold sm:text-lg">
                  Don't wait too long to apply
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-6 text-blue-100/75 sm:text-sm">
                  Saved jobs can fill quickly. Review your favorite
                  opportunities regularly and apply to the ones that match your
                  skills.
                </p>
              </div>

              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Explore Jobs
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default SavedJobs;
