import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  Search,
  Pencil,
  Trash2,
  X,
  BriefcaseBusiness,
  MapPin,
  Building2,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_BASE = "https://jobtrackerapp.rf.gd/backend/api/jobs";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  job_type: "Full Time",
  experience: "Fresher",
  salary: "",
  work_mode: "Hybrid",
  description: "",
  requirements: "",
  skills: "",
};

const AdminJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingJob, setEditingJob] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/get.php`);
      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid PHP response. Check your jobs/get.php file.");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to load jobs");
      }

      setJobs(data.jobs || []);
    } catch (err) {
      setError(err.message || "Unable to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);

    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      job_type: job.job_type || job.type || "Full Time",
      experience: job.experience || "Fresher",
      salary: job.salaryText || job.salary || "",
      work_mode: job.work_mode || job.mode || "Hybrid",
      description: job.description || "",
      requirements: job.requirements || "",
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : job.skills || "",
    });

    setMessage("");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingJob(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const url = editingJob
        ? `${API_BASE}/update.php`
        : `${API_BASE}/create.php`;

      const body = {
        ...form,
        ...(editingJob ? { id: editingJob.id } : {}),
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid PHP response. Check your PHP API for errors.");
      }

      if (!data.success) {
        throw new Error(data.message || "Unable to save job");
      }

      setMessage(
        editingJob ? "Job updated successfully." : "Job created successfully.",
      );

      await fetchJobs();

      setTimeout(() => {
        closeModal();
      }, 700);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_BASE}/delete.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid PHP response. Check your delete.php file.");
      }

      if (!data.success) {
        throw new Error(data.message || "Unable to delete job");
      }

      setJobs((prev) => prev.filter((job) => job.id !== id));
      setMessage("Job deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete job");
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchableText = `
        ${job.title || ""}
        ${job.company || ""}
        ${job.location || ""}
        ${job.type || job.job_type || ""}
        ${job.experience || ""}
        ${job.skills || ""}
      `.toLowerCase();

      const matchesSearch = searchableText.includes(
        search.toLowerCase().trim(),
      );

      const type = job.type || job.job_type || "";
      const mode = job.mode || job.work_mode || "";

      return (
        matchesSearch &&
        (typeFilter === "All" || type === typeFilter) &&
        (modeFilter === "All" || mode === modeFilter)
      );
    });
  }, [jobs, search, typeFilter, modeFilter]);

  const jobTypes = useMemo(() => {
    return [
      "All",
      ...new Set(jobs.map((job) => job.type || job.job_type).filter(Boolean)),
    ];
  }, [jobs]);

  const internshipCount = jobs.filter(
    (job) => (job.type || job.job_type) === "Internship",
  ).length;

  const fresherCount = jobs.filter(
    (job) => job.experience === "Fresher",
  ).length;

  const remoteCount = jobs.filter(
    (job) => (job.mode || job.work_mode) === "Remote",
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                title="Back to Admin Dashboard"
              >
                <ArrowLeft
                  size={18}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
              </button>

              <div className="hidden h-11 w-px bg-slate-200 sm:block" />

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                <BriefcaseBusiness size={21} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                    Job Management
                  </h1>

                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                    {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Manage your platform&apos;s job opportunities
                </p>
              </div>
            </div>

            <div className="flex w-full gap-2 sm:w-auto">
              <button
                type="button"
                onClick={fetchJobs}
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-60 sm:flex-none"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 sm:flex-none"
              >
                <Plus size={18} />
                Add New Job
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* ALERT */}
        {message && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={17} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={BriefcaseBusiness}
            label="Total Jobs"
            value={jobs.length}
            description="All listings"
            iconStyle="bg-blue-100 text-blue-600"
          />

          <StatCard
            icon={BriefcaseBusiness}
            label="Internships"
            value={internshipCount}
            description="Entry opportunities"
            iconStyle="bg-violet-100 text-violet-600"
          />

          <StatCard
            icon={CheckCircle2}
            label="Fresher Jobs"
            value={fresherCount}
            description="Beginner friendly"
            iconStyle="bg-emerald-100 text-emerald-600"
          />

          <StatCard
            icon={MapPin}
            label="Remote"
            value={remoteCount}
            description="Remote listings"
            iconStyle="bg-orange-100 text-orange-600"
          />
        </div>

        {/* BREADCRUMB */}
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-400">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="transition hover:text-blue-600"
          >
            Admin Dashboard
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-600">Jobs</span>
        </div>

        {/* SEARCH */}
        <section className="mb-6 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, companies or locations..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                showFilters
                  ? "border-blue-200 bg-blue-50 text-blue-600"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal size={17} />
              Filters
              <ChevronDown
                size={15}
                className={showFilters ? "rotate-180" : ""}
              />
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 grid grid-cols-1 gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2">
              <FilterSelect
                label="Job Type"
                value={typeFilter}
                onChange={setTypeFilter}
                options={jobTypes}
              />

              <FilterSelect
                label="Work Mode"
                value={modeFilter}
                onChange={setModeFilter}
                options={["All", "Onsite", "Hybrid", "Remote"]}
              />
            </div>
          )}
        </section>

        {/* LIST HEADER */}
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Job Listings</h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </p>
          </div>

          {(search || typeFilter !== "All" || modeFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("All");
                setModeFilter("All");
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center">
            <RefreshCw
              size={27}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-3 text-sm font-semibold text-slate-700">
              Loading jobs...
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredJobs.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <BriefcaseBusiness size={26} />
            </div>

            <h3 className="mt-4 font-bold text-slate-800">No jobs found</h3>

            <p className="mt-1 text-sm text-slate-500">
              {jobs.length
                ? "Try changing your search or filters."
                : "Create your first job posting."}
            </p>

            {!jobs.length && (
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
              >
                <Plus size={16} className="mr-1 inline" />
                Add New Job
              </button>
            )}
          </div>
        )}

        {/* DESKTOP */}
        {!loading && filteredJobs.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/50 lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Job
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Location
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Type
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Experience
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Mode
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-extrabold text-blue-700">
                            {(job.logo || job.company?.slice(0, 2) || "JB")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {job.title}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                              <Building2 size={12} />
                              {job.company}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin size={14} className="text-slate-400" />
                          {job.location}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
                          {job.type || job.job_type}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {job.experience}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                            (job.mode || job.work_mode) === "Remote"
                              ? "bg-emerald-50 text-emerald-700"
                              : (job.mode || job.work_mode) === "Hybrid"
                                ? "bg-violet-50 text-violet-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {job.mode || job.work_mode}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(job)}
                            title="Edit"
                            className="rounded-lg p-2.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(job.id)}
                            title="Delete"
                            className="rounded-lg p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MOBILE */}
        {!loading && filteredJobs.length > 0 && (
          <div className="space-y-3 lg:hidden">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-700">
                      {(job.logo || job.company?.slice(0, 2) || "JB")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-slate-900">
                        {job.title}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(job)}
                      className="rounded-lg bg-blue-50 p-2 text-blue-600"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(job.id)}
                      className="rounded-lg bg-red-50 p-2 text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <MobileInfo
                    icon={MapPin}
                    label="Location"
                    value={job.location}
                  />

                  <MobileInfo
                    icon={BriefcaseBusiness}
                    label="Type"
                    value={job.type || job.job_type}
                  />

                  <MobileInfo
                    icon={BriefcaseBusiness}
                    label="Experience"
                    value={job.experience}
                  />

                  <MobileInfo
                    icon={MapPin}
                    label="Mode"
                    value={job.mode || job.work_mode}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingJob ? "Edit Job" : "Create New Job"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {editingJob
                    ? "Update job information"
                    : "Add a new opportunity"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto">
              <div className="space-y-5 p-5 sm:p-6">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Job Information
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Job Title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Frontend Developer"
                      required
                    />

                    <Input
                      label="Company"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="TechNova Solutions"
                      required
                    />

                    <Input
                      label="Location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Bangalore"
                      required
                    />

                    <Input
                      label="Salary"
                      name="salary"
                      value={form.salary}
                      onChange={handleChange}
                      placeholder="₹4L - ₹7L"
                      required
                    />

                    <Select
                      label="Job Type"
                      name="job_type"
                      value={form.job_type}
                      onChange={handleChange}
                      options={[
                        "Full Time",
                        "Part Time",
                        "Internship",
                        "Contract",
                        "Remote",
                      ]}
                    />

                    <Select
                      label="Experience"
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      options={[
                        "Fresher",
                        "0-1 Years",
                        "1-3 Years",
                        "3-5 Years",
                        "5+ Years",
                      ]}
                    />

                    <Select
                      label="Work Mode"
                      name="work_mode"
                      value={form.work_mode}
                      onChange={handleChange}
                      options={["Onsite", "Hybrid", "Remote"]}
                    />

                    <Input
                      label="Skills"
                      name="skills"
                      value={form.skills}
                      onChange={handleChange}
                      placeholder="React, JavaScript, Tailwind CSS"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                  <Textarea
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the job..."
                    rows={6}
                    required
                  />

                  <Textarea
                    label="Requirements"
                    name="requirements"
                    value={form.requirements}
                    onChange={handleChange}
                    placeholder="React knowledge, JavaScript basics..."
                    rows={6}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving && <RefreshCw size={16} className="animate-spin" />}

                  {saving
                    ? "Saving..."
                    : editingJob
                      ? "Update Job"
                      : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, description, iconStyle }) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
    <div className="flex items-center justify-between">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
      >
        <Icon size={19} />
      </div>

      <span className="hidden text-[10px] font-bold uppercase tracking-wider text-slate-300 sm:block">
        Overview
      </span>
    </div>

    <p className="mt-4 text-xs font-medium text-slate-500">{label}</p>

    <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>

    <p className="mt-1 text-[11px] text-slate-400">{description}</p>
  </div>
);

const MobileInfo = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
      <Icon size={12} />
      {label}
    </div>

    <p className="mt-1 truncate text-xs font-semibold text-slate-700">
      {value || "—"}
    </p>
  </div>
);

const Input = ({ label, name, value, onChange, placeholder, required }) => (
  <div>
    <label className="mb-1.5 block text-xs font-bold text-slate-700">
      {label}
    </label>

    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="mb-1.5 block text-xs font-bold text-slate-700">
      {label}
    </label>

    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows,
  required,
}) => (
  <div>
    <label className="mb-1.5 block text-xs font-bold text-slate-700">
      {label}
    </label>

    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
    />
  </div>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <label>
    <span className="mb-1.5 block text-xs font-bold text-slate-500">
      {label}
    </span>

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

export default AdminJobs;
