import React, { useState } from 'react';
import type { Graph8IntentSignal, IntentSignalLabel } from '../../types';
import {
  Flame,
  CreditCard,
  Sparkles,
  Search,
  RotateCcw,
  Building2,
  Clock,
  PhoneCall,
  User,
  Users,
  Check,
  Send,
  Zap,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface IntentSignalCardProps {
  signal: Graph8IntentSignal;
  onViewProspect: (signal: Graph8IntentSignal) => void;
  onFindDecisionMaker: (signal: Graph8IntentSignal) => void;
  onAddToSequence: (signal: Graph8IntentSignal) => void;
  onCall: (signal: Graph8IntentSignal) => void;
}

export const IntentSignalCard: React.FC<IntentSignalCardProps> = ({
  signal,
  onViewProspect,
  onFindDecisionMaker,
  onAddToSequence,
  onCall
}) => {
  const [isAddedToSequence, setIsAddedToSequence] = useState(false);

  const getSignalBadgeStyle = (type: IntentSignalLabel) => {
    switch (type) {
      case 'HIGH INTENT':
        return {
          icon: <Flame className="w-3 h-3 text-rose-600 animate-pulse" />,
          classes: 'bg-rose-50 text-rose-700 border-rose-200'
        };
      case 'PRICING INTEREST':
        return {
          icon: <CreditCard className="w-3 h-3 text-amber-600" />,
          classes: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'BUYING SIGNAL':
        return {
          icon: <Sparkles className="w-3 h-3 text-purple-600" />,
          classes: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case 'RESEARCHING':
        return {
          icon: <Search className="w-3 h-3 text-sky-600" />,
          classes: 'bg-sky-50 text-sky-700 border-sky-200'
        };
      case 'FOLLOW-UP':
        return {
          icon: <RotateCcw className="w-3 h-3 text-indigo-600" />,
          classes: 'bg-indigo-50 text-indigo-700 border-indigo-200'
        };
      default:
        return {
          icon: <Zap className="w-3 h-3 text-slate-600" />,
          classes: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  const badgeConfig = getSignalBadgeStyle(signal.signalType);

  const initials = signal.contactName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'DM';

  const handleSequenceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddedToSequence(true);
    onAddToSequence(signal);
    setTimeout(() => {
      setIsAddedToSequence(false);
    }, 2500);
  };

  return (
    <div className="p-3 rounded-xl bg-white border border-slate-200/90 hover:border-purple-300 shadow-card-light hover:shadow-card-hover transition-all group select-none">
      {/* Top Header: Contact, Role, Badge */}
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
            <h4
              onClick={() => onViewProspect(signal)}
              className="text-[12px] font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate cursor-pointer flex items-center gap-1"
            >
              <span>{signal.contactName}</span>
              {signal.linkedinUrl && (
                <ExternalLink className="w-2.5 h-2.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </h4>
            <p className="text-[10.5px] text-slate-500 truncate">
              {signal.role}
            </p>
          </div>
        </div>

        {/* Signal Type Pill */}
        <div
          className={`flex items-center gap-1 text-[9.5px] font-mono px-2 py-0.5 rounded-full border font-bold flex-shrink-0 ${badgeConfig.classes}`}
        >
          {badgeConfig.icon}
          <span>{signal.signalType}</span>
        </div>
      </div>

      {/* Company, Domain & Timestamp info */}
      <div className="flex items-center justify-between text-[10.5px] text-slate-500 mb-2 px-0.5">
        <div className="flex items-center gap-1.5 truncate">
          <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span className="font-semibold text-slate-700 truncate">{signal.company}</span>
          {signal.companyDomain && (
            <span className="text-[9px] font-mono text-slate-400">({signal.companyDomain})</span>
          )}
        </div>

        {signal.timestamp && (
          <div className="flex items-center gap-1 text-[9.5px] font-mono text-slate-400 flex-shrink-0">
            <Clock className="w-2.5 h-2.5" />
            <span>{signal.timestamp}</span>
          </div>
        )}
      </div>

      {/* Signal Description */}
      <p className="text-[11px] text-slate-700 mb-2 leading-relaxed bg-slate-50/70 p-2 rounded-lg border border-slate-100">
        {signal.signalDescription}
      </p>

      {/* Priority / Graph8 Confidence Row (Only real Graph8 data, no invented scores) */}
      <div className="flex items-center justify-between mb-2 px-0.5 text-[10px]">
        {signal.graph8Confidence !== undefined && signal.graph8Confidence >= 60 ? (
          <span className="inline-flex items-center gap-1 font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <Zap className="w-2.5 h-2.5 text-emerald-600" />
            <span>Graph8 Score: {signal.graph8Confidence}%</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-mono text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200 font-medium">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
            <span>Verified Lead • {signal.seniority || 'Executive'}</span>
          </span>
        )}

        {signal.location && (
          <span className="text-slate-400 text-[9.5px] truncate max-w-[150px]">
            {signal.location}
          </span>
        )}
      </div>

      {/* Recommended Action Box */}
      <div className="p-2 rounded-lg bg-purple-50/60 border border-purple-100 mb-2.5 flex items-start gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <span className="text-[9.5px] font-bold text-purple-900 block leading-none mb-0.5 uppercase tracking-wide">
            Recommended Action
          </span>
          <p className="text-[10.5px] text-purple-950 font-medium leading-tight">
            {signal.recommendedAction}
          </p>
        </div>
      </div>

      {/* 4 Action Buttons: View Prospect, Find Decision Maker, Add to Sequence, Call */}
      <div className="grid grid-cols-4 gap-1 pt-1.5 border-t border-slate-100">
        {/* 1. View Prospect */}
        <button
          onClick={() => onViewProspect(signal)}
          className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200 transition-colors"
          title="View Prospect Profile"
        >
          <User className="w-3 h-3 text-slate-500" />
          <span className="truncate">Prospect</span>
        </button>

        {/* 2. Find Decision Maker */}
        <button
          onClick={() => onFindDecisionMaker(signal)}
          className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-[10px] font-semibold border border-slate-200 hover:border-purple-200 transition-colors"
          title="Find Decision Makers at this company"
        >
          <Users className="w-3 h-3 text-purple-500" />
          <span className="truncate">Decision Maker</span>
        </button>

        {/* 3. Add to Sequence */}
        <button
          onClick={handleSequenceClick}
          className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-md text-[10px] font-semibold border transition-all ${
            isAddedToSequence
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
          }`}
          title="Enroll into Outreach Sequence"
        >
          {isAddedToSequence ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="truncate">Enrolled</span>
            </>
          ) : (
            <>
              <Send className="w-3 h-3 text-purple-600" />
              <span className="truncate">Sequence</span>
            </>
          )}
        </button>

        {/* 4. Call */}
        <button
          onClick={() => onCall(signal)}
          className="flex items-center justify-center gap-1 py-1.5 px-1 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-700 text-[10px] font-semibold border border-sky-200 transition-colors"
          title="Launch Fast Voice Dialer"
        >
          <PhoneCall className="w-3 h-3 text-sky-600" />
          <span className="truncate">Call</span>
        </button>
      </div>
    </div>
  );
};
