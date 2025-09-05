import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../lib/utils/cropImage";

export default function Onboarding() {
  const user = useSelector((state) => state.auth.user);

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "example@gmail.com",
    avatar: null,
  });

  const [theme, setLocalTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );
  const { setTheme } = useTheme();

  const [org, setOrg] = useState({ name: "", slug: "", logo: null });
  const [teamInvites, setTeamInvites] = useState([
    { email: "", role: "Member" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);


  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleSelectImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropImage(URL.createObjectURL(file));
    setCropModalOpen(true);
  };

  const applyCrop = async () => {
    const result = await getCroppedImg(cropImage, croppedAreaPixels);
    setOrg((prev) => ({ ...prev, logo: result.file }));
    setCropModalOpen(false);
  };


  const initials = useMemo(() => {
    const fromName = (name) => {
      if (!name) return "";
      const parts = name.trim().split(/\s+/).filter(Boolean);
      if (parts.length === 0) return "";
      if (parts.length === 1) return parts[0][0]?.toUpperCase() || "";
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };
    const byName = fromName(user?.name || profile.name);
    if (byName) return byName;
    const email = user?.email || profile.email || "";
    return email.trim()[0]?.toUpperCase() || "U";
  }, [user, profile.name, profile.email]);

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (newTheme) => setLocalTheme(newTheme);

  const handleOrgChange = (e) => {
    const { name, value } = e.target;
    setOrg((prev) => ({ ...prev, [name]: value }));
  };

  const handleInviteChange = (index, e) => {
    const { name, value } = e.target;
    const newInvites = [...teamInvites];
    newInvites[index][name] = value;
    setTeamInvites(newInvites);
  };

  const addInvite = () =>
    setTeamInvites((prev) => [...prev, { email: "", role: "Member" }]);

  const renderProgress = () => (
    <div className="flex items-center gap-2 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded ${
            i <= step ? "bg-white" : "bg-gray-700"
          }`}
        />
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            {renderProgress()}
            <h2 className="text-xl font-semibold mb-2 text-white">
              Set up your profile
            </h2>
            <p className="text-white mb-6">
              Check if the profile information is correct. You&apos;ll be able
              to change this later in the account settings page.
            </p>

            <div className="flex justify-center mb-6">
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer relative"
              >
                {profile.avatar ? (
                  <img
                    src={URL.createObjectURL(profile.avatar)}
                    alt="avatar"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-white">
                    {initials}
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-black/70 rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7h4l3-3h4l3 3h4v13H3V7z"
                    />
                  </svg>
                </div>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    avatar: e.target.files?.[0] || null,
                  }))
                }
              />
            </div>

            <div className="space-y-4">
              <input
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Name"
                className="w-full p-2 rounded bg-black border border-gray-600 text-white"
              />
              <input
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                placeholder="Phone"
                className="w-full p-2 rounded bg-black border border-gray-600 text-white"
              />
              <input
                name="email"
                value={profile.email}
                disabled
                className="w-full p-2 rounded bg-black border border-gray-600 text-gray-400"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            {renderProgress()}
            <h2 className="text-xl font-semibold mb-2 text-white">
              Choose your theme
            </h2>
            <p className="text-gray-400 mb-6">
              Select the theme for the application. You&apos;ll be able to
              change this later.
            </p>
            <div className="flex gap-6 justify-center">
              <div
                onClick={() => handleThemeChange("light")}
                className={`w-24 h-24 border rounded flex flex-col items-center justify-center cursor-pointer ${
                  theme === "light" ? "border-white" : "border-gray-600"
                }`}
                style={{ backgroundColor: "white", color: "black" }}
              >
                <span className="text-lg font-bold">Aa</span>
                <span className="text-sm">Light</span>
                {theme === "light" && (
                  <div className="mt-1 w-2 h-2 rounded-full bg-black"></div>
                )}
              </div>
              <div
                onClick={() => handleThemeChange("dark")}
                className={`w-24 h-24 border rounded flex flex-col items-center justify-center cursor-pointer ${
                  theme === "dark" ? "border-white" : "border-gray-600"
                }`}
                style={{ backgroundColor: "black", color: "white" }}
              >
                <span className="text-lg font-bold">Aa</span>
                <span className="text-sm">Dark</span>
                {theme === "dark" && (
                  <div className="mt-1 w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            {renderProgress()}
            <h2 className="text-xl font-semibold mb-2 text-white">
              Add your organization
            </h2>
            <p className="text-white mb-6">
              We just need some basic info to get your organization set up.
              You&apos;ll be able to edit this later.
            </p>

            {/* Logo Upload */}
            <div className="flex justify-center mb-6">
              <label htmlFor="logo-upload" className="cursor-pointer relative">
                {org.logo ? (
                  <img
                    src={URL.createObjectURL(org.logo)}
                    alt="logo"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-white">
                    Logo
                  </div>
                )}

                {/* Icon thùng rác nhỏ ở góc dưới phải nếu đã có ảnh */}
                {org.logo && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setOrg((prev) => ({ ...prev, logo: null }));
                    }}
                    className="absolute bottom-1 right-1 bg-black/70 rounded-full p-1 hover:bg-red-600"
                    title="Remove logo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 00-2-2H9a2 2 0 00-2 2m10 0H5"
                      />
                    </svg>
                  </div>
                )}
              </label>

              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectImage}
              />
            </div>

            {/* Mô tả */}
            <div className="mb-4 text-center">
              <p className="text-sm text-white">Upload your logo</p>
              <p className="text-xs text-gray-400">
                *.png, *.jpeg files up to 5 MB
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-white">
              <input
                name="name"
                value={org.name}
                onChange={handleOrgChange}
                placeholder="Name*"
                className="w-full p-2 rounded bg-black border border-gray-600 text-white"
              />

              <input
                name="slug"
                value={org.slug}
                onChange={handleOrgChange}
                placeholder="Slug*"
                className="w-full p-2 rounded bg-black border border-gray-600 text-white"
              />

              <p className="text-sm text-gray-400 mb-2">
                /organizations/
                <span className="font-mono">{org.slug || "your-slug"}</span>
              </p>
            </div>

            {/* Modal Crop ảnh */}
            {cropModalOpen &&
              createPortal(
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                  <div className="bg-gray-900 rounded-lg p-6 w-[90%] max-w-md text-white relative">
                    <h3 className="text-lg mb-4 font-semibold">Crop photo</h3>
                    <div className="relative w-full h-64 bg-black">
                      <Cropper
                        image={cropImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                      <button
                        className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
                        onClick={() => setCropModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-white text-black font-semibold rounded"
                        onClick={applyCrop}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )}
          </div>
        );
      case 4:
        return (
          <div>
            {renderProgress()}
            <h2 className="text-xl font-semibold mb-2 text-white">
              Invite your team
            </h2>
            <p className="text-gray-400 mb-6">
              Add team members to get started. You can always invite more people
              later.
            </p>
            <div className="space-y-3">
              {teamInvites.map((invite, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    name="email"
                    value={invite.email}
                    onChange={(e) => handleInviteChange(index, e)}
                    placeholder="Email address"
                    className="flex-1 p-2 rounded bg-black border border-gray-600 text-white"
                  />
                  <select
                    name="role"
                    value={invite.role}
                    onChange={(e) => handleInviteChange(index, e)}
                    className="p-2 rounded bg-black border border-gray-600 text-white"
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              ))}
              <button
                onClick={addInvite}
                className="text-sm text-white underline"
              >
                + Add invitation
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-lg w-full">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
              <span className="text-black font-bold">A</span>
            </div>
            <span className="font-semibold text-white">Acme</span>
          </div>
        </div>

        <div>{renderStep()}</div>

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button
              className="text-white"
              variant="outline"
              onClick={handlePrev}
            >
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button className="ml-auto text-white" onClick={handleNext}>
              Next step →
            </Button>
          ) : (
            <Button
              className="ml-auto"
              onClick={async () => {
                try {
            
                  setTheme(theme);

               
                  localStorage.setItem(`onboarding_${user.id}`, "true");

                  navigate("/dashboard");
                } catch (error) {
                  console.error("Failed to complete onboarding:", error);
                }
              }}
            >
              Finish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
