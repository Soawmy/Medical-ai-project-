/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { RecordCategory } from '../../types/health';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';

export const AddRecordModal: React.FC = () => {
  const { isAddRecordModalOpen, setIsAddRecordModalOpen, addHealthRecord, journeys } = useHealth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RecordCategory>('lab');
  const [date, setDate] = useState('2026-10-27');
  const [facility, setFacility] = useState('');
  const [clinician, setClinician] = useState('');
  const [journeyId, setJourneyId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isAddRecordModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        setFilePreviewUrl(preview);
      } else {
        setFilePreviewUrl(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHealthRecord({
      title: title.trim(),
      category,
      date,
      facility: facility.trim() || 'General Medical Diagnostics',
      clinician: clinician.trim() || 'Attending Physician',
      journeyId: journeyId || undefined,
      aiAnalysisStatus: 'pending',
      fileType: selectedFileName.endsWith('.pdf') ? 'pdf' : filePreviewUrl ? 'image' : 'report',
      fileName: selectedFileName || `${title.replace(/\s+/g, '_')}_Record.pdf`,
      fileSize: '1.2 MB',
      previewImageUrl: filePreviewUrl || undefined,
      notes: notes.trim() || undefined,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsAddRecordModalOpen(false);
      // Reset form
      setTitle('');
      setCategory('lab');
      setFacility('');
      setClinician('');
      setJourneyId('');
      setNotes('');
      setSelectedFileName('');
      setFilePreviewUrl(null);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add Health Record</h2>
            <p className="text-xs text-slate-500">Upload and catalog medical documents, lab results, or imaging</p>
          </div>
          <button
            onClick={() => setIsAddRecordModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-teal-600 mb-3 animate-bounce" />
            <h3 className="text-lg font-semibold text-slate-900">Record Added Successfully</h3>
            <p className="text-sm text-slate-500 mt-1">Saved to your permanent medical records repository.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Record Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Comprehensive Metabolic Panel, Pelvic Ultrasound"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RecordCategory)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 bg-white"
                >
                  <option value="lab">Laboratory Results</option>
                  <option value="radiology">Radiology & Imaging</option>
                  <option value="clinical_notes">Clinical Consultation Note</option>
                  <option value="prescriptions">Prescription</option>
                  <option value="other">Other Medical Document</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Examination Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Clinician / Provider
                </label>
                <input
                  type="text"
                  value={clinician}
                  onChange={(e) => setClinician(e.target.value)}
                  placeholder="e.g. Dr. Evelyn Vance, MD"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Facility / Lab
                </label>
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  placeholder="e.g. Quest Diagnostics"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Associate with Health Journey (Optional)
              </label>
              <select
                value={journeyId}
                onChange={(e) => setJourneyId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 bg-white"
              >
                <option value="">None / General Health Record</option>
                {journeys.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Attach Medical File or Report
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-teal-500 transition-colors bg-slate-50/50">
                <input
                  type="file"
                  id="record-file-input"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
                <label
                  htmlFor="record-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-1"
                >
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-medium text-teal-700">
                    {selectedFileName ? selectedFileName : 'Click to choose file from computer'}
                  </span>
                  <span className="text-[11px] text-slate-400">PDF, DICOM images, PNG, JPG (Local preview only)</span>
                </label>

                {filePreviewUrl && (
                  <div className="mt-3 relative rounded-lg overflow-hidden border border-slate-200 max-h-36 flex items-center justify-center bg-black/5">
                    <img
                      src={filePreviewUrl}
                      alt="Local Preview"
                      className="max-h-36 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Clinical Notes / Context
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key symptoms, physician recommendations, or specific questions..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddRecordModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
              >
                Save Record
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
