import { useState, useEffect, useRef, useCallback } from 'react';
import { Header, type ConnectionStatusType } from './components/Header';
import { CommandBar } from './components/CommandBar';
import { QuickActions } from './components/QuickActions';
import { NextMoves } from './components/NextMoves';
import { FloatingButton } from './components/FloatingButton';
import { DesktopSimulator } from './components/DesktopSimulator';
import { DetailDrawer } from './components/drawers/DetailDrawer';
import { ProspectDrawer } from './components/drawers/ProspectDrawer';
import { CallDrawer } from './components/drawers/CallDrawer';
import { BookingDrawer } from './components/drawers/BookingDrawer';
import { ReplyDrawer } from './components/drawers/ReplyDrawer';
import { ConversationDrawer } from './components/drawers/ConversationDrawer';
import { FollowUpDrawer } from './components/drawers/FollowUpDrawer';
import { QuickProspectsDrawer } from './components/drawers/QuickProspectsDrawer';
import { QuickSignalsDrawer } from './components/drawers/QuickSignalsDrawer';
import { QuickInboxDrawer } from './components/drawers/QuickInboxDrawer';
import { QuickSequencesDrawer } from './components/drawers/QuickSequencesDrawer';
import { SettingsDrawer } from './components/drawers/SettingsDrawer';
import { DemoLabDrawer } from './components/drawers/DemoLabDrawer';
import { ActionConfirmModal } from './components/modals/ActionConfirmModal';
import { LiveDemoNotification, type DemoAlertData } from './components/modals/LiveDemoNotification';
import { checkGraph8Status, executeAddToSequence, type Graph8StatusResponse } from './services/graph8Client';
import { listenToDemoTrigger } from './services/demoRemote';

import {
  mockHighIntentCard,
  mockInterestedReplyCard,
  mockFollowUpCard
} from './mockData';
import { IntentSignalsView } from './components/IntentSignalsView';
import { ImportantRepliesView } from './components/ImportantRepliesView';
import type { DrawerType, DrawerState } from './types';
import { Zap, Sparkles, Inbox } from 'lucide-react';

