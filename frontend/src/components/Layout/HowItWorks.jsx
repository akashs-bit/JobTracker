import React from "react";
import {
  UserPlus,
  FilePlus2,
  BellRing,
  Trophy,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "1",
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up for free and set up your profile.",
  },
  {
    number: "2",
    icon: FilePlus2,
    title: "Add Applications",
    description: "Start tracking your job applications.",
  },
  {
    number: "3",
    icon: BellRing,
    title: "Stay Updated",
    description: "Get reminders and track interviews.",
  },
  {
    number: "4",
    icon: Trophy,
    title: "Achieve Your Goals",
    description: "Land your dream job!",
  },
];

const HowItWorks = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-gradient-to-b
        from-blue-50/60
        via-white
        to-blue-50/40
        px-5
        py-16
        sm:px-8
        sm:py-20
        lg:px-10
        lg:py-24
      "
    >

      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-180px]
          top-20
          h-[350px]
          w-[350px]
          rounded-full
          bg-blue-100/50
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-180px]
          bottom-10
          h-[350px]
          w-[350px]
          rounded-full
          bg-blue-100/40
          blur-3xl
        "
      />

      {/* =====================================================
          CONTAINER
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl">

        {/* =================================================
            HEADING
        ================================================== */}

        <div
          className="
            mx-auto
            mb-14
            max-w-2xl
            text-center
            sm:mb-16
          "
        >

          {/* Badge */}

          <div
            className="
              mb-4
              inline-flex
              items-center
              rounded-full
              border
              border-blue-100
              bg-blue-100/70
              px-4
              py-2
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-blue-600
              shadow-sm
              sm:text-xs
            "
          >
            How It Works
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
  Simple Steps to a{" "}
  <span className="text-blue-600">Better Job Search</span>
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
            Get started in minutes and take control of your career journey.
          </p>

        </div>

        {/* =================================================
            STEPS
        ================================================== */}

        <div
          className="
            relative
            grid
            gap-10
            md:grid-cols-4
            md:gap-5
          "
        >

          {/* =================================================
              DESKTOP CONNECTING LINE
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              left-[12.5%]
              right-[12.5%]
              top-[31px]
              hidden
              h-[2px]
              bg-blue-100
              md:block
            "
          >

            {/* Animated progress */}

            <div
              className="
                h-full
                w-full
                origin-left
                bg-gradient-to-r
                from-blue-500
                via-blue-400
                to-blue-200
                animate-[progressLine_2s_ease-out]
              "
            />
          </div>

          {/* =================================================
              STEP CARDS
          ================================================== */}

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="
                  group
                  relative
                  text-center
                  animate-[stepIn_0.7s_ease-out_both]
                "
                style={{
                  animationDelay: `${index * 120}ms`,
                }}
              >

                {/* =================================================
                    NUMBER CIRCLE
                ================================================== */}

                <div className="relative z-10 mx-auto w-fit">

                  {/* Outer glow */}

                  <div
                    className="
                      absolute
                      inset-[-7px]
                      rounded-full
                      bg-blue-200/40
                      opacity-0
                      blur-md
                      transition-all
                      duration-500
                      group-hover:opacity-100
                    "
                  />

                  {/* Circle */}

                  <div
                    className="
                      relative
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      border-[5px]
                      border-white
                      bg-blue-600
                      text-lg
                      font-extrabold
                      text-white
                      shadow-[0_8px_25px_rgba(37,99,235,0.25)]
                      transition-all
                      duration-500
                      group-hover:-translate-y-1
                      group-hover:scale-110
                      group-hover:bg-blue-700
                    "
                  >
                    {step.number}

                    {/* Small icon */}

                    <div
                      className="
                        absolute
                        -right-1
                        -top-1
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        border-2
                        border-white
                        bg-white
                        text-blue-600
                        opacity-0
                        scale-50
                        transition-all
                        duration-500
                        group-hover:scale-100
                        group-hover:opacity-100
                      "
                    >
                      <Icon size={12} />
                    </div>
                  </div>

                </div>

                {/* =================================================
                    CONTENT CARD
                ================================================== */}

                <div
                  className="
                    mx-auto
                    mt-6
                    max-w-[250px]
                    rounded-2xl
                    border
                    border-transparent
                    bg-white/60
                    px-4
                    py-4
                    transition-all
                    duration-500
                    group-hover:-translate-y-1
                    group-hover:border-blue-100
                    group-hover:bg-white
                    group-hover:shadow-[0_15px_35px_rgba(37,99,235,0.10)]
                  "
                >

                  {/* Icon */}

                  <div
                    className="
                      mx-auto
                      mb-4
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                      transition-all
                      duration-500
                      group-hover:scale-110
                      group-hover:bg-blue-600
                      group-hover:text-white
                    "
                  >
                    <Icon size={19} />
                  </div>

                  {/* Title */}

                  <h3
                    className="
                      text-base
                      font-bold
                      tracking-tight
                      text-[#102451]
                      transition-colors
                      duration-300
                      group-hover:text-blue-600
                    "
                  >
                    {step.title}
                  </h3>

                  {/* Description */}

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-[210px]
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    {step.description}
                  </p>

                </div>

                {/* =================================================
                    MOBILE ARROW
                ================================================== */}

                {index !== steps.length - 1 && (
                  <div
                    className="
                      absolute
                      -bottom-8
                      left-1/2
                      flex
                      -translate-x-1/2
                      items-center
                      justify-center
                      text-blue-300
                      md:hidden
                    "
                  >
                    <ArrowRight
                      size={20}
                      className="rotate-90"
                    />
                  </div>
                )}

              </div>
            );
          })}

        </div>

        {/* =================================================
            BOTTOM CTA / MESSAGE
        ================================================== */}

        <div
          className="
            mx-auto
            mt-14
            flex
            max-w-xl
            items-center
            justify-center
            gap-2
            text-center
            text-xs
            font-medium
            text-slate-500
            sm:mt-16
            sm:text-sm
          "
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

          Your next opportunity is just a few steps away.
        </div>

      </div>

      {/* =====================================================
          CUSTOM ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes stepIn {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progressLine {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }
      `}</style>

    </section>
  );
};

export default HowItWorks;