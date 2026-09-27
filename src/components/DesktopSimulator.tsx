import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Zap,
  Users,
  ShieldCheck,
  Building2,
  Clock,
  PhoneIncoming,
  MessageSquare,
  Radio
} from 'lucide-react';
import { Graph8Logo } from './Graph8Logo';

interface DesktopSimulatorProps {
  onBackdropClick?: () => void;
  onSimulateCall?: () => void;
  onSimulateReply?: () => void;
  onSimulateSignal?: () => void;
}

export const DesktopSimulator: React.FC<DesktopSimulatorProps> = ({
  onBackdropClick,
  onSimulateCall,
  onSimulateReply,
  onSimulateSignal
}) => {
  const handleTrigger = (_type: 'call' | 'reply' | 'signal', callback?: () => void) => {
    if (callback) callback();
  };

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden select-none bg-slate-50 flex flex-col"
      onClick={onBackdropClick}
    >
      {/* Ambient Gradient Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-purple-200/30 via-indigo-100/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tl from-cyan-200/25 via-pink-100/20 to-transparent blur-3xl" />
        <div className="absolute top-[30%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-sky-100/30 via-purple-100/20 to-transparent blur-3xl" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Top Enterprise Application Header / Nav Bar */}
      <header
        className="relative z-10 h-14 px-6 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between shadow-2xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brand & Workspace Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Graph8Logo size={28} glow />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-slate-900 tracking-tight">
                  Graph8 <span className="font-semibold text-purple-700">Enterprise</span>
                </span>
                <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 font-bold uppercase">
                  Production Org
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Revenue Operations & Real-time Signal Engine
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200 text-[11px] text-slate-600 font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Edge Radar: <span className="font-bold text-slate-800">Connected (12ms)</span></span>
          </div>
        </div>

        {/* Center / Controls: Desktop Companion Active Link */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200/80 text-[11px] font-semibold">
            <Radio className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span>Desktop Companion Link: <span className="font-bold text-purple-950">Active</span></span>
            <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-purple-200/60 text-purple-800 font-bold">Ctrl+K</span>
          </div>
        </div>

        {/* Demo Lab: Interactive Simulation Action Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase px-2 font-mono flex items-center gap-1">
            <Radio className="w-3 h-3 text-purple-600 animate-pulse" />
            <span className="hidden xl:inline">Remote Triggers:</span>
          </span>

          <button
            onClick={() => handleTrigger('call', onSimulateCall)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold transition-all shadow-2xs active:scale-95 group cursor-pointer"
            title="Simulate incoming client call popup in the floating desktop app"
          >
            <PhoneIncoming className="w-3 h-3 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>Incoming Call</span>
          </button>

          <button
            onClick={() => handleTrigger('reply', onSimulateReply)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-purple-50 text-purple-700 hover:text-purple-800 border border-purple-200/80 text-[11px] font-semibold transition-all shadow-2xs active:scale-95 group cursor-pointer"
            title="Simulate high-priority inbound buyer reply in the floating desktop app"
          >
            <MessageSquare className="w-3 h-3 text-purple-600 group-hover:scale-110 transition-transform" />
            <span>Urgent Reply</span>
          </button>

          <button
            onClick={() => handleTrigger('signal', onSimulateSignal)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 text-amber-800 hover:text-amber-900 border border-amber-200/80 text-[11px] font-semibold transition-all shadow-2xs active:scale-95 group cursor-pointer"
            title="Simulate live high-intent buyer spike in the floating desktop app"
          >
            <Zap className="w-3 h-3 text-amber-600 group-hover:scale-110 transition-transform" />
            <span>Intent Spike</span>
          </button>
        </div>

        {/* Right Info Widgets */}
        <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-700 font-semibold">SOC2 Certified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 font-medium">US-East (Active)</span>
          </div>
        </div>
      </header>

      {/* Main Professional Workspace Canvas */}
      <main 
        onClick={onBackdropClick}
        className="relative flex-1 p-6 md:p-8 overflow-y-auto pointer-events-auto"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Presentation Command Center Remote Control Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl border border-purple-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-3.5 z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm md:text-base font-black text-white tracking-tight">
                    Live Demo Remote (Localhost ➔ Floating Companion)
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold uppercase tracking-wider">
                    ● Live Link Active
                  </span>
                </div>
                <p className="text-xs text-purple-200/80 mt-1 max-w-2xl leading-relaxed">
                  Click any button on this web dashboard to instantly pop up notifications, audio rings, and AI actions directly inside your <strong>Floating Graph8 Sidekick</strong> desktop companion!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap z-10 w-full lg:w-auto">
              <button
                onClick={() => handleTrigger('call', onSimulateCall)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                title="Send incoming voice call notification to floating desktop app"
              >
                <PhoneIncoming className="w-4 h-4" />
                <span>Simulate Call</span>
              </button>

              <button
                onClick={() => handleTrigger('reply', onSimulateReply)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                title="Send high-priority buyer reply notification to floating desktop app"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Simulate Reply</span>
              </button>

              <button
                onClick={() => handleTrigger('signal', onSimulateSignal)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                title="Send intent surge spike notification to floating desktop app"
              >
                <Zap className="w-4 h-4" />
                <span>Simulate Surge</span>
              </button>
            </div>
          </div>

          {/* Executive KPI Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1 */}
            <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-card-light hover:shadow-card-hover transition-all backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-500 text-[11px] mb-2 font-medium">
                <span>Active Pipeline Value</span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-mono text-[10px]">
                  <TrendingUp className="w-3 h-3" />
                  +18.4%
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">$3,840,000</div>
              <p className="text-[11px] text-slate-500 mt-1">42 high-intent accounts in negotiation</p>
            </div>

            {/* KPI 2 */}
            <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-card-light hover:shadow-card-hover transition-all backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-500 text-[11px] mb-2 font-medium">
                <span>Live Buyer Intent Signals</span>
                <span className="flex items-center gap-1 text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 font-mono text-[10px]">
                  <Zap className="w-3 h-3 text-purple-600" />
                  Live Feed
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">18 Real-Time Signals</div>
              <p className="text-[11px] text-slate-500 mt-1">Surfaced via Graph8 Edge Radar</p>
            </div>

            {/* KPI 3 */}
            <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-card-light hover:shadow-card-hover transition-all backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-500 text-[11px] mb-2 font-medium">
                <span>Actionable Replies</span>
                <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-mono text-[10px]">
                  Priority Triage
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">6 Inbound Replies</div>
              <p className="text-[11px] text-slate-500 mt-1">Requiring human SDR & AE decisions</p>
            </div>

            {/* KPI 4 */}
            <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-card-light hover:shadow-card-hover transition-all backdrop-blur-md">
              <div className="flex items-center justify-between text-slate-500 text-[11px] mb-2 font-medium">
                <span>Deliverability Health</span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-mono text-[10px]">
                  Optimal
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">99.4% Inbox Rate</div>
              <p className="text-[11px] text-slate-500 mt-1">Multi-mailbox auto-warmup active</p>
            </div>
          </div>

          {/* Business Intelligence Panels: Account Activity & Sequence Orchestration */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Activity Radar Table */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-card-light backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-slate-900">
                      Real-Time Account Telemetry & Surge Streams
                    </h3>
                    <p className="text-[10.5px] text-slate-500">
                      Edge visitor touches, pricing calculator hits, and SDK doc reviews
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Streaming
                </span>
              </div>

              {/* Account Telemetry Rows */}
              <div className="divide-y divide-slate-100 text-[11px]">
                {[
                  {
                    name: 'Granite Systems',
                    industry: 'B2B Software & Cloud Infra',
                    contact: 'Barry Peraino',
                    role: 'Founder & VP Sales',
                    score: 95,
                    stage: 'Pricing Evaluation',
                    time: 'Just now'
                  },
                  {
                    name: 'Lion Interactive',
                    industry: 'Digital Performance & Media',
                    contact: 'David Miller',
                    role: 'VP Sales Operations',
                    score: 92,
                    stage: 'Architecture Sync',
                    time: '4m ago'
                  },
                  {
                    name: 'Datadog Partner Network',
                    industry: 'Observability & Monitoring',
                    contact: 'Elena Rostova',
                    role: 'Head of Infrastructure',
                    score: 89,
                    stage: 'API Webhook Docs',
                    time: '12m ago'
                  },
                  {
                    name: 'Sharp Dogs Seattle',
                    industry: 'Commercial Franchise',
                    contact: 'Julie Sharp',
                    role: 'Owner & Operator',
                    score: 84,
                    stage: 'Proposal Review',
                    time: '28m ago'
                  }
                ].map((acc) => (
                  <div key={acc.name} className="py-2.5 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[11px] border border-slate-200">
                        <Building2 className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{acc.name}</span>
                          <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                            {acc.stage}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {acc.contact} ({acc.role}) • {acc.industry}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {acc.score}% Intent
                      </span>
                      <span className="text-[10px] text-slate-400">{acc.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outreach Sequences & Deliverability Pipeline */}
            <div className="p-5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-card-light backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                    <Users className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-slate-900">
                      Active Sequences
                    </h3>
                    <p className="text-[10.5px] text-slate-500">
                      Multi-channel delivery progress
                    </p>
                  </div>
                </div>

                <span className="text-[10.5px] font-mono font-bold text-purple-700">
                  1 Active
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-[11.5px]">High Intent Executive Outreach</span>
                    <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      Healthy
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full" style={{ width: '68%' }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>250 Enrolled Contacts</span>
                    <span className="font-bold text-slate-700">68% Open Rate</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200/70 text-[11px] text-purple-950 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-purple-900">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Sidekick Intelligence Layer</span>
                  </div>
                  <p className="text-[10.5px] text-purple-900/90 leading-relaxed">
                    Graph8 Sidekick floats as an always-accessible companion window over your desktop. Manage outreach, examine high-intent signals, and trigger outbound actions instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Desktop Status Footer Bar */}
      <footer
        className="h-8 px-6 bg-white/80 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-between text-[10.5px] font-mono text-slate-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">Graph8 API Engine Online</span>
          </span>
          <span className="text-slate-300">•</span>
          <span>Latency: 14ms</span>
          <span className="text-slate-300">•</span>
          <span>HTTPS TLS 1.3</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Sidekick Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800 font-bold">Ctrl+K</kbd></span>
        </div>
      </footer>
    </div>
  );
};
