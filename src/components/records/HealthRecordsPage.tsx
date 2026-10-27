/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useHealth } from '../../context/HealthContext';
import { RecordCategory } from '../../types/health';
import {
  FileText,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Calendar,
  Sparkles,
  Building,
  User,
  ExternalLink,
  Activity,
  Pill,
  FileCheck,
  Eye,
} from 'lucide-react';

export const HealthRecordsPage: React.FC = () => {
  const {
    healthRecords,
    setSelectedRecordId,
    setIsAddRecordModalOpen,
    journeys,
  } = useHealth();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredRecords = useMemo(() => {
    return healthRecords
      .filter((rec) => {
        if (activeCategory !== 'all' && rec.category !== activeCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = rec.title.toLowerCase().includes(q);
          const matchDoc = rec.clinician.toLowerCase().includes(q);
          const matchFac = rec.facility.toLowerCase().includes(q);
          const matchNotes = rec.notes?.toLowerCase().includes(q);
          return matchTitle || matchDoc || matchFac || matchNotes;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [healthRecords, activeCategory, searchQuery, sortOrder]);

  const CATEGORIES = [
    { id: 'all', label: 'All Records', count: healthRecords.length },
    { id: 'lab', label: 'Laboratory Results', count: healthRecords.filter((r) => r.category === 'lab').length },
    { id: 'radiology', label: 'Radiology', count: healthRecords.filter((r) => r.category === 'radiology').length },
    { id: 'clinical_notes', label: 'Clinical Notes', count: healthRecords.filter((r) => r.category === 'clinical_notes').length },
    { id: 'prescriptions', label: 'Prescriptions', count: healthRecords.filter((r) => r.category === 'prescriptions').length },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Health Records
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Your medical information, diagnostic tests, and clinical imaging organized in one place.
          </p>
        </div>

        <button
          onClick={() => setIsAddRecordModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeCategory === cat.id ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records by test name, clinician, lab facility, or notes..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 text-slate-900 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Record Cards Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No matching medical records found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or category filters, or upload a new record to your library.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record) => {
            const journey = journeys.find((j) => j.id === record.journeyId);

            return (
              <div
                key={record.id}
                onClick={() => setSelectedRecordId(record.id)}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-teal-500/80 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {record.category === 'lab'
                        ? 'Laboratory'
                        : record.category === 'radiology'
                        ? 'Radiology'
                        : record.category === 'clinical_notes'
                        ? 'Consultation'
                        : 'Prescription'}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {record.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-900 transition-colors line-clamp-1">
                    {record.title}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{record.clinician}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{record.facility}</span>
                    </div>
                  </div>

                  {/* Radiology preview thumbnail or lab stats summary */}
                  {record.category === 'radiology' && (
                    <div className="mt-3 relative rounded-lg overflow-hidden border border-slate-900 h-28 bg-slate-950 flex items-center justify-center">
                      <img
                        src={record.previewImageUrl || '/src/assets/images/radiology_xray_hand_1793113251066.jpg'}
                        alt="Radiograph Thumbnail"
                        className="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                      />
                      <span className="absolute bottom-1 right-2 text-[10px] text-white/80 bg-black/60 px-1.5 py-0.5 rounded font-mono">
                        DICOM PA View
                      </span>
                    </div>
                  )}

                  {record.category === 'lab' && record.labItems && (
                    <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between font-semibold text-slate-700">
                        <span>Extracted Lab Tests:</span>
                        <span className="font-mono text-teal-800">{record.labItems.length} analytes</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px] truncate">
                        {record.labItems.slice(0, 3).map((it) => (
                          <span key={it.id} className="truncate">
                            {it.testName.split(' ')[0]}: {it.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {journey && (
                    <div className="mt-3 text-[11px] text-slate-600 flex items-center gap-1">
                      <span className="font-medium text-teal-800">Journey:</span>
                      <span className="truncate">{journey.title}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span
                    className={`flex items-center gap-1 font-semibold text-[11px] ${
                      record.aiAnalysisStatus === 'analyzed' ? 'text-teal-700' : 'text-amber-700'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{record.aiAnalysisStatus === 'analyzed' ? 'AI Interpreted' : 'Pending AI'}</span>
                  </span>

                  <button className="text-xs font-semibold text-teal-700 group-hover:text-teal-900 inline-flex items-center gap-1">
                    <span>View Record</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
