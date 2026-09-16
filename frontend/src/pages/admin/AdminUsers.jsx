import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  Users,
  ShieldCheck,
  UserRound,
  UserPlus,
  RefreshCw,
  Eye,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Mail,
  CalendarDays,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const USERS_API = "https://jobtrackerapp.rf.gd/backend/api/users";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const [deleteUser, setDeleteUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [updatingRoleId, setUpdatingRoleId] = useState(null);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        `${USERS_API}/get-all-users.php`
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Failed to fetch users"
        );
      }

      setUsers(data.users || []);

    } catch (error) {
      console.error("Fetch users error:", error);

      setMessage({
        type: "error",
        text: error.message || "Failed to load users",
      });

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // AUTO HIDE MESSAGE
  // =========================
  useEffect(() => {
    if (!message.text) return;

    const timer = setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, [message]);

  // =========================
  // FILTER USERS
  // =========================
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        user.name?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText);

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // =========================
  // STATS
  // =========================
  const totalUsers = users.length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;

  const totalNormalUsers = users.filter(
    (user) => user.role === "user"
  ).length;

  const newUsers = users.filter((user) => {
    if (!user.createdAt) return false;

    const created = new Date(
      user.createdAt.replace(" ", "T")
    );

    const now = new Date();

    const difference =
      now.getTime() - created.getTime();

    const sevenDays =
      7 * 24 * 60 * 60 * 1000;

    return difference <= sevenDays;
  }).length;

  // =========================
  // UPDATE ROLE
  // =========================
  const handleRoleChange = async (user, newRole) => {
    if (user.role === newRole) return;

    try {
      setUpdatingRoleId(user.id);

      const response = await fetch(
        `${USERS_API}/update-user-role.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            role: newRole,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Failed to update role"
        );
      }

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.id === user.id
            ? {
                ...item,
                role: newRole,
              }
            : item
        )
      );

      setMessage({
        type: "success",
        text: `${user.name}'s role updated to ${newRole}.`,
      });

    } catch (error) {
      console.error("Update role error:", error);

      setMessage({
        type: "error",
        text:
          error.message ||
          "Failed to update user role",
      });

    } finally {
      setUpdatingRoleId(null);
    }
  };

  // =========================
  // DELETE USER
  // =========================
  const handleDelete = async () => {
    if (!deleteUser) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${USERS_API}/delete-user.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: deleteUser.id,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Failed to delete user"
        );
      }

      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) => user.id !== deleteUser.id
        )
      );

      setMessage({
        type: "success",
        text: "User deleted successfully.",
      });

      setDeleteUser(null);

    } catch (error) {
      console.error("Delete user error:", error);

      setMessage({
        type: "error",
        text:
          error.message ||
          "Failed to delete user",
      });

    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(
      dateString.replace(" ", "T")
    );

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // INITIALS
  // =========================
  const getInitials = (name = "") => {
    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =========================
          HEADER
      ========================= */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <button
                onClick={() => navigate("/admin")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                title="Back to Dashboard"
              >
                <ArrowLeft size={19} />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                    <Users size={18} />
                  </div>

                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Users Management
                  </h1>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Manage registered users and account roles.
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchUsers(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>

          </div>
        </div>
      </header>

      {/* =========================
          CONTENT
      ========================= */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">

        {/* =========================
            ALERT
        ========================= */}
        {message.text && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <Check size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}

            <span>{message.text}</span>
          </div>
        )}

        {/* =========================
            STATS
        ========================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {totalUsers}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Registered accounts
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={21} />
              </div>
            </div>
          </div>

          {/* Normal users */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Normal Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {totalNormalUsers}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Standard accounts
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserRound size={21} />
              </div>
            </div>
          </div>

          {/* Admins */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Administrators
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {totalAdmins}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Admin accounts
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <ShieldCheck size={21} />
              </div>
            </div>
          </div>

          {/* New */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  New Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {newUsers}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Joined in last 7 days
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <UserPlus size={21} />
              </div>
            </div>
          </div>

        </div>

        {/* =========================
            SEARCH + FILTER
        ========================= */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="relative md:w-48">
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              >
                <option value="all">
                  All Roles
                </option>

                <option value="user">
                  Users
                </option>

                <option value="admin">
                  Admins
                </option>
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

          </div>
        </div>

        {/* =========================
            RESULTS
        ========================= */}
        <div className="mt-6">

          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                All Users
              </h2>

              <p className="text-sm text-slate-500">
                Showing {filteredUsers.length} of{" "}
                {users.length} users
              </p>
            </div>
          </div>

          {/* =========================
              LOADING
          ========================= */}
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2
                  size={32}
                  className="animate-spin text-blue-600"
                />

                <p className="text-sm font-medium text-slate-500">
                  Loading users...
                </p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* =========================
                EMPTY
            ========================= */
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Users size={26} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No users found
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                Try changing your search or role filter.
              </p>
            </div>
          ) : (
            <>
              {/* =========================
                  DESKTOP TABLE
              ========================= */}
              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px]">

                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          User
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Email
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Role
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Joined
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                          Actions
                        </th>

                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="transition hover:bg-slate-50/70"
                        >

                          {/* USER */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                {getInitials(
                                  user.name
                                )}
                              </div>

                              <div>
                                <p className="font-semibold text-slate-900">
                                  {user.name}
                                </p>

                                <p className="text-xs text-slate-400">
                                  ID #{user.id}
                                </p>
                              </div>

                            </div>
                          </td>

                          {/* EMAIL */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail
                                size={15}
                                className="text-slate-400"
                              />

                              <span>
                                {user.email}
                              </span>
                            </div>
                          </td>

                          {/* ROLE */}
                          <td className="px-6 py-4">
                            <div className="relative inline-block">

                              {updatingRoleId ===
                              user.id ? (
                                <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">
                                  <Loader2
                                    size={14}
                                    className="animate-spin"
                                  />
                                  Updating...
                                </div>
                              ) : (
                                <select
                                  value={
                                    user.role
                                  }
                                  onChange={(e) =>
                                    handleRoleChange(
                                      user,
                                      e.target.value
                                    )
                                  }
                                  className={`appearance-none rounded-lg border px-3 py-2 pr-8 text-xs font-bold outline-none transition ${
                                    user.role ===
                                    "admin"
                                      ? "border-violet-200 bg-violet-50 text-violet-700 focus:ring-4 focus:ring-violet-50"
                                      : "border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-4 focus:ring-emerald-50"
                                  }`}
                                >
                                  <option value="user">
                                    User
                                  </option>

                                  <option value="admin">
                                    Admin
                                  </option>
                                </select>
                              )}

                              {updatingRoleId !==
                                user.id && (
                                <ChevronDown
                                  size={14}
                                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                                />
                              )}

                            </div>
                          </td>

                          {/* DATE */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <CalendarDays
                                size={15}
                                className="text-slate-400"
                              />

                              {formatDate(
                                user.createdAt
                              )}
                            </div>
                          </td>

                          {/* ACTIONS */}
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">

                              <button
                                onClick={() => {
                                  setSelectedUser(
                                    user
                                  );
                                  setViewModal(true);
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                title="View user"
                              >
                                <Eye size={16} />
                              </button>

                              {user.role !==
                                "admin" && (
                                <button
                                  onClick={() =>
                                    setDeleteUser(
                                      user
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50 hover:text-red-600"
                                  title="Delete user"
                                >
                                  <Trash2
                                    size={16}
                                  />
                                </button>
                              )}

                            </div>
                          </td>

                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              </div>

              {/* =========================
                  MOBILE CARDS
              ========================= */}
              <div className="space-y-3 lg:hidden">

                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          {getInitials(
                            user.name
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-slate-900">
                            {user.name}
                          </h3>

                          <p className="truncate text-sm text-slate-500">
                            {user.email}
                          </p>
                        </div>

                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                          user.role ===
                          "admin"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {user.role ===
                        "admin"
                          ? "Admin"
                          : "User"}
                      </span>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Joined
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {formatDate(
                            user.createdAt
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          User ID
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          #{user.id}
                        </p>
                      </div>

                    </div>

                    <div className="mt-4 flex gap-2">

                      <button
                        onClick={() => {
                          setSelectedUser(
                            user
                          );
                          setViewModal(true);
                        }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      {user.role !==
                        "admin" && (
                        <button
                          onClick={() =>
                            setDeleteUser(
                              user
                            )
                          }
                          className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      )}

                    </div>

                  </div>
                ))}

              </div>
            </>
          )}

        </div>
      </main>

      {/* =========================
          VIEW USER MODAL
      ========================= */}
      {viewModal && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() =>
            setViewModal(false)
          }
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-bold text-slate-900">
                User Details
              </h3>

              <button
                onClick={() =>
                  setViewModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">

              <div className="flex flex-col items-center text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                  {getInitials(
                    selectedUser.name
                  )}
                </div>

                <h4 className="mt-4 text-xl font-bold text-slate-900">
                  {selectedUser.name}
                </h4>

                <span
                  className={`mt-2 rounded-full px-3 py-1 text-xs font-bold ${
                    selectedUser.role ===
                    "admin"
                      ? "bg-violet-100 text-violet-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {selectedUser.role ===
                  "admin"
                    ? "Administrator"
                    : "Normal User"}
                </span>

              </div>

              <div className="mt-6 space-y-3">

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <Mail
                      size={18}
                      className="text-blue-600"
                    />

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Email
                      </p>

                      <p className="mt-0.5 break-all text-sm font-semibold text-slate-800">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <UserRound
                      size={18}
                      className="text-blue-600"
                    />

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        User ID
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        #{selectedUser.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={18}
                      className="text-blue-600"
                    />

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Registered
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-slate-800">
                        {formatDate(
                          selectedUser.createdAt
                        )}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              <button
                onClick={() =>
                  setViewModal(false)
                }
                className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}

      {/* =========================
          DELETE MODAL
      ========================= */}
      {deleteUser && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() =>
            !deleting &&
            setDeleteUser(null)
          }
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle
                  size={23}
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Delete User?
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-800">
                    {deleteUser.name}
                  </span>
                  ? This action cannot be undone.
                </p>

                <p className="mt-2 text-xs leading-5 text-red-500">
                  The user's applications will also
                  be removed.
                </p>
              </div>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  setDeleteUser(null)
                }
                disabled={deleting}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete User
                  </>
                )}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;