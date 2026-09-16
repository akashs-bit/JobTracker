import {
  CalendarDays,
  Clock3,
  Video,
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
  CircleAlert,
  ExternalLink,
  Search,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const INTERVIEWS_API = "http://localhost/backend/api/interviews";

/* =========================================================
   GET LOGGED-IN USER
========================================================= */

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem("jobtracker_user") || "null"
    );
  } catch {
    return null;
  }
}

/* =========================================================
   COMPANY LOGO
========================================================= */

function getCompanyLogo(company = "Company") {
  const initials = company
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "CO";
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(timeString) {
  if (!timeString) return "—";

  const [hours, minutes] = timeString.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return timeString;
  }

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/* =========================================================
   CHECK TODAY
========================================================= */

function isToday(dateString) {
  if (!dateString) return false;

  const today = new Date();
  const date = new Date(`${dateString}T00:00:00`);

  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}

/* =========================================================
   STATUS CONFIG
========================================================= */

const statusConfig = {
  Upcoming: {
    icon: Clock3,
    badge:
      "bg-blue-50 text-blue-700 border-blue-200",
    iconBg: "bg-blue-100 text-blue-600",
    accent: "from-blue-500 to-indigo-500",
  },

  Completed: {
    icon: CheckCircle2,
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconBg: "bg-emerald-100 text-emerald-600",
    accent: "from-emerald-500 to-teal-500",
  },

  Cancelled: {
    icon: XCircle,
    badge:
      "bg-red-50 text-red-700 border-red-200",
    iconBg: "bg-red-100 text-red-600",
    accent: "from-red-500 to-orange-500",
  },
};

/* =========================================================
   INTERVIEW CARD
========================================================= */

function InterviewCard({ interview }) {
  const config =
    statusConfig[interview.status] ||
    statusConfig.Upcoming;

  const StatusIcon = config.icon;

  return (
    <article
      className="
        group relative overflow-hidden
        rounded-3xl border border-slate-200
        bg-white shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-xl hover:shadow-blue-100/40
      "
    >
      {/* Top Accent */}
      <div
        className={`
          absolute left-0 right-0 top-0 h-1
          bg-gradient-to-r ${config.accent}
          opacity-0 transition-opacity
          group-hover:opacity-100
        `}
      />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center">

          {/* =================================================
              JOB INFORMATION
          ================================================= */}

          <div className="flex min-w-0 flex-1 items-start gap-4">

            {/* Company Logo */}
            <div className="relative shrink-0">
              <div
                className="
                  absolute inset-0 rounded-2xl
                  bg-blue-500/15 blur-lg
                "
              />

              <div
                className="
                  relative flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-blue-600 via-indigo-600
                  to-violet-600
                  text-sm font-black text-white
                  shadow-lg shadow-blue-600/20
                  transition-transform duration-300
                  group-hover:scale-105
                  sm:h-16 sm:w-16
                "
              >
                {interview.logo}
              </div>
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <h3
                  className="
                    truncate text-base font-extrabold
                    text-slate-950
                    transition-colors
                    group-hover:text-blue-600
                    sm:text-lg
                  "
                >
                  {interview.jobTitle}
                </h3>

                {isToday(interview.date) && (
                  <span
                    className="
                      rounded-full border
                      border-orange-200
                      bg-orange-50
                      px-2.5 py-1
                      text-[10px] font-bold
                      uppercase tracking-wide
                      text-orange-600
                    "
                  >
                    Today
                  </span>
                )}
              </div>

              {/* Company */}
              <div className="mt-1.5 flex items-center gap-2">
                <Building2
                  className="
                    h-4 w-4 shrink-0
                    text-slate-400
                  "
                />

                <p
                  className="
                    truncate text-sm
                    font-semibold text-slate-600
                  "
                >
                  {interview.company}
                </p>
              </div>

              {/* Date / Time / Mode */}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">

                <span
                  className="
                    inline-flex items-center gap-1.5
                    text-xs font-medium text-slate-400
                  "
                >
                  <CalendarDays
                    className="h-3.5 w-3.5 text-blue-500"
                  />

                  {formatDate(interview.date)}
                </span>

                <span
                  className="
                    inline-flex items-center gap-1.5
                    text-xs font-medium text-slate-400
                  "
                >
                  <Clock3
                    className="h-3.5 w-3.5 text-blue-500"
                  />

                  {formatTime(interview.time)}
                </span>

                <span
                  className="
                    inline-flex items-center gap-1.5
                    text-xs font-medium text-slate-400
                  "
                >
                  <Video
                    className="h-3.5 w-3.5 text-blue-500"
                  />

                  {interview.mode || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              INTERVIEW INFORMATION
          ================================================= */}

          <div
            className="
              grid grid-cols-2 gap-3
              border-t border-slate-100
              pt-5
              sm:grid-cols-4
              xl:w-[470px]
              xl:border-l xl:border-t-0
              xl:pl-6 xl:pt-0
            "
          >

            {/* Interview Type */}
            <div className="rounded-2xl bg-slate-50 p-3">
              <p
                className="
                  mb-1 text-[10px]
                  font-bold uppercase
                  tracking-wide text-slate-400
                "
              >
                Interview
              </p>

              <p
                className="
                  line-clamp-2
                  text-xs font-bold
                  text-slate-700
                "
              >
                {interview.interviewType || "—"}
              </p>
            </div>

            {/* Duration */}
            <div className="rounded-2xl bg-slate-50 p-3">
              <p
                className="
                  mb-1 text-[10px]
                  font-bold uppercase
                  tracking-wide text-slate-400
                "
              >
                Duration
              </p>

              <p className="text-sm font-bold text-slate-700">
                {interview.duration || "—"}
              </p>
            </div>

            {/* Interviewer */}
            <div className="rounded-2xl bg-slate-50 p-3">
              <p
                className="
                  mb-1 text-[10px]
                  font-bold uppercase
                  tracking-wide text-slate-400
                "
              >
                Interviewer
              </p>

              <p
                className="
                  truncate text-xs
                  font-bold text-slate-700
                "
              >
                {interview.interviewer || "—"}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-2xl bg-slate-50 p-3">
              <p
                className="
                  mb-1 text-[10px]
                  font-bold uppercase
                  tracking-wide text-slate-400
                "
              >
                Status
              </p>

              <span
                className={`
                  inline-flex items-center gap-1.5
                  rounded-full border
                  px-2.5 py-1
                  text-[10px] font-bold
                  ${config.badge}
                `}
              >
                <StatusIcon className="h-3.5 w-3.5" />

                {interview.status}
              </span>
            </div>
          </div>

          {/* =================================================
              ACTION
          ================================================= */}

          <div
            className="
              flex gap-2
              border-t border-slate-100
              pt-4
              xl:border-t-0 xl:pt-0
            "
          >

            {interview.status === "Upcoming" ? (
              <>
                {interview.meetingLink ? (
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex h-11 flex-1
                      items-center justify-center
                      gap-2 rounded-xl
                      bg-gradient-to-r
                      from-blue-600 to-indigo-600
                      px-5 text-sm font-bold
                      text-white shadow-md
                      shadow-blue-600/20
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:shadow-lg
                      sm:flex-none
                    "
                  >
                    <Video className="h-4 w-4" />

                    Join
                  </a>
                ) : (
                  <span
                    className="
                      inline-flex h-11 flex-1
                      items-center justify-center
                      gap-2 rounded-xl
                      bg-slate-100
                      px-5 text-sm font-bold
                      text-slate-400
                      sm:flex-none
                    "
                  >
                    <Video className="h-4 w-4" />

                    Link unavailable
                  </span>
                )}

                {interview.meetingLink && (
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open meeting link"
                    className="
                      flex h-11 w-11
                      items-center justify-center
                      rounded-xl
                      border border-slate-200
                      bg-white text-slate-500
                      transition-all
                      hover:border-blue-200
                      hover:bg-blue-50
                      hover:text-blue-600
                    "
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </>
            ) : (
              <span
                className="
                  inline-flex h-11 flex-1
                  items-center justify-center
                  rounded-xl
                  border border-slate-200
                  bg-white px-5
                  text-sm font-bold
                  text-slate-500
                  sm:flex-none
                "
              >
                {interview.status}
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        <div
          className="
            mt-5 flex items-center gap-2
            border-t border-slate-100
            pt-4 text-xs
            font-medium text-slate-400
          "
        >
          <MapPin
            className="h-3.5 w-3.5 text-blue-500"
          />

          Interview location:

          <span
            className="
              truncate font-bold
              text-slate-600
            "
          >
            {interview.location || "Not specified"}
          </span>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Interviews() {
  const [interviewsData, setInterviewsData] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH ONLY REAL USER INTERVIEWS
  ======================================================= */

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError("");

      const user = getStoredUser();

      if (!user?.id) {
        setInterviewsData([]);
        setError(
          "Please login to view your interviews."
        );
        return;
      }

      const response = await fetch(
        `${INTERVIEWS_API}/get-my-interviews.php?user_id=${user.id}`
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid server response. Check get-my-interviews.php."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to load interviews."
        );
      }

      /*
        IMPORTANT:
        No fake/default/sample data here.

        If backend returns:
        []
        
        then frontend remains:
        []
      */

      const realInterviews = Array.isArray(
        data.interviews
      )
        ? data.interviews
        : [];

      const mappedInterviews =
        realInterviews.map((item) => ({
          id: item.id,

          applicationId:
            item.applicationId,

          userId:
            item.userId,

          jobId:
            item.jobId,

          jobTitle:
            item.jobTitle ||
            "Job Position",

          company:
            item.company ||
            "Company",

          date:
            item.date || "",

          time:
            item.time || "",

          duration:
            item.duration ||
            "—",

          interviewType:
            item.interviewType ||
            "Interview",

          mode:
            item.mode ||
            "—",

          meetingLink:
            item.meetingLink ||
            "",

          interviewer:
            item.interviewer ||
            "—",

          location:
            item.location ||
            "Not specified",

          notes:
            item.notes ||
            "",

          status:
            item.status ||
            "Upcoming",

          createdAt:
            item.createdAt ||
            "",

          logo:
            getCompanyLogo(
              item.company
            ),
        }));

      setInterviewsData(
        mappedInterviews
      );
    } catch (err) {
      console.error(
        "Interview fetch error:",
        err
      );

      setInterviewsData([]);

      setError(
        err.message ||
          "Unable to load interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD ON PAGE OPEN
  ======================================================= */

  useEffect(() => {
    fetchInterviews();
  }, []);

  /* =======================================================
     REAL COUNTS
  ======================================================= */

  const totalInterviews =
    interviewsData.length;

  const upcomingCount =
    interviewsData.filter(
      (item) =>
        item.status === "Upcoming"
    ).length;

  const completedCount =
    interviewsData.filter(
      (item) =>
        item.status === "Completed"
    ).length;

  const cancelledCount =
    interviewsData.filter(
      (item) =>
        item.status === "Cancelled"
    ).length;

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredInterviews =
    useMemo(() => {
      const searchText =
        search.toLowerCase().trim();

      return interviewsData.filter(
        (interview) => {
          const matchesTab =
            activeTab === "All" ||
            interview.status ===
              activeTab;

          const matchesSearch =
            !searchText ||
            (
              interview.jobTitle ||
              ""
            )
              .toLowerCase()
              .includes(searchText) ||
            (
              interview.company ||
              ""
            )
              .toLowerCase()
              .includes(searchText) ||
            (
              interview.interviewType ||
              ""
            )
              .toLowerCase()
              .includes(searchText);

          return (
            matchesTab &&
            matchesSearch
          );
        }
      );
    }, [
      interviewsData,
      activeTab,
      search,
    ]);

  /* =======================================================
     NEXT REAL INTERVIEW
  ======================================================= */

  const nextInterview =
    useMemo(() => {
      const upcoming =
        interviewsData
          .filter(
            (item) =>
              item.status ===
              "Upcoming"
          )
          .filter(
            (item) =>
              item.date
          )
          .sort((a, b) => {
            const aDate =
              new Date(
                `${a.date}T${
                  a.time ||
                  "00:00:00"
                }`
              );

            const bDate =
              new Date(
                `${b.date}T${
                  b.time ||
                  "00:00:00"
                }`
              );

            return (
              aDate.getTime() -
              bDate.getTime()
            );
          });

      return upcoming[0] || null;
    }, [interviewsData]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-100
        via-blue-50
        to-indigo-100
        text-slate-900
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          relative overflow-hidden
          bg-gradient-to-br
          from-[#07152f]
          via-[#0d2b63]
          to-[#1649a3]
          text-white
        "
      >
        <div
          className="
            absolute -right-24 -top-32
            h-96 w-96 rounded-full
            bg-blue-400/20 blur-3xl
          "
        />

        <div
          className="
            absolute -bottom-40
            left-1/3 h-96 w-96
            rounded-full
            bg-indigo-400/20 blur-3xl
          "
        />

        <div
          className="
            relative mx-auto max-w-7xl
            px-4 py-9
            sm:px-6 sm:py-12
            lg:px-8
          "
        >

          {/* Back */}
          <Link
            to="/dashboard"
            className="
              inline-flex items-center
              gap-2 text-sm font-semibold
              text-blue-100 transition
              hover:text-white
            "
          >
            <span>←</span>

            Back to Dashboard
          </Link>

          <div
            className="
              mt-7 flex flex-col
              gap-7
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            {/* Title */}
            <div className="max-w-2xl">

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex h-14 w-14
                    items-center justify-center
                    rounded-2xl
                    border border-white/15
                    bg-white/10
                    backdrop-blur-md
                  "
                >
                  <CalendarDays
                    className="h-6 w-6"
                  />
                </div>

                <div>
                  <p
                    className="
                      text-xs font-bold
                      uppercase
                      tracking-[0.16em]
                      text-blue-200
                    "
                  >
                    Career Activity
                  </p>

                  <h1
                    className="
                      mt-0.5 text-3xl
                      font-black
                      tracking-tight
                      sm:text-4xl
                    "
                  >
                    Interviews
                  </h1>
                </div>
              </div>

              <p
                className="
                  mt-4 max-w-xl
                  text-sm leading-7
                  text-blue-100/75
                  sm:text-base
                "
              >
                View interviews scheduled
                for your job applications.
              </p>
            </div>

            {/* Find Jobs */}
            <Link
              to="/jobs"
              className="
                group inline-flex
                w-fit items-center
                justify-center gap-2
                rounded-2xl bg-white
                px-5 py-3.5
                text-sm font-bold
                text-blue-700
                shadow-xl
                transition-all
                hover:-translate-y-0.5
                hover:bg-blue-50
              "
            >
              <Search className="h-4 w-4" />

              Find More Jobs

              <ArrowUpRight
                className="
                  h-4 w-4
                  transition-transform
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          mx-auto max-w-7xl
          px-4 py-7
          sm:px-6 sm:py-9
          lg:px-8
        "
      >

        {/* ===================================================
            STATS
        =================================================== */}

        <section
          className="
            grid grid-cols-2
            gap-4 xl:grid-cols-4
          "
        >
          <StatCard
            title="Total Interviews"
            value={totalInterviews}
            subtitle="Actually scheduled"
            icon={CalendarDays}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            accent="from-blue-500 to-indigo-500"
          />

          <StatCard
            title="Upcoming"
            value={upcomingCount}
            subtitle="Scheduled interviews"
            icon={Clock3}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
            accent="from-violet-500 to-purple-500"
          />

          <StatCard
            title="Completed"
            value={completedCount}
            subtitle="Completed interviews"
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            accent="from-emerald-500 to-teal-500"
          />

          <StatCard
            title="Cancelled"
            value={cancelledCount}
            subtitle="Cancelled interviews"
            icon={XCircle}
            iconBg="bg-red-50"
            iconColor="text-red-500"
            accent="from-red-500 to-orange-500"
          />
        </section>

        {/* ===================================================
            NEXT INTERVIEW
        =================================================== */}

        {nextInterview && (
          <section
            className="
              relative mt-7 overflow-hidden
              rounded-3xl
              bg-gradient-to-br
              from-[#07152f]
              via-[#123d86]
              to-[#2563eb]
              text-white
              shadow-2xl
              shadow-blue-900/20
            "
          >
            <div
              className="
                absolute -right-20 -top-24
                h-72 w-72
                rounded-full
                bg-blue-300/20
                blur-3xl
              "
            />

            <div className="relative p-5 sm:p-6 lg:p-7">

              <div
                className="
                  flex flex-col gap-6
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >

                <div className="flex items-start gap-4">

                  <div
                    className="
                      flex h-12 w-12
                      shrink-0
                      items-center justify-center
                      rounded-2xl
                      border border-white/10
                      bg-white/10
                    "
                  >
                    <Sparkles
                      className="h-5 w-5"
                    />
                  </div>

                  <div>

                    <p
                      className="
                        text-xs font-bold
                        uppercase
                        tracking-[0.15em]
                        text-blue-200
                      "
                    >
                      Your Next Interview
                    </p>

                    <h2
                      className="
                        mt-1 text-xl
                        font-black
                        sm:text-2xl
                      "
                    >
                      {nextInterview.jobTitle}
                    </h2>

                    <p
                      className="
                        mt-1 text-sm
                        font-medium
                        text-blue-100
                      "
                    >
                      {nextInterview.company}
                    </p>

                    <div
                      className="
                        mt-4 flex flex-wrap
                        gap-x-5 gap-y-2
                        text-xs font-medium
                        text-blue-100
                        sm:text-sm
                      "
                    >
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />

                        {formatDate(
                          nextInterview.date
                        )}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock3 className="h-4 w-4" />

                        {formatTime(
                          nextInterview.time
                        )}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Video className="h-4 w-4" />

                        {nextInterview.mode}
                      </span>
                    </div>
                  </div>
                </div>

                {nextInterview.meetingLink && (
                  <a
                    href={
                      nextInterview.meetingLink
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2 rounded-xl
                      bg-white
                      px-5 py-3
                      text-sm font-bold
                      text-blue-700
                      shadow-lg
                      transition-all
                      hover:-translate-y-0.5
                      hover:bg-blue-50
                    "
                  >
                    <Video className="h-4 w-4" />

                    Join Interview
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ===================================================
            FILTERS
        =================================================== */}

        <section
          className="
            mt-7 overflow-hidden
            rounded-3xl
            border border-slate-200
            bg-white
            shadow-lg
            shadow-slate-200/40
          "
        >
          <div className="p-4 sm:p-5">

            <div className="mb-4 flex items-center gap-3">

              <div
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-blue-100
                  bg-blue-50
                "
              >
                <Search
                  className="h-4 w-4 text-blue-600"
                />
              </div>

              <div>
                <h2
                  className="
                    text-sm font-bold
                    text-slate-900
                  "
                >
                  Find an interview
                </h2>

                <p
                  className="
                    text-xs text-slate-400
                  "
                >
                  Search your real interview schedule
                </p>
              </div>
            </div>

            <div
              className="
                flex flex-col gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >

              {/* Tabs */}
              <div className="flex flex-wrap gap-2">

                {[
                  "All",
                  "Upcoming",
                  "Completed",
                  "Cancelled",
                ].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab)
                    }
                    className={`
                      rounded-xl
                      px-4 py-2.5
                      text-xs font-bold
                      transition-all
                      sm:text-sm
                      ${
                        activeTab === tab
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                      }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div
                className="
                  relative w-full
                  lg:max-w-sm
                "
              >
                <Search
                  className="
                    absolute left-4 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  placeholder="Search interviews..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="
                    h-11 w-full
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    pl-11 pr-4
                    text-sm
                    outline-none
                    transition-all
                    focus:border-blue-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div
            className="
              mt-7 rounded-3xl
              border border-slate-200
              bg-white
              p-12 text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto flex h-12 w-12
                items-center justify-center
                rounded-2xl
                bg-blue-50
              "
            >
              <CalendarDays
                className="
                  h-6 w-6
                  animate-pulse
                  text-blue-600
                "
              />
            </div>

            <p
              className="
                mt-4 text-sm
                font-bold text-slate-800
              "
            >
              Loading your interviews...
            </p>

            <p
              className="
                mt-1 text-xs
                text-slate-400
              "
            >
              Checking your scheduled interviews.
            </p>
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && !loading && (
          <div
            className="
              mt-7 flex items-start gap-3
              rounded-2xl
              border border-red-200
              bg-red-50
              px-4 py-4
              text-sm font-semibold
              text-red-700
            "
          >
            <CircleAlert
              className="
                mt-0.5 h-5 w-5
                shrink-0
              "
            />

            <div className="flex-1">

              <p>{error}</p>

              <button
                type="button"
                onClick={fetchInterviews}
                className="
                  mt-2 font-bold
                  text-red-800
                  underline
                  underline-offset-2
                "
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* ===================================================
            LIST TITLE
        =================================================== */}

        {!loading && !error && (
          <>
            <div
              className="
                mb-5 mt-9
                flex flex-col gap-2
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>

                <div className="flex items-center gap-2">

                  <h2
                    className="
                      text-xl font-black
                      tracking-tight
                      text-slate-950
                      sm:text-2xl
                    "
                  >
                    {activeTab === "All"
                      ? "All Interviews"
                      : `${activeTab} Interviews`}
                  </h2>

                  <span
                    className="
                      flex h-7 min-w-7
                      items-center
                      justify-center
                      rounded-full
                      bg-blue-100
                      px-2
                      text-xs font-bold
                      text-blue-700
                    "
                  >
                    {filteredInterviews.length}
                  </span>
                </div>

                <p
                  className="
                    mt-1.5 text-sm
                    text-slate-400
                  "
                >
                  Only interviews actually
                  scheduled for your applications
                  are shown here.
                </p>
              </div>
            </div>

            {/* =================================================
                INTERVIEW LIST
            ================================================= */}

            <div className="space-y-4">

              {filteredInterviews.length > 0 ? (
                filteredInterviews.map(
                  (interview) => (
                    <InterviewCard
                      key={interview.id}
                      interview={interview}
                    />
                  )
                )
              ) : (
                <div
                  className="
                    relative overflow-hidden
                    rounded-3xl
                    border border-dashed
                    border-slate-300
                    bg-white
                    px-6 py-20
                    text-center
                    shadow-sm
                  "
                >
                  <div
                    className="
                      relative
                    "
                  >

                    <div
                      className="
                        mx-auto flex
                        h-20 w-20
                        items-center
                        justify-center
                        rounded-3xl
                        border
                        border-blue-100
                        bg-blue-50
                      "
                    >
                      <CalendarDays
                        className="
                          h-8 w-8
                          text-blue-500
                        "
                      />
                    </div>

                    <h3
                      className="
                        mt-6 text-xl
                        font-black
                        text-slate-950
                      "
                    >
                      {interviewsData.length === 0
                        ? "No interviews scheduled"
                        : "No interviews found"}
                    </h3>

                    <p
                      className="
                        mx-auto mt-2
                        max-w-md
                        text-sm leading-6
                        text-slate-500
                      "
                    >
                      {interviewsData.length === 0
                        ? "You have no interviews scheduled yet. When an admin schedules an interview for one of your applications, it will appear here."
                        : "No interview matches your current search or filter."}
                    </p>

                    {interviewsData.length === 0 ? (
                      <Link
                        to="/dashboard/applications"
                        className="
                          mt-6 inline-flex
                          items-center gap-2
                          rounded-xl
                          bg-blue-600
                          px-5 py-3
                          text-sm font-bold
                          text-white
                          shadow-md
                          transition
                          hover:bg-blue-700
                        "
                      >
                        View My Applications

                        <ArrowUpRight
                          className="h-4 w-4"
                        />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setActiveTab("All");
                        }}
                        className="
                          mt-6 rounded-xl
                          bg-blue-600
                          px-5 py-3
                          text-sm font-bold
                          text-white
                          shadow-md
                          transition
                          hover:bg-blue-700
                        "
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ===================================================
            PREPARATION TIP
        =================================================== */}

        <section
          className="
            relative mt-8 overflow-hidden
            rounded-3xl
            bg-gradient-to-br
            from-[#07152f]
            via-[#103779]
            to-[#2055c9]
            text-white
            shadow-2xl
            shadow-blue-900/15
          "
        >
          <div
            className="
              absolute -right-20 -top-24
              h-72 w-72
              rounded-full
              bg-blue-400/20
              blur-3xl
            "
          />

          <div
            className="
              relative flex flex-col
              gap-5 p-5
              sm:p-6
              md:flex-row
              md:items-center
              lg:p-7
            "
          >

            <div
              className="
                flex h-12 w-12
                shrink-0 items-center
                justify-center
                rounded-2xl
                border border-white/10
                bg-white/10
              "
            >
              <CircleAlert
                className="h-5 w-5"
              />
            </div>

            <div className="flex-1">

              <p
                className="
                  text-xs font-bold
                  uppercase
                  tracking-[0.15em]
                  text-blue-200
                "
              >
                Interview Preparation
              </p>

              <h3
                className="
                  mt-1 text-base
                  font-bold
                  sm:text-lg
                "
              >
                Be ready before your interview
              </h3>

              <p
                className="
                  mt-1 max-w-2xl
                  text-xs leading-6
                  text-blue-100/75
                  sm:text-sm
                "
              >
                Review the job description,
                prepare examples of your work,
                and test your camera and
                microphone before joining.
              </p>
            </div>

            <Link
              to="/jobs"
              className="
                inline-flex
                items-center
                justify-center
                gap-2 rounded-xl
                bg-white
                px-5 py-3
                text-sm font-bold
                text-slate-900
                transition
                hover:-translate-y-0.5
                hover:bg-blue-50
              "
            >
              Explore Jobs

              <ArrowUpRight
                className="h-4 w-4"
              />
            </Link>
          </div>
        </section>
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
    <div
      className="
        group relative overflow-hidden
        rounded-3xl
        border border-slate-200
        bg-white
        p-4 shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-slate-200/60
        sm:p-5
      "
    >
      <div
        className={`
          absolute bottom-0 left-0 top-0
          w-1 bg-gradient-to-b
          ${accent}
        `}
      />

      <div
        className="
          flex items-start
          justify-between gap-3
        "
      >
        <div>

          <p
            className="
              text-xs font-semibold
              text-slate-400
              sm:text-sm
            "
          >
            {title}
          </p>

          <p
            className="
              mt-2 text-2xl
              font-black
              tracking-tight
              text-slate-950
              sm:text-3xl
            "
          >
            {value}
          </p>

          <p
            className="
              mt-1 text-[11px]
              text-slate-400
              sm:text-xs
            "
          >
            {subtitle}
          </p>
        </div>

        <div
          className={`
            flex h-10 w-10
            shrink-0
            items-center justify-center
            rounded-2xl
            ${iconBg}
            transition-transform
            duration-300
            group-hover:scale-110
            sm:h-11 sm:w-11
          `}
        >
          <Icon
            className={`
              h-5 w-5
              ${iconColor}
            `}
          />
        </div>
      </div>
    </div>
  );
}