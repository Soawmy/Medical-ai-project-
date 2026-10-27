/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  X,
  FileText,
  Sparkles,
  Download,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building,
  User,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Maximize2,
  ZoomIn,
} from 'lucide-react';

export const RecordDetailModal: React.FC = () => {
  const {
    selectedRecordId,
    setSelectedRecordId,
    healthRecords,
    runSimulatedRecordAI,
    journeys,
  } = useHealth();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!selectedRecordId) return null;

  const record = healthRecords.find((r) => r.id === selectedRecordId);
  if (!record) return null;

  const associatedJourney = journeys.find((j) => j.id === record.journeyId);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      runSimulatedRecordAI(record.id);
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-teal-700 capitalize">
                {record.category === 'lab' ? 'Laboratory Results' : record.category}
              </span>
              <span>·</span>
              <span>{record.date}</span>
              {associatedJourney && (
                <>
                  <span>·</span>
                  <span className="text-slate-600 font-medium">Journey: {associatedJourney.title}</span>
                </>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{record.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRecordId(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close record modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Clinician</span>
              <span className="font-semibold text-slate-800">{record.clinician}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Facility</span>
              <span className="font-semibold text-slate-800">{record.facility}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">File Format</span>
              <span className="font-semibold text-slate-800 uppercase">{record.fileType} ({record.fileSize})</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">AI Analysis</span>
              <span className={`font-semibold ${record.aiAnalysisStatus === 'analyzed' ? 'text-teal-700' : 'text-amber-700'}`}>
                {record.aiAnalysisStatus === 'analyzed' ? 'Completed' : 'Pending Review'}
              </span>
            </div>
          </div>

          {/* Radiology Image Viewer */}
          {record.category === 'radiology' && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-slate-900 bg-slate-950 flex flex-col items-center justify-center p-3">
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10 bg-slate-900/80 backdrop-blur-xs px-2 py-1 rounded-md text-xs text-white border border-slate-800">
                  <button
                    onClick={() => setZoomLevel((z) => (z >= 1.5 ? 1 : z + 0.25))}
                    className="hover:text-teal-400 flex items-center gap-1"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom {Math.round(zoomLevel * 100)}%</span>
                  </button>
                </div>

                <div className="w-full max-h-[380px] overflow-auto flex items-center justify-center p-2">
                  <img
                    src={record.previewImageUrl || '/src/assets/images/radiology_xray_hand_1793113251066.jpg'}
                    alt="Radiology radiograph preview"
                    className="max-h-[360px] object-contain transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                </div>
                <div className="w-full text-center py-1 text-[11px] text-slate-400 border-t border-slate-900 flex justify-between px-3">
                  <span>Diagnostic PA & Lateral Projections</span>
                  <span className="font-mono">FOV: 24x30cm · DICOM Compliant</span>
                </div>
              </div>

              {record.radiologyFindings && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-semibold text-slate-900 text-sm">Radiologist Formal Impression</h4>
                  <p className="text-slate-700 leading-relaxed font-mono">{record.radiologyFindings.impression}</p>
                  <div className="pt-2 border-t border-slate-200 flex gap-4 text-slate-500">
                    <span>Modality: <strong className="text-slate-700">{record.radiologyFindings.modality}</strong></span>
                    <span>Anatomy: <strong className="text-slate-700">{record.radiologyFindings.bodyPart}</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Laboratory Results Table */}
          {record.category === 'lab' && record.labItems && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Extracted Laboratory Values</h3>
                <span className="text-xs text-slate-500">Normal and abnormal flags calibrated to certified ranges</span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Test Name</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Result</th>
                      <th className="py-2.5 px-3 font-semibold">Units</th>
                      <th className="py-2.5 px-3 font-semibold">Reference Interval</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-4 font-semibold">Prior Comparison</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {record.labItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-slate-900">
                          {item.testName}
                          {item.flagNotes && (
                            <span className="block text-[11px] text-slate-400 font-normal">{item.flagNotes}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                          {item.value}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono">{item.unit}</td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono">{item.referenceRange}</td>
                        <td className="py-2.5 px-3">
                          {item.status === 'normal' && (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              Normal
                            </span>
                          )}
                          {item.status === 'low' && (
                            <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                              <TrendingDown className="w-3.5 h-3.5" />
                              Low
                            </span>
                          )}
                          {item.status === 'high' && (
                            <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                              <TrendingUp className="w-3.5 h-3.5" />
                              High
                            </span>
                          )}
                          {item.status === 'critical' && (
                            <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Critical
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">
                          {item.previousValue || 'No earlier data'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Clinical Notes / Prescription Text */}
          {record.notes && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Document Summary & Notes
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{record.notes}</p>
            </div>
          )}

          {/* AI Clinical Interpretation Panel */}
          <div className="border border-teal-200/80 bg-teal-50/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">MediCall AI Simulated Clinical Interpretation</h3>
              </div>
              {record.aiAnalysis && (
                <span className="text-[11px] text-teal-800">
                  Generated {record.aiAnalysis.simulatedTimestamp}
                </span>
              )}
            </div>

            {record.aiAnalysis ? (
              <div className="space-y-4 text-xs text-slate-700">
                <div className="p-3 bg-white rounded-lg border border-teal-100">
                  <h4 className="font-semibold text-slate-900 mb-1">Executive Summary</h4>
                  <p className="leading-relaxed">{record.aiAnalysis.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg border border-teal-100 space-y-2">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      Key Findings
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-600 pl-1">
                      {record.aiAnalysis.keyFindings.map((finding, idx) => (
                        <li key={idx} className="leading-relaxed">{finding}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-teal-100 space-y-2">
                    <h4 className="font-semibold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Warrants Attention
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-600 pl-1">
                      {record.aiAnalysis.attentionItems.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {record.aiAnalysis.questionsForDoctor.length > 0 && (
                  <div className="p-3 bg-white rounded-lg border border-teal-100">
                    <h4 className="font-semibold text-slate-900 mb-2">Recommended Questions for Your Clinician</h4>
                    <ul className="space-y-1 text-slate-700">
                      {record.aiAnalysis.questionsForDoctor.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-bold text-teal-700">Q{idx + 1}:</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-2.5 bg-slate-100/80 rounded-md border border-slate-200 text-[11px] text-slate-500">
                  <strong>Prototype Notice:</strong> {record.aiAnalysis.limitations}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white rounded-lg border border-teal-100 text-center space-y-3">
                <p className="text-xs text-slate-600">
                  This record has not been interpreted yet. Run simulated AI analysis to extract clinical trends and generate discussion points for your doctor.
                </p>
                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors inline-flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAnalyzing ? 'Extracting Findings...' : 'Analyze with AI'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-500 font-mono">Record ID: {record.id}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedRecordId(null)}
              className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
