/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Maximize2,
  Minimize2,
  Trash2,
  Bot,
  User,
  Zap,
  Activity,
  Utensils,
  FileText,
  Compass,
} from 'lucide-react';

export const FloatingAIChatWidget: React.FC = () => {
  const {
    isFloatingChatOpen,
    setIsFloatingChatOpen,
    chatMessages,
    sendChatMessage,
    isAssistantThinking,
    chatMode,
    setChatMode,
    currentPage,
    setCurrentPage,
    clearChatMessages,
    setIsScanFoodModalOpen,
  } = useHealth();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside chat
  useEffect(() => {
    if (isFloatingChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isFloatingChatOpen, isAssistantThinking]);

  // Don't render floating launcher if already on the dedicated full-page AI Assistant
  if (currentPage === 'assistant') {
    return null;
  }

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isAssistantThinking) return;
    const msg = input.trim();
    setInput('');
    sendChatMessage(msg);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt);
  };

  const getContextualPrompts = () => {
    switch (currentPage) {
      case 'nutrition':
        return [
          { label: 'Calculate net caloric deficit', query: 'What is my current net caloric deficit based on my Mifflin-St Jeor TDEE and today\'s meals?' },
          { label: 'Check protein & Vit D synergy', query: 'How does my protein and fat intake today support the Ergocalciferol 50,000 IU repletion protocol?' },
          { label: 'Scan food with Cal AI', action: () => setIsScanFoodModalOpen(true) },
        ];
      case 'journeys':
        return [
          { label: 'Analyze Vitamin D velocity', query: 'How fast is my Vitamin D 25-OH rising under Ergocalciferol therapy and when should normal range be achieved?' },
          { label: 'Weight & deficit pacing', query: 'Am I on pace for the 65.0 kg target weight while preserving lean muscle mass?' },
          { label: 'Explain epiphyseal fusion', query: 'What does the wrist radiograph finding mean for my height and posture targets?' },
        ];
      case 'records':
        return [
          { label: 'Flag abnormal values', query: 'Which of my recent lab tests are outside standard reference intervals, and what are the clinical implications?' },
          { label: 'Explain Vitamin D result', query: 'Explain my 25-OH Vitamin D level of 18.0 ng/mL in context of the baseline 14.0 ng/mL.' },
        ];
      default:
        return [
          { label: 'Review Dr. Vance appointment', query: 'What should I prepare for my upcoming endocrine visit with Dr. Evelyn Vance?' },
          { label: 'Evaluate metabolic velocity', query: 'How are my weight, nutrition, and Vitamin D levels trending this month?' },
          { label: 'Explain Cal AI calorie tracking', query: 'How does MediCall AI calculate my caloric intake and nutritional balance?' },
        ];
    }
  };

  return (
    <div className={`fixed bottom-20 lg:bottom-6 right-3 sm:right-6 ${isFloatingChatOpen ? 'z-50' : 'z-30'} select-none`}>
      {/* Floating Trigger Button */}
      {!isFloatingChatOpen && (
        <button
          onClick={() => setIsFloatingChatOpen(true)}
          className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          aria-label="Open MediCall AI Assistant"
        >
          <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-teal-300"></span>
          </span>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-teal-200 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold tracking-wide">
            MediCall AI Bot
          </span>
        </button>
      )}

      {/* Expanded Floating Drawer Widget */}
      {isFloatingChatOpen && (
        <div className="w-[calc(100vw-1.5rem)] sm:w-96 md:w-[420px] h-[520px] max-h-[76vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white tracking-tight">
                    MediCall Health Bot
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.2 rounded">
                    Active
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">
                  Context: {currentPage === 'nutrition' ? 'Calories & Nutrition' : currentPage === 'journeys' ? 'Active Journeys' : currentPage === 'records' ? 'Medical Records' : 'Global Profile'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              {/* Maximize to full page */}
              <button
                onClick={() => {
                  setIsFloatingChatOpen(false);
                  setCurrentPage('assistant');
                }}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Open full page assistant"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                onClick={() => setIsFloatingChatOpen(false)}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Mode Pill Selector */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mr-1">
              Focus:
            </span>
            {(
              [
                { id: 'general', label: 'All Health', icon: Activity },
                { id: 'calories', label: 'Calories & Food', icon: Utensils },
                { id: 'records', label: 'Lab Records', icon: FileText },
                { id: 'journeys', label: 'Journeys', icon: Compass },
              ] as const
            ).map((m) => {
              const Icon = m.icon;
              const isSelected = chatMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setChatMode(m.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-2xs font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40 text-xs">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs leading-relaxed ${
                      isUser
                        ? 'bg-teal-700 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right font-mono ${
                        isUser ? 'text-teal-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      AM
                    </div>
                  )}
                </div>
              );
            })}

            {/* Assistant Thinking Indicator */}
            {isAssistantThinking && (
              <div className="flex gap-2 items-center text-slate-500 py-1">
                <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-500 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" />
                  <span className="text-[11px] font-medium ml-1">
                    Analyzing clinical records...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Contextual Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {getContextualPrompts().map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (p.action) {
                    p.action();
                  } else if (p.query) {
                    handleQuickPrompt(p.query);
                  }
                }}
                className="px-2.5 py-1 text-[10.5px] font-medium text-slate-700 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 border border-transparent rounded-full whitespace-nowrap transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about calories, records, labs, or health goals..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-slate-50 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isAssistantThinking}
              className="p-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-lg transition-colors shadow-2xs shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
