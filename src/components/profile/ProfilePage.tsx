/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  Camera,
  Edit2,
  Settings,
  Plus,
  Trash2,
  Check,
  X,
  Palette,
  Shield,
  Heart,
  Pill,
  AlertCircle,
  Stethoscope,
  Compass,
  FileText,
  RotateCcw,
} from 'lucide-react';

const BANNER_GRADIENTS = [
  { id: 'teal-dark', label: 'Clinical Slate & Teal', class: 'from-teal-800 via-slate-900 to-emerald-950' },
  { id: 'ocean-blue', label: 'Pacific Blue', class: 'from-blue-800 via-slate-900 to-indigo-950' },
  { id: 'emerald-sage', label: 'Botanical Emerald', class: 'from-emerald-800 via-teal-900 to-slate-950' },
  { id: 'midnight-violet', label: 'Nordic Twilight', class: 'from-indigo-900 via-slate-900 to-slate-950' },
  { id: 'warm-amber', label: 'Warm Amber & Charcoal', class: 'from-amber-900 via-slate-900 to-stone-950' },
];

export const ProfilePage: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    setCurrentPage,
    setSelectedJourneyId,
    setSelectedRecordId,
    resetAllDemoData,
  } = useHealth();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'preferences' | 'goals' | 'appearance'>('info');

  // Form edit states
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [dob, setDob] = useState(userProfile.dob);
  const [pronouns, setPronouns] = useState(userProfile.pronouns);
  const [intro, setIntro] = useState(userProfile.intro);
  const [heightCm, setHeightCm] = useState(userProfile.heightCm);
  const [weightKg, setWeightKg] = useState(userProfile.currentWeightKg);
  const [biologicalSex, setBiologicalSex] = useState(userProfile.biologicalSex);
  const [preferredUnits, setPreferredUnits] = useState(userProfile.preferredUnits);
  const [bannerGradient, setBannerGradient] = useState(userProfile.bannerGradient);
  const [avatarPreview, setAvatarPreview] = useState(userProfile.avatarUrl);

  // New goal state
  const [newGoalText, setNewGoalText] = useState('');
  const [goalsList, setGoalsList] = useState<string[]>(userProfile.healthGoals);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName,
      dob,
      pronouns,
      intro,
      heightCm: Number(heightCm),
      currentWeightKg: Number(weightKg),
      biologicalSex,
      preferredUnits,
      bannerGradient,
      avatarUrl: avatarPreview,
      healthGoals: goalsList,
    });
    setIsEditing(false);
  };

  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    const updated = [...goalsList, newGoalText.trim()];
    setGoalsList(updated);
    updateUserProfile({ healthGoals: updated });
    setNewGoalText('');
  };

  const handleRemoveGoal = (index: number) => {
    const updated = goalsList.filter((_, idx) => idx !== index);
    setGoalsList(updated);
    updateUserProfile({ healthGoals: updated });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Profile Header with Banner & Avatar */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        {/* Banner */}
        <div className={`h-44 sm:h-56 bg-gradient-to-r ${userProfile.bannerGradient} relative`}>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('appearance');
                setIsEditing(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white/90 bg-black/40 hover:bg-black/60 backdrop-blur-xs rounded-lg transition-colors flex items-center gap-1.5 border border-white/20"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme Banner</span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Reset sample data"
              className="p-1.5 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-lg transition-colors border border-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Identity Bar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="flex items-end gap-4">
              <div className="relative group">
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.fullName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md bg-slate-100"
                />
                <button
                  onClick={() => {
                    setActiveTab('appearance');
                    setIsEditing(true);
                  }}
                  className="absolute bottom-1 right-1 p-2 bg-teal-700 text-white rounded-full hover:bg-teal-800 shadow-md transition-colors"
                  aria-label="Change profile picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-0.5 pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {userProfile.fullName}
                  </h2>
                  <span className="text-xs font-medium text-slate-500">
                    ({userProfile.pronouns})
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {userProfile.age} years old · Born {userProfile.dob} ·{' '}
                  <span className="capitalize">{userProfile.biologicalSex}</span>
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-600 font-mono pt-1">
                  <span>Height: <strong className="text-slate-900 font-sans">{userProfile.heightCm} cm</strong></span>
                  <span>·</span>
                  <span>Weight: <strong className="text-slate-900 font-sans">{userProfile.currentWeightKg} kg</strong></span>
                  <span>·</span>
                  <span>Units: <strong className="text-slate-900 font-sans capitalize">{userProfile.preferredUnits}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 max-w-3xl leading-relaxed mt-2">
            {userProfile.intro}
          </p>
        </div>
      </div>

      {/* Health Goals Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Personal Health Goals</h3>
            <p className="text-xs text-slate-500">Long-term targets and personal health milestones</p>
          </div>
          <button
            onClick={() => {
              setActiveTab('goals');
              setIsEditing(true);
            }}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Goals</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {goalsList.map((goal, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-3.5 rounded-lg border border-slate-200/90 bg-slate-50/60"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  {idx + 1}
                </div>
                <span className="text-xs font-medium text-slate-800 leading-relaxed">{goal}</span>
              </div>
              <button
                onClick={() => handleRemoveGoal(idx)}
                className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                title="Remove goal"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
            placeholder="Add a new health goal (e.g. Run 5km without joint discomfort, Maintain TSH <2.5)..."
            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 text-slate-900"
          />
          <button
            onClick={handleAddGoal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shrink-0"
          >
            Add Goal
          </button>
        </div>
      </div>

      {/* Organized Health Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Conditions & Deficiencies */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Active Conditions & Deficiencies</span>
          </div>
          <ul className="space-y-2 text-xs">
            {userProfile.conditions.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  if (item.toLowerCase().includes('vitamin d')) {
                    setSelectedJourneyId('journey-deficiency');
                    setCurrentPage('journeys');
                  }
                }}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-teal-400 cursor-pointer transition-colors flex items-center justify-between"
              >
                <span className="font-semibold text-slate-800">{item}</span>
                <span className="text-[11px] text-teal-700 font-medium">View Journey →</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Current Medications & Treatment */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2">
            <Pill className="w-4 h-4 text-teal-600" />
            <span>Current Medications & Regimen</span>
          </div>
          <ul className="space-y-2 text-xs">
            {userProfile.medications.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSelectedRecordId('rec-rx-vitd');
                }}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-teal-400 cursor-pointer transition-colors flex items-center justify-between"
              >
                <span className="text-slate-800 font-medium leading-snug">{item}</span>
                <span className="text-[11px] text-teal-700 font-medium shrink-0 ml-2">Rx Record →</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Known Allergies & Sensitivities */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Allergies & Sensitivities</span>
          </div>
          <ul className="space-y-2 text-xs">
            {userProfile.allergies.map((item, idx) => (
              <li key={idx} className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/60 text-slate-800 font-medium">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Food Preferences & Diet */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Dietary Preferences</span>
          </div>
          <ul className="space-y-2 text-xs">
            {userProfile.foodPreferences.map((item, idx) => (
              <li key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-medium">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Important Medical History */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Medical History</span>
          </div>
          <ul className="space-y-2 text-xs">
            {userProfile.medicalHistory.map((item, idx) => (
              <li key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-mono leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Healthcare Providers */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2">
            <Stethoscope className="w-4 h-4 text-teal-700" />
            <span>Care Team & Physicians</span>
          </div>
          <div className="space-y-2 text-xs">
            {userProfile.healthcareProviders.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  if (doc.id === 'doc-vance') {
                    setCurrentPage('appointment_detail');
                  }
                }}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-teal-400 cursor-pointer transition-colors"
              >
                <div className="font-bold text-slate-900">{doc.name}</div>
                <div className="text-teal-800 text-[11px] font-medium">{doc.specialty}</div>
                <div className="text-slate-500 text-[11px]">{doc.clinic} · {doc.contact}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Customize Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-6 gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'border-teal-700 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Personal Info
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'preferences'
                    ? 'border-teal-700 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'goals'
                    ? 'border-teal-700 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Health Goals
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'appearance'
                    ? 'border-teal-700 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Banner & Photo
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 overflow-y-auto flex-1">
              {activeTab === 'info' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Pronouns
                      </label>
                      <input
                        type="text"
                        value={pronouns}
                        onChange={(e) => setPronouns(e.target.value)}
                        placeholder="She / Her"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Personal Bio / Context
                    </label>
                    <textarea
                      rows={3}
                      value={intro}
                      onChange={(e) => setIntro(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Biological Sex (for clinical reference ranges)
                    </label>
                    <select
                      value={biologicalSex}
                      onChange={(e) => setBiologicalSex(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other / Specified in clinical notes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Preferred Units
                    </label>
                    <select
                      value={preferredUnits}
                      onChange={(e) => setPreferredUnits(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white"
                    >
                      <option value="metric">Metric (kg, cm, ml)</option>
                      <option value="imperial">Imperial (lbs, ft/in, oz)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'goals' && (
                <div className="space-y-3 text-xs">
                  <p className="text-slate-500">Edit, reorder, or remove your personalized health objectives:</p>
                  {goalsList.map((g, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={g}
                        onChange={(e) => {
                          const updated = [...goalsList];
                          updated[i] = e.target.value;
                          setGoalsList(updated);
                        }}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(i)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-2">
                      Select Cover Banner Gradient
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {BANNER_GRADIENTS.map((bg) => (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => setBannerGradient(bg.class)}
                          className={`p-3 rounded-lg border text-left flex items-center justify-between ${
                            bannerGradient === bg.class
                              ? 'border-teal-700 ring-2 ring-teal-600/20'
                              : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-6 h-6 rounded-md bg-gradient-to-r ${bg.class}`} />
                            <span className="font-semibold text-slate-900">{bg.label}</span>
                          </div>
                          {bannerGradient === bg.class && (
                            <Check className="w-4 h-4 text-teal-700" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block font-semibold text-slate-700 uppercase mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                      />
                      <label className="cursor-pointer px-4 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors">
                        <span>Upload Local Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFile}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reset Sample Data?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will restore all demo health records, appointments, journeys, and nutrition logs back to their initial state.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
