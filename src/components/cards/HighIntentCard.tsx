import React from 'react';
import { Eye, PhoneCall, Calendar, Zap, Building2, Flame } from 'lucide-react';
import type { HighIntentCardData } from '../../types';

interface HighIntentCardProps {
  data: HighIntentCardData;
  onView: (data: HighIntentCardData) => void;
  onCall: (data: HighIntentCardData) => void;
  onBook: (data: HighIntentCardData) => void;
}

export const HighIntentCard: React.FC<HighIntentCardProps> = ({
  data,
  onView,
  onCall,
  onBook
}) => {
  return (
    <div className="group relative rounded-[16px] bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-card-hover p-3.5 transition-all duration-200 backdrop-blur-sm shadow-card-light">
      {/* Top row: Label badge + Signal score */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9.5px] font-mono font-semibold uppercase tracking-wider shadow-2xs">
            <Flame className="w-2.5 h-2.5 text-emerald-600" />
            High Intent
          </span>
          <span className="text-[10px] font-mono text-sky-700 font-semibold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
            {data.signalBadge.score}% Match
          </span>
        </div>

        <span className="text-[10px] text-slate-400 font-mono">
          Radar Telemetry
        </span>
      </div>

      {/* Contact & Company Information */}
      <div className="mb-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-[13px] font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
            {data.contactName}
          </h3>
          <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-400" />
            {data.company}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 font-normal">
          {data.role}
        </p>
      </div>

      {/* Intent Reason Box */}
      <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 leading-snug flex items-start gap-1.5">
        <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <span className="line-clamp-2">
          {data.intentReason}
        </span>
      </div>

      {/* Action Buttons: View, Call, Book */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
        <button
          onClick={() => onView(data)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/80 transition-colors shadow-2xs"
        >
          <Eye className="w-3 h-3 text-slate-500" />
          <span>View</span>
        </button>

        <button
          onClick={() => onCall(data)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-semibold border border-sky-200 transition-colors shadow-2xs"
        >
          <PhoneCall className="w-3 h-3 text-sky-600" />
          <span>Call</span>
        </button>

        <button
          onClick={() => onBook(data)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold border border-emerald-200 transition-colors shadow-2xs"
        >
          <Calendar className="w-3 h-3 text-emerald-600" />
          <span>Book</span>
        </button>
      </div>
    </div>
  );
};
