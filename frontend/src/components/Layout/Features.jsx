import React from "react";
import {
  FileText,
  CalendarDays,
  BarChart3,
  Bell,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Track Applications",
    description:
      "Keep track of all your job applications in one place and never lose sight of an opportunity.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    glow: "group-hover:bg-blue-400/10",
    delay: "0ms",
  },
  {
    icon: CalendarDays,
    title: "Manage Interviews",
    description:
      "Get reminders about upcoming interviews and stay prepared for every important opportunity.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    glow: "group-hover:bg-emerald-400/10",
    delay: "100ms",
  },
  {
    icon: BarChart3,
    title: "Visualize Progress",
    description:
      "See your job search progress with beautiful charts, useful insights, and clear analytics.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    glow: "group-hover:bg-purple-400/10",
    delay: "200ms",
  },
  {
    icon: Bell,
    title: "Stay Organized",
    description:
      "Add notes, links, reminders, and important details for every job application.",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    glow: "group-hover:bg-orange-400/10",
    delay: "300ms",
  },
];

const Features = () => {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute left-[-180px] top-20 h-[350px] w-[350px] rounded-full bg-blue-100/40 blur-3xl" />

      <div className="pointer-events-none absolute right-[-180px] bottom-10 h-[350px] w-[350px] rounded-full bg-purple-100/30 blur-3xl" />

      {/* =====================================================
          CONTAINER
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl">

        {/* =================================================
            HEADING
        ================================================== */}

        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">

          {/* Small label */}

          <div
            className="
              mb-4
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
            "
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />

            Powerful Tools
          </div>

          {/* Heading */}

          <h2
            className="
              text-3xl
              font-extrabold
              leading-tight
              tracking-tight
              text-[#102451]
              sm:text-4xl
              lg:text-[42px]
            "
          >
            Powerful Features for
            <br className="hidden sm:block" />{" "}
            <span className="text-blue-600">
              Your Job Search
            </span>
          </h2>

          {/* Description */}

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-6
              text-slate-500
              sm:text-base
              sm:leading-7
            "
          >
            Everything you need to stay organized, track your progress,
            and never miss an opportunity.
          </p>

        </div>

        {/* =================================================
            FEATURE CARDS
        ================================================== */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                style={{
                  animationDelay: feature.delay,
                }}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-[0_5px_25px_rgba(15,23,42,0.05)]
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:border-blue-100
                  hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)]
                  animate-[featureIn_0.7s_ease-out_both]
                "
              >

                {/* =================================================
                    CARD BACKGROUND GLOW
                ================================================== */}

                <div
                  className={`
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12
                    h-32
                    w-32
                    rounded-full
                    blur-2xl
                    transition-all
                    duration-500
                    ${feature.glow}
                  `}
                />

                {/* =================================================
                    TOP LINE
                ================================================== */}

                <div
                  className="
                    absolute
                    left-0
                    top-0
                    h-1
                    w-0
                    bg-blue-600
                    transition-all
                    duration-500
                    group-hover:w-full
                  "
                />

                {/* =================================================
                    ICON
                ================================================== */}

                <div className="relative flex items-center justify-between">

                  <div
                    className={`
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      ${feature.iconBg}
                      transition-all
                      duration-500
                      group-hover:scale-110
                      group-hover:rotate-3
                    `}
                  >
                    <Icon
                      size={25}
                      strokeWidth={2}
                      className={`
                        ${feature.iconColor}
                        transition-transform
                        duration-500
                        group-hover:scale-110
                      `}
                    />
                  </div>

                  {/* Arrow */}

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-slate-100
                      bg-white
                      text-slate-400
                      opacity-0
                      translate-x-2
                      transition-all
                      duration-500
                      group-hover:translate-x-0
                      group-hover:opacity-100
                    "
                  >
                    <ArrowUpRight size={17} />
                  </div>

                </div>

                {/* =================================================
                    CONTENT
                ================================================== */}

                <div className="relative mt-6">

                  <h3
                    className="
                      text-lg
                      font-bold
                      tracking-tight
                      text-[#102451]
                      transition-colors
                      duration-300
                      group-hover:text-blue-600
                    "
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    {feature.description}
                  </p>

                </div>

                {/* =================================================
                    BOTTOM DECORATION
                ================================================== */}

                <div
                  className="
                    relative
                    mt-6
                    h-1
                    w-10
                    overflow-hidden
                    rounded-full
                    bg-slate-100
                  "
                >
                  <div
                    className="
                      absolute
                      left-0
                      top-0
                      h-full
                      w-0
                      rounded-full
                      bg-blue-600
                      transition-all
                      duration-500
                      group-hover:w-full
                    "
                  />
                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* =====================================================
          CUSTOM ANIMATION
      ====================================================== */}

      <style>{`
        @keyframes featureIn {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </section>
  );
};

export default Features;