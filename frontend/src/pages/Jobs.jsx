import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  ChevronDown,
  X,
  ArrowRight,
  Building2,
  Banknote,
  Sparkles,
  RotateCcw,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

const JOBS_API = "https://jobtracker-w9yo.onrender.com/api/jobs/get.php";
const SAVED_JOBS_API =
  "https://jobtracker-w9yo.onrender.com/api/saved-jobs/get-my-saved-jobs.php";
const SAVE_JOB_API =
  "https://jobtracker-w9yo.onrender.com/api/saved-jobs/save.php";
const REMOVE_SAVED_JOB_API =
  "https://jobtracker-w9yo.onrender.com/api/saved-jobs/remove.php";

const Jobs = () => {
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("All");
  const [experience, setExperience] = useState("All");
  const [workMode, setWorkMode] = useState("All");
  const [salary, setSalary] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("Most Recent");

  const [savedJobs, setSavedJobs] = useState([]);
  const [savingJobId, setSavingJobId] = useState(null);

  const getLoggedInUser = () => {
    try {
      return JSON.parse(localStorage.getItem("jobtracker_user") || "null");
    } catch {
      return null;
    }
  };

  const getUserId = () => {
    const user = getLoggedInUser();
    return Number(user?.id || 0);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(JOBS_API);

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load jobs");
      }

      setJobsData(data.jobs || []);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load jobs. Please make sure Apache and your PHP backend are running.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    const userId = getUserId();

    if (!userId) {
      setSavedJobs([]);
      return;
    }

    try {
      const response = await fetch(`${SAVED_JOBS_API}?user_id=${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch saved jobs");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load saved jobs");
      }

      const savedIds = (data.savedJobs || data.jobs || [])
        .map((item) => Number(item.jobId ?? item.job_id ?? item.id))
        .filter(Boolean);

      setSavedJobs(savedIds);
    } catch (err) {
      console.error("Saved jobs error:", err);
      setSavedJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();

    const handleSavedJobsUpdate = () => {
      fetchSavedJobs();
    };

    window.addEventListener("jobtracker-saved-jobs-updated", handleSavedJobsUpdate);
    window.addEventListener("storage", handleSavedJobsUpdate);

    return () => {
      window.removeEventListener(
        "jobtracker-saved-jobs-updated",
        handleSavedJobsUpdate
      );
      window.removeEventListener("storage", handleSavedJobsUpdate);
    };
  }, []);

  const toggleSaveJob = async (id) => {
    const userId = getUserId();

    if (!userId) {
      alert("Please login first to save jobs.");
      return;
    }

    const jobId = Number(id);

    if (!jobId || savingJobId === jobId) return;

    const isCurrentlySaved = savedJobs.includes(jobId);

    try {
      setSavingJobId(jobId);

      const response = await fetch(
        isCurrentlySaved ? REMOVE_SAVED_JOB_API : SAVE_JOB_API,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            job_id: jobId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (isCurrentlySaved
              ? "Failed to remove saved job"
              : "Failed to save job")
        );
      }

      setSavedJobs((prev) =>
        isCurrentlySaved
          ? prev.filter((savedId) => savedId !== jobId)
          : prev.includes(jobId)
            ? prev
            : [...prev, jobId]
      );

      window.dispatchEvent(new Event("jobtracker-saved-jobs-updated"));
    } catch (err) {
      console.error("Toggle saved job error:", err);
      alert(err.message || "Something went wrong while saving the job.");
    } finally {
      setSavingJobId(null);
    }
  };

  const filteredJobs = useMemo(() => {
    const filtered = jobsData.filter((job) => {
      const keyword = search.toLowerCase().trim();

      const matchesSearch =
        !keyword ||
        job.title?.toLowerCase().includes(keyword) ||
        job.company?.toLowerCase().includes(keyword) ||
        job.skills?.some((skill) => skill.toLowerCase().includes(keyword));

      const matchesLocation =
        !location.trim() ||
        job.location?.toLowerCase().includes(location.toLowerCase().trim());

      const matchesType = jobType === "All" || job.type === jobType;

      const matchesExperience =
        experience === "All" || job.experience === experience;

      const matchesMode = workMode === "All" || job.mode === workMode;

      const matchesSalary = (Number(job.salary) || 0) <= salary;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesExperience &&
        matchesMode &&
        matchesSalary
      );
    });

    if (sortBy === "Salary: High to Low") {
      return [...filtered].sort(
        (a, b) => Number(b.salary || 0) - Number(a.salary || 0),
      );
    }

    if (sortBy === "Salary: Low to High") {
      return [...filtered].sort(
        (a, b) => Number(a.salary || 0) - Number(b.salary || 0),
      );
    }

    return [...filtered].sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
    );
  }, [
    jobsData,
    search,
    location,
    jobType,
    experience,
    workMode,
    salary,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("All");
    setExperience("All");
    setWorkMode("All");
    setSalary(10);
    setSortBy("Most Recent");
  };

  const hasFilters =
    search ||
    location ||
    jobType !== "All" ||
    experience !== "All" ||
    workMode !== "All" ||
    salary !== 10;

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-[#0b1b3a]">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-bold text-blue-200">
              <Sparkles size={14} />
              Explore Career Opportunities
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Find Your <span className="text-blue-400">Dream Job</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Search thousands of opportunities and find the right role for your
              skills, experience and career goals.
            </p>
          </div>

          {/* SEARCH */}

          <div className="mx-auto mt-9 max-w-5xl rounded-2xl bg-white p-2 shadow-2xl">
            <div className="grid gap-2 md:grid-cols-[1fr_0.7fr_auto]">
              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job title, skills or company"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="relative">
                <MapPin
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <button
                onClick={() =>
                  document.getElementById("jobs-list")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl"
              >
                <Search size={17} />
                Search Jobs
              </button>
            </div>
          </div>

          {/* QUICK STATS */}

          <div className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-3">
            <HeroBadge
              icon={<BriefcaseBusiness size={14} />}
              text={`${jobsData.length} Jobs Available`}
            />

            <HeroBadge
              icon={<Bookmark size={14} />}
              text={`${savedJobs.length} Saved`}
            />

            <HeroBadge
              icon={<Sparkles size={14} />}
              text="Fresh Opportunities"
            />
          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}

      <main
        id="jobs-list"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
      >
        {/* MOBILE FILTER */}

        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm lg:hidden"
        >
          <SlidersHorizontal size={17} />
          {showFilters ? "Hide Filters" : "Show Filters"}
          <ChevronDown
            size={15}
            className={showFilters ? "rotate-180 transition" : "transition"}
          />
        </button>

        <div className="grid gap-7 lg:grid-cols-[255px_1fr]">
          {/* ================= FILTERS ================= */}

          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-[#102451]">
                    Filters
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Refine your search
                  </p>
                </div>

                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>

              <FilterSelect
                label="Job Type"
                value={jobType}
                onChange={setJobType}
                options={["All", "Full Time", "Part Time", "Internship"]}
              />

              <FilterSelect
                label="Experience"
                value={experience}
                onChange={setExperience}
                options={[
                  "All",
                  "Fresher",
                  "0-1 Years",
                  "0-2 Years",
                  "1-2 Years",
                  "1-3 Years",
                ]}
              />

              <FilterSelect
                label="Work Mode"
                value={workMode}
                onChange={setWorkMode}
                options={["All", "Remote", "Hybrid", "On-site"]}
              />

              {/* SALARY */}

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-700">Salary</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Maximum salary
                    </p>
                  </div>

                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                    ₹{salary}L+
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-blue-600"
                />

                <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                  <span>₹1L</span>
                  <span>₹5L</span>
                  <span>₹10L+</span>
                </div>
              </div>

              {/* LOCATION */}

              <div className="mt-6 border-t border-slate-100 pt-5">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                  />

                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
                  />
                </div>
              </div>

              {/* SAVED */}

              <Link
                to="/dashboard/saved"
                className="mt-6 flex items-center justify-between rounded-xl bg-[#102451] px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <span className="flex items-center gap-2">
                  <Bookmark size={16} />
                  Saved Jobs
                </span>

                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/15 px-1.5 text-[10px]">
                  {savedJobs.length}
                </span>
              </Link>
            </div>
          </aside>

          {/* ================= RESULTS ================= */}

          <section>
            <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-[#102451]">
                    Available Jobs
                  </h2>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-blue-600">
                    {filteredJobs.length}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  Browse opportunities that match your profile
                </p>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-9 text-xs font-bold text-slate-600 outline-none focus:border-blue-400"
                >
                  <option>Most Recent</option>
                  <option>Salary: High to Low</option>
                  <option>Salary: Low to High</option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* FILTER TAGS */}

            {hasFilters && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400">
                  Filters:
                </span>

                {search && (
                  <FilterTag
                    text={`"${search}"`}
                    remove={() => setSearch("")}
                  />
                )}

                {location && (
                  <FilterTag text={location} remove={() => setLocation("")} />
                )}

                {jobType !== "All" && (
                  <FilterTag text={jobType} remove={() => setJobType("All")} />
                )}

                {experience !== "All" && (
                  <FilterTag
                    text={experience}
                    remove={() => setExperience("All")}
                  />
                )}

                {workMode !== "All" && (
                  <FilterTag
                    text={workMode}
                    remove={() => setWorkMode("All")}
                  />
                )}

                {salary !== 10 && (
                  <FilterTag
                    text={`Up to ₹${salary}L`}
                    remove={() => setSalary(10)}
                  />
                )}

                <button
                  onClick={clearFilters}
                  className="ml-1 text-xs font-bold text-red-500 hover:text-red-600"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* LOADING */}

            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
                <LoaderCircle
                  size={40}
                  className="mx-auto animate-spin text-blue-600"
                />

                <h3 className="mt-5 text-lg font-extrabold text-[#102451]">
                  Loading Jobs...
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Finding the latest opportunities.
                </p>
              </div>
            )}

            {/* ERROR */}

            {!loading && error && (
              <div className="rounded-2xl border border-red-100 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <AlertCircle size={27} />
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-[#102451]">
                  Unable to Load Jobs
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                  {error}
                </p>

                <button
                  onClick={fetchJobs}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                >
                  <RotateCcw size={15} />
                  Try Again
                </button>
              </div>
            )}

            {/* JOBS */}

            {!loading && !error && filteredJobs.length > 0 && (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobs.includes(Number(job.id))}
                    saving={savingJobId === Number(job.id)}
                    onSave={() => toggleSaveJob(job.id)}
                  />
                ))}
              </div>
            )}

            {/* EMPTY */}

            {!loading && !error && filteredJobs.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <BriefcaseBusiness size={28} />
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-[#102451]">
                  No Jobs Found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                  Try changing your search or removing some filters.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                >
                  <RotateCcw size={15} />
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

/* =========================================================
   HERO BADGE
========================================================= */

const HeroBadge = ({ icon, text }) => (
  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 backdrop-blur">
    <span className="text-blue-400">{icon}</span>
    {text}
  </div>
);

/* =========================================================
   FILTER SELECT
========================================================= */

const FilterSelect = ({ label, value, onChange, options }) => (
  <div className="mb-5">
    <label className="mb-2 block text-sm font-bold text-slate-700">
      {label}
    </label>

    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-400 focus:bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  </div>
);

/* =========================================================
   FILTER TAG
========================================================= */

const FilterTag = ({ text, remove }) => (
  <button
    onClick={remove}
    className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-600 transition hover:bg-blue-100"
  >
    {text}
    <X size={12} />
  </button>
);

/* =========================================================
   JOB CARD
========================================================= */

const JobCard = ({ job, isSaved, saving, onSave }) => {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(37,99,235,0.10)] sm:p-6">
      {/* TOP BLUE ACCENT */}

      <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          {/* LOGO */}

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
            {job.logo || "CO"}
          </div>

          {/* TITLE */}

          <div className="min-w-0">
            <h3 className="truncate text-base font-extrabold text-[#102451] transition group-hover:text-blue-600 sm:text-lg">
              {job.title}
            </h3>

            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
              <Building2 size={14} className="text-blue-500" />
              {job.company}
            </p>
          </div>
        </div>

        {/* SAVE */}

        <button
          onClick={onSave}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
            isSaved
              ? "border-blue-200 bg-blue-50 text-blue-600"
              : "border-slate-200 bg-slate-50 text-slate-400 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          {saving ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : isSaved ? (
            <BookmarkCheck size={18} />
          ) : (
            <Bookmark size={18} />
          )}
        </button>
      </div>

      {/* META */}

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
        <JobMeta icon={<MapPin size={14} />} text={job.location} />

        <JobMeta icon={<BriefcaseBusiness size={14} />} text={job.type} />

        <JobMeta icon={<Clock3 size={14} />} text={job.posted} />
      </div>

      {/* TAGS */}

      <div className="mt-5 flex flex-wrap gap-2">
        {(job.skills || []).map((skill) => (
          <span
            key={skill}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-600"
          >
            {skill}
          </span>
        ))}

        <span className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-600">
          {job.mode}
        </span>
      </div>

      {/* BOTTOM */}

      <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-medium text-slate-400">Salary</p>

          <p className="mt-0.5 flex items-center gap-1 text-sm font-extrabold text-emerald-600">
            <Banknote size={15} />
            {job.salaryText || "Not specified"}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            View Details
          </Link>

          <Link
            to={`/jobs/${job.id}/apply`}
            className="group/apply inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/15 transition hover:bg-blue-700 hover:shadow-lg"
          >
            Apply Now
            <ArrowRight
              size={14}
              className="transition group-hover/apply:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   JOB META
========================================================= */

const JobMeta = ({ icon, text }) => (
  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
    <span className="text-blue-500">{icon}</span>
    {text || "Not specified"}
  </span>
);

export default Jobs;
