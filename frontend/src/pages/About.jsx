import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Heart,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Target,
    title: "Stay Focused",
    description:
      "Keep your job search organized and focus your energy on finding the right opportunities.",
  },
  {
    icon: Zap,
    title: "Work Smarter",
    description:
      "Manage applications, interviews, saved jobs, and progress from one simple platform.",
  },
  {
    icon: TrendingUp,
    title: "Keep Growing",
    description:
      "Understand your progress and continuously improve your job-search strategy.",
  },
];

const benefits = [
  "Track all your job applications",
  "Find opportunities that match your skills",
  "Manage interviews and important dates",
  "Save interesting jobs for later",
  "Monitor application status",
  "View your job-search progress",
];

const stats = [
  {
    value: "500+",
    label: "Companies",
    icon: BriefcaseBusiness,
  },
  {
    value: "1K+",
    label: "Job Opportunities",
    icon: Search,
  },
  {
    value: "100%",
    label: "Organized",
    icon: BarChart3,
  },
  {
    value: "24/7",
    label: "Access",
    icon: Users,
  },
];

const About = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* ================= HERO ================= */}
      <section className="relative isolate">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-32 -z-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
              <Sparkles size={16} />
              About JobTracker
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your Job Search,
              <br className="hidden sm:block" />
              <span className="text-blue-600"> Organized & Simplified</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              JobTracker is designed to make the job-search process simpler,
              more organized, and less stressful by bringing your career
              opportunities into one place.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Explore Jobs
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-white/80 bg-white/80 shadow-xl shadow-blue-900/5 backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`group p-6 text-center transition hover:bg-blue-50/60 sm:p-7 ${
                  index !== stats.length - 1
                    ? "border-b border-slate-200 sm:border-r lg:border-b-0"
                    : ""
                } ${index === 1 ? "sm:border-r-0 lg:border-r" : ""}`}
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={21} />
                </div>

                <p className="mt-4 text-3xl font-extrabold text-slate-900">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= ABOUT CONTENT ================= */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left visual */}
          <div className="relative">
            <div className="absolute -left-5 -top-5 h-24 w-24 rounded-3xl bg-blue-200/50 blur-xl" />

            <div className="relative overflow-hidden rounded-3xl bg-[#0d1f46] p-7 shadow-2xl sm:p-9">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg">
                    <BriefcaseBusiness size={24} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-blue-200">
                      Welcome to
                    </p>
                    <h3 className="text-xl font-extrabold text-white">
                      JobTracker
                    </h3>
                  </div>
                </div>

                <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                  Everything You Need
                  <br />
                  <span className="text-blue-400">For Your Career Journey</span>
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
                  Finding a job can involve dozens of applications, follow-ups,
                  interviews, and deadlines. JobTracker gives you a simple
                  workspace to keep everything organized.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Organize applications",
                    "Track your progress",
                    "Stay ready for interviews",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-blue-400"
                      />
                      <span className="text-sm font-semibold text-slate-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-5 -right-3 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block lg:-right-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp size={20} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">Career Progress</p>
                  <p className="font-bold text-slate-900">
                    Keep Moving Forward
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Who We Are
            </span>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              Built to Make Job Searching
              <span className="text-blue-600"> Less Complicated</span>
            </h2>

            <p className="mt-6 leading-7 text-slate-600">
              JobTracker is a job-search management platform created to help job
              seekers stay organized while looking for their next opportunity.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Instead of keeping application details across spreadsheets, notes,
              emails, and different platforms, you can manage your journey from
              one focused dashboard.
            </p>

            <div className="mt-7 space-y-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 text-sm font-semibold text-slate-700"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <CheckCircle2 size={15} />
                  </div>

                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="relative overflow-hidden bg-[#0d1f46] py-20 sm:py-24">
        <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400">
            <Heart size={27} />
          </div>

          <span className="mt-6 block text-sm font-bold uppercase tracking-widest text-blue-300">
            Our Mission
          </span>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Helping Job Seekers Move
            <span className="text-blue-400"> Forward With Confidence</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Our goal is simple: make the job-search process easier to manage.
            Whether you are applying for your first job, changing careers, or
            looking for your next opportunity, JobTracker helps you stay
            organized and focused.
          </p>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-12 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            What We Believe
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Designed Around Your Goals
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            JobTracker is built around a few simple principles that make your
            career journey easier to manage.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.title}
                className="group rounded-2xl border border-white/80 bg-white/80 p-7 text-center shadow-sm backdrop-blur transition duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl hover:shadow-blue-900/10"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={25} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-blue-600">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= HOW IT HELPS ================= */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-7 shadow-lg sm:p-10 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Simple & Effective
              </span>

              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
                Spend Less Time Organizing.
                <br />
                <span className="text-blue-600">More Time Getting Hired.</span>
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-600">
                Your job search should be about discovering opportunities and
                preparing for them — not maintaining complicated spreadsheets.
              </p>

              <Link
                to="/features"
                className="mt-7 inline-flex items-center gap-2 font-bold text-blue-600 transition hover:gap-3"
              >
                Explore all features
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Search,
                  title: "Discover",
                  text: "Find relevant opportunities.",
                },
                {
                  icon: ClipboardCheck,
                  title: "Apply",
                  text: "Keep applications organized.",
                },
                {
                  icon: BarChart3,
                  title: "Track",
                  text: "Monitor your progress.",
                },
                {
                  icon: ShieldCheck,
                  title: "Achieve",
                  text: "Move toward your career goals.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-4 font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-5 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-12 text-center shadow-2xl shadow-blue-900/20 sm:px-10 sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
            <Sparkles size={27} />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
            Your Next Opportunity Starts Here
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Take control of your job search and keep your career journey
            organized with JobTracker.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Create Free Account
            </Link>

            <Link
              to="/jobs"
              className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white transition hover:bg-white/20"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