export function App() {
  const isElectron = typeof window !== 'undefined' && Boolean((window as any).electronAPI?.isElectron);
  const [isExpanded, setIsExpanded] = useState(!isElectron);
  const [isPinned, setIsPinned] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [mainTab, setMainTab] = useState<'signals' | 'replies' | 'moves'>('signals');

  // Sync window expand/collapse with Electron native window
  useEffect(() => {
    if (isElectron) {
      if (isExpanded) {
        (window as any).electronAPI?.expandWindow();
      } else {
        (window as any).electronAPI?.collapseWindow();
      }
    }
  }, [isExpanded, isElectron]);

  // Global shortcut listener from Electron main process (Ctrl+K)
  useEffect(() => {
    if (isElectron && (window as any).electronAPI?.onToggleShortcut) {
      const unsub = (window as any).electronAPI.onToggleShortcut(() => {
        setIsExpanded((prev: boolean) => !prev);
      });
      return unsub;
    }
  }, [isElectron]);

  // Sync state when native Electron window collapses on blur
  useEffect(() => {
    if (isElectron && (window as any).electronAPI?.onBlurCollapse) {
      const unsub = (window as any).electronAPI.onBlurCollapse(() => {
        setIsExpanded(false);
      });
      return unsub;
    }
  }, [isElectron]);

  // Floating Window Custom Drag Position State
  const [customPosition, setCustomPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialLeft: number; initialTop: number }>({
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialTop: 0
  });

  const handleDragStart = (e: React.PointerEvent) => {
    // Exclude clicks on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, select, a, [role="button"], .app-no-drag')) {
      return;
    }
    if (!panelRef.current) return;
    
    // Primary mouse button only
    if (e.button !== 0) return;

    const rect = panelRef.current.getBoundingClientRect();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialLeft: rect.left,
      initialTop: rect.top
    };
    setIsDragging(true);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleDragMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    const panelWidth = panelRef.current?.offsetWidth || 420;
    const panelHeight = panelRef.current?.offsetHeight || 600;

    const minX = 8;
    const maxX = Math.max(minX, window.innerWidth - panelWidth - 8);
    const minY = 8;
    const maxY = Math.max(minY, window.innerHeight - panelHeight - 8);

    let newX = dragStartRef.current.initialLeft + deltaX;
    let newY = dragStartRef.current.initialTop + deltaY;

    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    setCustomPosition({ x: newX, y: newY });
  };

  const handleDragEnd = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleResetPosition = () => {
    setCustomPosition(null);
  };

  // Window-level safety listeners during drag so mouse never loses tracking
  useEffect(() => {
    if (!isDragging) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - dragStartRef.current.startX;
      const deltaY = e.clientY - dragStartRef.current.startY;

      const panelWidth = panelRef.current?.offsetWidth || 420;
      const panelHeight = panelRef.current?.offsetHeight || 600;

      const minX = 8;
      const maxX = Math.max(minX, window.innerWidth - panelWidth - 8);
      const minY = 8;
      const maxY = Math.max(minY, window.innerHeight - panelHeight - 8);

      let newX = dragStartRef.current.initialLeft + deltaX;
      let newY = dragStartRef.current.initialTop + deltaY;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      setCustomPosition({ x: newX, y: newY });
    };

    const handleWindowPointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [isDragging]);

  // Graph8 REST API connection state
  const [graph8Status, setGraph8Status] = useState<Graph8StatusResponse | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusType>('checking');

  // Live Demo Simulation Alert State (For Pitch & Presentation Demos)
  const [demoAlert, setDemoAlert] = useState<DemoAlertData | null>(null);

  const handleSimulateCall = () => {
    if (!isExpanded && isElectron) {
      (window as any).electronAPI?.showNotificationMode?.();
    }
    setDemoAlert({
      type: 'call',
      contactName: 'Barry Peraino',
      role: 'Founder & VP Sales',
      company: 'Granite Systems',
      phone: '+1 (415) 890-4122',
      score: 95,
      dataPayload: {
        contactName: 'Barry Peraino',
        company: 'Granite Systems',
        role: 'Founder & VP Sales',
        email: 'barry@granitesystems.com',
        phone: '+1 (415) 890-4122',
        companyDomain: 'granitesystems.com',
        signalBadge: { label: 'High Intent', score: 95 }
      }
    });
  };

  const handleSimulateReply = () => {
    if (!isExpanded && isElectron) {
      (window as any).electronAPI?.showNotificationMode?.();
    }
    setDemoAlert({
      type: 'reply',
      contactName: 'Marcus Brody',
      role: 'VP Infrastructure',
      company: 'Cortex Data',
      previewText: 'Saw the architecture doc you sent over. Can you jump on a 20-min demo this Thursday afternoon to show how Graph8 handles Kafka consumer lag?',
      dataPayload: {
        id: 'reply-1',
        contactName: 'Marcus Brody',
        company: 'Cortex Data',
        role: 'VP Infrastructure',
        email: 'marcus.brody@cortexdata.io',
        channel: 'Email',
        preview: 'Saw the architecture doc you sent over. Can you jump on a 20-min demo this Thursday afternoon to show how Graph8 handles Kafka consumer lag?',
        classification: 'Wants Demo',
        classificationSource: 'Graph8 AI',
        priorityTier: 1
      }
    });
  };

  const handleSimulateSignal = () => {
    if (!isExpanded && isElectron) {
      (window as any).electronAPI?.showNotificationMode?.();
    }
    setDemoAlert({
      type: 'signal',
      contactName: 'Elena Rostova',
      role: 'Head of Infrastructure',
      company: 'Datadog Partner Network',
      score: 89,
      previewText: 'High-Intent surge: Pricing calculator and API Webhook documentation reviewed 3 times in last 10 minutes.',
      dataPayload: {
        id: 'g8-sig-3',
        contactName: 'Elena Rostova',
        company: 'Datadog Partner Network',
        role: 'Head of Infrastructure',
        email: 'elena.rostova@datadog.com',
        phone: '+1 (650) 412-9908',
        signalType: 'HIGH INTENT',
        signalDescription: 'High-Intent surge: Pricing calculator and API Webhook documentation reviewed 3 times in last 10 minutes.',
        recommendedAction: 'Call direct or schedule priority architecture briefing'
      }
    });
  };

  const handleDelayedSimulateCall = (seconds: number) => {
    setTimeout(() => {
      handleSimulateCall();
    }, seconds * 1000);
  };

  const handleDelayedSimulateReply = (seconds: number) => {
    setTimeout(() => {
      handleSimulateReply();
    }, seconds * 1000);
  };

  const handleDelayedSimulateSignal = (seconds: number) => {
    setTimeout(() => {
      handleSimulateSignal();
    }, seconds * 1000);
  };

  // Real-time synchronization: listen for remote demo triggers from localhost browser dashboard
  useEffect(() => {
    const unsub = listenToDemoTrigger((type) => {
      console.log('[App] Received remote demo trigger from browser dashboard:', type);
      if (type === 'call') {
        handleSimulateCall();
      } else if (type === 'reply') {
        handleSimulateReply();
      } else if (type === 'signal') {
        handleSimulateSignal();
      }
    });
    return unsub;
  }, [isExpanded, isElectron]);

  // Professional 7-second auto-transparency when idle over desktop
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    if (isElectron) {
      (window as any).electronAPI?.setOpacity?.(1.0);
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    // Only fade when no demo alert is active and user is not dragging
    if (!demoAlert && !isDragging) {
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
        if (isElectron) {
          (window as any).electronAPI?.setOpacity?.(0.4);
        }
      }, 7000);
    }
  }, [isElectron, demoAlert, isDragging]);

  useEffect(() => {
    if (!isElectron) return;

    const handleActivity = () => resetIdleTimer();

    window.addEventListener('pointermove', handleActivity);
    window.addEventListener('pointerdown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('mouseenter', handleActivity);

    resetIdleTimer();

    return () => {
      window.removeEventListener('pointermove', handleActivity);
      window.removeEventListener('pointerdown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('mouseenter', handleActivity);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isElectron, resetIdleTimer]);

  useEffect(() => {
    if (demoAlert) {
      setIsIdle(false);
      if (isElectron) {
        (window as any).electronAPI?.setOpacity?.(1.0);
      }
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    }
  }, [demoAlert, isElectron]);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    actionType: 'add_to_sequence' | 'initiate_call';
    targetName: string;
    targetSubtitle?: string;
    destinationName: string;
    consequenceWarning?: string;
    onConfirm: () => Promise<any>;
    onSuccessCallback?: (result: any) => void;
  }>({
    isOpen: false,
    actionType: 'add_to_sequence',
    targetName: '',
    destinationName: '',
    onConfirm: async () => ({ success: true })
  });

  // Active drawer state
  const [drawer, setDrawer] = useState<DrawerState>({
    isOpen: false,
    type: null,
    data: null
  });

  const handleAppAddToSequence = (contact: any) => {
    setConfirmModal({
      isOpen: true,
      actionType: 'add_to_sequence',
      targetName: contact.contactName || 'Prospect',
      targetSubtitle: `${contact.role || 'Executive'} • ${contact.company || 'Enterprise Account'}`,
      destinationName: 'High Intent Executive Outreach',
      consequenceWarning: `This will enroll ${contact.contactName || 'this contact'} into automated multi-step outreach via Graph8. Stop on reply is enabled.`,
      onConfirm: async () => {
        return await executeAddToSequence({
          contactId: contact.crmContactId || contact.id || 250,
          contactName: contact.contactName || 'Prospect',
          role: contact.role || 'Executive Decision Maker',
          company: contact.company || 'Enterprise Account',
          email: contact.email,
          phone: contact.phone,
          sequenceName: 'High Intent Executive Outreach'
        });
      },
      onSuccessCallback: () => {
        // Successfully enrolled
      }
    });
  };

  const commandInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Probe Graph8 Health / Connection via our server API endpoint
  const testGraph8Connection = useCallback(async () => {
    setConnectionStatus('checking');
    try {
      const res = await checkGraph8Status();
      setGraph8Status(res);
      setConnectionStatus(res.connected ? 'connected' : 'error');
    } catch {
      setConnectionStatus('error');
    }
  }, []);

  useEffect(() => {
    testGraph8Connection();
  }, [testGraph8Connection]);

  // Global Keyboard Shortcuts (Ctrl+K to toggle, Esc to close/minimize)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsExpanded((prev) => {
          const next = !prev;
          if (next) {
            setTimeout(() => commandInputRef.current?.focus(), 100);
          }
          return next;
        });
      }

      // Escape
      if (e.key === 'Escape') {
        if (drawer.isOpen) {
          closeDrawer();
        } else if (isExpanded && !isPinned) {
          setIsExpanded(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawer.isOpen, isExpanded, isPinned]);

  const openDrawer = (type: DrawerType, data?: any) => {
    if (!type) {
      closeDrawer();
      return;
    }
    setDrawer({
      isOpen: true,
      type,
      data
    });
  };

  const closeDrawer = () => {
    setDrawer({
      isOpen: false,
      type: null,
      data: null
    });
  };

  const handleCommandAction = (actionKey: string, payload?: any) => {
    if (actionKey === 'quick_prospects') {
      openDrawer('quick_prospects', payload);
    } else if (actionKey === 'quick_signals') {
      setMainTab('signals');
      openDrawer('quick_signals', payload);
    } else if (actionKey === 'quick_inbox') {
      setMainTab('replies');
      openDrawer('quick_inbox', payload);
    } else if (actionKey === 'quick_sequences') {
      openDrawer('quick_sequences', payload);
    } else if (actionKey === 'settings') {
      openDrawer('settings');
    }
  };

  // Close when clicking outside anywhere on the page (unless pinned)
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!isExpanded || isPinned) return;
      const target = e.target as HTMLElement;

      // Don't close if clicking inside the floating panel
      if (panelRef.current && panelRef.current.contains(target)) {
        return;
      }

      // Don't close if clicking interactive controls in header, modals, or demo lab
      if (target.closest('[role="status"], [role="dialog"], button, a, input, select')) {
        return;
      }

      if (drawer.isOpen) {
        closeDrawer();
      }
      setIsExpanded(false);
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isExpanded, isPinned, drawer.isOpen]);

  const companionNode = (
    <div
      onPointerMove={resetIdleTimer}
      onMouseEnter={resetIdleTimer}
      className={`relative w-full h-full overflow-hidden bg-transparent font-sans antialiased transition-opacity duration-700 ${
        isIdle && !demoAlert && isElectron ? 'opacity-40 hover:opacity-100' : 'opacity-100'
      }`}
    >
      {/* State 1: Collapsed Pill (Idle) - Clean floating pill centered in window */}
      {!isExpanded && !demoAlert && (
        <div className="w-full h-full flex items-center justify-center p-1 select-none">
          <FloatingButton
            isRelative={true}
            onClick={() => {
              setIsExpanded(true);
              resetIdleTimer();
              setTimeout(() => commandInputRef.current?.focus(), 100);
            }}
            badgeCount={3}
            isActive={connectionStatus === 'connected'}
          />
        </div>
      )}

      {/* State 2: Collapsed with Demo Alert - Clean notification card floating OUTSIDE and ABOVE the pill */}
      {!isExpanded && demoAlert && (
        <div className="w-full h-full flex flex-col justify-end items-end p-2 gap-2.5 select-none animate-fade-in">
          {/* Standalone Notification Card outside & above the pill */}
          <LiveDemoNotification
            isEmbedded={true}
            alert={demoAlert}
            onDismiss={() => {
              setDemoAlert(null);
              if (isElectron) {
                (window as any).electronAPI?.collapseWindow?.();
              }
            }}
            onAcceptCall={(contact) => {
              setIsExpanded(true);
              setDemoAlert(null);
              openDrawer('call_modal', contact);
            }}
            onAcceptReply={(reply) => {
              setIsExpanded(true);
              setMainTab('replies');
              setDemoAlert(null);
              openDrawer('conversation_thread', reply);
            }}
            onAcceptSignal={(signal) => {
              setIsExpanded(true);
              setMainTab('signals');
              setDemoAlert(null);
              openDrawer('prospect_detail', signal);
            }}
          />

          {/* Floating Pill resting cleanly below the notification */}
          <FloatingButton
            isRelative={true}
            onClick={() => {
              setIsExpanded(true);
              resetIdleTimer();
              setTimeout(() => commandInputRef.current?.focus(), 100);
            }}
            badgeCount={3}
            isActive={connectionStatus === 'connected'}
          />
        </div>
      )}

      {/* State 3: Expanded 440px Floating Companion Window */}
      {isExpanded && (
        <div
          ref={panelRef}
          onClick={(e) => {
            e.stopPropagation();
            resetIdleTimer();
          }}
          style={isElectron ? { width: '100%', height: '100%', left: 0, top: 0 } : undefined}
          className={`${isElectron ? 'fixed z-40 top-0 left-0 w-full h-full p-2' : 'relative w-full h-full p-1'} select-none flex flex-col bg-transparent`}
        >
          {/* Subtle Accent Glow Ring & Shadow */}
          <div className="relative p-[1px] rounded-[20px] bg-gradient-to-b from-purple-200/90 via-slate-200/80 to-purple-200/60 shadow-2xl backdrop-blur-2xl w-full h-full">
            <div className="relative w-full h-full rounded-[19px] bg-white/98 border border-slate-200/90 shadow-sidekick-light flex flex-col overflow-hidden animate-fade-in">
              {/* Top Quick Grab Bar for dragging */}
              <div
                onPointerDown={handleDragStart}
                className={`w-full py-1.5 flex items-center justify-center bg-white/95 border-b border-slate-100/80 transition-colors select-none app-drag-region ${
                  isDragging
                    ? 'cursor-grabbing bg-purple-50/60'
                    : 'cursor-grab hover:bg-slate-50'
                }`}
                title="Hold and drag anywhere on screen (Left, Right, Up, Down)"
              >
                <div className={`w-10 h-1 rounded-full transition-all ${isDragging ? 'bg-purple-400 w-14' : 'bg-slate-300/80'}`} />
              </div>

              {/* Header with Live Graph8 Connection Status */}
              <Header
                onMinimize={() => setIsExpanded(false)}
                onOpenSettings={() => openDrawer('settings')}
                onOpenDemoLab={() => openDrawer('demo_lab')}
                isPinned={isPinned}
                onTogglePin={() => setIsPinned((prev) => !prev)}
                connectionStatus={connectionStatus}
                onRefreshConnection={testGraph8Connection}
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
                isDragging={isDragging}
                onResetPosition={handleResetPosition}
                hasCustomPosition={customPosition !== null}
              />

            {/* Scrollable Container for Main Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/30">
              {/* Command Bar */}
              <CommandBar
                inputRef={commandInputRef}
                onSearch={(q) => setSearchFilter(q)}
                onSelectAction={handleCommandAction}
              />

              {/* Quick Actions (4 key pillars) */}
              <QuickActions
                onOpenDrawer={openDrawer}
                activeDrawerType={drawer.isOpen ? drawer.type : undefined}
              />

              {/* Main View Mode Selector (Signals, Important Replies, Next Moves) */}
              <div className="px-3.5 mb-2.5 flex items-center justify-between border-b border-slate-200/80 pb-2">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setMainTab('signals')}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all whitespace-nowrap ${
                      mainTab === 'signals'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                    }`}
                  >
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </div>
                    <Zap className="w-3 h-3 text-purple-600" />
                    <span>Signals</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      Live
                    </span>
                  </button>

                  <button
                    onClick={() => setMainTab('replies')}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all whitespace-nowrap ${
                      mainTab === 'replies'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                    }`}
                  >
                    <Inbox className="w-3 h-3 text-purple-600" />
                    <span>Replies</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-bold">
                      Triage
                    </span>
                  </button>

                  <button
                    onClick={() => setMainTab('moves')}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all whitespace-nowrap ${
                      mainTab === 'moves'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-slate-500" />
                    <span>Moves</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-700 font-semibold">
                      3
                    </span>
                  </button>
                </div>

                <div className="text-[9.5px] text-slate-400 font-mono hidden sm:block">
                  {mainTab === 'signals' ? 'Graph8 Radar' : mainTab === 'replies' ? 'Action Required' : 'Priority Queue'}
                </div>
              </div>

              {/* Feed Content: Intent Signals vs Important Replies vs Next Moves */}
              {mainTab === 'signals' ? (
                <div className="px-3 pb-3">
                  <IntentSignalsView
                    onOpenDrawer={openDrawer}
                    initialFilter={searchFilter}
                    isCompact
                  />
                </div>
              ) : mainTab === 'replies' ? (
                <div className="px-3 pb-3">
                  <ImportantRepliesView
                    onOpenDrawer={openDrawer}
                    initialFilter={searchFilter}
                    isCompact
                  />
                </div>
              ) : (
                <NextMoves
                  highIntentData={mockHighIntentCard}
                  interestedReplyData={mockInterestedReplyCard}
                  followUpData={mockFollowUpCard}
                  onOpenDrawer={openDrawer}
                  searchFilter={searchFilter}
                />
              )}
            </div>

            {/* Footer Status Bar with Graph8 REST API status */}
            <div className="px-3.5 py-1.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-500 select-none">
              <span className="flex items-center gap-1.5 font-medium">
                <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-500' : connectionStatus === 'checking' ? 'bg-sky-500 animate-pulse' : 'bg-rose-500'}`} />
                <span>
                  {connectionStatus === 'connected' ? 'Graph8 REST API Connected' : connectionStatus === 'checking' ? 'Connecting to Graph8...' : 'Graph8 Connection Error'}
                </span>
              </span>
              <span className="text-slate-400">Press Esc to close</span>
            </div>

            {/* Detail Drawers */}
            <DetailDrawer
              isOpen={drawer.isOpen && drawer.type === 'prospect_detail'}
              onClose={closeDrawer}
              title={drawer.data?.contactName || mockHighIntentCard.contactName}
              subtitle={`${drawer.data?.role || mockHighIntentCard.role} • ${drawer.data?.company || mockHighIntentCard.company}`}
              badge={
                drawer.data?.signalBadge?.score !== undefined
                  ? `${drawer.data.signalBadge.score}% Intent`
                  : typeof drawer.data?.graph8Confidence === 'number' && drawer.data.graph8Confidence >= 60
                  ? `Score: ${drawer.data.graph8Confidence}%`
                  : 'Verified Lead'
              }
              badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              <ProspectDrawer
                data={drawer.data || mockHighIntentCard}
                onCall={() => openDrawer('call_modal', drawer.data || mockHighIntentCard)}
                onBook={() => openDrawer('book_meeting', drawer.data || mockHighIntentCard)}
                onAddToSequence={(p) => handleAppAddToSequence(p)}
              />
            </DetailDrawer>

            <DetailDrawer
              isOpen={drawer.isOpen && drawer.type === 'call_modal'}
              onClose={closeDrawer}
              title="Fast Voice Dialer"
              subtitle={`Connecting to ${drawer.data?.contactName || mockHighIntentCard.contactName} (${drawer.data?.company || mockHighIntentCard.company})`}
              badge="Local Presence"
              badgeColor="bg-sky-50 text-sky-700 border-sky-200"
            >
              <CallDrawer data={drawer.data || mockHighIntentCard} />
            </DetailDrawer>

            <DetailDrawer
              isOpen={drawer.isOpen && drawer.type === 'book_meeting'}
              onClose={closeDrawer}
              title="Schedule Architecture Sync"
              subtitle={`With ${drawer.data?.contactName || mockHighIntentCard.contactName} • ${drawer.data?.company || mockHighIntentCard.company}`}
              badge="Instant Slot"
              badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              <BookingDrawer data={drawer.data || mockHighIntentCard} />
            </DetailDrawer>

            {/* Conversation Thread Drawer */}
            <DetailDrawer
              isOpen={drawer.isOpen && drawer.type === 'conversation_thread'}
              onClose={closeDrawer}
              title="Conversation Thread"
              subtitle={`Inbound history from ${drawer.data?.contactName || 'Buyer'} (${drawer.data?.company || 'Account'})`}
              badge={drawer.data?.channel || 'Email'}
              badgeColor="bg-purple-50 text-purple-700 border-purple-200"
            >
              <ConversationDrawer
                reply={drawer.data || {}}
                onReply={(rep) => openDrawer('reply_composer', rep)}
                onCall={(rep) => openDrawer('call_modal', rep)}
                onAddToSequence={(rep) => handleAppAddToSequence(rep)}
                onViewProspect={(rep) => openDrawer('prospect_detail', rep)}
              />
            </DetailDrawer>

            <DetailDrawer
              isOpen={drawer.isOpen && drawer.type === 'reply_composer'}
              onClose={closeDrawer}
              title="AI Reply Composer"
              subtitle={`Thread with ${drawer.data?.contactName || mockInterestedReplyCard.contactName} (${drawer.data?.company || mockInterestedReplyCard.company})`}
              badge={drawer.data?.aiClassification?.label || drawer.data?.classification || mockInterestedReplyCard.aiClassification.label}
              badgeColor="bg-purple-50 text-purple-700 border-purple-200"
            >
              <ReplyDrawer data={drawer.data || mockInterestedReplyCard} />
            </DetailDrawer>

            <DetailDrawer
              isOpen={drawer.isOpen && drawer.type === 'followup_action'}
              onClose={closeDrawer}
              title="Follow-Up Action"
              subtitle={`Contract Review with ${mockFollowUpCard.contactName} (${mockFollowUpCard.company})`}
              badge={`${mockFollowUpCard.daysStalled}d Stalled`}
              badgeColor="bg-amber-50 text-amber-700 border-amber-200"
            >
              <FollowUpDrawer data={mockFollowUpCard} />
            </DetailDrawer>

            <DetailDrawer
              isOpen={drawer.isOpen && drawer.type === 'quick_prospects'}
              onClose={closeDrawer}
              title="Prospect Discovery"
              subtitle="Real-time target audience & account search"
              badge="Radar Verified"
              badgeColor="bg-sky-50 text-sky-700 border-sky-200"
            >
              <QuickProspectsDrawer
                initialFilter={drawer.data?.filter || ''}
                onSelectProspect={(p) => {
                  openDrawer('prospect_detail', p);
                }}
              />
            </DetailDrawer>

            <DetailDrawer
              isOpen={drawer.isOpen && drawer.type === 'quick_signals'}
              onClose={closeDrawer}
              title="Live Intent Radar"
              subtitle="Real-time buyer telemetry and intent signals from Graph8"
              badge="Live Feed"
              badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              <QuickSignalsDrawer
                onOpenDrawer={openDrawer}
                onSelectSignal={(sig) => {
                  openDrawer('prospect_detail', sig);
                }}
              />
            </DetailDrawer>

            <DetailDrawer
              isOpen={drawer.isOpen && drawer.type === 'quick_inbox'}
              onClose={closeDrawer}
              title="Important Buyer Replies"
              subtitle="Prioritizing replies requiring human attention"
              badge="Triage"
              badgeColor="bg-purple-50 text-purple-700 border-purple-200"
            >
              <QuickInboxDrawer
                onOpenDrawer={openDrawer}
                onSelectThread={(reply) => {
                  openDrawer('reply_composer', reply);
                }}
              />
            </DetailDrawer>

            <DetailDrawer
              isOpen={drawer.isOpen && drawer.type === 'quick_sequences'}
              onClose={closeDrawer}
              title="Active Outreach Sequences"
              subtitle="Multi-channel automated workflows & deliverability"
              badge="Healthy"
              badgeColor="bg-pink-50 text-pink-700 border-pink-200"
            >
              <QuickSequencesDrawer />
            </DetailDrawer>

            <DetailDrawer
              isOpen={drawer.isOpen && drawer.type === 'settings'}
              onClose={closeDrawer}
              title="Sidekick Settings"
              subtitle="Preferences, keyboard shortcuts, and Electron bridge"
            >
              <SettingsDrawer
                isPinned={isPinned}
                onTogglePin={() => setIsPinned((prev) => !prev)}
                onResetData={() => {
                  setSearchFilter('');
                  closeDrawer();
                }}
                graph8Status={graph8Status}
                onRefreshGraph8={testGraph8Connection}
              />
            </DetailDrawer>

            {/* Presentation Demo Lab Drawer */}
            <DetailDrawer
              isOpen={drawer.isOpen && drawer.type === 'demo_lab'}
              onClose={closeDrawer}
              title="Presentation Demo Lab"
              subtitle="Trigger live simulated calls, high-priority replies & intent radar spikes"
              badge="Live Demo Control"
              badgeColor="bg-purple-50 text-purple-700 border-purple-200"
            >
              <DemoLabDrawer
                onSimulateCall={handleSimulateCall}
                onSimulateReply={handleSimulateReply}
                onSimulateSignal={handleSimulateSignal}
                onDelayedSimulateCall={handleDelayedSimulateCall}
                onDelayedSimulateReply={handleDelayedSimulateReply}
                onDelayedSimulateSignal={handleDelayedSimulateSignal}
                onClose={closeDrawer}
              />
            </DetailDrawer>
            </div>
          </div>
        </div>
      )}

      {/* Live Demo Notification Popup inside Expanded Companion */}
      {isExpanded && demoAlert && (
        <div className="fixed top-12 left-4 right-4 z-50 animate-slide-up">
          <LiveDemoNotification
            isEmbedded={true}
            alert={demoAlert}
            onDismiss={() => setDemoAlert(null)}
            onAcceptCall={(contact) => {
              setDemoAlert(null);
              openDrawer('call_modal', contact);
            }}
            onAcceptReply={(reply) => {
              setMainTab('replies');
              setDemoAlert(null);
              openDrawer('conversation_thread', reply);
            }}
            onAcceptSignal={(signal) => {
              setMainTab('signals');
              setDemoAlert(null);
              openDrawer('prospect_detail', signal);
            }}
          />
        </div>
      )}

      {/* App-level Action Confirmation Modal */}
      <ActionConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        actionType={confirmModal.actionType}
        targetName={confirmModal.targetName}
        targetSubtitle={confirmModal.targetSubtitle}
        destinationName={confirmModal.destinationName}
        consequenceWarning={confirmModal.consequenceWarning}
        onConfirm={confirmModal.onConfirm}
        onSuccessCallback={confirmModal.onSuccessCallback}
      />
    </div>
  );

  // In Web Browser (e.g. Vercel deployment): Render Desktop Simulator + Floating Interactive Companion
  if (!isElectron) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-slate-50 font-sans antialiased">
        <DesktopSimulator
          onSimulateCall={handleSimulateCall}
          onSimulateReply={handleSimulateReply}
          onSimulateSignal={handleSimulateSignal}
        />
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isExpanded
              ? 'bottom-3 right-3 sm:bottom-6 sm:right-6 w-[430px] h-[720px] max-h-[94vh] max-w-[96vw]'
              : 'bottom-6 right-6 flex flex-col items-end'
          }`}
        >
          {companionNode}
        </div>
      </div>
    );
  }

  // In Electron Desktop Mode: Pure frameless companion
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-transparent font-sans antialiased">
      {companionNode}
    </div>
  );
}
export default App;
