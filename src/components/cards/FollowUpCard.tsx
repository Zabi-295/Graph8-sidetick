import React from 'react';
import { Clock, ExternalLink, Building2, AlertCircle } from 'lucide-react';
import type { FollowUpCardData } from '../../types';

interface FollowUpCardProps {
  data: FollowUpCardData;
  onOpen: (data: FollowUpCardData) => void;
}

export const FollowUpCard: React.FC<FollowUpCardProps> = ({
  data,
  onOpen
}) => {
  return (
    <div className="group relative rounded-[16px] bg-white border border-slate-200/90 hover:border-amber-300 hover:shadow-card-hover p-3.5 transition-all duration-200 backdrop-blur-sm shadow-card-light">
      {/* Top row: Follow-up badge + stall timer */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[9.5px] font-mono font-semibold uppercase tracking-wider shadow-2xs">
            <Clock className="w-2.5 h-2.5 text-amber-600" />
            Follow-Up Needed
          </span>
          <span className="text-[10px] font-mono text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            {data.daysStalled}d Stalled
          </span>
        </div>

        {data.dealSize && (
          <span className="text-[10px] text-emerald-700 font-mono font-semibold">
            {data.dealSize}
          </span>
        )}
      </div>

      {/* Contact & Company */}
      <div className="mb-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-[13px] font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
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

      {/* Follow-up reason */}
      <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 leading-snug flex items-start gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <span className="line-clamp-2">
          {data.followUpReason}
        </span>
      </div>

      {/* Action: Open */}
      <div className="pt-1 border-t border-slate-100">
        <button
          onClick={() => onOpen(data)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/80 transition-colors shadow-2xs"
        >
          <ExternalLink className="w-3 h-3 text-slate-500" />
          <span>Open</span>
        </button>
      </div>
    </div>
  );
};
