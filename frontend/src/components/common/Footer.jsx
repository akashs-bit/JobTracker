const Footer = () => {
  return (
    <footer className="bg-[#0d1b31] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">

          {/* BRAND */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                💼
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Job<span className="text-blue-400">Tracker</span>
                </h2>

                <p className="text-[10px] text-slate-400">
                  Track. Apply. Grow.
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
              JobTracker helps you organize your job search,
              track applications, and achieve your career goals.
            </p>

            {/* SOCIAL */}
            <div className="mt-5 flex gap-3">

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-sm font-bold text-slate-400 transition hover:border-blue-500 hover:text-white"
              >
                in
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-sm font-bold text-slate-400 transition hover:border-blue-500 hover:text-white"
              >
                𝕏
              </a>

              <a
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-sm font-bold text-slate-400 transition hover:border-blue-500 hover:text-white"
              >
                GH
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-sm font-bold text-slate-400 transition hover:border-blue-500 hover:text-white"
              >
                ▶
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-sm font-bold text-slate-400 transition hover:border-blue-500 hover:text-white"
              >
                ◎
              </a>

            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-5 text-sm font-semibold">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a href="/" className="transition hover:text-white">
                  Home
                </a>
              </li>

              <li>
                <a href="/jobs" className="transition hover:text-white">
                  Jobs
                </a>
              </li>

              <li>
                <a href="/#features" className="transition hover:text-white">
                  Features
                </a>
              </li>

              <li>
                <a href="/about" className="transition hover:text-white">
                  About
                </a>
              </li>

              <li>
                <a href="/contact" className="transition hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="mb-5 text-sm font-semibold">
              Resources
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a href="#" className="transition hover:text-white">
                  Blog
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Career Tips
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Interview Guide
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Resume Tips
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="mb-5 text-sm font-semibold">
              Legal
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a href="#" className="transition hover:text-white">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Terms of Service
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Cookie Policy
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* NEWSLETTER */}
        <div className="mt-10 border-t border-slate-700 pt-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>
              <h3 className="text-sm font-semibold">
                Subscribe to Our Newsletter
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Get the latest job search tips and updates.
              </p>
            </div>

            <div className="flex w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-l-lg border-0 px-4 py-3 text-sm text-slate-800 outline-none"
              />

              <button
                type="button"
                className="rounded-r-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Subscribe
              </button>
            </div>

          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-slate-700 pt-5 text-xs text-slate-400 md:flex-row">

          <p>
            © 2026 JobTracker. All rights reserved.
          </p>

          <p>
            Made with{" "}
            <span className="text-red-500">♥</span>{" "}
            for Job Seekers
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;