import { Settings, Minus, Pin, RefreshCw, AlertCircle, GripHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { Graph8Logo } from './Graph8Logo';

export type ConnectionStatusType = 'connected' | 'error' | 'checking';

interface HeaderProps {
  onMinimize: () => void;
  onOpenSettings: () => void;
  onOpenDemoLab?: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
  connectionStatus?: ConnectionStatusType;
  onRefreshConnection?: () => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
  isDragging?: boolean;
  onResetPosition?: () => void;
  hasCustomPosition?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMinimize,
  onOpenSettings,
  onOpenDemoLab,
  isPinned = false,
  onTogglePin,
  connectionStatus = 'connected',
  onRefreshConnection,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  isDragging = false,
  onResetPosition,
  hasCustomPosition = false
}) => {
  return (
    <header
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onResetPosition}
      className={`flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200/80 bg-white/90 backdrop-blur-md select-none rounded-t-[18px] app-drag-region transition-colors ${
        isDragging ? 'cursor-grabbing bg-purple-50/40' : 'cursor-grab hover:bg-slate-50/50'
      }`}
      title="Click and hold to drag anywhere on screen (Double-click to reset)"
    >
      {/* Left: Brand + Graph8 Connection status */}
      <div className="flex items-center gap-2 app-no-drag pointer-events-auto">
        <Graph8Logo size={24} glow />
        
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-bold text-slate-900 tracking-tight">
            Graph8 <span className="font-semibold text-slate-700">Sidekick</span>
          </span>
        </div>

        {/* Live Graph8 Connection Status Badge */}
        {connectionStatus === 'connected' && (
          <div 
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 ml-1 shadow-2xs group cursor-default transition-all"
            title="Authenticated via server-side GRAPH8_API_KEY"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold tracking-tight">
              ● Graph8 Connected
            </span>
          </div>
        )}

        {connectionStatus === 'checking' && (
          <div 
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 ml-1 shadow-2xs"
            title="Verifying connection to Graph8 via server route"
          >
            <RefreshCw className="w-2.5 h-2.5 text-sky-600 animate-spin" />
            <span className="text-[10px] font-semibold tracking-tight">
              ● Connecting...
            </span>
          </div>
        )}

        {connectionStatus === 'error' && (
          <div 
            onClick={onRefreshConnection}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 ml-1 shadow-2xs cursor-pointer hover:bg-amber-100 transition-colors"
            title="Graph8 API unavailable. Running with clearly labelled Demo Data fallback."
          >
            <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span className="text-[10px] font-bold tracking-tight">
              ● Demo Mode (Fallback)
            </span>
            {onRefreshConnection && (
              <RefreshCw className="w-2.5 h-2.5 text-amber-600 hover:rotate-180 transition-transform ml-0.5" />
            )}
          </div>
        )}
      </div>

      {/* Center: Drag Grip Indicator */}
      <div className="flex-1 flex items-center justify-center pointer-events-none mx-2">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-slate-300 transition-colors">
          <GripHorizontal className={`w-4 h-4 ${isDragging ? 'text-purple-500' : 'text-slate-300'}`} />
          {isDragging && (
            <span className="text-[10px] font-mono font-bold text-purple-600 animate-pulse tracking-tight">
              Moving
            </span>
          )}
        </div>
      </div>

      {/* Right: Window Controls */}
      <div className="flex items-center gap-1 app-no-drag text-slate-400">
        {hasCustomPosition && onResetPosition && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResetPosition();
            }}
            className="p-1.5 rounded-md text-purple-600 hover:text-purple-800 hover:bg-purple-50 transition-colors"
            title="Reset to default dock position (or double-click header)"
            aria-label="Reset position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {onTogglePin && (
          <button
            onClick={onTogglePin}
            className={`p-1.5 rounded-md hover:text-slate-700 hover:bg-slate-100 transition-colors ${
              isPinned ? 'text-purple-600 bg-purple-50 font-medium' : ''
            }`}
            title={isPinned ? 'Unpin from Top' : 'Pin Always on Top'}
            aria-label="Pin Window"
          >
            <Pin className="w-3.5 h-3.5 rotate-45" />
          </button>
        )}

        {onOpenDemoLab && (
          <button
            onClick={onOpenDemoLab}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all shadow-2xs group mr-0.5"
            title="Open Live Presentation Demo Lab (Simulate Calls, Replies, Signals)"
          >
            <Sparkles className="w-3 h-3 text-purple-600 group-hover:rotate-12 transition-transform" />
            <span>Demo Lab</span>
          </button>
        )}

        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Sidekick Settings & Hotkeys"
          aria-label="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onMinimize}
          className="p-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100 transition-colors group"
          title="Minimize to Floating Pill (Esc)"
          aria-label="Minimize"
        >
          <Minus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </header>
  );
};
