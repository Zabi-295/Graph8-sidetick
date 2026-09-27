import { useState } from 'react';
import { Command, Monitor, RefreshCw, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import type { Graph8StatusResponse } from '../../services/graph8Client';

interface SettingsDrawerProps {
  isPinned: boolean;
  onTogglePin: () => void;
  onResetData?: () => void;
  graph8Status?: Graph8StatusResponse | null;
  onRefreshGraph8?: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isPinned,
  onTogglePin,
  onResetData,
  graph8Status,
  onRefreshGraph8
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoStart, setAutoStart] = useState(true);
  const [highIntentNotify, setHighIntentNotify] = useState(true);
  const [resetDone, setResetDone] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    if (onRefreshGraph8) {
      await onRefreshGraph8();
    }
    setTimeout(() => setTesting(false), 800);
  };

  const handleReset = () => {
    if (onResetData) onResetData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  };

  const isConnected = graph8Status?.connected ?? true;

  return (
    <div className="space-y-3.5 text-slate-800">
      {/* Graph8 REST API Connection Card */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[12px] font-bold shadow-2xs"
              style={{
                background: 'linear-gradient(135deg, #00d2ff 0%, #9b51e0 50%, #ff2a85 100%)'
              }}
            >
              G8
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-slate-900 leading-none">
                Graph8 REST API
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-none">
                Backend route: <code className="font-mono text-[9.5px] text-purple-700 bg-purple-50 px-1 py-0.2 rounded border border-purple-200">/api/graph8/status</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isConnected ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                <AlertCircle className="w-3 h-3 text-rose-600" />
                Disconnected
              </span>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
          <span className="text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-700 font-medium">Server-side GRAPH8_API_KEY</span>
          </span>

          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-[10px] border border-purple-200 transition-colors shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 text-purple-600 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testing...' : 'Test Connection'}</span>
          </button>
        </div>

        {graph8Status?.message && (
          <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono">
            {graph8Status.message}
          </p>
        )}
      </div>

      {/* Shortcut Quick Guide */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900 mb-2">
          <Command className="w-3.5 h-3.5 text-purple-600" />
          <span>Desktop Hotkeys</span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between text-slate-600">
            <span>Toggle Sidekick Floating Panel</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200 shadow-2xs">
              Ctrl + K
            </kbd>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Close Drawer / Minimize</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200 shadow-2xs">
              Esc
            </kbd>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Command Autocomplete</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200 shadow-2xs">
              ↑ / ↓ + Enter
            </kbd>
          </div>
        </div>
      </div>

      {/* Desktop Utility Preferences */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
        <h4 className="text-[11px] font-bold text-slate-900">
          Desktop Companion Preferences
        </h4>

        {/* Pin Always on Top */}
        <div className="flex items-center justify-between text-[11px]">
          <div>
            <span className="text-slate-800 font-medium">Always on Top</span>
            <p className="text-[9.5px] text-slate-400">Keep sidekick above other desktop apps</p>
          </div>
          <button
            onClick={onTogglePin}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              isPinned ? 'bg-purple-600' : 'bg-slate-200'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform absolute top-0.5 ${
              isPinned ? 'left-[18px]' : 'left-1'
            }`} />
          </button>
        </div>

        {/* Auto Launch on Boot */}
        <div className="flex items-center justify-between text-[11px]">
          <div>
            <span className="text-slate-800 font-medium">Auto-Launch on Boot</span>
            <p className="text-[9.5px] text-slate-400">Silently run in system tray on login</p>
          </div>
          <button
            onClick={() => setAutoStart(!autoStart)}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              autoStart ? 'bg-purple-600' : 'bg-slate-200'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform absolute top-0.5 ${
              autoStart ? 'left-[18px]' : 'left-1'
            }`} />
          </button>
        </div>

        {/* High-Intent Alerts */}
        <div className="flex items-center justify-between text-[11px]">
          <div>
            <span className="text-slate-800 font-medium">Real-time Intent Popups</span>
            <p className="text-[9.5px] text-slate-400">Notify when target account visits pricing</p>
          </div>
          <button
            onClick={() => setHighIntentNotify(!highIntentNotify)}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              highIntentNotify ? 'bg-purple-600' : 'bg-slate-200'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform absolute top-0.5 ${
              highIntentNotify ? 'left-[18px]' : 'left-1'
            }`} />
          </button>
        </div>

        {/* Subtle Sound Cues */}
        <div className="flex items-center justify-between text-[11px]">
          <div>
            <span className="text-slate-800 font-medium">Sound Feedback</span>
            <p className="text-[9.5px] text-slate-400">Soft audio chime on interested replies</p>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-9 h-5 rounded-full transition-colors relative ${
              soundEnabled ? 'bg-purple-600' : 'bg-slate-200'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform absolute top-0.5 ${
              soundEnabled ? 'left-[18px]' : 'left-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Electron Bridge Readiness */}
      <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 shadow-2xs text-[10.5px]">
        <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-1">
          <Monitor className="w-3.5 h-3.5 text-purple-600" />
          <span>Electron Wrapper Ready</span>
        </div>
        <p className="text-purple-950/80 leading-relaxed">
          Graph8 Sidekick uses decoupled UI components with native window drag boundaries (<code className="font-mono text-[9.5px] text-purple-700 bg-white px-1 py-0.2 rounded border border-purple-200">app-drag-region</code>). Ready for Electron tray and global shortcuts wrapper.
        </p>
      </div>

      {/* Reset State */}
      <button
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-[10.5px] border border-slate-200 shadow-2xs font-semibold transition-colors"
      >
        {resetDone ? <Check className="w-3 h-3 text-emerald-600" /> : <RefreshCw className="w-3 h-3" />}
        <span>{resetDone ? 'Demo State Reset' : 'Reset Demo State & Mock Data'}</span>
      </button>
    </div>
  );
};
