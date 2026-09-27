import React, { useState, useRef } from 'react';
import { Search, CornerDownLeft, Users, Zap, Mail, Sparkles } from 'lucide-react';

interface CommandBarProps {
  onSearch: (query: string) => void;
  onSelectAction: (actionKey: string, payload?: any) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  onSearch,
  onSelectAction,
  inputRef: externalInputRef
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const activeInputRef = externalInputRef || internalInputRef;

  const defaultCommands = [
    {
      id: 'cmd-demo-lab',
      label: 'Open Live Demo Lab (Simulate calls & messages)',
      category: 'Presentation Demo',
      icon: Sparkles,
      action: () => onSelectAction('demo_lab')
    },
    {
      id: 'cmd-cto-saas',
      label: 'Find CTOs at SaaS companies',
      category: 'Prospect Discovery',
      icon: Users,
      action: () => onSelectAction('quick_prospects', { filter: 'CTO' })
    },
    {
      id: 'cmd-high-intent',
      label: 'Show high intent leads',
      category: 'Intent Signals',
      icon: Zap,
      action: () => onSelectAction('quick_signals', { filter: 'high_intent' })
    },
    {
      id: 'cmd-interested',
      label: 'Show interested replies',
      category: 'AI Inbox',
      icon: Mail,
      action: () => onSelectAction('quick_inbox', { filter: 'interested' })
    },
    {
      id: 'cmd-prospects-msft',
      label: 'Find prospects at Microsoft',
      category: 'Account Intelligence',
      icon: Users,
      action: () => onSelectAction('quick_prospects', { filter: 'Microsoft' })
    }
  ];

  const filteredCommands = query.trim()
    ? defaultCommands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
      )
    : defaultCommands;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setQuery('');
        setIsFocused(false);
      } else if (query.trim()) {
        onSearch(query);
        onSelectAction('quick_prospects', { filter: query });
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      activeInputRef.current?.blur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(0);
    onSearch(val);
  };

  return (
    <div className="relative px-3.5 pt-3 pb-2 select-none">
      <div 
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/90 border transition-all duration-150 ${
          isFocused 
            ? 'border-purple-400 bg-white ring-2 ring-purple-500/15 shadow-sm' 
            : 'border-slate-200/90 hover:border-slate-300 hover:bg-white'
        }`}
      >
        <Search className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${isFocused ? 'text-purple-600' : 'text-slate-400'}`} />
        
        <input
          ref={activeInputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search prospects, check signals, or run an action..."
          className="w-full bg-transparent text-[12px] text-slate-800 placeholder:text-slate-400 focus:outline-none font-normal"
        />

        {query ? (
          <button
            onClick={() => {
              setQuery('');
              onSearch('');
            }}
            className="text-[10px] text-slate-500 hover:text-slate-800 px-1 py-0.5 rounded bg-slate-200/60"
          >
            Clear
          </button>
        ) : (
          <div className="flex items-center gap-1 flex-shrink-0">
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200 shadow-2xs">
              Ctrl
            </kbd>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200 shadow-2xs">
              K
            </kbd>
          </div>
        )}
      </div>

      {/* Autocomplete / Command suggestions dropdown */}
      {isFocused && (
        <div className="absolute left-3.5 right-3.5 top-full mt-1.5 z-30 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 animate-fade-in backdrop-blur-xl">
          <div className="px-2 py-1 flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            <span>Suggested Actions</span>
            <span>Use ↑ ↓ to navigate</span>
          </div>

          <div className="space-y-0.5 max-h-56 overflow-y-auto">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      cmd.action();
                      setQuery('');
                      setIsFocused(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected 
                        ? 'bg-purple-50 text-purple-900 border border-purple-200' 
                        : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span className="text-[11.5px] font-medium">{cmd.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        {cmd.category}
                      </span>
                      {isSelected && (
                        <CornerDownLeft className="w-3 h-3 text-purple-600" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3 text-center text-[11px] text-slate-500">
                Press <kbd className="px-1 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">Enter</kbd> to search Graph8 radar for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
