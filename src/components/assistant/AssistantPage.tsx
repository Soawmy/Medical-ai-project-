/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  Sparkles,
  Send,
  RotateCcw,
  User,
  HeartPulse,
  FileText,
  Calendar,
  Pill,
  Activity,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    clearChatMessages,
    isAssistantThinking,
    userProfile,
    healthRecords,
    setSelectedRecordId,
    setCurrentPage,
    appointments,
    journeys,
  } = useHealth();

  const [input, setInput] = useState('');
  const [isContextCollapsed, setIsContextCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAssistantThinking]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isAssistantThinking) return;
    const text = input.trim();
    setInput('');
    sendChatMessage(text);
  };

  const handlePromptClick = (prompt: string) => {
    if (isAssistantThinking) return;
    sendChatMessage(prompt);
  };

  const SUGGESTED_PROMPTS = [
    'Explain my latest blood test results',
    'What should I ask Dr. Vance next week?',
    'How is my Vitamin D repletion progressing?',
    'Summarize my growth and height status',
    'How are my daily nutrition & macros tracking?',
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-slate-50">
      {/* Main Conversation Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white border-r border-slate-200">
        {/* Chat Header */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                MediCall AI Clinical Assistant
              </h2>
              <span className="text-[11px] text-teal-700 font-medium">
                Grounded in Alex's electronic health records & active journeys
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearChatMessages}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 border border-slate-200"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className="shrink-0 mt-0.5">
                  {isUser ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt="You"
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center shadow-xs">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-teal-700 text-white font-medium rounded-tr-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>

                  {/* Referenced Records Links (Assistant only) */}
                  {!isUser && msg.referencedRecordIds && msg.referencedRecordIds.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Referenced Clinical Records:
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {msg.referencedRecordIds.map((recId) => {
                          const r = healthRecords.find((rec) => rec.id === recId);
                          if (!r) return null;
                          return (
                            <button
                              key={recId}
                              onClick={() => setSelectedRecordId(recId)}
                              className="px-2 py-1 rounded bg-white border border-slate-200 text-teal-800 hover:bg-teal-50 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <FileText className="w-3 h-3 text-teal-600" />
                              <span className="truncate max-w-[200px]">{r.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Follow-up suggestions */}
                  {!isUser && msg.followUpSuggestions && msg.followUpSuggestions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                      {msg.followUpSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePromptClick(suggestion)}
                          className="px-2.5 py-1 rounded-full bg-white border border-teal-200 text-teal-800 hover:bg-teal-50 text-[11px] font-medium transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-1.5 font-mono ${
                      isUser ? 'text-teal-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isAssistantThinking && (
            <div className="flex gap-3 max-w-md">
              <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                <HeartPulse className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] text-slate-400 font-mono">
                  Synthesizing patient health profile...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Strip (above input) */}
        {chatMessages.length <= 2 && (
          <div className="px-6 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Suggestions:
            </span>
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(prompt)}
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-teal-400 hover:text-teal-900 text-xs whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Message Composer */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your lab results, growth tracking, vitamin regimen, or appointment..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isAssistantThinking}
              className="p-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 text-white rounded-xl shadow-xs transition-colors shrink-0"
              aria-label="Send health inquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            MediCall AI provides personalized health literacy assistance based on your uploaded records. Always consult licensed medical clinicians for diagnosis.
          </p>
        </form>
      </div>

      {/* Patient Record Context Panel (Right Side on desktop) */}
      <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-5 space-y-4 overflow-y-auto shrink-0">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Active Patient Context
            </h3>
          </div>
          <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-mono font-bold">
            Synchronized
          </span>
        </div>

        {/* Profile Card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
          <div className="font-bold text-slate-900">{userProfile.fullName} ({userProfile.pronouns})</div>
          <div className="text-slate-500 font-mono text-[11px]">
            {userProfile.age} yrs · {userProfile.currentWeightKg} kg · {userProfile.heightCm} cm
          </div>
        </div>

        {/* Active Conditions */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Diagnoses & Deficiencies
          </span>
          <div className="space-y-1 text-xs">
            {userProfile.conditions.map((c, i) => (
              <div key={i} className="p-2 bg-slate-50 rounded border border-slate-100 text-slate-800 font-medium">
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Key Recent Lab Indicators */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Latest Biometrics & Analytes
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              onClick={() => setSelectedRecordId('rec-vitd-sep26')}
              className="p-2 bg-amber-50/60 border border-amber-200/80 rounded cursor-pointer hover:border-amber-400"
            >
              <span className="text-[10px] text-amber-800 block">25-OH Vit D</span>
              <span className="font-mono font-bold text-amber-900">18.0 ng/mL</span>
            </div>
            <div
              onClick={() => setSelectedRecordId('rec-thyroid-sep26')}
              className="p-2 bg-slate-50 border border-slate-100 rounded cursor-pointer hover:border-teal-400"
            >
              <span className="text-[10px] text-slate-500 block">TSH (Thyroid)</span>
              <span className="font-mono font-bold text-slate-900">2.15 mIU/L</span>
            </div>
            <div
              onClick={() => setSelectedRecordId('rec-cbc-sep26')}
              className="p-2 bg-slate-50 border border-slate-100 rounded cursor-pointer hover:border-teal-400"
            >
              <span className="text-[10px] text-slate-500 block">Hemoglobin</span>
              <span className="font-mono font-bold text-slate-900">12.8 g/dL</span>
            </div>
            <div
              onClick={() => setSelectedRecordId('rec-radiology-xray')}
              className="p-2 bg-slate-50 border border-slate-100 rounded cursor-pointer hover:border-teal-400"
            >
              <span className="text-[10px] text-slate-500 block">Bone Age X-Ray</span>
              <span className="font-mono font-bold text-slate-900">Physes Fused</span>
            </div>
          </div>
        </div>

        {/* Active Medications */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Medications
          </span>
          <div className="space-y-1 text-xs">
            {userProfile.medications.map((m, i) => (
              <div key={i} className="p-2 bg-slate-50 rounded border border-slate-100 text-slate-700 text-[11px] leading-tight">
                {m}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Consult */}
        <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-xl space-y-1 text-xs text-teal-900">
          <div className="flex items-center justify-between">
            <span className="font-bold">Next Doctor Visit</span>
            <span className="text-[10px] font-mono text-teal-800">Nov 4</span>
          </div>
          <div className="font-semibold">Dr. Evelyn Vance, MD</div>
          <p className="text-[11px] text-teal-800">Endocrinology & Metabolic Health</p>
          <button
            onClick={() => setCurrentPage('appointment_detail')}
            className="text-[11px] font-bold text-teal-800 hover:text-teal-950 inline-flex items-center gap-1 pt-1"
          >
            <span>Open Visit Prep →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
