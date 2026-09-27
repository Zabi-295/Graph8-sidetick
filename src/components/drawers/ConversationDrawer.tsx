import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Phone,
  Send,
  User,
  Mail,
  Check,
  Copy
} from 'lucide-react';
import type { Graph8ImportantReply } from '../../types';

interface ConversationDrawerProps {
  reply: Graph8ImportantReply | any;
  onReply: (reply: any) => void;
  onCall: (contact: any) => void;
  onAddToSequence: (contact: any) => void;
  onViewProspect: (contact: any) => void;
}

export const ConversationDrawer: React.FC<ConversationDrawerProps> = ({
  reply,
  onReply,
  onCall,
  onAddToSequence,
  onViewProspect
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyThread = () => {
    const text = `From: ${reply.contactName} (${reply.email || 'N/A'})\nCompany: ${reply.company}\nDate: ${reply.receivedTime}\nChannel: ${reply.channel}\nClassification: ${reply.classification}\n\nMessage:\n${reply.fullMessage || reply.preview}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 2:
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-3.5 text-slate-800 select-none">
      {/* Contact Profile & Metadata Header */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[13px] shadow-sm flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #00d2ff 0%, #9b51e0 50%, #ff2a85 100%)'
              }}
            >
              {reply.contactName
                ? reply.contactName
                    .split(' ')
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'DM'}
            </div>
            <div>
              <h4 className="text-[13.5px] font-bold text-slate-900 flex items-center gap-1.5">
                <span>{reply.contactName}</span>
                <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                  {reply.channel || 'Email'}
                </span>
              </h4>
              <p className="text-[11px] text-slate-500">
                {reply.role} • <span className="text-slate-700 font-medium">{reply.company}</span>
              </p>
            </div>
          </div>

          <div
            className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full border font-bold ${getTierColor(
              reply.priorityTier || 1
            )}`}
          >
            {reply.classification}
          </div>
        </div>

        {/* Communication identifiers */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10.5px]">
          <div className="flex items-center gap-1.5 text-slate-600 truncate">
            <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate">{reply.email || 'direct@company.com'}</span>
          </div>
          {reply.phone && (
            <div className="flex items-center gap-1.5 text-slate-600 font-mono truncate">
              <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="truncate">{reply.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Next Move Banner */}
      <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 shadow-2xs">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-900">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Suggested Next Action</span>
          </div>
          <span className="text-[9.5px] font-mono text-purple-700 font-semibold">
            {reply.classificationSource || 'Graph8 AI'}
          </span>
        </div>
        <p className="text-[11px] text-purple-950 font-medium leading-relaxed">
          {reply.suggestedNextAction || 'Review incoming inquiry and dispatch priority follow-up.'}
        </p>
      </div>

      {/* Main Conversation Thread */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Conversation Thread</span>
          </div>
          <button
            onClick={handleCopyThread}
            className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-purple-700 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy Thread'}</span>
          </button>
        </div>

        {/* Message Bubble: Previous Outbound Touchpoint */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[9.5px] text-slate-400 font-mono px-1">
            <span>You (Outbound Outreach)</span>
            <span>1d ago</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 text-[10.5px] leading-relaxed">
            Hi {reply.firstName || reply.contactName?.split(' ')[0] || 'there'}, noticed your team evaluating scalable infrastructure and API pipelines. Would you have 15 minutes this week to compare multi-channel telemetry options?
          </div>
        </div>

        {/* Message Bubble: Current Inbound Reply */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[9.5px] text-purple-700 font-mono px-1 font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{reply.contactName} (Inbound)</span>
            </span>
            <span>{reply.receivedTime || 'Recently'}</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200/80 text-slate-900 text-[11px] leading-relaxed whitespace-pre-line font-sans">
            {reply.fullMessage || reply.preview}
          </div>
        </div>
      </div>

      {/* Primary Action Buttons Bar */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
        <span className="text-[10.5px] font-bold text-slate-800 block">
          Execute Graph8 Action
        </span>

        <div className="grid grid-cols-2 gap-2">
          {/* Action 1: Reply */}
          <button
            onClick={() => onReply(reply)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-white text-[11px] font-semibold shadow-sm hover:opacity-95 transition-all"
            style={{
              background: 'linear-gradient(135deg, #00d2ff 0%, #9b51e0 50%, #ff2a85 100%)'
            }}
          >
            <Send className="w-3.5 h-3.5" />
            <span>AI Reply</span>
          </button>

          {/* Action 2: Call */}
          <button
            onClick={() => onCall(reply)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-[11px] font-semibold transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Fast Call</span>
          </button>

          {/* Action 3: Add to Sequence */}
          <button
            onClick={() => onAddToSequence(reply)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Sequence</span>
          </button>

          {/* Action 4: View Prospect */}
          <button
            onClick={() => onViewProspect(reply)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] font-semibold transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>Prospect Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
