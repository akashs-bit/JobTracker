import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronDown,
  RefreshCw,
  FileText,
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  X,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const APPLICATIONS_API = "https://jobtrackerapp.rf.gd/backend/api/applications";
const BACKEND_BASE_URL = "https://jobtrackerapp.rf.gd/backend";
const INTERVIEWS_API = "https://jobtrackerapp.rf.gd/backend/api/interviews";


const getResumeUrl = (resume) => {
  if (!resume) return "";
  if (resume.startsWith("http://") || resume.startsWith("https://")) {
    return resume;
  }
  return `${BACKEND_BASE_URL}/${resume.replace(/^\/+/, "")}`;
};

const STATUS_OPTIONS = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

const AdminApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedApplication, setSelectedApplication] = useState(null);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    interview_date: "",
    interview_time: "",
    duration: "45 min",
    interview_type: "Technical Interview",
    mode: "Video Call",
    meeting_link: "",
    interviewer: "",
    location: "",
    notes: "",
  });

  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchApplications = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${APPLICATIONS_API}/get-all-applications.php`,
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid PHP response. Check get-all-applications.php.",
        );
      }

      if (!data.success) {
        throw new Error(data.message || "Unable to load applications.");
      }

      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message || "Unable to load applications.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);
      setError("");
      setMessage("");

      const response = await fetch(`${APPLICATIONS_API}/update-status.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application_id: applicationId,
          status,
        }),
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid PHP response. Check update-status.php.");
      }

      if (!data.success) {
        throw new Error(data.message || "Unable to update status.");
      }

      setApplications((prev) =>
        prev.map((application) =>
          application.id === applicationId
            ? { ...application, status }
            : application,
        ),
      );

      setSelectedApplication((prev) =>
        prev?.id === applicationId ? { ...prev, status } : prev,
      );

      setMessage("Application status updated successfully.");

      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setError(err.message || "Unable to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const openScheduleModal = (application) => {
    setSelectedApplication(application);
    setError("");
    setMessage("");

    setScheduleForm({
      interview_date: "",
      interview_time: "",
      duration: "45 min",
      interview_type: "Technical Interview",
      mode: "Video Call",
      meeting_link: "",
      interviewer: "",
      location: "",
      notes: "",
    });

    setShowScheduleModal(true);
  };

  const closeScheduleModal = () => {
    if (scheduling) return;
    setShowScheduleModal(false);
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;

    setScheduleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const scheduleInterview = async (e) => {
    e.preventDefault();

    if (!selectedApplication) return;

    if (!scheduleForm.interview_date || !scheduleForm.interview_time) {
      setError("Please select interview date and time.");
      return;
    }

    if (!scheduleForm.interviewer.trim()) {
      setError("Please enter interviewer name.");
      return;
    }

    try {
      setScheduling(true);
      setError("");
      setMessage("");

      const response = await fetch(`${INTERVIEWS_API}/create.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application_id: selectedApplication.id,
          ...scheduleForm,
          interviewer: scheduleForm.interviewer.trim(),
          meeting_link: scheduleForm.meeting_link.trim(),
          location: scheduleForm.location.trim(),
          notes: scheduleForm.notes.trim(),
        }),
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid PHP response. Check create.php for interview API.",
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || "Unable to schedule interview.",
        );
      }

      // Move the application to the Interview stage automatically.
      await updateStatus(selectedApplication.id, "Interview");

      setShowScheduleModal(false);
      setSelectedApplication(null);

      setMessage("Interview scheduled successfully.");

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Unable to schedule interview.");
    } finally {
      setScheduling(false);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const query = search.toLowerCase().trim();

      const searchableText = `
        ${application.fullName || ""}
        ${application.email || ""}
        ${application.phone || ""}
        ${application.jobTitle || ""}
        ${application.company || ""}
        ${application.location || ""}
        ${application.status || ""}
      `.toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesStatus =
        statusFilter === "All" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((item) =>
        ["Applied", "Under Review"].includes(item.status),
      ).length,
      interview: applications.filter((item) => item.status === "Interview")
        .length,
      selected: applications.filter((item) => item.status === "Selected")
        .length,
    };
  }, [applications]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name = "User") => {
    return (
      name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "US"
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Under Review":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Shortlisted":
        return "bg-violet-50 text-violet-700 border-violet-100";
      case "Interview":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      case "Selected":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

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

              <div className="hidden h-10 w-px bg-slate-200 sm:block" />

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                <FileText size={21} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                    Applications
                  </h1>

                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                    {applications.length}
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Review and manage candidate applications
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fetchApplications(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {/* BREADCRUMB */}
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-400">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="hover:text-blue-600"
          >
            Admin Dashboard
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-600">Applications</span>
        </div>

        {/* ALERTS */}
        {message && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={17} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STATS */}
        <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ApplicationStat
            icon={Users}
            label="Total Applications"
            value={stats.total}
            description="All candidates"
            style="bg-blue-100 text-blue-600"
          />

          <ApplicationStat
            icon={Clock3}
            label="Pending Review"
            value={stats.pending}
            description="Needs attention"
            style="bg-amber-100 text-amber-600"
          />

          <ApplicationStat
            icon={CalendarDays}
            label="Interviews"
            value={stats.interview}
            description="Interview stage"
            style="bg-cyan-100 text-cyan-600"
          />

          <ApplicationStat
            icon={CheckCircle2}
            label="Selected"
            value={stats.selected}
            description="Successful candidates"
            style="bg-emerald-100 text-emerald-600"
          />
        </section>

        {/* SEARCH / FILTER */}
        <section className="mb-6 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate, email, job or company..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                showFilters
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal size={17} />
              Filter Status
              <ChevronDown
                size={15}
                className={`transition ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 border-t border-slate-100 pt-3 sm:max-w-xs">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-500">
                  Application Status
                </span>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                >
                  <option value="All">All Statuses</option>

                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </section>

        {/* RESULTS */}
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Candidate Applications
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Showing {filteredApplications.length} of {applications.length}{" "}
              applications
            </p>
          </div>

          {(search || statusFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-3 text-sm font-semibold text-slate-700">
              Loading applications...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Fetching candidate data from your database.
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredApplications.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <FileText size={26} />
            </div>

            <h3 className="mt-4 font-bold text-slate-800">
              No applications found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or status filter.
            </p>
          </div>
        )}

        {/* DESKTOP TABLE */}
        {!loading && filteredApplications.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/50 lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Candidate
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Applied For
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Applied Date
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map((application) => (
                    <tr
                      key={application.id}
                      className="transition hover:bg-blue-50/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-xs font-extrabold text-blue-700">
                            {getInitials(application.fullName)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {application.fullName || "Unknown Candidate"}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-slate-400">
                              {application.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[230px] truncate text-sm font-semibold text-slate-800">
                          {application.jobTitle || "Unknown Position"}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <Building2Icon />
                          {application.company || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-slate-600">
                          {formatDate(application.appliedAt)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={application.status || "Applied"}
                          disabled={updatingId === application.id}
                          onChange={(e) =>
                            updateStatus(application.id, e.target.value)
                          }
                          className={`cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-bold outline-none transition disabled:cursor-wait disabled:opacity-60 ${getStatusStyle(
                            application.status,
                          )}`}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedApplication(application)}
                            className="rounded-lg p-2.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                            title="View application"
                          >
                            <Eye size={16} />
                          </button>

                          {application.resume && (
                            <a
                              href={getResumeUrl(application.resume)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg p-2.5 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                              title="View resume"
                            >
                              <Download size={16} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => openScheduleModal(application)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                            title="Schedule interview"
                          >
                            <Plus size={15} />
                            <span className="hidden xl:inline">Interview</span>
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
        {!loading && filteredApplications.length > 0 && (
          <div className="space-y-3 lg:hidden">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                statusOptions={STATUS_OPTIONS}
                statusStyle={getStatusStyle(application.status)}
                updating={updatingId === application.id}
                onStatusChange={(status) =>
                  updateStatus(application.id, status)
                }
                onView={() => setSelectedApplication(application)}
                onSchedule={() => openScheduleModal(application)}
              />
            ))}
          </div>
        )}
      </main>

      {/* APPLICATION DETAILS MODAL */}
      {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          statusOptions={STATUS_OPTIONS}
          statusStyle={getStatusStyle(selectedApplication.status)}
          updating={updatingId === selectedApplication.id}
          onStatusChange={(status) =>
            updateStatus(selectedApplication.id, status)
          }
          onClose={() => setSelectedApplication(null)}
          onSchedule={() => openScheduleModal(selectedApplication)}
          formatDate={formatDate}
          getInitials={getInitials}
        />
      )}

      {showScheduleModal && selectedApplication && (
        <ScheduleInterviewModal
          application={selectedApplication}
          form={scheduleForm}
          loading={scheduling}
          onChange={handleScheduleChange}
          onSubmit={scheduleInterview}
          onClose={closeScheduleModal}
        />
      )}
    </div>
  );
};

const ApplicationStat = ({ icon: Icon, label, value, description, style }) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${style}`}
      >
        <Icon size={19} />
      </div>
    </div>

    <p className="mt-4 text-xs font-semibold text-slate-500">{label}</p>

    <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
      {value}
    </p>

    <p className="mt-1 text-[11px] text-slate-400">{description}</p>
  </div>
);

const ApplicationCard = ({
  application,
  statusOptions,
  statusStyle,
  updating,
  onStatusChange,
  onView,
  onSchedule,
}) => {
  const initials =
    application.fullName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            {initials}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {application.fullName || "Unknown Candidate"}
            </h3>

            <p className="truncate text-xs text-slate-400">
              {application.email || "—"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onView}
          className="rounded-lg bg-blue-50 p-2.5 text-blue-600"
        >
          <Eye size={16} />
        </button>
        <button
          type="button"
          onClick={onSchedule}
          className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 transition hover:bg-indigo-100"
          title="Schedule interview"
        >
          <CalendarDays size={16} />
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-bold text-slate-800">
          {application.jobTitle || "Unknown Position"}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {application.company || "—"}
        </p>
      </div>

      <div className="mt-3">
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-400">
          Status
        </label>

        <select
          value={application.status || "Applied"}
          disabled={updating}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`w-full rounded-xl border px-3 py-2.5 text-xs font-bold outline-none ${statusStyle}`}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const ApplicationDetails = ({
  application,
  statusOptions,
  statusStyle,
  updating,
  onStatusChange,
  onClose,
  onSchedule,
  formatDate,
  getInitials,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
    <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Application Details
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Review candidate information
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={20} />
        </button>
      </div>

      <div className="max-h-[calc(92vh-76px)] overflow-y-auto p-5 sm:p-6">
        {/* CANDIDATE */}
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-blue-700 shadow-sm">
            {getInitials(application.fullName)}
          </div>

          <div className="min-w-0">
            <h3 className="text-xl font-bold text-slate-900">
              {application.fullName || "Unknown Candidate"}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {application.email || "—"}
            </p>
          </div>
        </div>

        {/* JOB */}
        <div className="mt-5 rounded-2xl border border-slate-200 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Applied Position
          </p>

          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {application.jobTitle || "Unknown Position"}
          </h3>

          <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <DetailItem
              icon={BriefcaseBusiness}
              label="Company"
              value={application.company}
            />

            <DetailItem
              icon={MapPin}
              label="Location"
              value={application.location}
            />

            <DetailItem
              icon={CalendarDays}
              label="Applied"
              value={formatDate(application.appliedAt)}
            />

            <DetailItem
              icon={FileText}
              label="Job Type"
              value={application.jobType}
            />
          </div>
        </div>

        {/* CONTACT */}
        <div className="mt-4 rounded-2xl border border-slate-200 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Contact Information
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <DetailItem icon={Mail} label="Email" value={application.email} />

            <DetailItem icon={Phone} label="Phone" value={application.phone} />
          </div>
        </div>

        {/* COVER LETTER */}
        {application.coverLetter && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Cover Letter
            </p>

            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
              {application.coverLetter}
            </p>
          </div>
        )}

        {/* STATUS */}
        <div className="mt-4 rounded-2xl border border-slate-200 p-5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Application Status
          </label>

          <select
            value={application.status || "Applied"}
            disabled={updating}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm font-bold outline-none ${statusStyle}`}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* SCHEDULE INTERVIEW */}
        <button
          type="button"
          onClick={onSchedule}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <CalendarDays size={17} />
          Schedule Interview
        </button>

        {/* RESUME */}
        {application.resume && (
          <a
            href={getResumeUrl(application.resume)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Download size={17} />
            View Resume
          </a>
        )}
      </div>
    </div>
  </div>
);

const ScheduleInterviewModal = ({
  application,
  form,
  loading,
  onChange,
  onSubmit,
  onClose,
}) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
    <div className="max-h-[94vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <CalendarDays size={18} />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Schedule Interview
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {application.fullName} · {application.jobTitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
        >
          <X size={20} />
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="max-h-[calc(94vh-82px)] overflow-y-auto p-5 sm:p-6"
      >
        <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
            Candidate
          </p>
          <p className="mt-1 text-sm font-extrabold text-slate-900">
            {application.fullName}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {application.email} · {application.company}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Interview Date" required>
            <input
              type="date"
              name="interview_date"
              value={form.interview_date}
              onChange={onChange}
              min={new Date().toISOString().split("T")[0]}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </FormField>

          <FormField label="Interview Time" required>
            <input
              type="time"
              name="interview_time"
              value={form.interview_time}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </FormField>

          <FormField label="Interview Type" required>
            <select
              name="interview_type"
              value={form.interview_type}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            >
              <option>Technical Interview</option>
              <option>Technical Round</option>
              <option>HR Interview</option>
              <option>HR Round</option>
              <option>Managerial Round</option>
              <option>Final Interview</option>
            </select>
          </FormField>

          <FormField label="Duration">
            <select
              name="duration"
              value={form.duration}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            >
              <option>30 min</option>
              <option>45 min</option>
              <option>60 min</option>
              <option>90 min</option>
              <option>120 min</option>
            </select>
          </FormField>

          <FormField label="Mode">
            <select
              name="mode"
              value={form.mode}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            >
              <option>Video Call</option>
              <option>Phone Call</option>
              <option>In Person</option>
            </select>
          </FormField>

          <FormField label="Interviewer" required>
            <input
              type="text"
              name="interviewer"
              value={form.interviewer}
              onChange={onChange}
              placeholder="e.g. Senior Frontend Engineer"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </FormField>

          <FormField label="Meeting Link">
            <input
              type="url"
              name="meeting_link"
              value={form.meeting_link}
              onChange={onChange}
              placeholder="https://meet.google.com/..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </FormField>

          <FormField label="Location">
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={onChange}
              placeholder="Google Meet / Office / Phone"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </FormField>
        </div>

        <FormField label="Notes">
          <textarea
            name="notes"
            value={form.notes}
            onChange={onChange}
            rows={4}
            placeholder="Interview instructions, preparation notes, or other details..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 resize-none"
          />
        </FormField>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw size={17} className="animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <CalendarDays size={17} />
                Schedule Interview
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const FormField = ({ label, required = false, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-bold text-slate-600">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </span>
    {children}
  </label>
);

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2.5">
    <div className="mt-0.5 text-slate-400">
      <Icon size={16} />
    </div>

    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 break-words text-sm font-semibold text-slate-700">
        {value || "—"}
      </p>
    </div>
  </div>
);

const Building2Icon = () => <BriefcaseBusiness size={12} />;

export default AdminApplications;
