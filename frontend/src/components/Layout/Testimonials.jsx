import React from "react";
import {
  Quote,
  Star,
  ArrowUpRight,
} from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Software Developer",
    image: "https://i.pravatar.cc/150?img=12",
    text: "JobTracker helped me stay organized during my job search. I landed my dream job in just 3 months!",
  },
  {
    name: "Priya Verma",
    role: "Data Analyst",
    image: "https://i.pravatar.cc/150?img=47",
    text: "The reminders and tracking features are amazing. I never miss an interview anymore!",
  },
  {
    name: "Amit Kumar",
    role: "Full Stack Developer",
    image: "https://i.pravatar.cc/150?img=33",
    text: "Clean UI, easy to use, and super helpful. Highly recommended for all job seekers!",
  },
];

const Testimonials = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-white
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
          bg-blue-100/40
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
          bg-purple-100/30
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
            mb-12
            max-w-2xl
            text-center
            sm:mb-14
          "
        >

          {/* Badge */}

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
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-blue-600
              shadow-sm
              sm:text-xs
            "
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />

            Testimonials
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
           What Our <span className="text-blue-600">Users Say</span>
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
            Join thousands of job seekers who have improved their
            job search with JobTracker.
          </p>

        </div>

        {/* =================================================
            TESTIMONIAL CARDS
        ================================================== */}

        <div className="grid gap-5 md:grid-cols-3">

          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
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
                animate-[testimonialIn_0.7s_ease-out_both]
              "
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >

              {/* =================================================
                  TOP BLUE LINE
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
                  BACKGROUND QUOTE
              ================================================== */}

              <Quote
                size={70}
                strokeWidth={1}
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-4
                  text-blue-50
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:text-blue-100
                "
              />

              {/* =================================================
                  USER
              ================================================== */}

              <div className="relative flex items-center justify-between">

                <div className="flex items-center gap-3">

                  {/* Profile image */}

                  <div
                    className="
                      relative
                      h-12
                      w-12
                      shrink-0
                      overflow-hidden
                      rounded-full
                      ring-4
                      ring-blue-50
                      transition-all
                      duration-500
                      group-hover:ring-blue-100
                      group-hover:scale-105
                    "
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                      loading="lazy"
                    />
                  </div>

                  {/* Name */}

                  <div>
                    <h4
                      className="
                        text-sm
                        font-bold
                        text-[#102451]
                        transition-colors
                        duration-300
                        group-hover:text-blue-600
                      "
                    >
                      {testimonial.name}
                    </h4>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {testimonial.role}
                    </p>
                  </div>

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
                  STARS
              ================================================== */}

              <div
                className="
                  relative
                  mt-5
                  flex
                  items-center
                  gap-1
                "
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill="currentColor"
                    className="
                      text-orange-400
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                    style={{
                      transitionDelay: `${star * 40}ms`,
                    }}
                  />
                ))}
              </div>

              {/* =================================================
                  TESTIMONIAL TEXT
              ================================================== */}

              <p
                className="
                  relative
                  mt-4
                  text-sm
                  leading-7
                  text-slate-600
                "
              >
                "{testimonial.text}"
              </p>

              {/* =================================================
                  BOTTOM LINE
              ================================================== */}

              <div
                className="
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
          ))}

        </div>

        {/* =================================================
            BOTTOM MESSAGE
        ================================================== */}

        <div
          className="
            mt-10
            flex
            items-center
            justify-center
            gap-2
            text-center
            text-xs
            font-medium
            text-slate-500
            sm:mt-12
            sm:text-sm
          "
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

          Trusted by job seekers building their next career move.
        </div>

      </div>

      {/* =====================================================
          ANIMATION
      ====================================================== */}

      <style>{`
        @keyframes testimonialIn {
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

export default Testimonials;