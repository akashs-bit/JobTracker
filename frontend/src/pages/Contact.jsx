import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Please enter a subject.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* ================= HERO ================= */}
      <section className="relative isolate">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-40 -z-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
              <MessageSquare size={16} />
              We'd Love to Hear From You
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Let's Start a{" "}
              <span className="text-blue-600">Conversation</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Have a question, suggestion, or need help with JobTracker?
              Send us a message and we'll be happy to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTACT AREA ================= */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          {/* ================= LEFT INFO ================= */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-[#0d1f46] p-7 shadow-2xl sm:p-9">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
                <MessageSquare size={23} />
              </div>

              <h2 className="mt-6 text-3xl font-extrabold text-white">
                Get in Touch
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                Whether you're having trouble using JobTracker or simply want
                to share feedback, we're here to help.
              </p>

              <div className="mt-8 space-y-5">
                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400">
                    <Mail size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      support@jobtracker.com
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400">
                    <Phone size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      +91 90000 00000
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      India
                    </p>
                  </div>
                </div>

                {/* Response */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Response Time
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      Usually within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-9 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-blue-400"
                  />

                  <div>
                    <h3 className="font-bold text-white">
                      Your Privacy Matters
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Your information is used only to respond to your
                      request.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= FORM ================= */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-white/80 bg-white/85 p-6 shadow-xl shadow-blue-900/5 backdrop-blur sm:p-8 lg:p-10">
              {!submitted ? (
                <>
                  <div className="mb-8">
                    <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                      Contact Form
                    </span>

                    <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                      Send Us a Message
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Fill out the form below and we'll get back to you as
                      soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name + Email */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-bold text-slate-700"
                        >
                          Full Name
                        </label>

                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className={`w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                            errors.name
                              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                          }`}
                        />

                        {errors.name && (
                          <p className="mt-1.5 text-xs font-medium text-red-500">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-bold text-slate-700"
                        >
                          Email Address
                        </label>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                            errors.email
                              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                          }`}
                        />

                        {errors.email && (
                          <p className="mt-1.5 text-xs font-medium text-red-500">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="mb-2 block text-sm font-bold text-slate-700"
                      >
                        Subject
                      </label>

                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className={`w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                          errors.subject
                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />

                      {errors.subject && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-bold text-slate-700"
                      >
                        Message
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        className={`w-full resize-none rounded-xl border bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                          errors.message
                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />

                      {errors.message && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0"
                    >
                      <Send
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                      Send Message
                    </button>

                    <p className="text-center text-xs text-slate-400">
                      We usually respond within 24 hours.
                    </p>
                  </form>
                </>
              ) : (
                /* ================= SUCCESS ================= */
                <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={42} />
                  </div>

                  <h2 className="mt-7 text-3xl font-extrabold text-slate-900">
                    Message Sent!
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                    Thanks for reaching out to JobTracker. We've received your
                    message and will get back to you soon.
                  </p>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Need Help?
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-slate-600">
            Here are some common questions about JobTracker.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4">
          {[
            {
              question: "Is JobTracker free to use?",
              answer:
                "Yes. You can create an account and use the core job-search management features.",
            },
            {
              question: "Can I track multiple applications?",
              answer:
                "Yes. JobTracker is designed to help you manage multiple job applications in one place.",
            },
            {
              question: "Can I save jobs for later?",
              answer:
                "Yes. You can save interesting opportunities and access them later from your dashboard.",
            },
            {
              question: "Can I track interviews?",
              answer:
                "Yes. Your dashboard includes an interview section where upcoming and completed interviews can be organized.",
            },
          ].map((faq, index) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-slate-800">
                <span>
                  <span className="mr-3 text-blue-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {faq.question}
                </span>

                <span className="text-xl text-blue-600 transition group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-500">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-5 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-12 text-center shadow-2xl shadow-blue-900/20 sm:px-10 sm:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
            <Sparkles size={27} />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Organize Your Job Search?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Create your JobTracker account and start managing your career
            journey today.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Create Free Account
              <ArrowRight size={18} />
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

export default Contact;