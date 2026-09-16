import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="px-6 pb-16">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-10 shadow-xl md:px-12">

        <div className="flex flex-col items-center justify-between gap-7 md:flex-row">

          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Ready to Take Control of Your Career?
            </h2>

            <p className="mt-2 text-sm text-blue-100">
              Join thousands of job seekers and start tracking your applications today.
            </p>
          </div>

          <button className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-[#102451] shadow-md transition hover:bg-slate-100">
            Get Started Free
            <ArrowRight size={17} />
          </button>

        </div>
      </div>
    </section>
  );
};

export default CTA;