import React, { useState } from 'react';
import { 
  Building2, Mail, Layers, Zap, Clock, 
  Sparkles, Check, PhoneCall, Calendar, Copy, Send
} from 'lucide-react';

interface ProspectDrawerProps {
  data: any;
  onCall: () => void;
  onBook: () => void;
  onAddToSequence?: (data: any) => void;
}

export const ProspectDrawer: React.FC<ProspectDrawerProps> = ({
  data,
  onCall,
  onBook,
  onAddToSequence
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (data?.email) {
      navigator.clipboard.writeText(data.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const score = data?.signalBadge?.score ?? (typeof data?.graph8Confidence === 'number' && data.graph8Confidence >= 60 ? data.graph8Confidence : 92);
  const techStack = data?.details?.techStack || ['Graph8 B2B Suite', 'REST API', 'CRM Integration'];
  const timelineEvents = data?.details?.timelineEvents || [
    {
      time: data?.timestamp || 'Just now',
      title: data?.signalType || 'Active Intent Signal',
      description: data?.signalDescription || data?.intentReason || 'Verified intent event captured across edge network telemetry.',
      source: data?.source || 'Graph8 Telemetry'
    }
  ];
  const talkingPoints = data?.details?.talkingPoints || [
    data?.recommendedAction || 'Review recent telemetry touchpoints and qualification criteria',
    `Schedule direct call with ${data?.contactName || 'lead'} regarding pipeline expansion`,
    `Share enterprise pricing and deployment SLA`
  ];

  const initials = data?.avatar || (data?.contactName
    ? data.contactName
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'DM');

  return (
    <div className="space-y-3.5 text-slate-800">
      {/* Contact Profile Header */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-[12px] shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #00d2ff 0%, #9b51e0 50%, #ff2a85 100%)'
              }}
            >
              {initials}
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                {data?.contactName}
              </h4>
              <p className="text-[11px] text-slate-500">
                {data?.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
            <Zap className="w-3 h-3 text-emerald-600" />
            <span>{score}% Intent</span>
          </div>
        </div>

        {/* Company & contact info pills */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Building2 className="w-3 h-3 text-slate-400" />
            <span className="truncate font-medium">{data?.company}</span>
          </div>
          <button 
            onClick={handleCopyEmail}
            className="flex items-center justify-between text-slate-600 hover:text-purple-700 transition-colors group"
            title="Click to copy email"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Mail className="w-3 h-3 text-slate-400" />
              <span className="truncate">{data?.email || 'email@company.com'}</span>
            </div>
            {copied ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>
      </div>

      {/* Tech Stack Signals */}
      <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Detected Tech Stack & Profile</span>
          </div>
          <span className="text-[10px] text-slate-500">
            {data?.details?.companySize || data?.location || 'Verified Account'}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {techStack.map((tech: string) => (
            <span 
              key={tech} 
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Real-time Radar Timeline */}
      <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Intent Activity Stream</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">Live</span>
        </div>

        <div className="space-y-2.5">
          {timelineEvents.map((evt: any, idx: number) => (
            <div key={idx} className="relative pl-3 border-l-2 border-emerald-400 text-[11px]">
              <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                <span className="font-semibold text-slate-800">{evt.title}</span>
                <span className="font-mono">{evt.time}</span>
              </div>
              <p className="text-slate-600 text-[10.5px] leading-relaxed">
                {evt.description}
              </p>
              <span className="text-[9px] font-mono text-slate-400 mt-0.5 inline-block">
                Via {evt.source}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Talking Points */}
      <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-900 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Recommended Talking Points</span>
        </div>
        <ul className="space-y-1.5 text-[10.5px] text-purple-900/90 list-disc list-inside leading-snug">
          {talkingPoints.map((point: string, idx: number) => (
            <li key={idx} className="marker:text-purple-500">
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Launch Buttons */}
      <div className="flex items-center gap-2 pt-1">
        {onAddToSequence && (
          <button
            onClick={() => onAddToSequence(data)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold border border-purple-200 transition-all"
            title="Enroll into Graph8 Outreach Sequence"
          >
            <Send className="w-3.5 h-3.5 text-purple-600" />
            <span>+ Sequence</span>
          </button>
        )}

        <button
          onClick={onCall}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-semibold shadow-sm transition-all"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Launch Dialer</span>
        </button>

        <button
          onClick={onBook}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold shadow-sm transition-all"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Booking Link</span>
        </button>
      </div>
    </div>
  );
};

