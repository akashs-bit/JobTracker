
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Upload,
  Send,
  MapPin,
  Briefcase,
  IndianRupee,
  CheckCircle2,
  Code2,
  ExternalLink,
  Mail,
  Phone,
  User,
  FileText,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

/* =========================================================
   JOB DATA
   Real job data is loaded from PHP + MySQL using the job ID
   from the URL. No hardcoded/fake job data is used.
========================================================= */

const JOB_API = "https://jobtracker-w9yo.onrender.com/api/jobs/get-by-id.php";

/* =========================================================
   INPUT STYLE
========================================================= */

const inputClass =
  "w-full px-4 py-3.5 pl-11 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300";

/* =========================================================
   COMPONENT
========================================================= */

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* =======================================================
     REAL JOB DATA
     Load the selected job from PHP + MySQL using the URL ID.
  ======================================================= */

  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState("");

  /* =======================================================
     LOGIN CHECK
     User must be logged in before applying
  ======================================================= */

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("jobtracker_logged_in") === "true";

    if (!isLoggedIn) {
      navigate("/login", {
        replace: true,
        state: {
          from: `/jobs/${id}/apply`,
          message: "Please login to apply for this job.",
        },
      });
      return;
    }

    setAuthChecked(true);
  }, [id, navigate]);

  /* =======================================================
     LOAD SELECTED JOB FROM BACKEND
  ======================================================= */

  useEffect(() => {
    if (!authChecked) return;

    const loadJob = async () => {
      setJobLoading(true);
      setJobError("");

      try {
        const response = await fetch(`${JOB_API}?id=${encodeURIComponent(id)}`);
        const responseText = await response.text();

        let result;

        try {
          result = JSON.parse(responseText);
        } catch (error) {
          throw new Error("Server returned an invalid job response.");
        }

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Failed to load job details.");
        }

        // Support the common API response shapes: { job }, { data }, or direct object.
        const rawJob = result.job || result.data || result;

        if (!rawJob || !rawJob.id) {
          throw new Error("Job not found.");
        }

        const skillsValue = rawJob.skills;
        const normalizedJob = {
          id: Number(rawJob.id ?? rawJob.job_id ?? rawJob.jobId),
          title: rawJob.title || rawJob.job_title || "",
          company: rawJob.company || "",
          location: rawJob.location || "",
          type: rawJob.type || rawJob.job_type || rawJob.jobType || "",
          experience: rawJob.experience || "",
          salary: String(rawJob.salary ?? ""),
          mode: rawJob.mode || rawJob.work_mode || rawJob.workMode || "",
          logo:
            rawJob.logo ||
            (rawJob.company || "Company")
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((word) => word[0])
              .join("")
              .toUpperCase(),
          skills: Array.isArray(skillsValue)
            ? skillsValue
            : typeof skillsValue === "string"
              ? skillsValue
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)
              : [],
          description: rawJob.description || "",
          requirements: rawJob.requirements || "",
        };

        setJob(normalizedJob);
      } catch (error) {
        console.error("Load job error:", error);
        setJob(null);
        setJobError(error.message || "Unable to load job details.");
      } finally {
        setJobLoading(false);
      }
    };

    loadJob();
  }, [authChecked, id]);

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    coverLetter: "",
    resume: null,
    agree: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =======================================================
     HANDLE INPUT CHANGE
  ======================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    /* Resume validation */
    if (type === "file") {
      const file = files?.[0];

      if (!file) {
        return;
      }

      /* Maximum 5MB */
      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        alert("Resume must be smaller than 5MB.");
        e.target.value = "";
        return;
      }

      /* Allowed file types */
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF, DOC, or DOCX file.");
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =======================================================
     HANDLE SUBMIT
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Login check */
    const isLoggedIn =
      localStorage.getItem("jobtracker_logged_in") === "true";

    if (!isLoggedIn) {
      navigate("/login", {
        replace: true,
        state: {
          from: `/jobs/${id}/apply`,
          message: "Please login to apply for this job.",
        },
      });
      return;
    }

    /* Job check */
    if (!job) {
      alert("Job not found.");
      return;
    }

    /* Agreement check */
    if (!formData.agree) {
      alert("Please confirm that your information is accurate.");
      return;
    }

    /* Resume check */
    if (!formData.resume) {
      alert("Please upload your resume.");
      return;
    }

    setIsSubmitting(true);

    /*
    |--------------------------------------------------------------------------
    | Get logged-in user
    |--------------------------------------------------------------------------
    */

    let loggedInUser = null;

    try {
      loggedInUser = JSON.parse(
        localStorage.getItem("jobtracker_user") || "null"
      );
    } catch (error) {
      loggedInUser = null;
    }

    const userId =
      loggedInUser?.id ??
      loggedInUser?.user_id ??
      loggedInUser?.userId ??
      null;

    if (!userId || Number(userId) <= 0) {
      localStorage.removeItem("jobtracker_logged_in");

      alert("Your login session is invalid. Please login again.");

      navigate("/login", {
        replace: true,
        state: {
          from: `/jobs/${id}/apply`,
          message: "Please login to apply for this job.",
        },
      });

      setIsSubmitting(false);
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Send application to PHP + MySQL
    |--------------------------------------------------------------------------
    */

    const data = new FormData();

    data.append("user_id", String(userId));
    data.append("job_id", String(job.id));
    data.append("full_name", formData.fullName.trim());
    data.append("email", formData.email.trim());
    data.append("phone", formData.phone.trim());
    data.append("cover_letter", formData.coverLetter.trim());

    if (formData.resume) {
      data.append("resume", formData.resume);
    }

    try {
      const response = await fetch(
        "https://jobtracker-w9yo.onrender.com/api/applications/apply.php",
        {
          method: "POST",
          body: data,
        }
      );

      const responseText = await response.text();

      let result;

      try {
        result = JSON.parse(responseText);
      } catch (error) {
        console.error("Invalid PHP response:", responseText);

        throw new Error(
          "Server returned an invalid response. Check the PHP API."
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to submit application."
        );
      }

      console.log("Application saved:", result);

      setIsSubmitting(false);
      setSubmitted(true);

    } catch (error) {
      console.error("Application submission error:", error);

      setIsSubmitting(false);

      alert(
        error.message ||
          "Unable to submit application. Please try again."
      );
    }
  };

  /* =======================================================
     AUTH CHECK SCREEN
  ======================================================= */

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center">
            <span className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          </div>
          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Checking your login...
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     JOB LOADING
  ======================================================= */

  if (jobLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center">
            <span className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          </div>
          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Loading job details...
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Fetching the selected job from the database.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     JOB NOT FOUND
  ======================================================= */

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-red-100 flex items-center justify-center">
            <FileText className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-800">
            Job Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            {jobError || "The job you're looking for does not exist."}
          </p>

          <Link
            to="/jobs"
            className="inline-flex mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  /* =======================================================
     SUCCESS SCREEN
  ======================================================= */

  if (submitted) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center px-4 py-12">
        {/* Background Glow */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />

        {/* Success Card */}
        <div className="relative w-full max-w-xl">
          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 sm:p-12 text-center animate-[fadeIn_0.6s_ease-out]">
            {/* Success Icon */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />

              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-500/30">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Success Badge */}
            <div className="mt-7 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Application Successfully Sent
            </div>

            {/* Heading */}
            <h1 className="mt-5 text-3xl sm:text-4xl font-black text-slate-900">
              You're all set!
            </h1>

            {/* Description */}
            <p className="mt-4 text-slate-600 leading-relaxed">
              Your application for{" "}
              <span className="font-bold text-slate-900">
                {job.title}
              </span>{" "}
              at{" "}
              <span className="font-bold text-blue-600">
                {job.company}
              </span>{" "}
              has been submitted successfully.
            </p>

            {/* Buttons */}
            <div className="grid sm:grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                Go to Dashboard
              </button>

              <button
                onClick={() => navigate("/jobs")}
                className="px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold hover:bg-slate-100 hover:-translate-y-1 transition-all duration-300"
              >
                Browse More Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Animation */}
        <style>
          {`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px) scale(0.98);
              }

              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}
        </style>
      </div>
    );
  }

  /* =======================================================
     MAIN APPLICATION PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-8 sm:py-12 overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <Link
          to={`/jobs/${job.id}`}
          className="group inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold mb-8 transition-all duration-300"
        >
          <span className="w-9 h-9 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:-translate-x-1 group-hover:border-blue-200 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </span>

          Back to Job Details
        </Link>

        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            Job Application
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            Apply for your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              next opportunity.
            </span>
          </h1>

          <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl">
            Complete your application and take the next step toward your
            career goals.
          </p>
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid lg:grid-cols-[1fr_370px] gap-8 items-start">
          {/* =================================================
              APPLICATION FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl shadow-slate-300/30 p-6 sm:p-8 lg:p-10"
          >
            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Tell us a little about yourself
                </p>
              </div>
            </div>

            {/* =================================================
                INPUTS
            ================================================= */}

            <div className="grid sm:grid-cols-2 gap-5 mt-7">
              {/* Full Name */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* GitHub */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  GitHub Profile <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />

                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    required
                    placeholder="https://github.com/username"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div className="group sm:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  LinkedIn Profile
                </label>

                <div className="relative">
                  <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />

                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourname"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                RESUME
            ================================================= */}

            <div className="mt-9 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Resume
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Upload your latest resume
                  </p>
                </div>
              </div>

              <label className="group relative flex flex-col items-center justify-center min-h-40 border-2 border-dashed border-blue-200 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-400 cursor-pointer transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:-translate-y-1 group-hover:shadow-lg transition-all duration-300">
                  <Upload className="w-7 h-7 text-blue-600" />
                </div>

                <span className="mt-4 text-sm font-bold text-slate-700 text-center px-4">
                  {formData.resume
                    ? formData.resume.name
                    : "Click to upload your resume"}
                </span>

                <span className="text-xs text-slate-500 mt-1">
                  PDF, DOC or DOCX • Max 5MB
                </span>

                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  required
                  className="hidden"
                />
              </label>
            </div>

            {/* =================================================
                COVER LETTER
            ================================================= */}

            <div className="mt-9 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Cover Letter
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Explain why you're a great fit
                  </p>
                </div>
              </div>

              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                required
                rows="7"
                placeholder="Tell the employer why you are interested in this role and what makes you a good fit..."
                className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/80 text-slate-800 placeholder:text-slate-400 outline-none resize-none transition-all duration-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              <p className="text-xs text-slate-400 mt-2">
                Keep your cover letter clear, professional and job-specific.
              </p>
            </div>

            {/* =================================================
                CONFIRMATION
            ================================================= */}

            <label className="flex items-start gap-3 mt-8 p-4 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-blue-50/50 hover:border-blue-100 transition-all">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer"
              />

              <span className="text-sm text-slate-600 leading-relaxed">
                I confirm that the information provided is accurate and
                complete.
              </span>
            </label>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full mt-6 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white font-bold text-base shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                  Submitting Application...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />

                  Submit Application
                </>
              )}
            </button>

            {/* Security */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4" />

              Your application information is secure
            </div>
          </form>

          {/* =================================================
              JOB SUMMARY
          ================================================= */}

          <aside className="lg:sticky lg:top-8">
            <div className="bg-slate-950 rounded-[2rem] p-6 sm:p-7 text-white shadow-2xl shadow-blue-900/20 overflow-hidden relative">
              {/* Card Glow */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl" />

              <div className="relative">
                {/* Job Logo */}
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
                    {job.logo}
                  </div>

                  <span className="px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/20 text-blue-300 text-xs font-bold">
                    {job.type}
                  </span>
                </div>

                {/* Job Title */}
                <h2 className="mt-6 text-2xl font-black">
                  {job.title}
                </h2>

                <p className="mt-1 text-slate-400 font-medium">
                  {job.company}
                </p>

                {/* =================================================
                    JOB DETAILS
                ================================================= */}

                <div className="mt-7 space-y-4">
                  {/* Location */}
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-400" />
                    </div>

                    {job.location}
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                    </div>

                    {job.experience}
                  </div>

                  {/* Salary */}
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <IndianRupee className="w-4 h-4 text-blue-400" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                        Salary
                      </p>
                      <p className="text-base font-semibold text-white">
                        {job.salary}
                      </p>
                    </div>
                  </div>

                  {/* Work Mode */}
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                    </div>

                    {job.mode}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-7" />

                {/* =================================================
                    APPLICATION TIPS
                ================================================= */}

                <h3 className="font-bold text-white">
                  Application Tips
                </h3>

                <div className="mt-4 space-y-3">
                  {[
                    "Keep your resume updated",
                    "Use a professional GitHub profile",
                    "Write a job-specific cover letter",
                    "Double-check your contact details",
                  ].map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 text-sm text-slate-400"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />

                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;

