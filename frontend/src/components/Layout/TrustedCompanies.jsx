import React from "react";

const TrustedCompanies = () => {
  return (
    <section className="w-full bg-white py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[1250px] px-4 sm:px-6 lg:px-10">

        {/* Heading */}
        <p
          className="
            mb-6
            text-center
            text-xs
            font-medium
            text-slate-500
            sm:mb-8
            sm:text-sm
            lg:mb-9
          "
        >
          Trusted by job seekers applying to top companies
        </p>

        {/* ==================================================
            DESKTOP / TABLET
        =================================================== */}

        <div className="hidden w-full items-center justify-center md:flex">
          <div
            className="
              relative
              h-[85px]
              w-full
              max-w-[1180px]
              overflow-hidden
              sm:h-[100px]
              lg:h-[110px]
            "
          >
            <img
              src="/company-logos.png.png"
              alt="Trusted companies"
              className="
                absolute
                left-0
                top-1/2
                w-full
                max-w-none
                -translate-y-1/2
                object-contain
              "
            />
          </div>
        </div>

        {/* ==================================================
            MOBILE
        =================================================== */}

        <div
          className="
            -mx-4
            flex
            overflow-x-auto
            px-4
            pb-2
            sm:-mx-6
            sm:px-6
            md:hidden
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div
            className="
              relative
              h-[75px]
              min-w-[850px]
              flex-shrink-0
              overflow-hidden
            "
          >
            <img
              src="/company-logos.png.png"
              alt="Trusted companies"
              className="
                absolute
                left-0
                top-1/2
                w-[850px]
                max-w-none
                -translate-y-1/2
                object-contain
              "
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustedCompanies;