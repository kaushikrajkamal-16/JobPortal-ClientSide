import { useState, useRef } from "react";
import { LuX, LuUserCog, LuUser, LuBadgeCheck, LuCheck } from "react-icons/lu";
import { useUpdateProfileMutation } from "../redux/authApi";
import { getError } from "../utils/helpers";

// Popup for editing the applicant's profile.
// profile = current user (from getMe), onClose = closes the popup
// Saves with PUT /auth/updateprofile (form-data). getMe reloads by itself after.
export default function EditProfileModal({ profile, onClose }) {
  // A copy of the profile that changes while the user types
  const [form, setForm] = useState({
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    department: profile.department || "",
    batch: profile.batch || "",
    photo: profile.photo || null,
    photoFile: null,
  });
  const [photoError, setPhotoError] = useState("");
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // Points at the hidden file input so a button can "click" it
  const fileInputRef = useRef(null);

  // Runs on every key press in any input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Runs after the user picks a file from their folder
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return; // user pressed Cancel in the file picker

    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setPhotoError("Only PNG, JPG or WebP images are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be 5MB or smaller.");
      e.target.value = "";
      return;
    }

    // Turn the file into a URL the <img> can show
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, photo: reader.result, photoFile: file }));
      setPhotoError("");
    };
    reader.readAsDataURL(file);

    // Reset so picking the same file again still triggers onChange
    e.target.value = "";
  };

  // Runs when "Remove" is clicked → go back to the saved photo
  const handleRemovePhoto = () => {
    setForm((prev) => ({ ...prev, photo: profile.photo || null, photoFile: null }));
    setPhotoError("");
  };

  // Runs when "Update Profile" is clicked
  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    // Text + file together → FormData
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("department", form.department);
    formData.append("batch", form.batch);
    if (form.photoFile) formData.append("photo", form.photoFile); // name must be "photo"

    try {
      const res = await updateProfile(formData).unwrap();
      alert(res.message); // "Profile updated successfully."
      onClose();
    } catch (err) {
      alert(getError(err));
    }
  };

  // First letters of the name, e.g. "Rahim Uddin" -> "RU"
  const initials =
    (form.name || "?")
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const inputClass =
    "h-10 w-full rounded-lg border border-[#c4c5d5]/60 bg-white px-4 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#1e40af]";

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Dark background — click it to close */}
      <div onClick={onClose} className='fixed inset-0 bg-[#213145]/60'></div>

      {/* White box */}
      <div className='relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl'>
        {/* Header */}
        <div className='flex items-start justify-between gap-4 bg-[#eff4ff] px-5 py-5 sm:px-8'>
          <div>
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e40af] text-white'>
                <LuUserCog className='h-5 w-5' />
              </div>
              <h2 className='text-2xl font-bold text-[#0b1c30]'>
                Edit Profile
              </h2>
            </div>
            <p className='mt-1 text-xs text-[#444653]'>
              Update your personal credentials, contact details, and resume.
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg p-2 text-[#444653] hover:bg-[#dce9ff]'
          >
            <LuX className='h-5 w-5' />
          </button>
        </div>

        {/* Body (scrolls if too tall) */}
        <div className='flex flex-col gap-6 overflow-y-auto px-5 py-6 sm:px-8'>
          {/* Photo row */}
          <div className='flex flex-col justify-between gap-4 rounded-xl bg-[#eff4ff] p-4 sm:flex-row sm:items-center'>
            <div className='flex items-center gap-4'>
              {form.photo ? (
                <img
                  src={form.photo}
                  alt='Profile'
                  className='h-16 w-16 rounded-full object-cover'
                />
              ) : (
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#1e40af] text-xl font-bold text-white'>
                  {initials}
                </div>
              )}
              <div>
                <p className='font-bold text-[#0b1c30]'>{form.name}</p>
                <p className='text-[11px] text-[#444653]'>
                  PNG, JPG or WebP up to 5MB
                </p>
                {photoError && (
                  <p className='mt-1 text-[11px] text-[#ba1a1a]'>
                    {photoError}
                  </p>
                )}
              </div>
            </div>

            <div className='flex gap-2'>
              {/* Hidden file input — the button below opens it */}
              <input
                ref={fileInputRef}
                type='file'
                accept='image/png, image/jpeg, image/webp'
                onChange={handlePhotoChange}
                className='hidden'
              />
              <button
                type='button'
                onClick={() => fileInputRef.current.click()}
                className='rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#00288e] shadow-sm hover:bg-[#e5eeff]'
              >
                Change Photo
              </button>
              {form.photoFile && (
                <button
                  type='button'
                  onClick={handleRemovePhoto}
                  className='rounded-lg px-4 py-2 text-sm font-medium text-[#ba1a1a] hover:bg-[#ffdad6]/40'
                >
                  Undo
                </button>
              )}
            </div>
          </div>

          {/* Form fields */}
          <div className='flex flex-col gap-4'>
            <h3 className='flex items-center gap-1 font-semibold text-[#00288e]'>
              <LuUser className='h-[18px] w-[18px]' />
              Personal &amp; Contact Credentials
            </h3>

            {/* 1 column on phone, 2 columns on tablet+ */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-semibold text-[#0b1c30]'>
                  Full Legal Name
                </label>
                <input
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-semibold text-[#0b1c30]'>
                  Institutional Email
                </label>
                <div className='relative'>
                  {/* Email can't be changed (it's the login) */}
                  <input
                    name='email'
                    type='email'
                    value={form.email}
                    readOnly
                    className={`${inputClass} cursor-not-allowed bg-[#f8f9ff] pr-10 text-[#757684]`}
                  />
                  <LuBadgeCheck className='absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#fd761a]' />
                </div>
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-semibold text-[#0b1c30]'>
                  Phone Number
                </label>
                <input
                  name='phone'
                  type='tel'
                  value={form.phone}
                  onChange={handleChange}
                  placeholder='+880 1712-345678'
                  className={inputClass}
                />
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-semibold text-[#0b1c30]'>
                  Department
                </label>
                <input
                  name='department'
                  value={form.department}
                  onChange={handleChange}
                  placeholder='e.g., CSE'
                  className={inputClass}
                />
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-semibold text-[#0b1c30]'>
                  Batch / Graduation Year
                </label>
                <input
                  name='batch'
                  value={form.batch}
                  onChange={handleChange}
                  placeholder='e.g., 2026'
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className='flex justify-end gap-3 bg-[#eff4ff] px-5 py-4 sm:px-8'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg bg-[#dce9ff] px-5 py-2.5 text-sm font-semibold text-[#0b1c30] hover:bg-[#d3e4fe]'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleSave}
            disabled={isLoading}
            className='flex items-center gap-1 rounded-lg bg-[#1e40af] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#00288e] disabled:opacity-60'
          >
            <LuCheck className='h-[18px] w-[18px]' />
            {isLoading ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
