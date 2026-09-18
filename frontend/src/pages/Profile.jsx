import {
  Camera,
  Check,
  Mail,
  MapPin,
  Phone,
  User,
  Briefcase,
  Edit3,
  Save,
  X,
  Sparkles,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const PROFILE_API = "https://jobtracker-w9yo.onrender.com/api/profile";

const DEFAULT_PROFILE = {
  name: "",
  email: "",
  phone: "",
  location: "",
  headline: "",
  github: "",
  linkedin: "",
  skills: "",
  about: "",
  photo: "",
};

export default function Profile() {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [originalProfile, setOriginalProfile] = useState(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("jobtracker_user") || "null");
    } catch {
      return null;
    }
  };

  const userId = Number(getUser()?.id || 0);

  const fetchProfile = async () => {
    if (!userId) {
      setError("Please login again to load your profile.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${PROFILE_API}/get.php?user_id=${userId}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load profile");
      }

      const nextProfile = {
        ...DEFAULT_PROFILE,
        ...(data.profile || {}),
      };

      setProfile(nextProfile);
      setOriginalProfile(nextProfile);

      // Keep navbar/user identity synchronized with the real account.
      const currentUser = getUser();
      if (currentUser) {
        localStorage.setItem(
          "jobtracker_user",
          JSON.stringify({
            ...currentUser,
            name: nextProfile.name || currentUser.name,
            email: nextProfile.email || currentUser.email,
            phone: nextProfile.phone || currentUser.phone,
          })
        );
      }
    } catch (err) {
      console.error("Profile load error:", err);
      setError(err.message || "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfile((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setProfile((prev) => ({
      ...prev,
      photo: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!userId) {
      alert("Please login again.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${PROFILE_API}/update.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          headline: profile.headline,
          github: profile.github,
          linkedin: profile.linkedin,
          skills: profile.skills,
          about: profile.about,
          photo: profile.photo,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedProfile = {
        ...profile,
        ...(data.profile || {}),
      };

      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);

      const currentUser = getUser();
      if (currentUser) {
        localStorage.setItem(
          "jobtracker_user",
          JSON.stringify({
            ...currentUser,
            name: updatedProfile.name,
            email: updatedProfile.email,
            phone: updatedProfile.phone,
          })
        );
      }

      setSaved(true);
      setEditing(false);

      window.dispatchEvent(new Event("jobtracker-profile-updated"));

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error("Profile update error:", err);
      alert(err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setEditing(false);
  };

  const skills = profile.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 text-slate-900">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative overflow-hidden bg-gradient-to-br from-[#07152f] via-[#0d2b63] to-[#1649a3] text-white">
        {/* Background Glow */}
        <div className="absolute -right-28 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "45px 45px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* Back Button */}
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back to Dashboard
          </Link>

          {/* Header Content */}
          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-blue-400/30 blur-lg" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md">
                  <User className="h-6 w-6" />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                  Account Settings
                </p>

                <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                  My Profile
                </h1>
              </div>
            </div>

            {/* Header Buttons */}
            <div className="flex flex-wrap gap-2">
              {!editing ? (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        {loading && (
          <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
            Loading your real profile...
          </div>
        )}

        {!loading && error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {error}
            <button
              type="button"
              onClick={fetchProfile}
              className="ml-3 underline"
            >
              Retry
            </button>
          </div>
        )}
        {/* Success Message */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-4 w-4" />
            </div>
            Profile updated successfully.
          </div>
        )}

        <div className="grid gap-7 lg:grid-cols-[330px_1fr]">
          {/* =================================================
              LEFT PROFILE CARD
          ================================================= */}

          <aside className="h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            {/* Cover */}
            <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[#0d2b63] via-[#1652bd] to-[#4f46e5]">
              <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

              <div className="absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-blue-300/20 blur-2xl" />
            </div>

            <div className="relative px-5 pb-6">
              {/* Profile Photo */}
              <div className="-mt-14 flex justify-center">
                <div className="group relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 opacity-60 blur-sm" />

                  <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-600 to-indigo-600 text-3xl font-black text-white shadow-xl">
                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      profile.name?.charAt(0)?.toUpperCase() || "A"
                    )}

                    {editing && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center bg-black/55 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <Camera className="h-7 w-7" />
                      </button>
                    )}
                  </div>

                  {/* Camera Button */}
                  {editing && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-lg transition hover:scale-105 hover:bg-blue-700"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

              {/* Profile Name */}
              <div className="mt-4 text-center">
                <h2 className="text-xl font-black text-slate-950">
                  {profile.name || "Your Name"}
                </h2>

                <p className="mt-1 text-sm font-semibold text-blue-600">
                  {profile.headline || "Add your professional headline"}
                </p>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location || "Add your location"}
                </div>
              </div>

              {/* Photo Controls */}
              {editing && (
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-700">
                    Profile Photo
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    JPG, PNG or WEBP. Maximum file size 2MB.
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                    >
                      Choose Photo
                    </button>

                    {profile.photo && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Social Profiles */}
              <div className="mt-6 grid grid-cols-2 gap-2">
                <a
                  href={profile.github || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  GitHub
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>

                <a
                  href={profile.linkedin || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  LinkedIn
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>

              {/* Profile Complete */}
              <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />

                    <span className="text-xs font-bold text-slate-700">
                      Profile Complete
                    </span>
                  </div>

                  <span className="text-xs font-black text-blue-600">
                    {Math.min(
                      100,
                      [
                        profile.name,
                        profile.email,
                        profile.phone,
                        profile.location,
                        profile.headline,
                        profile.skills,
                        profile.about,
                        profile.github,
                        profile.linkedin,
                      ].filter(Boolean).length * 11
                    )}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        [
                          profile.name,
                          profile.email,
                          profile.phone,
                          profile.location,
                          profile.headline,
                          profile.skills,
                          profile.about,
                          profile.github,
                          profile.linkedin,
                        ].filter(Boolean).length * 11
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-[11px] leading-5 text-slate-400">
                  Add more information to improve your profile.
                </p>
              </div>
            </div>
          </aside>

          {/* =================================================
              RIGHT CONTENT
          ================================================= */}

          <div className="space-y-7">
            {/* Personal Information */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
              <SectionHeader
                icon={User}
                title="Personal Information"
                description="Keep your personal details up to date."
              />

              <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
                <InputField
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!editing}
                  icon={User}
                />

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!editing}
                  icon={Mail}
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  icon={Phone}
                />

                <InputField
                  label="Location"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  disabled={!editing}
                  icon={MapPin}
                />
              </div>
            </section>

            {/* Professional Information */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
              <SectionHeader
                icon={Briefcase}
                title="Professional Information"
                description="Show recruiters what you can do."
              />

              <div className="space-y-5 p-5 sm:p-6">
                <InputField
                  label="Professional Headline"
                  name="headline"
                  value={profile.headline}
                  onChange={handleChange}
                  disabled={!editing}
                  icon={Briefcase}
                />

                {/* Skills */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Skills
                  </label>

                  {editing ? (
                    <input
                      type="text"
                      name="skills"
                      value={profile.skills}
                      onChange={handleChange}
                      placeholder="React, JavaScript, Node.js..."
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      {skills.length > 0 ? (
                        skills.map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">
                          No skills added yet.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* About */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    About Me
                  </label>

                  <textarea
                    name="about"
                    value={profile.about}
                    onChange={handleChange}
                    disabled={!editing}
                    rows={5}
                    placeholder="Tell recruiters about yourself..."
                    className={`w-full resize-none rounded-xl border px-4 py-3 text-sm font-medium outline-none transition ${
                      editing
                        ? "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        : "border-slate-100 bg-slate-50 text-slate-600"
                    }`}
                  />
                </div>
              </div>
            </section>

            {/* Social Profiles */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
              <SectionHeader
                icon={ExternalLink}
                title="Social Profiles"
                description="Add your professional profile links."
              />

              <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
                <InputField
                  label="GitHub Profile"
                  name="github"
                  value={profile.github}
                  onChange={handleChange}
                  disabled={!editing}
                  icon={ExternalLink}
                />

                <InputField
                  label="LinkedIn Profile"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleChange}
                  disabled={!editing}
                  icon={ExternalLink}
                />
              </div>
            </section>

            {/* Bottom Tip */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#07152f] via-[#103779] to-[#2055c9] p-5 text-white shadow-2xl shadow-blue-900/15 sm:p-6">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Sparkles className="h-5 w-5 text-blue-200" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-200">
                    Profile Tip
                  </p>

                  <h3 className="mt-1 text-base font-black sm:text-lg">
                    Keep your profile recruiter-ready
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-blue-100/75 sm:text-sm">
                    A complete profile with relevant skills and professional
                    links can make your job applications stand out.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <h2 className="text-sm font-black text-slate-950 sm:text-base">
          {title}
        </h2>

        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  name,
  value,
  onChange,
  disabled,
  icon: Icon,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`h-12 w-full rounded-xl border pl-11 pr-4 text-sm font-medium outline-none transition ${
            disabled
              ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-600"
              : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          }`}
        />
      </div>
    </div>
  );
}
