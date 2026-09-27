import React, { useEffect, useState } from 'react';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOff,
  MessageSquare,
  Zap,
  X,
  Send,
  Mic,
  MicOff,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Clock
} from 'lucide-react';

export type DemoAlertType = 'call' | 'reply' | 'signal';

export interface DemoAlertData {
  type: DemoAlertType;
  contactName: string;
  role: string;
  company: string;
  phone?: string;
  email?: string;
  previewText?: string;
  badgeText?: string;
  score?: number;
  dataPayload?: any;
}

interface LiveDemoNotificationProps {
  alert: DemoAlertData | null;
  onDismiss: () => void;
  onAcceptCall: (data: any) => void;
  onAcceptReply: (data: any) => void;
  onAcceptSignal: (data: any) => void;
  isEmbedded?: boolean;
}

// Gentle Web Audio API synthesizer for realistic audio chime without external assets
export function playDemoChime(type: DemoAlertType | 'sent' | 'end') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'call') {
      // Incoming phone ring tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      osc.frequency.setValueAtTime(783.99, now + 0.24);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.start(now);
      osc.stop(now + 0.7);
    } else if (type === 'sent') {
      // Message sent swoosh chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else {
      // Inbound alert tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880.0, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch {
    // Non-blocking if audio blocked by browser policy
  }
}

