import React, { useState } from 'react';
import type { FollowUpCardData } from '../../types';
import { Send, Check, Sparkles, FileText, Share2 } from 'lucide-react';

interface FollowUpDrawerProps {
  data: FollowUpCardData;
}

export const FollowUpDrawer: React.FC<FollowUpDrawerProps> = ({ data }) => {
  const [nudgeMessage, setNudgeMessage] = useState(
    `Hi Sarah,\n\nFollowing up on our proposal from Tuesday regarding the enterprise streaming cluster ($48k ARR).\n\nWanted to check if your legal team had any redlines or questions around the mutual NDA or data processing agreement? Happy to coordinate directly with them to save your time.\n\nBest,\nJahan`
  );
  const [sent, setSent] = useState(false);

  const handleSendNudge = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-3.5 text-slate-800">
      {/* Deal & Stalled Status Header */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-[13px] font-bold text-slate-900">
              {data.contactName}
            </h4>
            <p className="text-[10.5px] text-slate-500">
              {data.role} • {data.company}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[12px] font-mono font-bold text-emerald-700">
              {data.dealSize}
            </span>
            <div className="text-[9.5px] font-mono text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 mt-0.5">
              {data.daysStalled} Days Since Last Touch
            </div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
          <span className="text-slate-500 flex items-center gap-1">
            <FileText className="w-3 h-3 text-slate-400" />
            Stage: <span className="text-slate-800 font-semibold">{data.stage}</span>
          </span>
          <span className="text-slate-500">
            Last touch: <span className="text-slate-800 font-semibold">{data.lastTouchDate}</span>
          </span>
        </div>
      </div>

      {/* Social Signals Alert */}
      <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-900 mb-1.5">
          <Share2 className="w-3.5 h-3.5 text-sky-600" />
          <span>Active Social Radar Signal</span>
        </div>
        <p className="text-[10.5px] text-sky-950/90 leading-relaxed font-medium">
          {data.socialSignals}
        </p>
      </div>

      {/* Recommended Nudge Composer */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-1.5 text-[11px]">
          <span className="text-slate-800 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            AI Recommended Nudge
          </span>
          <span className="text-[9.5px] font-mono text-slate-400">Non-pushy assistance</span>
        </div>

        <textarea
          rows={6}
          value={nudgeMessage}
          onChange={(e) => setNudgeMessage(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white resize-none font-sans leading-relaxed"
        />

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setNudgeMessage(`Hi Sarah, saw your recent note on LinkedIn regarding data infrastructure. Quick check on the contract draft—shall we hop on a 5-minute call Thursday?`)}
              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium"
            >
              + LinkedIn Context
            </button>
            <button 
              onClick={() => setNudgeMessage(`Hi Sarah, wanted to see if your security lead had questions on our SOC2 Type II package for OmniStack AI? Happy to assist directly.`)}
              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium"
            >
              + Security Angle
            </button>
          </div>

          <button
            onClick={handleSendNudge}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold shadow-sm transition-all"
          >
            {sent ? <Check className="w-3.5 h-3.5 text-white" /> : <Send className="w-3.5 h-3.5" />}
            <span>{sent ? 'Nudge Sent!' : 'Send Nudge'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
