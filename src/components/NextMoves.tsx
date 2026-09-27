import React from 'react';
import { HighIntentCard } from './cards/HighIntentCard';
import { InterestedReplyCard } from './cards/InterestedReplyCard';
import { FollowUpCard } from './cards/FollowUpCard';
import type { HighIntentCardData, InterestedReplyCardData, FollowUpCardData, DrawerType } from '../types';
import { CheckCheck, Sparkles } from 'lucide-react';

interface NextMovesProps {
  highIntentData: HighIntentCardData;
  interestedReplyData: InterestedReplyCardData;
  followUpData: FollowUpCardData;
  onOpenDrawer: (type: DrawerType, data: any) => void;
  searchFilter?: string;
}

export const NextMoves: React.FC<NextMovesProps> = ({
  highIntentData,
  interestedReplyData,
  followUpData,
  onOpenDrawer,
  searchFilter = ''
}) => {
  const q = searchFilter.toLowerCase().trim();

  const matchHighIntent = !q || 
    highIntentData.contactName.toLowerCase().includes(q) ||
    highIntentData.company.toLowerCase().includes(q) ||
    highIntentData.role.toLowerCase().includes(q) ||
    highIntentData.intentReason.toLowerCase().includes(q) ||
    'high intent'.includes(q);

  const matchInterested = !q ||
    interestedReplyData.contactName.toLowerCase().includes(q) ||
    interestedReplyData.company.toLowerCase().includes(q) ||
    interestedReplyData.previewMessage.toLowerCase().includes(q) ||
    'interested reply'.includes(q);

  const matchFollowUp = !q ||
    followUpData.contactName.toLowerCase().includes(q) ||
    followUpData.company.toLowerCase().includes(q) ||
    followUpData.followUpReason.toLowerCase().includes(q) ||
    'follow-up'.includes(q) || 'followup'.includes(q);

  const visibleCount = [matchHighIntent, matchInterested, matchFollowUp].filter(Boolean).length;

  return (
    <div className="px-3.5 pb-3">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-[12px] font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
            <span>Your next moves</span>
          </h2>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold shadow-2xs">
            {visibleCount} prioritized
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
          <Sparkles className="w-3 h-3 text-purple-500" />
          <span className="text-brand-gradient font-semibold">AI Revenue Engine</span>
        </div>
      </div>

      {/* Cards list */}
      <div className="space-y-2.5">
        {matchHighIntent && (
          <HighIntentCard
            data={highIntentData}
            onView={(data) => onOpenDrawer('prospect_detail', data)}
            onCall={(data) => onOpenDrawer('call_modal', data)}
            onBook={(data) => onOpenDrawer('book_meeting', data)}
          />
        )}

        {matchInterested && (
          <InterestedReplyCard
            data={interestedReplyData}
            onReply={(data) => onOpenDrawer('reply_composer', data)}
            onOpen={(data) => onOpenDrawer('reply_composer', data)}
          />
        )}

        {matchFollowUp && (
          <FollowUpCard
            data={followUpData}
            onOpen={(data) => onOpenDrawer('followup_action', data)}
          />
        )}

        {visibleCount === 0 && (
          <div className="py-8 text-center px-4 rounded-xl bg-slate-50 border border-slate-200">
            <CheckCheck className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-[12px] text-slate-700 font-medium">No moves match &ldquo;{searchFilter}&rdquo;</p>
            <p className="text-[11px] text-slate-500 mt-1">Try clearing your command bar filter or search globally.</p>
          </div>
        )}
      </div>
    </div>
  );
};
