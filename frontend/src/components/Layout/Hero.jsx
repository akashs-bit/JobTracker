import React from "react";
import {
  ArrowRight,
  Check,
  PlayCircle,
  CalendarDays,
  CheckCircle2,
  Gift,
  BarChart3,
  Rocket,
  Users,
  Link2,
  Heart,
  Building2,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute -left-48 top-10 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-3xl" />

      <div className="pointer-events-none absolute -right-48 top-20 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-250px] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-100/30 blur-3xl" />

      {/* =====================================================
          CONTAINER
      ====================================================== */}

      <div className="relative mx-auto max-w-[1250px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-[70px]">

        {/* =====================================================
            HERO GRID
        ====================================================== */}

        <div className="grid items-center lg:grid-cols-[0.98fr_1.02fr]">

          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <div className="relative z-20">

            {/* Badge */}

            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-blue-100
                bg-blue-50
                px-4
                py-2
                text-xs
                font-semibold
                text-blue-600
                shadow-sm
                sm:text-sm
              "
            >
              <Rocket size={15} />
              Track · Apply · Grow
            </div>

            {/* Heading */}

            <h1
              className="
                max-w-[610px]
                text-[43px]
                font-extrabold
                leading-[1.08]
                tracking-[-1.5px]
                text-[#102451]
                sm:text-[52px]
                lg:text-[55px]
                xl:text-[61px]
              "
            >
              Your Career
              <br />

              Journey,{" "}

              <span
                className="
                  text-blue-600
                  underline
                  decoration-blue-200
                  decoration-wavy
                  decoration-[2px]
                  underline-offset-[7px]
                "
              >
                Organized
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-5
                max-w-[590px]
                text-[15px]
                leading-7
                text-slate-600
                sm:text-base
              "
            >
              Track your job applications, manage interviews, set reminders
              and never miss an opportunity. Take control of your career and
              build your dream job with JobTracker.
            </p>

            {/* Buttons */}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">

              <button
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-blue-200
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-blue-700
                  hover:shadow-blue-300
                "
              >
                Get Started Free
                <ArrowRight size={17} />
              </button>

              <button
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  text-[#102451]
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-blue-200
                  hover:bg-blue-50
                  hover:text-blue-600
                "
              >
                <PlayCircle
                  size={20}
                  className="text-blue-600"
                />
                Watch Demo
              </button>

            </div>

            {/* Trust */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                gap-x-6
                gap-y-3
                text-xs
                font-medium
                text-slate-500
                sm:text-sm
              "
            >

              <div className="flex items-center gap-2">
                <Check
                  size={17}
                  className="rounded-full bg-emerald-500 p-0.5 text-white"
                />
                Free to use
              </div>

              <div className="flex items-center gap-2">
                <Check
                  size={17}
                  className="rounded-full bg-emerald-500 p-0.5 text-white"
                />
                No credit card required
              </div>

              <div className="flex items-center gap-2">
                <Check
                  size={17}
                  className="rounded-full bg-emerald-500 p-0.5 text-white"
                />
                Trusted by job seekers
              </div>

            </div>
          </div>

          {/* =================================================
              RIGHT SIDE VISUAL
          ================================================== */}

          <div
            className="
              relative
              mx-auto
              mt-10
              h-[440px]
              w-full
              max-w-[650px]
              lg:mt-0
            "
          >

            {/* Main glow */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-8
                left-1/2
                h-[130px]
                w-[70%]
                -translate-x-1/2
                rounded-full
                bg-blue-200/50
                blur-3xl
              "
            />

            {/* =================================================
                APPLICATION CARD
            ================================================== */}

            <div
              className="
                absolute
                left-[2%]
                top-[7%]
                z-30
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-100
                bg-white
                px-4
                py-3
                shadow-[0_12px_35px_rgba(37,99,235,0.12)]
                animate-[bounce_4s_ease-in-out_infinite]
                sm:left-[4%]
              "
            >
              <CheckCircle2
                size={26}
                className="rounded-full bg-emerald-500 p-1 text-white"
              />

              <div>
                <p className="text-[10px] font-medium text-slate-400">
                  Application
                </p>

                <p className="text-sm font-bold text-[#102451]">
                  Submitted
                </p>
              </div>
            </div>

            {/* =================================================
                INTERVIEW CARD
            ================================================== */}

            <div
              className="
                absolute
                right-[12%]
                top-[0%]
                z-30
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-100
                bg-white
                px-4
                py-3
                shadow-[0_12px_35px_rgba(37,99,235,0.12)]
                animate-[bounce_5s_ease-in-out_infinite_1s]
              "
            >
              <CalendarDays
                size={26}
                className="text-blue-600"
              />

              <div>
                <p className="text-[10px] font-medium text-slate-400">
                  Interview
                </p>

                <p className="text-sm font-bold text-[#102451]">
                  Scheduled
                </p>
              </div>
            </div>

            {/* =================================================
                OFFER CARD
            ================================================== */}

            <div
              className="
                absolute
                right-[3%]
                top-[24%]
                z-30
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-100
                bg-white
                px-4
                py-3
                shadow-[0_12px_35px_rgba(37,99,235,0.12)]
                animate-[bounce_4.5s_ease-in-out_infinite_0.5s]
              "
            >
              <Gift
                size={26}
                className="rounded-full bg-emerald-500 p-1 text-white"
              />

              <div>
                <p className="text-[10px] font-medium text-slate-400">
                  Offer
                </p>

                <p className="text-sm font-bold text-[#102451]">
                  Received
                </p>
              </div>
            </div>

            {/* =================================================
                KEEP GOING CARD
            ================================================== */}

            <div
              className="
                absolute
                left-[8%]
                top-[43%]
                z-30
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-100
                bg-white
                px-4
                py-3
                shadow-[0_12px_35px_rgba(37,99,235,0.12)]
                animate-[bounce_5.5s_ease-in-out_infinite_1.5s]
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-50
                "
              >
                <BarChart3
                  size={19}
                  className="text-blue-600"
                />
              </div>

              <p className="text-sm font-bold leading-tight text-[#102451]">
                Keep
                <br />
                Going!
              </p>
            </div>

            {/* =================================================
                MAIN CHARACTER IMAGE
            ================================================== */}

            <img
              src="/jobtracker-hero.png.png"
              alt="Job seeker using JobTracker"
              className="
                absolute
                left-1/2
                top-[8%]
                z-10
                w-[360px]
                -translate-x-1/2
                object-contain
                drop-shadow-[0_22px_35px_rgba(37,99,235,0.13)]
                sm:top-[6%]
                sm:w-[455px]
                lg:w-[475px]
              "
            />

            {/* =================================================
                LEFT CURVED ARROW
            ================================================== */}

            <svg
              className="
                pointer-events-none
                absolute
                left-[-10%]
                top-[55%]
                z-20
                hidden
                h-[105px]
                w-[115px]
                sm:block
              "
              viewBox="0 0 115 105"
              fill="none"
            >

              <path
                d="
                  M108 7
                  C82 10 58 20 48 39
                  C39 56 42 72 24 87
                  C20 90 16 92 10 94
                "
                stroke="#2878F0"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />

              <path
                d="M10 94 L22 87"
                stroke="#2878F0"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M10 94 L23 96"
                stroke="#2878F0"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

            </svg>

            {/* =================================================
                LEFT ARROW TEXT
            ================================================== */}

            <div
              className="
                absolute
                left-[-25%]
                top-[75%]
                z-20
                hidden
                w-[100px]
                text-center
                text-[11px]
                font-medium
                leading-[15px]
                text-blue-600
                sm:block
              "
            >
              Dream Jobs
              <br />
              Are Closer
              <br />
              Than You Think!
            </div>

            {/* =================================================
                RIGHT CURVED ARROW
            ================================================== */}

            <svg
              className="
                pointer-events-none
                absolute
                right-[-8%]
                top-[1%]
                z-20
                hidden
                h-[100px]
                w-[125px]
                sm:block
              "
              viewBox="0 0 125 100"
              fill="none"
            >

              <path
                d="
                  M118 12
                  C95 7 69 10 54 24
                  C42 35 39 49 25 58
                  C20 61 15 63 8 63
                "
                stroke="#2878F0"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />

              <path
                d="M8 63 L19 55"
                stroke="#2878F0"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M8 63 L20 66"
                stroke="#2878F0"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

            </svg>

            {/* =================================================
                RIGHT ARROW TEXT
            ================================================== */}

            <div
              className="
                absolute
                right-[-21%]
                top-[1%]
                z-20
                hidden
                w-[105px]
                text-center
                text-[10px]
                font-medium
                leading-[14px]
                text-blue-600
                sm:block
              "
            >
              Track your
              <br />
              progress
              <br />
              towards a brighter
              <br />
              future!
            </div>

            {/* =================================================
                COMPANIES CARD
            ================================================== */}

            <div
              className="
                absolute
                bottom-[3%]
                right-[9%]
                z-30
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-100
                bg-white
                px-4
                py-3
                shadow-[0_12px_35px_rgba(37,99,235,0.12)]
                animate-[bounce_4s_ease-in-out_infinite_2s]
              "
            >
              <BarChart3
                size={26}
                className="text-blue-600"
              />

              <div>
                <p className="text-sm font-bold text-[#102451]">
                  500+
                </p>

                <p className="text-[11px] text-slate-400">
                  Companies
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* =====================================================
            STATS CARD
        ====================================================== */}

        <div
          className="
            relative
            z-30
            mt-5
            rounded-2xl
            border
            border-blue-100
            bg-white/90
            px-4
            py-6
            shadow-xl
            shadow-blue-100/40
            backdrop-blur-xl
            sm:px-8
            sm:py-7
          "
        >

          <div
            className="
              grid
              grid-cols-2
              gap-y-6
              md:grid-cols-4
              md:divide-x
              md:divide-slate-100
            "
          >

            {/* STAT 1 */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                px-2
                sm:gap-4
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-50
                  text-blue-600
                  sm:h-12
                  sm:w-12
                "
              >
                <Users size={22} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#102451] sm:text-xl">
                  10K+
                </h3>

                <p className="text-[10px] text-slate-500 sm:text-xs">
                  Active Users
                </p>
              </div>
            </div>

            {/* STAT 2 */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                px-2
                sm:gap-4
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-50
                  text-blue-600
                  sm:h-12
                  sm:w-12
                "
              >
                <Link2 size={22} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#102451] sm:text-xl">
                  50K+
                </h3>

                <p className="text-[10px] text-slate-500 sm:text-xs">
                  Applications Tracked
                </p>
              </div>
            </div>

            {/* STAT 3 */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                px-2
                sm:gap-4
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-50
                  text-blue-600
                  sm:h-12
                  sm:w-12
                "
              >
                <Heart size={22} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#102451] sm:text-xl">
                  95%
                </h3>

                <p className="text-[10px] text-slate-500 sm:text-xs">
                  User Satisfaction
                </p>
              </div>
            </div>

            {/* STAT 4 */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-3
                px-2
                sm:gap-4
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-50
                  text-blue-600
                  sm:h-12
                  sm:w-12
                "
              >
                <Building2 size={22} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#102451] sm:text-xl">
                  500+
                </h3>

                <p className="text-[10px] text-slate-500 sm:text-xs">
                  Companies Listed
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;