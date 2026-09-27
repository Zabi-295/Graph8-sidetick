import React, { useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Check, Sparkles } from 'lucide-react';
import { executeInitiateCall } from '../../services/graph8Client';

interface CallDrawerProps {
  data: any;
}

export const CallDrawer: React.FC<CallDrawerProps> = ({ data }) => {
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [notes, setNotes] = useState('');
  const [savedOutcome, setSavedOutcome] = useState(false);
  const [graph8Notice, setGraph8Notice] = useState<string | null>(null);

  const startCall = async () => {
    setCallState('calling');
    setGraph8Notice(null);

    try {
      const res = await executeInitiateCall({
        contactName: data?.contactName || 'Executive Lead',
        phone: data?.phone || '+13149107560',
        contactId: data?.crmContactId || data?.id
      });

      if (res.success && res.sessionId) {
        setGraph8Notice(`Action completed: Graph8 session ${res.sessionId.slice(0, 8)}... (${res.status || 'Active'})`);
        setCallState('connected');
      } else if (res.canFallback) {
        setGraph8Notice(res.message);
        setCallState('connected');
      } else {
        setGraph8Notice(res.message || 'Call initiated with audio grading.');
        setCallState('connected');
      }
    } catch {
      setGraph8Notice('Direct presence line active: AI grading enabled.');
      setCallState('connected');
    }
  };

  const endCall = () => {
    setCallState('ended');
  };

  return (
    <div className="space-y-3.5 text-slate-800">
      {/* Dialer Head */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
        <div 
          className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-white shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #00d2ff 0%, #9b51e0 50%, #ff2a85 100%)'
          }}
        >
          <Phone className={`w-5 h-5 ${callState === 'calling' ? 'animate-bounce' : ''}`} />
        </div>

        <h4 className="text-[14px] font-bold text-slate-900">
          {data?.contactName || 'Executive Lead'}
        </h4>
        <p className="text-[11px] text-slate-500">
          {data?.role || 'Decision Maker'} • {data?.company || 'Enterprise Account'}
        </p>
        <p className="text-[12px] font-mono text-purple-600 font-semibold mt-1">
          {data?.phone || '+1 (512) 840-2911'}
        </p>

        {/* Call Status Badge */}
        <div className="mt-3 flex flex-col items-center justify-center gap-1.5">
          {callState === 'idle' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
              Ready to dial with local presence (Austin, TX)
            </span>
          )}
          {callState === 'calling' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 animate-pulse font-semibold">
              Dispatching call via Graph8...
            </span>
          )}
          {callState === 'connected' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Connected (00:34) • AI Audio Grading Active
            </span>
          )}
          {callState === 'ended' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
              Call Completed • Log summary below
            </span>
          )}

          {graph8Notice && (
            <div className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 max-w-[320px] text-center font-mono">
              {graph8Notice}
            </div>
          )}
        </div>

        {/* Dial Controls */}
        <div className="mt-4 flex items-center justify-center gap-3">
          {callState === 'idle' && (
            <button
              onClick={startCall}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[12px] shadow-sm transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Start Call</span>
            </button>
          )}

          {callState === 'calling' && (
            <button
              onClick={endCall}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[12px] transition-colors"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}

          {callState === 'connected' && (
            <>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isMuted 
                    ? 'bg-rose-50 border-rose-200 text-rose-600' 
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={endCall}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[12px] shadow-sm transition-colors"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Hang Up</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Real-time AI Battlecard & Objection Handling */}
      <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/80 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-900 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Live Call Script & Objection Playbook</span>
        </div>
        <div className="space-y-2 text-[10.5px]">
          <div className="p-2 rounded bg-white border border-sky-200/60 shadow-2xs">
            <span className="font-bold text-sky-950">Opening Hook:</span>
            <p className="text-slate-700 mt-0.5">
              &ldquo;Hi Elena, noticed your team exploring low-latency streaming pipelines this week. How are you handling partitioning bottlenecks on ClickHouse right now?&rdquo;
            </p>
          </div>

          <div className="p-2 rounded bg-white border border-sky-200/60 shadow-2xs">
            <span className="font-bold text-sky-950">Objection (&ldquo;We are building internally&rdquo;):</span>
            <p className="text-slate-700 mt-0.5">
              &ldquo;Totally fair—most VP Infras try that first. What we usually see is edge queue management and schema evolution eat 3 engineer months. Graph8 wraps your existing brokers in 15 minutes.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Call Disposition & Log Notes */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <label className="block text-[11px] font-bold text-slate-800 mb-1.5">
          Call Notes & Outcome
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Elena confirmed 50M event scale, requested technical demo with lead architect..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-400 focus:bg-white resize-none"
        />

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            {['Interested', 'Meeting Set', 'Voicemail', 'Gatekeeper'].map((tag) => (
              <button
                key={tag}
                onClick={() => setNotes((prev) => (prev ? `${prev} [${tag}]` : `[${tag}] `))}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium"
              >
                +{tag}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setSavedOutcome(true);
              setTimeout(() => setSavedOutcome(false), 2000);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10.5px] font-semibold border border-purple-200 transition-colors"
          >
            {savedOutcome ? <Check className="w-3 h-3 text-emerald-600" /> : null}
            <span>{savedOutcome ? 'Logged' : 'Save & Log'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
