import React, { useState } from 'react';
import type { Graph8ImportantReply, ReplyCategory } from '../../types';
import {
  Mail,
  MessageSquare,
  Share2,
  Sparkles,
  PhoneCall,
  Calendar,
  Send,
  Check,
  Bot,
  Flame,
  AlertTriangle,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface ImportantReplyCardProps {
  reply: Graph8ImportantReply;
  onOpenConversation: (reply: Graph8ImportantReply) => void;
  onReply: (reply: Graph8ImportantReply) => void;
  onCall: (reply: Graph8ImportantReply) => void;
  onBookMeeting: (reply: Graph8ImportantReply) => void;
  onAddToSequence: (reply: Graph8ImportantReply) => void;
}

export const ImportantReplyCard: React.FC<ImportantReplyCardProps> = ({
  reply,
  onOpenConversation,
  onReply,
  onCall,
  onBookMeeting,
  onAddToSequence
}) => {
  const [isSequenceAdded, setIsSequenceAdded] = useState(false);

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'linkedin':
        return <Share2 className="w-2.5 h-2.5 text-indigo-600" />;
      case 'sms':
        return <MessageSquare className="w-2.5 h-2.5 text-emerald-600" />;
      default:
        return <Mail className="w-2.5 h-2.5 text-sky-600" />;
    }
  };

  const getClassificationBadge = (cat: ReplyCategory, source: string) => {
    const isGraph8 = source === 'Graph8 AI';
    const sourceLabel = isGraph8 ? 'Graph8 AI' : 'AI suggestion';

    switch (cat) {
      case 'Wants Demo':
      case 'Interested':
        return {
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <Flame className="w-2.5 h-2.5 text-emerald-600" />,
          label: `${sourceLabel}: ${cat}`
        };
      case 'Pricing Question':
        return {
          classes: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Sparkles className="w-2.5 h-2.5 text-amber-600" />,
          label: `${sourceLabel}: ${cat}`
        };
      case 'Needs Human':
        return {
          classes: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <AlertTriangle className="w-2.5 h-2.5 text-rose-600 animate-pulse" />,
          label: `${sourceLabel}: ${cat}`
        };
      case 'Follow Up':
        return {
          classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: <Clock className="w-2.5 h-2.5 text-indigo-600" />,
          label: `${sourceLabel}: ${cat}`
        };
      case 'Negative/Not Interested':
        return {
          classes: 'bg-slate-100 text-slate-600 border-slate-200',
          icon: <Bot className="w-2.5 h-2.5 text-slate-500" />,
          label: `${sourceLabel}: ${cat}`
        };
      default:
        return {
          classes: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <Bot className="w-2.5 h-2.5 text-purple-600" />,
          label: `${sourceLabel}: ${cat}`
        };
    }
  };

  const badgeConfig = getClassificationBadge(reply.classification, reply.classificationSource);

  const initials = reply.contactName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'DM';

  const handleSequenceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSequenceAdded(true);
    onAddToSequence(reply);
    setTimeout(() => {
      setIsSequenceAdded(false);
    }, 2500);
  };

  return (
    <div
      className={`p-3 rounded-xl border transition-all select-none ${
        reply.unread
          ? 'bg-white border-purple-300 shadow-2xs hover:shadow-card-hover'
          : 'bg-white border-slate-200/90 hover:border-purple-300 shadow-card-light hover:shadow-card-hover'
      }`}
    >
      {/* Top Header: Contact, Role, Channel & Priority Tier */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-[11px] shadow-2xs"
            style={{
              background: 'linear-gradient(135deg, #00d2ff 0%, #9b51e0 50%, #ff2a85 100%)'
            }}
          >
            {initials}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              {reply.unread && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0 animate-pulse" />
              )}
              <h4
                onClick={() => onOpenConversation(reply)}
                className="text-[12px] font-bold text-slate-900 hover:text-purple-700 transition-colors truncate cursor-pointer"
              >
                {reply.contactName}
              </h4>
            </div>
            <p className="text-[10.5px] text-slate-500 truncate">
              {reply.role} • <span className="font-semibold text-slate-700">{reply.company}</span>
            </p>
          </div>
        </div>

        {/* Channel & Timestamp */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="flex items-center gap-1 text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {getChannelIcon(reply.channel)}
            <span>{reply.channel}</span>
          </span>
          <span className="text-[9.5px] font-mono text-slate-400">
            {reply.receivedTime}
          </span>
        </div>
      </div>

      {/* Classification Pill */}
      <div className="mb-2 flex items-center justify-between">
        <div
          className={`inline-flex items-center gap-1 text-[9.5px] font-mono px-2 py-0.5 rounded-full border font-semibold ${badgeConfig.classes}`}
        >
          {badgeConfig.icon}
          <span>{badgeConfig.label}</span>
        </div>

        {reply.priorityTier === 1 && (
          <span className="text-[9px] font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
            Tier 1: High Interest
          </span>
        )}
        {reply.priorityTier === 2 && (
          <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
            Tier 2: Needs Attention
          </span>
        )}
      </div>

      {/* Message Preview */}
      <div
        onClick={() => onOpenConversation(reply)}
        className="p-2 rounded-lg bg-slate-50/80 border border-slate-200/80 text-[11px] text-slate-700 leading-relaxed mb-2 cursor-pointer hover:bg-slate-100/70 transition-colors"
      >
        <p className="line-clamp-2 italic font-sans">
          &ldquo;{reply.preview}&rdquo;
        </p>
      </div>

      {/* Suggested Next Action */}
      <div className="p-2 rounded-lg bg-purple-50/60 border border-purple-100 mb-2.5 flex items-start gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <span className="text-[9px] font-bold text-purple-900 block leading-none mb-0.5 uppercase tracking-wide">
            Suggested Next Action
          </span>
          <p className="text-[10.5px] text-purple-950 font-medium leading-tight">
            {reply.suggestedNextAction}
          </p>
        </div>
      </div>

      {/* 5 Actions Bar: Open, Reply, Call, Book, Sequence */}
      <div className="grid grid-cols-5 gap-1 pt-1.5 border-t border-slate-100 text-[10px]">
        {/* 1. Open conversation */}
        <button
          onClick={() => onOpenConversation(reply)}
          className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors"
          title="Open Conversation History"
        >
          <ArrowUpRight className="w-3 h-3 text-slate-500" />
          <span className="truncate">Open</span>
        </button>

        {/* 2. Reply */}
        <button
          onClick={() => onReply(reply)}
          className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold border border-purple-200 transition-colors"
          title="Compose AI Reply"
        >
          <Send className="w-3 h-3 text-purple-600" />
          <span className="truncate">Reply</span>
        </button>

        {/* 3. Call */}
        <button
          onClick={() => onCall(reply)}
          className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold border border-sky-200 transition-colors"
          title="Launch Fast Voice Dialer"
        >
          <PhoneCall className="w-3 h-3 text-sky-600" />
          <span className="truncate">Call</span>
        </button>

        {/* 4. Book meeting */}
        <button
          onClick={() => onBookMeeting(reply)}
          className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200 transition-colors"
          title="Send Instant Booking Calendar Link"
        >
          <Calendar className="w-3 h-3 text-emerald-600" />
          <span className="truncate">Book</span>
        </button>

        {/* 5. Add to sequence */}
        <button
          onClick={handleSequenceClick}
          className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-md font-semibold border transition-all ${
            isSequenceAdded
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
          title="Enroll or Update Outreach Sequence"
        >
          {isSequenceAdded ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="truncate">Enrolled</span>
            </>
          ) : (
            <span className="truncate">+Seq</span>
          )}
        </button>
      </div>
    </div>
  );
};
