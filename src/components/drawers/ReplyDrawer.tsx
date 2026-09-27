import React, { useState } from 'react';
import { Sparkles, Send, Check, Bot } from 'lucide-react';

interface ReplyDrawerProps {
  data: any;
}

export const ReplyDrawer: React.FC<ReplyDrawerProps> = ({ data }) => {
  const defaultReplies = [
    {
      id: 'd1',
      title: 'Quick Response',
      subject: 'Re: Inquiry',
      body: `Hi ${data?.contactName || 'there'},\n\nThank you for reaching out. Would you have 15 minutes this week for a brief technical walkthrough?\n\nBest,\nGraph8 Team`,
      tone: 'Confident & Direct'
    }
  ];

  const suggestedReplies = data?.suggestedReplies?.length ? data.suggestedReplies : defaultReplies;
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [replyBody, setReplyBody] = useState(suggestedReplies[0]?.body || '');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  React.useEffect(() => {
    const list = data?.suggestedReplies?.length ? data.suggestedReplies : defaultReplies;
    setSelectedTemplateIndex(0);
    setReplyBody(list[0]?.body || '');
  }, [data]);

  const handleSelectTemplate = (idx: number) => {
    setSelectedTemplateIndex(idx);
    setReplyBody(suggestedReplies[idx]?.body || '');
  };

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-3 text-slate-800">
      {/* Contact & AI Classification Header */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
              {data.contactName}
            </h4>
            <p className="text-[10.5px] text-slate-500">
              {data.role} • {data.company}
            </p>
          </div>

          <div className="flex items-center gap-1 text-[9.5px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 font-semibold">
            <Bot className="w-3 h-3 text-purple-600" />
            <span>{data?.aiClassification?.label || 'Inbound Reply'}</span>
          </div>
        </div>

        {/* Inbound Email Thread */}
        <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
          <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-500 mb-1 border-b border-slate-200/80 pb-1">
            <span>Inbound ({data?.receivedTime || 'Recently'})</span>
            <span className="text-emerald-700 font-semibold">High Urgency</span>
          </div>
          <p className="whitespace-pre-line font-sans text-slate-800 text-[10.5px] leading-relaxed">
            {data?.fullMessage || data?.previewMessage || 'Inbound message received.'}
          </p>
        </div>
      </div>

      {/* AI Smart Draft Options */}
      <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-900">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Suggested Responses</span>
          </div>
          <span className="text-[9.5px] font-mono text-purple-700 font-medium">Graph8 LLM Engine</span>
        </div>

        <div className="flex gap-1.5">
          {suggestedReplies.map((reply: any, idx: number) => (
            <button
              key={reply.id || idx}
              onClick={() => handleSelectTemplate(idx)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-left text-[10.5px] font-medium transition-all border ${
                selectedTemplateIndex === idx
                  ? 'bg-white border-purple-400 text-purple-900 shadow-sm'
                  : 'bg-white/60 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <div className="truncate font-semibold">{reply.title}</div>
              <div className="text-[9px] text-purple-600 font-medium">{reply.tone}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Response Composer */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-1.5 text-[10.5px] text-slate-500">
          <span>To: <span className="text-slate-800 font-medium">{data.email}</span></span>
          <span className="font-mono text-[9.5px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">SOC2 Attached</span>
        </div>

        <textarea
          rows={7}
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-400 focus:bg-white resize-none font-sans leading-relaxed"
          placeholder="Compose reply..."
        />

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Outreach sequence pauses automatically</span>
          </div>

          <button
            onClick={handleSend}
            disabled={isSending || isSent}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-[11px] font-semibold shadow-sm transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #00d2ff 0%, #9b51e0 50%, #ff2a85 100%)'
            }}
          >
            {isSent ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Sent & Logged!</span>
              </>
            ) : isSending ? (
              <span>Sending...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Reply</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