export const LiveDemoNotification: React.FC<LiveDemoNotificationProps> = ({
  alert,
  onDismiss,
  onAcceptCall,
  onAcceptReply,
  onAcceptSignal,
  isEmbedded = false
}) => {
  // Call States: 'ringing' | 'connected' | 'ended'
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Reply States: 'reading' | 'sent'
  const [replyStatus, setReplyStatus] = useState<'reading' | 'sent'>('reading');
  const [replyText, setReplyText] = useState('');
  const [sentReplyContent, setSentReplyContent] = useState('');

  const [progress, setProgress] = useState(100);

  // Reset internal states whenever a new alert arrives
  useEffect(() => {
    if (!alert) return;
    setCallStatus('ringing');
    setCallDuration(0);
    setIsMuted(false);
    setReplyStatus('reading');
    setReplyText('');
    setSentReplyContent('');

    playDemoChime(alert.type);

    setProgress(100);
    // Don't auto-dismiss if user is on an active call
    const duration = alert.type === 'call' ? 22000 : 15000;
    const intervalTime = 100;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [alert, onDismiss]);

  // Call duration counter when call is attended on the notification
  useEffect(() => {
    let timer: any;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  if (!alert) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAttendCallOnNotification = () => {
    setCallStatus('connected');
    setProgress(100); // Freeze progress while on call
  };

  const handleEndCallOnNotification = () => {
    setCallStatus('ended');
    playDemoChime('end');
    setTimeout(() => {
      onDismiss();
    }, 2200);
  };

  const handleSendReplyOnNotification = (text: string) => {
    const finalMsg = text.trim() || "Thursday at 2 PM PT works great! Direct slot: cal.com/graph8/demo";
    setSentReplyContent(finalMsg);
    setReplyStatus('sent');
    playDemoChime('sent');
    setTimeout(() => {
      onDismiss();
    }, 2800);
  };

  return (
    <aside
      role="status"
      aria-live="polite"
      className={
        isEmbedded
          ? "relative z-40 w-full max-w-[414px] select-none animate-slide-up"
          : "fixed bottom-24 right-6 z-50 w-[410px] max-w-[calc(100vw-32px)] select-none animate-slide-up"
      }
    >
      <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-purple-500/50 via-cyan-400/50 to-pink-500/50 shadow-2xl backdrop-blur-2xl">
        <div className="relative rounded-[15px] bg-white/98 border border-slate-200/90 p-3.5 shadow-xl overflow-hidden">
          {/* Top Progress Countdown Bar (hidden during active call) */}
          {callStatus !== 'connected' && replyStatus !== 'sent' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
              <div
                className={`h-full transition-all duration-100 ${
                  alert.type === 'call'
                    ? 'bg-emerald-500'
                    : alert.type === 'reply'
                    ? 'bg-purple-600'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Header Row */}
          <div className="flex items-center justify-between mb-3 pt-0.5">
            <div className="flex items-center gap-2">
              {alert.type === 'call' && (
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                    callStatus === 'connected'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : callStatus === 'ended'
                      ? 'bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        callStatus === 'connected'
                          ? 'animate-ping bg-emerald-500'
                          : 'animate-ping bg-emerald-400'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        callStatus === 'ended' ? 'bg-slate-500' : 'bg-emerald-500'
                      }`}
                    />
                  </span>
                  <PhoneIncoming className="w-3 h-3 text-emerald-600" />
                  <span>
                    {callStatus === 'connected'
                      ? `Active Call • ${formatSeconds(callDuration)}`
                      : callStatus === 'ended'
                      ? 'Call Completed'
                      : 'Incoming Client Call'}
                  </span>
                </div>
              )}

              {alert.type === 'reply' && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10.5px] font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                  </span>
                  <MessageSquare className="w-3 h-3 text-purple-600" />
                  <span>
                    {replyStatus === 'sent' ? 'Reply Dispatched' : 'Priority Inbound Reply'}
                  </span>
                </div>
              )}

              {alert.type === 'signal' && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10.5px] font-bold">
                  <Zap className="w-3 h-3 text-amber-600 animate-pulse" />
                  <span>Buyer Intent Surge</span>
                </div>
              )}

              <span className="text-[10px] font-mono text-slate-400">Live Notification</span>
            </div>

            <button
              onClick={onDismiss}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Caller / Contact Identity */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0 ${
                alert.type === 'call'
                  ? callStatus === 'connected'
                    ? 'bg-emerald-600 ring-2 ring-emerald-400 animate-pulse'
                    : 'bg-emerald-600 ring-2 ring-emerald-300/60'
                  : alert.type === 'reply'
                  ? 'bg-purple-600'
                  : 'bg-amber-600'
              }`}
            >
              {alert.type === 'call' ? (
                <PhoneCall className="w-5 h-5" />
              ) : alert.type === 'reply' ? (
                <MessageSquare className="w-5 h-5" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-[13px] font-bold text-slate-900 truncate">
                  {alert.contactName}
                </h4>
                {alert.score && (
                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {alert.score}% Intent
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 font-medium truncate">
                {alert.role} • <span className="font-semibold text-slate-800">{alert.company}</span>
              </p>
              {alert.phone && (
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Direct Line: {alert.phone}
                </p>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* CALL STATE 1: RINGING (Allows Direct Attend on Notification)   */}
          {/* ============================================================== */}
          {alert.type === 'call' && callStatus === 'ringing' && (
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-600 bg-emerald-50/60 border border-emerald-100 p-2 rounded-xl flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Client is ringing your Graph8 workspace line right now.</span>
              </p>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                {/* ATTEND CALL DIRECTLY ON NOTIFICATION BUTTON */}
                <button
                  onClick={handleAttendCallOnNotification}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[11.5px] font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  title="Answer and speak directly from this notification"
                >
                  <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
                  <span>Attend Call Here</span>
                </button>

                {/* Open in full Sidekick */}
                <button
                  onClick={() => onAcceptCall(alert.dataPayload)}
                  className="px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold border border-purple-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Open in full Sidekick Dialer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Full Dialer</span>
                </button>

                <button
                  onClick={onDismiss}
                  className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-[11px] font-semibold transition-colors cursor-pointer"
                  title="Decline Call"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* CALL STATE 2: ATTENDED & CONNECTED DIRECTLY ON NOTIFICATION     */}
          {/* ============================================================== */}
          {alert.type === 'call' && callStatus === 'connected' && (
            <div className="space-y-3 pt-1 border-t border-slate-100 animate-fade-in">
              {/* Active Audio Waveform & Status */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 text-white">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-emerald-300 rounded-full animate-bounce" />
                    <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-emerald-300 rounded-full animate-bounce" />
                  </div>
                  <span className="text-[11px] font-mono text-emerald-300 font-semibold">
                    {isMuted ? 'Muted' : 'Speaking (HD Voice)'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{formatSeconds(callDuration)}</span>
                </div>
              </div>

              {/* Live Caller Transcript snippet */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 italic">
                "{alert.contactName}: 'Hi, thanks for picking up! We are evaluating Graph8 for 40 SDR seats and want to confirm edge sync latency...'"
              </div>

              {/* In-Call Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted((prev) => !prev)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
                    isMuted
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button
                  onClick={() => onAcceptCall(alert.dataPayload)}
                  className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold border border-purple-200"
                  title="Expand to Full Sidekick window"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Expand</span>
                </button>

                {/* END CALL BUTTON */}
                <button
                  onClick={handleEndCallOnNotification}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer active:scale-95"
                  title="Hang up call"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span>End Call</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* CALL STATE 3: COMPLETED                                        */}
          {/* ============================================================== */}
          {alert.type === 'call' && callStatus === 'ended' && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11.5px] font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Call completed ({formatSeconds(callDuration)}). AI note saved to Graph8 CRM.</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* REPLY NOTIFICATION: INLINE QUICK REPLY ON NOTIFICATION        */}
          {/* ============================================================== */}
          {alert.type === 'reply' && replyStatus === 'reading' && (
            <div className="space-y-2.5">
              {/* Message Preview */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-relaxed font-sans italic">
                "{alert.previewText || 'Can we jump on a 20-min demo this Thursday afternoon?'}"
              </div>

              {/* 1-Click AI Quick Reply Chips */}
              <div className="space-y-1">
                <span className="text-[9.5px] font-bold text-slate-500 uppercase font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  1-Click AI Responses:
                </span>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() =>
                      handleSendReplyOnNotification(
                        'Thursday at 2 PM PT works great! Direct slot: cal.com/graph8/demo'
                      )
                    }
                    className="text-left text-[10.5px] font-medium px-2.5 py-1.5 rounded-lg bg-purple-50/80 hover:bg-purple-100 text-purple-800 border border-purple-200/80 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span>⚡ "Thursday 2 PM works! Here is cal.com/slot"</span>
                    <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button
                    onClick={() =>
                      handleSendReplyOnNotification(
                        'Confirmed! Attaching our Kafka latency recovery benchmarks document.'
                      )
                    }
                    className="text-left text-[10.5px] font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span>📄 "Confirmed! Sending Kafka latency docs"</span>
                    <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>

              {/* Inline Custom Reply Input */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && replyText.trim()) {
                      handleSendReplyOnNotification(replyText);
                    }
                  }}
                  placeholder="Type quick reply here..."
                  className="flex-1 text-[11px] px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-200 outline-none font-sans"
                />

                <button
                  onClick={() => handleSendReplyOnNotification(replyText)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
                  title="Send reply immediately via Graph8"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>

                <button
                  onClick={() => onAcceptReply(alert.dataPayload)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                  title="Open full conversation in Sidekick"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* REPLY SENT SUCCESS CONFIRMATION                                 */}
          {/* ============================================================== */}
          {alert.type === 'reply' && replyStatus === 'sent' && (
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1 animate-fade-in">
              <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-purple-700">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>Reply Sent to {alert.contactName} via Graph8!</span>
              </div>
              <p className="text-[10.5px] text-purple-800 italic pl-5">
                "{sentReplyContent}"
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/* INTENT SIGNAL NOTIFICATION                                      */}
          {/* ============================================================== */}
          {alert.type === 'signal' && (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 leading-relaxed font-sans italic">
                "{alert.previewText}"
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => onAcceptSignal(alert.dataPayload)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 active:scale-95 text-white text-[11.5px] font-bold shadow-md transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View Prospect & Action</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onDismiss}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
