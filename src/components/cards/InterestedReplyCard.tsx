import React from 'react';
import { Mail, Reply, ExternalLink, Bot, Building2 } from 'lucide-react';
import type { InterestedReplyCardData } from '../../types';

interface InterestedReplyCardProps {
  data: InterestedReplyCardData;
  onReply: (data: InterestedReplyCardData) => void;
  onOpen: (data: InterestedReplyCardData) => void;
}

export const InterestedReplyCard: React.FC<InterestedReplyCardProps> = ({
  data,
  onReply,
  onOpen
}) => {
  return (
    <div className="group relative rounded-[16px] bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-card-hover p-3.5 transition-all duration-200 backdrop-blur-sm shadow-card-light">
      {/* Top row: Classification badge + time */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[9.5px] font-mono font-semibold uppercase tracking-wider shadow-2xs">
            <Bot className="w-2.5 h-2.5 text-purple-600" />
            {data.aiClassification.label}
          </span>
          <span className="text-[10px] font-mono text-purple-700 font-semibold bg-purple-50/70 px-1.5 py-0.5 rounded border border-purple-200">
            {data.aiClassification.sentimentScore}% Conf
          </span>
        </div>

        <span className="text-[10px] text-slate-400 font-mono">
          {data.receivedTime}
        </span>
      </div>

      {/* Contact & Company */}
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

      {/* Short Message Preview */}
      <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 leading-snug flex items-start gap-1.5">
        <Mail className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
        <span className="line-clamp-2 italic text-slate-700">
          &ldquo;{data.previewMessage}&rdquo;
        </span>
      </div>

      {/* Action Buttons: Reply, Open */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={() => onReply(data)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold border border-purple-200 transition-colors shadow-2xs"
        >
          <Reply className="w-3 h-3 text-purple-600" />
          <span>Reply</span>
        </button>

        <button
          onClick={() => onOpen(data)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/80 transition-colors shadow-2xs"
        >
          <ExternalLink className="w-3 h-3 text-slate-500" />
          <span>Open</span>
        </button>
      </div>
    </div>
  );
};
