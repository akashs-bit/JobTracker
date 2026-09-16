import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  Banknote,
  Building2,
  CheckCircle2,
  FileText,
  CircleAlert,
  LoaderCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const JOB_API = "http://localhost/backend/api/jobs/get-by-id.php";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [isSaved, setIsSaved] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | CHECK SAVED JOB
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    try {
      const saved =
        JSON.parse(localStorage.getItem("jobtracker_saved_jobs")) || [];

      setIsSaved(saved.includes(Number(id)));
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | FETCH JOB
  |--------------------------------------------------------------------------
  */

  const fetchJob = async () => {
    try {
      setLoading(true);

      setError("");

      setJob(null);

      const response = await fetch(`${JOB_API}?id=${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch job");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Job not found");
      }

      setJob(data.job);
    } catch (error) {
      console.error("Job Details Error:", error);

      setError(error.message || "Unable to load job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | SAVE / UNSAVE
  |--------------------------------------------------------------------------
  */

  const toggleSave = () => {
    try {
      const saved =
        JSON.parse(localStorage.getItem("jobtracker_saved_jobs")) || [];

      const jobId = Number(id);

      let updated;

      if (saved.includes(jobId)) {
        updated = saved.filter((savedId) => savedId !== jobId);

        setIsSaved(false);
      } else {
        updated = [...saved, jobId];

        setIsSaved(true);
      }

      localStorage.setItem("jobtracker_saved_jobs", JSON.stringify(updated));
    } catch (error) {
      console.error(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <LoaderCircle size={30} className="animate-spin text-blue-600" />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#102451]">
              Loading Job Details...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we fetch the job.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div
            className="
              w-full max-w-lg
              rounded-3xl
              border border-red-100
              bg-white/80
              p-8
              text-center
              shadow-xl
              backdrop-blur
              sm:p-10
            "
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <CircleAlert size={30} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#102451]">
              Job Not Found
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error || "The job you are looking for does not exist."}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={fetchJob}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5 py-3
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                <RotateCcw size={16} />
                Try Again
              </button>

              <Link
                to="/jobs"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  px-5 py-3
                  text-sm
                  font-bold
                  text-slate-600
                  transition
                  hover:bg-blue-50
                  hover:text-blue-600
                "
              >
                <ArrowLeft size={16} />
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d1f46] via-[#174ea6] to-[#2563eb]">
        {/* Glow */}

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          {/* BACK */}

          <Link
            to="/jobs"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-blue-100
              transition
              hover:text-white
            "
          >
            <ArrowLeft size={17} />
            Back to Jobs
          </Link>

          {/* MAIN HERO CARD */}

          <div
            className="
              mt-7
              rounded-3xl
              border border-white/15
              bg-white/10
              p-5
              shadow-2xl
              backdrop-blur-xl
              sm:p-7
              lg:p-8
            "
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* LEFT */}

              <div className="flex min-w-0 gap-4 sm:gap-5">
                {/* LOGO */}

                <div
                  className="
                    flex h-16 w-16
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white
                    text-lg
                    font-extrabold
                    text-blue-700
                    shadow-xl
                    sm:h-20
                    sm:w-20
                    sm:text-xl
                  "
                >
                  {job.logo || "CO"}
                </div>

                {/* DETAILS */}

                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-blue-100">
                    <Sparkles size={12} />
                    Job Opportunity
                  </div>

                  <h1
                    className="
                      text-2xl
                      font-extrabold
                      tracking-tight
                      text-white
                      sm:text-3xl
                      lg:text-4xl
                    "
                  >
                    {job.title}
                  </h1>

                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-blue-100 sm:text-base">
                    <Building2 size={17} />

                    {job.company}
                  </p>
                </div>
              </div>

              {/* SAVE */}

              <button
                type="button"
                onClick={toggleSave}
                className={`
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-5 py-3
                  text-sm
                  font-bold
                  transition-all
                  ${
                    isSaved
                      ? "bg-white text-blue-600 shadow-lg"
                      : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                  }
                `}
              >
                {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}

                {isSaved ? "Saved" : "Save Job"}
              </button>
            </div>

            {/* JOB META */}

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <HeroInfo
                icon={<MapPin size={17} />}
                label="Location"
                value={job.location}
              />

              <HeroInfo
                icon={<BriefcaseBusiness size={17} />}
                label="Job Type"
                value={job.type}
              />

              <HeroInfo
                icon={<Banknote size={17} />}
                label="Salary"
                value={job.salaryText}
              />

              <HeroInfo
                icon={<Clock3 size={17} />}
                label="Posted"
                value={job.posted}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-7 lg:grid-cols-[1fr_340px]">
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="space-y-6">
            {/* DESCRIPTION */}

            <section
              className="
                rounded-3xl
                border border-blue-100
                bg-white/80
                p-6
                shadow-[0_12px_40px_rgba(15,23,42,0.05)]
                backdrop-blur
                sm:p-7
              "
            >
              <SectionTitle
                icon={<FileText size={19} />}
                title="Job Description"
              />

              <div className="mt-5">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {job.description || "No job description provided."}
                </p>
              </div>
            </section>

            {/* REQUIREMENTS */}

            <section
              className="
                rounded-3xl
                border border-blue-100
                bg-white/80
                p-6
                shadow-[0_12px_40px_rgba(15,23,42,0.05)]
                backdrop-blur
                sm:p-7
              "
            >
              <SectionTitle
                icon={<CheckCircle2 size={19} />}
                title="Requirements"
              />

              {job.requirements ? (
                <div className="mt-5">
                  {job.requirements
                    .split(/\r?\n/)
                    .filter(Boolean)
                    .map((requirement, index) => (
                      <div key={index} className="mb-3 flex items-start gap-3">
                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <CheckCircle2 size={13} />
                        </div>

                        <p className="text-sm leading-6 text-slate-600">
                          {requirement.replace(/^[-•*]\s*/, "")}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500">
                  No specific requirements provided.
                </p>
              )}
            </section>

            {/* SKILLS */}

            <section
              className="
                rounded-3xl
                border border-blue-100
                bg-white/80
                p-6
                shadow-[0_12px_40px_rgba(15,23,42,0.05)]
                backdrop-blur
                sm:p-7
              "
            >
              <SectionTitle icon={<Sparkles size={19} />} title="Skills" />

              <div className="mt-5 flex flex-wrap gap-2.5">
                {(job.skills || []).length > 0 ? (
                  job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="
                        rounded-xl
                        border
                        border-blue-100
                        bg-blue-50
                        px-3.5
                        py-2
                        text-xs
                        font-bold
                        text-blue-700
                      "
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No skills listed.</p>
                )}
              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside>
            <div
              className="
                sticky top-24
                space-y-5
              "
            >
              {/* APPLY CARD */}

              <div
                className="
                  overflow-hidden
                  rounded-3xl
                  border border-blue-100
                  bg-white
                  shadow-[0_18px_50px_rgba(37,99,235,0.10)]
                "
              >
                <div className="bg-gradient-to-br from-[#102451] via-[#174ea6] to-[#2563eb] p-6">
                  <p className="text-xs font-semibold text-blue-100">
                    Interested in this opportunity?
                  </p>

                  <h3 className="mt-2 text-xl font-extrabold text-white">
                    Ready to Apply?
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-blue-100">
                    Take the next step and submit your application.
                  </p>
                </div>

                <div className="p-5">
                  <Link
                    to={`/jobs/${job.id}/apply`}
                    className="
                      flex w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-gradient-to-r
                      from-blue-600
                      to-indigo-600
                      px-5 py-3.5
                      text-sm
                      font-extrabold
                      text-white
                      shadow-lg
                      shadow-blue-500/20
                      transition-all
                      hover:-translate-y-0.5
                      hover:shadow-xl
                    "
                  >
                    Apply Now
                    <ArrowRight size={17} />
                  </Link>

                  <button
                    type="button"
                    onClick={toggleSave}
                    className="
                      mt-3
                      flex w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border border-slate-200
                      bg-slate-50
                      px-5 py-3
                      text-sm
                      font-bold
                      text-slate-600
                      transition
                      hover:border-blue-200
                      hover:bg-blue-50
                      hover:text-blue-600
                    "
                  >
                    {isSaved ? (
                      <BookmarkCheck size={16} />
                    ) : (
                      <Bookmark size={16} />
                    )}

                    {isSaved ? "Remove from Saved" : "Save Job"}
                  </button>
                </div>
              </div>

              {/* JOB SUMMARY */}

              <div
                className="
                  rounded-3xl
                  border border-blue-100
                  bg-white/80
                  p-6
                  shadow-sm
                  backdrop-blur
                "
              >
                <h3 className="text-base font-extrabold text-[#102451]">
                  Job Summary
                </h3>

                <div className="mt-5 space-y-4">
                  <SummaryItem
                    icon={<MapPin size={16} />}
                    label="Location"
                    value={job.location}
                  />

                  <SummaryItem
                    icon={<BriefcaseBusiness size={16} />}
                    label="Job Type"
                    value={job.type}
                  />

                  <SummaryItem
                    icon={<Clock3 size={16} />}
                    label="Experience"
                    value={job.experience}
                  />

                  <SummaryItem
                    icon={<Banknote size={16} />}
                    label="Salary"
                    value={job.salaryText}
                  />

                  <SummaryItem
                    icon={<Building2 size={16} />}
                    label="Work Mode"
                    value={job.mode}
                  />
                </div>
              </div>

              {/* TIP */}

              <div
                className="
                  rounded-3xl
                  border border-blue-100
                  bg-gradient-to-br
                  from-blue-50
                  to-indigo-50
                  p-6
                "
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Sparkles size={16} />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-[#102451]">
                      Application Tip
                    </h3>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      Make sure your resume highlights the skills required for
                      this position.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

/* =========================================================
   HERO INFO
========================================================= */

const HeroInfo = ({ icon, label, value }) => {
  return (
    <div
      className="
        rounded-2xl
        border border-white/10
        bg-white/10
        p-4
        backdrop-blur
      "
    >
      <div className="flex items-center gap-2 text-blue-200">
        {icon}

        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-bold text-white">
        {value || "Not specified"}
      </p>
    </div>
  );
};

/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = ({ icon, title }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
          flex h-10 w-10
          items-center
          justify-center
          rounded-xl
          bg-blue-100
          text-blue-600
        "
      >
        {icon}
      </div>

      <h2 className="text-lg font-extrabold text-[#102451]">{title}</h2>
    </div>
  );
};

/* =========================================================
   SUMMARY ITEM
========================================================= */

const SummaryItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div
        className="
          flex h-9 w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-blue-50
          text-blue-600
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-400">{label}</p>

        <p className="mt-0.5 text-sm font-bold text-slate-700">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
};

export default JobDetails;
