import React, { useState } from 'react';
import { mockSequences } from '../../mockData';
import { Workflow, Play, Pause, CheckCircle2 } from 'lucide-react';

export const QuickSequencesDrawer: React.FC = () => {
  const [pausedStates, setPausedStates] = useState<Record<string, boolean>>({});

  const togglePause = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPausedStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-3 text-slate-800">
      {/* Sequences Health Header */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-slate-900">
              Active Outbound Sequences
            </h4>
            <p className="text-[10px] text-slate-500">
              224 contacts active across 3 sequences
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
          Optimal Deliverability
        </span>
      </div>

      {/* Sequence cards */}
      <div className="space-y-2">
        {mockSequences.map((seq) => {
          const isPaused = pausedStates[seq.id];
          return (
            <div
              key={seq.id}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-card-hover transition-all shadow-card-light"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-[12.5px] font-bold text-slate-900">
                    {seq.name}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {seq.activeCount} contacts active
                  </p>
                </div>

                <button
                  onClick={(e) => togglePause(seq.id, e)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-semibold border transition-colors ${
                    isPaused
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                  title={isPaused ? 'Resume sequence' : 'Pause sequence'}
                >
                  {isPaused ? <Play className="w-3 h-3 text-amber-600" /> : <Pause className="w-3 h-3 text-slate-500" />}
                  <span>{isPaused ? 'Paused' : 'Active'}</span>
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 mb-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10.5px]">
                <div>
                  <span className="text-slate-500 text-[9.5px]">Open Rate</span>
                  <div className="font-mono font-bold text-emerald-700">{seq.openRate}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[9.5px]">Reply Rate</span>
                  <div className="font-mono font-bold text-purple-700">{seq.replyRate}</div>
                </div>
              </div>

              <div className="text-[9.5px] font-mono text-slate-500 flex items-center justify-between">
                <span>{seq.nextScheduled}</span>
                <span className="text-emerald-700 flex items-center gap-0.5 font-semibold">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Spintax Verified
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
