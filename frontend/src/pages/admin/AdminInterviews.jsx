import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Video,
  MapPin,
  UserRound,
  Building2,
  Search,
  RefreshCw,
  ExternalLink,
  Pencil,
  XCircle,
  CheckCircle2,
  MoreHorizontal,
  BriefcaseBusiness,
  AlertCircle,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = "https://jobtracker-w9yo.onrender.com/api/interviews";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "—";

  const parts = value.split(":");
  if (parts.length < 2) return value;

  const date = new Date();
  date.setHours(Number(parts[0]), Number(parts[1]), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusClass(status) {
  if (status === "Completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Cancelled") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

function AdminInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/get-all-interviews.php`
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid API response. Check get-all-interviews.php."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || "Failed to load interviews."
        );
      }

      setInterviews(
        Array.isArray(data.interviews)
          ? data.interviews
          : []
      );
    } catch (err) {
      console.error(err);
      setInterviews([]);
      setError(
        err.message || "Unable to load interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const filteredInterviews = useMemo(() => {
    const q = search.trim().toLowerCase();

    return interviews.filter((item) => {
      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesSearch =
        !q ||
        String(item.candidateName || "")
          .toLowerCase()
          .includes(q) ||
        String(item.email || "")
          .toLowerCase()
          .includes(q) ||
        String(item.company || "")
          .toLowerCase()
          .includes(q) ||
        String(item.jobTitle || "")
          .toLowerCase()
          .includes(q) ||
        String(item.interviewer || "")
          .toLowerCase()
          .includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [interviews, search, statusFilter]);

  const counts = {
    total: interviews.length,
    upcoming: interviews.filter(
      (item) => item.status === "Upcoming"
    ).length,
    completed: interviews.filter(
      (item) => item.status === "Completed"
    ).length,
    cancelled: interviews.filter(
      (item) => item.status === "Cancelled"
    ).length,
  };

  const updateInterview = async (form) => {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API}/update-interview.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: form.id,
            interview_date: form.interview_date,
            interview_time: form.interview_time,
            duration: form.duration,
            interview_type: form.interview_type,
            mode: form.mode,
            meeting_link: form.meeting_link,
            interviewer: form.interviewer,
            location: form.location,
            notes: form.notes,
            status: form.status,
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid server response."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || "Update failed."
        );
      }

      setEditing(null);
      setSelected(null);
      await fetchInterviews();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to update interview."
      );
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (interview, status) => {
    const form = {
      id: interview.id,
      interview_date: interview.date || "",
      interview_time: interview.time || "",
      duration: interview.duration || "45 min",
      interview_type:
        interview.interviewType || "Technical Interview",
      mode: interview.mode || "Video Call",
      meeting_link: interview.meetingLink || "",
      interviewer: interview.interviewer || "",
      location: interview.location || "",
      notes: interview.notes || "",
      status,
    };

    await updateInterview(form);
  };

  const deleteInterview = async (interview) => {
    const confirmed = window.confirm(
      `Delete the interview for ${interview.candidateName || "this candidate"}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API}/delete-interview.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: interview.id,
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid server response."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || "Delete failed."
        );
      }

      setSelected(null);
      await fetchInterviews();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to delete interview."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600">
                  Admin Panel
                </p>
                <h1 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                  Interview Management
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/admin/applications"
                className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:inline-flex"
              >
                Applications
              </Link>

              <button
                type="button"
                onClick={fetchInterviews}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">{error}</div>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-700"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STATS */}
        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            label="Total Interviews"
            value={counts.total}
            icon={CalendarDays}
            iconClass="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Upcoming"
            value={counts.upcoming}
            icon={Clock3}
            iconClass="bg-violet-50 text-violet-600"
          />
          <StatCard
            label="Completed"
            value={counts.completed}
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            label="Cancelled"
            value={counts.cancelled}
            icon={XCircle}
            iconClass="bg-red-50 text-red-600"
          />
        </section>

        {/* TOOLBAR */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search candidate, company, job..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Upcoming",
                "Completed",
                "Cancelled",
              ].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                    statusFilter === status
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Scheduled Interviews
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Only interviews stored in the database are displayed.
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                {filteredInterviews.length} records
              </span>
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredInterviews.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(search) ||
                statusFilter !== "All"
              }
              clearFilters={() => {
                setSearch("");
                setStatusFilter("All");
              }}
            />
          ) : (
            <>
              {/* DESKTOP */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1150px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Candidate
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Job
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Schedule
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredInterviews.map(
                      (item) => (
                        <InterviewRow
                          key={item.id}
                          item={item}
                          onView={() =>
                            setSelected(item)
                          }
                          onEdit={() =>
                            setEditing(item)
                          }
                          onComplete={() =>
                            changeStatus(
                              item,
                              "Completed"
                            )
                          }
                          onCancel={() =>
                            changeStatus(
                              item,
                              "Cancelled"
                            )
                          }
                          onDelete={() =>
                            deleteInterview(item)
                          }
                          busy={saving}
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="space-y-4 p-4 lg:hidden">
                {filteredInterviews.map(
                  (item) => (
                    <MobileInterviewCard
                      key={item.id}
                      item={item}
                      onView={() =>
                        setSelected(item)
                      }
                      onEdit={() =>
                        setEditing(item)
                      }
                      onComplete={() =>
                        changeStatus(
                          item,
                          "Completed"
                        )
                      }
                      onCancel={() =>
                        changeStatus(
                          item,
                          "Cancelled"
                        )
                      }
                      onDelete={() =>
                        deleteInterview(item)
                      }
                      busy={saving}
                    />
                  )
                )}
              </div>
            </>
          )}
        </section>
      </main>

      {/* DETAILS MODAL */}
      {selected && (
        <DetailsModal
          item={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {
            setEditing(selected);
            setSelected(null);
          }}
        />
      )}

      {/* EDIT MODAL */}
      {editing && (
        <EditModal
          item={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={updateInterview}
        />
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-400 sm:text-sm">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
            {value}
          </p>
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DESKTOP ROW
========================================================= */

function InterviewRow({
  item,
  onView,
  onEdit,
  onComplete,
  onCancel,
  onDelete,
  busy,
}) {
  return (
    <tr className="group transition hover:bg-slate-50/80">
      <td className="px-6 py-5">
        <button
          type="button"
          onClick={onView}
          className="text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-black text-white">
              {String(item.candidateName || "U")
                .split(" ")
                .map((x) => x[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-slate-900 group-hover:text-blue-600">
                {item.candidateName || "Unknown"}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-400">
                {item.email || "—"}
              </p>
            </div>
          </div>
        </button>
      </td>

      <td className="px-6 py-5">
        <p className="max-w-[220px] truncate text-sm font-bold text-slate-800">
          {item.jobTitle || "—"}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
          <Building2 className="h-3.5 w-3.5" />
          {item.company || "—"}
        </p>
      </td>

      <td className="px-6 py-5">
        <p className="text-sm font-bold text-slate-800">
          {formatDate(item.date)}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
          <Clock3 className="h-3.5 w-3.5" />
          {formatTime(item.time)}
        </p>
      </td>

      <td className="px-6 py-5">
        <p className="text-xs font-bold text-slate-700">
          {item.interviewType || "—"}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {item.mode || "—"}
        </p>
      </td>

      <td className="px-6 py-5">
        <span className={`inline-flex rounded-full border px-3 py-1.5 text-[11px] font-bold ${statusClass(item.status)}`}>
          {item.status || "Upcoming"}
        </span>
      </td>

      <td className="px-6 py-5">
        <div className="flex justify-end gap-1.5">
          {item.meetingLink && (
            <a
              href={item.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Open meeting"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          <button
            type="button"
            onClick={onView}
            title="View details"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onEdit}
            title="Edit"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
          >
            <Pencil className="h-4 w-4" />
          </button>

          {item.status === "Upcoming" && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={onComplete}
                title="Mark completed"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={onCancel}
                title="Cancel interview"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   MOBILE CARD
========================================================= */

function MobileInterviewCard({
  item,
  onView,
  onEdit,
  onComplete,
  onCancel,
  onDelete,
  busy,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">

        <button
          type="button"
          onClick={onView}
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-black text-white">
            {String(item.candidateName || "U")
              .split(" ")
              .map((x) => x[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-slate-900">
              {item.candidateName || "Unknown"}
            </p>
            <p className="truncate text-xs text-slate-400">
              {item.email || "—"}
            </p>
          </div>
        </button>

        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusClass(item.status)}`}>
          {item.status || "Upcoming"}
        </span>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3">
        <p className="text-sm font-extrabold text-slate-800">
          {item.jobTitle || "—"}
        </p>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
          <Building2 className="h-3.5 w-3.5" />
          {item.company || "—"}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Info label="Date" value={formatDate(item.date)} />
          <Info label="Time" value={formatTime(item.time)} />
          <Info label="Type" value={item.interviewType || "—"} />
          <Info label="Mode" value={item.mode || "—"} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onView}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600"
        >
          View
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-xs font-bold text-violet-700"
        >
          Edit
        </button>

        {item.meetingLink && (
          <a
            href={item.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-blue-600 px-3 py-2.5 text-center text-xs font-bold text-white"
          >
            Meeting
          </a>
        )}

        {item.status === "Upcoming" && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={onComplete}
              className="rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700 disabled:opacity-50"
            >
              Complete
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={onCancel}
              className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   DETAILS MODAL
========================================================= */

function DetailsModal({ item, onClose, onEdit }) {
  return (
    <Modal onClose={onClose} title="Interview Details">

      <div className="space-y-5">

        <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-black text-white">
            {String(item.candidateName || "U")
              .split(" ")
              .map((x) => x[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-slate-950">
              {item.candidateName || "Unknown"}
            </h3>
            <p className="truncate text-sm text-slate-400">
              {item.email || "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailItem
            icon={BriefcaseBusiness}
            label="Job"
            value={item.jobTitle}
          />

          <DetailItem
            icon={Building2}
            label="Company"
            value={item.company}
          />

          <DetailItem
            icon={CalendarDays}
            label="Date"
            value={formatDate(item.date)}
          />

          <DetailItem
            icon={Clock3}
            label="Time"
            value={formatTime(item.time)}
          />

          <DetailItem
            icon={Video}
            label="Interview Type"
            value={item.interviewType}
          />

          <DetailItem
            icon={Video}
            label="Mode"
            value={item.mode}
          />

          <DetailItem
            icon={UserRound}
            label="Interviewer"
            value={item.interviewer}
          />

          <DetailItem
            icon={MapPin}
            label="Location"
            value={item.location}
          />
        </div>

        {item.notes && (
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Notes
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {item.notes}
            </p>
          </div>
        )}

        {item.meetingLink && (
          <a
            href={item.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            <ExternalLink className="h-4 w-4" />
            Open Meeting Link
          </a>
        )}

        <div className="flex gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
          >
            Edit Interview
          </button>
        </div>
      </div>
    </Modal>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-600" />
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>
      </div>
      <p className="mt-2 text-sm font-bold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

/* =========================================================
   EDIT MODAL
========================================================= */

function EditModal({
  item,
  saving,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    id: item.id,
    interview_date: item.date || "",
    interview_time: item.time
      ? item.time.slice(0, 5)
      : "",
    duration: item.duration || "45 min",
    interview_type:
      item.interviewType ||
      "Technical Interview",
    mode: item.mode || "Video Call",
    meeting_link:
      item.meetingLink || "",
    interviewer:
      item.interviewer || "",
    location:
      item.location || "",
    notes:
      item.notes || "",
    status:
      item.status || "Upcoming",
  });

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal onClose={onClose} title="Edit Interview">

      <form
        onSubmit={submit}
        className="space-y-4"
      >

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-black text-slate-900">
            {item.candidateName}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {item.jobTitle} · {item.company}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <Field
            label="Interview Date"
            type="date"
            value={form.interview_date}
            onChange={(e) =>
              update(
                "interview_date",
                e.target.value
              )
            }
            required
          />

          <Field
            label="Interview Time"
            type="time"
            value={form.interview_time}
            onChange={(e) =>
              update(
                "interview_time",
                e.target.value
              )
            }
            required
          />

          <Field
            label="Duration"
            value={form.duration}
            onChange={(e) =>
              update(
                "duration",
                e.target.value
              )
            }
          />

          <SelectField
            label="Interview Type"
            value={form.interview_type}
            onChange={(e) =>
              update(
                "interview_type",
                e.target.value
              )
            }
            options={[
              "Technical Interview",
              "HR Interview",
              "Managerial Interview",
              "Final Interview",
              "Screening Interview",
              "Other",
            ]}
          />

          <SelectField
            label="Mode"
            value={form.mode}
            onChange={(e) =>
              update(
                "mode",
                e.target.value
              )
            }
            options={[
              "Video Call",
              "Phone Call",
              "In Person",
            ]}
          />

          <SelectField
            label="Status"
            value={form.status}
            onChange={(e) =>
              update(
                "status",
                e.target.value
              )
            }
            options={[
              "Upcoming",
              "Completed",
              "Cancelled",
            ]}
          />

          <Field
            label="Interviewer"
            value={form.interviewer}
            onChange={(e) =>
              update(
                "interviewer",
                e.target.value
              )
            }
          />

          <Field
            label="Location"
            value={form.location}
            onChange={(e) =>
              update(
                "location",
                e.target.value
              )
            }
          />

          <div className="sm:col-span-2">
            <Field
              label="Meeting Link"
              type="url"
              value={form.meeting_link}
              onChange={(e) =>
                update(
                  "meeting_link",
                  e.target.value
                )
              }
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Notes
            </label>

            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) =>
                update(
                  "notes",
                  e.target.value
                )
              }
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* =========================================================
   FORM HELPERS
========================================================= */

function Field({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  onClose,
  children,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <h2 className="text-lg font-black text-slate-950">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LOADING / EMPTY
========================================================= */

function LoadingState() {
  return (
    <div className="px-6 py-20 text-center">
      <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600" />
      <p className="mt-4 text-sm font-bold text-slate-800">
        Loading interviews...
      </p>
    </div>
  );
}

function EmptyState({
  hasFilters,
  clearFilters,
}) {
  return (
    <div className="px-6 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <CalendarDays className="h-7 w-7 text-slate-400" />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-950">
        {hasFilters
          ? "No matching interviews"
          : "No interviews scheduled"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        {hasFilters
          ? "Try changing your search or status filter."
          : "When an admin schedules an interview for an application, it will appear here."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default AdminInterviews;
