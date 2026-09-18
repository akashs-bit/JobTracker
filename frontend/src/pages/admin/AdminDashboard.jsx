import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  FileText,
  CalendarDays,
  LogOut,
  Plus,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  RefreshCw,
  Search,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const JOBS_API = "https://jobtracker-w9yo.onrender.com/api/jobs/get.php";
const APPLICATIONS_API =
  "https://jobtracker-w9yo.onrender.com/api/applications/get-all-applications.php";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("jobtracker_user") || "null"
      );
      setUser(storedUser);
    } catch {
      setUser(null);
    }
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [jobsResponse, applicationsResponse] =
        await Promise.allSettled([
          fetch(JOBS_API),
          fetch(APPLICATIONS_API),
        ]);

      if (jobsResponse.status === "fulfilled" && jobsResponse.value.ok) {
        try {
          const data = await jobsResponse.value.json();

          if (data.success) {
            setJobs(data.jobs || []);
          }
        } catch {
          // Keep dashboard usable if one optional API has invalid output.
        }
      }

      if (
        applicationsResponse.status === "fulfilled" &&
        applicationsResponse.value.ok
      ) {
        try {
          const data = await applicationsResponse.value.json();

          if (data.success) {
            setApplications(data.applications || []);
          }
        } catch {
          // Applications API can be added without breaking the dashboard UI.
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jobtracker_logged_in");
    localStorage.removeItem("jobtracker_user");
    localStorage.removeItem("jobtracker_remember");

    navigate("/login", { replace: true });
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const stats = useMemo(() => {
    const totalApplications = applications.length;

    const pending = applications.filter((item) =>
      ["Applied", "Under Review", "Shortlisted", "Interview"].includes(
        item.status
      )
    ).length;

    const selected = applications.filter(
      (item) => item.status === "Selected"
    ).length;

    const rejected = applications.filter(
      (item) => item.status === "Rejected"
    ).length;

    return [
      {
        title: "Total Jobs",
        value: jobs.length,
        change: "Live job listings",
        icon: BriefcaseBusiness,
        iconClass: "bg-blue-50 text-blue-600",
        barClass: "bg-blue-600",
      },
      {
        title: "Applications",
        value: totalApplications,
        change: `${pending} active applications`,
        icon: FileText,
        iconClass: "bg-violet-50 text-violet-600",
        barClass: "bg-violet-600",
      },
      {
        title: "Selected",
        value: selected,
        change: `${rejected} rejected`,
        icon: CheckCircle2,
        iconClass: "bg-emerald-50 text-emerald-600",
        barClass: "bg-emerald-600",
      },
      {
        title: "Pending Review",
        value: pending,
        change: "Needs attention",
        icon: Clock3,
        iconClass: "bg-amber-50 text-amber-600",
        barClass: "bg-amber-500",
      },
    ];
  }, [jobs, applications]);

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort(
        (a, b) =>
          new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0)
      )
      .filter((application) => {
        const query = search.toLowerCase().trim();

        if (!query) return true;

        return `
          ${application.fullName || ""}
          ${application.email || ""}
          ${application.jobTitle || ""}
          ${application.company || ""}
          ${application.status || ""}
        `
          .toLowerCase()
          .includes(query);
      })
      .slice(0, 6);
  }, [applications, search]);

  const statusStyles = {
    Applied: "bg-blue-50 text-blue-700 border-blue-100",
    "Under Review": "bg-amber-50 text-amber-700 border-amber-100",
    Shortlisted: "bg-violet-50 text-violet-700 border-violet-100",
    Interview: "bg-cyan-50 text-cyan-700 border-cyan-100",
    Selected: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Rejected: "bg-red-50 text-red-700 border-red-100",
  };

  const formatDate = (date) => {
    if (!date) return "Recently";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col
          border-r border-slate-800 bg-slate-950 text-white
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* BRAND */}
        <div className="flex h-[84px] items-center justify-between border-b border-white/10 px-6">
          <Link
            to="/"
            onClick={closeMobile}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <p className="text-xl font-extrabold tracking-tight">
                Job<span className="text-blue-400">Tracker</span>
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Admin Console
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeMobile}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAV */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-1.5">
            <AdminNavLink
              to="/admin"
              icon={LayoutDashboard}
              label="Dashboard"
              active
              onClick={closeMobile}
            />

            <AdminNavLink
              to="/admin/jobs"
              icon={BriefcaseBusiness}
              label="Jobs"
              onClick={closeMobile}
            />

            <AdminNavLink
              to="/admin/applications"
              icon={FileText}
              label="Applications"
              onClick={closeMobile}
            />

            <AdminNavLink
              to="/admin/users"
              icon={Users}
              label="Users"
              onClick={closeMobile}
            />

            <AdminNavLink
              to="/admin/interviews"
              icon={CalendarDays}
              label="Interviews"
              onClick={closeMobile}
            />
          </nav>

          <div className="my-7 border-t border-white/10" />

          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Quick Actions
          </p>

          <button
            type="button"
            onClick={() => {
              closeMobile();
              navigate("/admin/jobs");
            }}
            className="flex w-full items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3.5 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
          >
            <Plus size={18} />
            Create New Job
          </button>
        </div>

        {/* ADMIN PROFILE */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
              {(user?.name || "Admin")
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "Admin"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email || "Administrator"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="min-h-screen md:ml-[280px]">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex h-[84px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Dashboard
                  </h1>

                  <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 sm:inline-flex">
                    Admin
                  </span>
                </div>

                <p className="mt-0.5 hidden text-sm text-slate-500 sm:block">
                  Overview of your JobTracker platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <Link
                to="/admin/jobs"
                className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:inline-flex"
              >
                <Plus size={17} />
                New Job
              </Link>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {(user?.name || "AD")
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* WELCOME */}
          <section className="mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
            <div className="relative">
              <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    System operational
                  </div>

                  <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                    Welcome back, {user?.name?.split(" ")[0] || "Admin"} 👋
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                    Manage job listings, applications and your recruitment
                    workflow from one central workspace.
                  </p>
                </div>

                <Link
                  to="/admin/applications"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-blue-50"
                >
                  Review Applications
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                    >
                      <Icon size={21} />
                    </div>

                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <div className="mt-1 flex items-end gap-2">
                    <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">
                      {loading ? "—" : stat.value}
                    </h3>
                  </div>

                  <p className="mt-2 text-xs font-medium text-slate-400">
                    {stat.change}
                  </p>

                  <div
                    className={`absolute bottom-0 left-0 h-1 w-full ${stat.barClass} opacity-80`}
                  />
                </div>
              );
            })}
          </section>

          {/* MAIN GRID */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
            {/* APPLICATIONS */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Recent Applications
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Latest candidate activity
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-56">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  <Link
                    to="/admin/applications"
                    className="hidden items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:inline-flex"
                  >
                    View all
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>

              {loading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <RefreshCw
                    size={28}
                    className="animate-spin text-blue-600"
                  />
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <FileText size={25} />
                  </div>

                  <h4 className="mt-4 font-bold text-slate-800">
                    No applications yet
                  </h4>

                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    Applications submitted by candidates will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px]">
                    <thead className="bg-slate-50/80">
                      <tr>
                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Candidate
                        </th>
                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Position
                        </th>
                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Status
                        </th>
                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Applied
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {recentApplications.map((application) => (
                        <tr
                          key={application.id}
                          className="transition hover:bg-slate-50/70"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                {(application.fullName || "U")
                                  .split(" ")
                                  .map((part) => part[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-800">
                                  {application.fullName || "Unknown"}
                                </p>
                                <p className="truncate text-xs text-slate-400">
                                  {application.email || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="max-w-[220px] truncate text-sm font-semibold text-slate-700">
                              {application.jobTitle || "Job Application"}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {application.company || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                                statusStyles[application.status] ||
                                "bg-slate-50 text-slate-600 border-slate-100"
                              }`}
                            >
                              {application.status || "Applied"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-xs font-medium text-slate-500">
                            {formatDate(application.appliedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border-t border-slate-100 p-4 sm:hidden">
                <Link
                  to="/admin/applications"
                  className="flex items-center justify-center gap-1 rounded-xl bg-slate-50 py-3 text-sm font-semibold text-blue-600"
                >
                  View all applications
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* QUICK ACTIONS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Quick Actions</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Common admin tasks
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <QuickAction
                    to="/admin/jobs"
                    icon={Plus}
                    title="Add Job"
                    description="Create listing"
                  />

                  <QuickAction
                    to="/admin/applications"
                    icon={FileText}
                    title="Applications"
                    description="Review candidates"
                  />

                  <QuickAction
                    to="/admin/users"
                    icon={Users}
                    title="Users"
                    description="Manage users"
                  />

                  <QuickAction
                    to="/admin/interviews"
                    icon={CalendarDays}
                    title="Interviews"
                    description="View schedule"
                  />
                </div>
              </div>

              {/* SYSTEM STATUS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">System Status</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Platform health overview
                    </p>
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={19} />
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <StatusRow
                    label="Job Listings API"
                    status="Operational"
                    ok
                  />
                  <StatusRow
                    label="Applications API"
                    status={
                      applications.length > 0
                        ? "Operational"
                        : "Ready"
                    }
                    ok
                  />
                  <StatusRow
                    label="Admin Authentication"
                    status={user?.role === "admin" ? "Verified" : "Check"}
                    ok={user?.role === "admin"}
                  />
                </div>
              </div>

              {/* ATTENTION */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                    <AlertCircle size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-amber-900">
                      Review pending applications
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-amber-800/70">
                      {stats[3].value > 0
                        ? `${stats[3].value} applications currently need review.`
                        : "No applications currently need review."}
                    </p>

                    <Link
                      to="/admin/applications"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900"
                    >
                      Review now
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const AdminNavLink = ({
  to,
  icon: Icon,
  label,
  active = false,
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        group flex items-center gap-3 rounded-xl px-3.5 py-3
        text-sm font-semibold transition-all duration-200
        ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }
      `}
    >
      <Icon
        size={18}
        className={
          active
            ? "text-white"
            : "text-slate-500 transition group-hover:text-blue-400"
        }
      />

      <span>{label}</span>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
      )}
    </Link>
  );
};

const QuickAction = ({
  to,
  icon: Icon,
  title,
  description,
}) => {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:border-blue-100 hover:bg-blue-50"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white">
        <Icon size={17} />
      </div>

      <p className="mt-3 text-xs font-bold text-slate-800">
        {title}
      </p>

      <p className="mt-0.5 text-[11px] text-slate-400">
        {description}
      </p>
    </Link>
  );
};

const StatusRow = ({ label, status, ok }) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            ok ? "bg-emerald-500" : "bg-amber-500"
          }`}
        />

        <span className="truncate text-sm font-medium text-slate-700">
          {label}
        </span>
      </div>

      <span
        className={`shrink-0 text-xs font-semibold ${
          ok ? "text-emerald-600" : "text-amber-600"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

export default AdminDashboard;
