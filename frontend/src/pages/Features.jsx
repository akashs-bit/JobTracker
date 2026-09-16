import {
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Filter,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: BriefcaseBusiness,
    title: "Track Applications",
    description:
      "Keep all your job applications organized in one place and never lose track of where you applied.",
  },
  {
    icon: Search,
    title: "Find Better Jobs",
    description:
      "Search jobs by title, skills, location, experience, salary, and work mode to find relevant opportunities.",
  },
  {
    icon: ClipboardCheck,
    title: "Manage Applications",
    description:
      "Track every application from the moment you apply until you receive an offer.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Understand your job search progress with simple statistics and application insights.",
  },
  {
    icon: BellRing,
    title: "Interview Tracking",
    description:
      "Keep upcoming interviews, interview rounds, dates, and meeting details organized.",
  },
  {
    icon: FileText,
    title: "Application Status",
    description:
      "Know exactly whether your application is Applied, Shortlisted, Interviewed, Selected, or Rejected.",
  },
  {
    icon: Filter,
    title: "Smart Filters",
    description:
      "Quickly narrow down job opportunities using powerful search and filtering options.",
  },
  {
    icon: LayoutDashboard,
    title: "Personal Dashboard",
    description:
      "Get a clear overview of your applications, saved jobs, interviews, and job-search progress.",
  },
  {
    icon: ShieldCheck,
    title: "Organized & Secure",
    description:
      "Keep your career information organized with a simple and focused job-search workspace.",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Save Time",
    text: "Spend less time maintaining spreadsheets and more time preparing for opportunities.",
  },
  {
    icon: Target,
    title: "Stay Focused",
    text: "Keep your job search structured so you always know your next step.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    text: "See how your applications and interviews are progressing over time.",
  },
  {
    icon: UserCheck,
    title: "Build Your Career",
    text: "Manage your job search from one professional dashboard.",
  },
];

const Features = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* HERO */}
      <section className="relative isolate">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-40 -z-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
              <Sparkles size={16} />
              Everything You Need for Your Job Search
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Powerful Features for a{" "}
              <span className="text-blue-600">Smarter Job Search</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              JobTracker gives you everything you need to discover jobs, manage
              applications, prepare for interviews, and stay organized
              throughout your career journey.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                <Search size={19} />
                Explore Jobs
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600"
              >
                <Users size={19} />
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mb-12 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Everything in one place
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Features Built for Job Seekers
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            From finding the right opportunity to tracking your application
            progress, JobTracker keeps your entire job search organized.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/10"
              >
                {/* Top hover line */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />

                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <span className="text-sm font-bold text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 transition group-hover:text-blue-600">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 transition duration-300 group-hover:opacity-100">
                  <CheckCircle2 size={16} />
                  Built for your career journey
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DASHBOARD EXPERIENCE */}
      <section className="relative overflow-hidden bg-[#0d1f46] py-20 sm:py-24">
        <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
              <LayoutDashboard size={16} />
              Your Career Command Center
            </div>

            <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              One Dashboard.
              <br />
              <span className="text-blue-400">Your Entire Job Search.</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Stop switching between spreadsheets, notes, emails, and multiple
              websites. JobTracker gives you one organized place to manage your
              complete job-search journey.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Application overview",
                "Upcoming interviews",
                "Saved opportunities",
                "Progress tracking",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <CheckCircle2 className="shrink-0 text-blue-400" size={19} />
                  <span className="text-sm font-semibold text-slate-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur">
              <div className="overflow-hidden rounded-2xl bg-slate-100">
                {/* Mock topbar */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Welcome back
                    </p>
                    <p className="font-bold text-slate-900">
                      Your Job Dashboard
                    </p>
                  </div>

                  <div className="h-9 w-9 rounded-full bg-blue-600 text-center text-sm font-bold leading-9 text-white">
                    J
                  </div>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-xs text-slate-500">Applications</p>
                    <div className="mt-2 flex items-end justify-between">
                      <span className="text-3xl font-extrabold text-slate-900">
                        24
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        +12%
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-xs text-slate-500">Interviews</p>
                    <div className="mt-2 flex items-end justify-between">
                      <span className="text-3xl font-extrabold text-slate-900">
                        06
                      </span>
                      <span className="text-xs font-bold text-blue-600">
                        Upcoming
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm sm:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="font-bold text-slate-900">
                        Recent Applications
                      </p>
                      <span className="text-xs font-semibold text-blue-600">
                        View all
                      </span>
                    </div>

                    {[
                      ["Frontend Developer", "TechNova Solutions"],
                      ["MERN Stack Developer", "CodeSphere Technologies"],
                      ["Python Developer", "DataBridge Labs"],
                    ].map(([role, company]) => (
                      <div
                        key={role}
                        className="flex items-center gap-3 border-t border-slate-100 py-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                          {company.slice(0, 2).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {role}
                          </p>
                          <p className="text-xs text-slate-500">{company}</p>
                        </div>

                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
                          Applied
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-12 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Why JobTracker
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Make Your Job Search Easier
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            A simple system can make a big difference when you are applying for
            multiple opportunities.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-white/80 bg-white/70 p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={23} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {benefit.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-12 text-center shadow-2xl shadow-blue-900/20 sm:px-10 sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
            <Sparkles size={27} />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Take Control of Your Job Search?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Create your free JobTracker account and start organizing your career
            journey today.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Get Started Free
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

export default Features;
