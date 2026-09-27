import React, { useState } from 'react';
import { PhoneCall, Mail, Zap, Sparkles, Clock, ExternalLink, ShieldCheck, Monitor } from 'lucide-react';

interface DemoLabDrawerProps {
  onSimulateCall: () => void;
  onSimulateReply: () => void;
  onSimulateSignal: () => void;
  onDelayedSimulateCall: (seconds: number) => void;
  onDelayedSimulateReply: (seconds: number) => void;
  onDelayedSimulateSignal: (seconds: number) => void;
  onClose: () => void;
}

export const DemoLabDrawer: React.FC<DemoLabDrawerProps> = ({
  onSimulateCall,
  onSimulateReply,
  onSimulateSignal,
  onDelayedSimulateCall,
  onDelayedSimulateReply,
  onDelayedSimulateSignal,
  onClose
}) => {
  const [activeTimer, setActiveTimer] = useState<string | null>(null);

  const handleDelayed = (type: 'call' | 'reply' | 'signal', seconds: number) => {
    setActiveTimer(`${type}-${seconds}`);
    if (type === 'call') onDelayedSimulateCall(seconds);
    if (type === 'reply') onDelayedSimulateReply(seconds);
    if (type === 'signal') onDelayedSimulateSignal(seconds);

    setTimeout(() => {
      setActiveTimer(null);
      onClose();
    }, 800);
  };

  return (
    <div className="space-y-4 text-slate-800 pb-2">
      {/* Intro presentation banner */}
      <div 
        className="p-3.5 rounded-xl border border-purple-200/90 shadow-2xs relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.9) 0%, rgba(245, 243, 255, 0.95) 50%, rgba(253, 242, 248, 0.9) 100%)'
        }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1 rounded-lg bg-purple-600 text-white shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[12px] font-bold text-purple-950">
            Live Presentation & Pitching Lab
          </span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Use these triggers during your demo to showcase how Graph8 Sidekick proactively alerts you to hot buyer calls, high-priority replies, and intent spikes directly on your desktop.
        </p>
      </div>

      {/* 1. Simulate Incoming Phone Call */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-purple-300 transition-all space-y-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-2xs">
              <PhoneCall className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-[12.5px] font-bold text-slate-900 leading-none">
                  Incoming Voice Call
                </h4>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  95% Intent
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Barry Peraino (Founder & VP Sales, Granite Systems)
              </p>
            </div>
          </div>
        </div>

        <p className="text-[10.5px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-snug">
          Demonstrates in-notification call attendance, real-time waveform voice equalizer, live transcript sync, and automatic CRM call disposition.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              onSimulateCall();
              onClose();
            }}
            className="flex-1 py-1.5 px-3 rounded-lg text-white font-semibold text-[11px] shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            }}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Trigger Call Now</span>
          </button>

          <button
            onClick={() => handleDelayed('call', 5)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-800 font-semibold text-[10.5px] transition-all flex items-center gap-1 shadow-2xs"
            title="Triggers call after 5 seconds so you can minimize to desktop"
          >
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{activeTimer === 'call-5' ? 'Set! (5s)' : 'In 5s'}</span>
          </button>
        </div>
      </div>

      {/* 2. Simulate High-Priority Buyer Reply */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-purple-300 transition-all space-y-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shadow-2xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-[12.5px] font-bold text-slate-900 leading-none">
                  High-Priority Reply
                </h4>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Wants Demo
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Marcus Brody (VP Infrastructure, Cortex Data)
              </p>
            </div>
          </div>
        </div>

        <p className="text-[10.5px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-snug">
          "Saw the architecture doc. Can you jump on a 20-min demo this Thursday afternoon?" Shows AI 1-click reply drafting & meeting booking.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              onSimulateReply();
              onClose();
            }}
            className="flex-1 py-1.5 px-3 rounded-lg text-white font-semibold text-[11px] shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
            }}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Trigger Reply Now</span>
          </button>

          <button
            onClick={() => handleDelayed('reply', 5)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 text-slate-700 hover:text-purple-800 font-semibold text-[10.5px] transition-all flex items-center gap-1 shadow-2xs"
            title="Triggers reply after 5 seconds so you can minimize to desktop"
          >
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{activeTimer === 'reply-5' ? 'Set! (5s)' : 'In 5s'}</span>
          </button>
        </div>
      </div>

      {/* 3. Simulate Intent Surge Signal */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-purple-300 transition-all space-y-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shadow-2xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-[12.5px] font-bold text-slate-900 leading-none">
                  Live Intent Surge
                </h4>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  Radar Surge
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Elena Rostova (Head of Infrastructure, Datadog Network)
              </p>
            </div>
          </div>
        </div>

        <p className="text-[10.5px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-snug">
          Pricing calculator & API webhooks reviewed 3 times in 10 minutes. Demonstrates instant account research and 1-click sequence enrollment.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              onSimulateSignal();
              onClose();
            }}
            className="flex-1 py-1.5 px-3 rounded-lg text-white font-semibold text-[11px] shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Trigger Signal Now</span>
          </button>

          <button
            onClick={() => handleDelayed('signal', 5)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-200 hover:border-sky-300 bg-slate-50 hover:bg-sky-50/50 text-slate-700 hover:text-sky-800 font-semibold text-[10.5px] transition-all flex items-center gap-1 shadow-2xs"
            title="Triggers intent signal after 5 seconds so you can minimize to desktop"
          >
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{activeTimer === 'signal-5' ? 'Set! (5s)' : 'In 5s'}</span>
          </button>
        </div>
      </div>

      {/* Full Browser Simulator Dashboard Launcher */}
      <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200/80 text-[11px] space-y-2">
        <div className="flex items-center justify-between font-bold text-purple-950">
          <span className="flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-purple-600" />
            Full Screen Web Simulator
          </span>
          <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
            Port 5175
          </span>
        </div>
        <p className="text-[10.5px] text-slate-600 leading-snug">
          Want to present the full CRM workspace canvas in Chrome/browser alongside the floating companion?
        </p>
        <button
          onClick={() => {
            if ((window as any).electronAPI?.openExternal) {
              (window as any).electronAPI.openExternal('http://127.0.0.1:5175/');
            } else {
              window.open('http://127.0.0.1:5175/', '_blank');
            }
          }}
          className="w-full py-2 px-3 rounded-lg bg-white border border-purple-300 hover:bg-purple-100 text-purple-850 font-bold text-[11px] flex items-center justify-center gap-2 shadow-2xs transition-all hover:shadow-xs active:scale-98 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
          <span>Launch Web Simulator in Browser</span>
        </button>
      </div>

      {/* External Graph8 Links */}
      <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 text-[11px] text-slate-600 space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Graph8 Connected Resources
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href="http://127.0.0.1:5178/api/graph8/status"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-[10px] font-semibold flex items-center justify-between transition-colors shadow-2xs"
          >
            <span>API Status JSON</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href="http://127.0.0.1:5178/api/graph8/intent-signals"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-[10px] font-semibold flex items-center justify-between transition-colors shadow-2xs"
          >
            <span>Live Signals Feed</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
