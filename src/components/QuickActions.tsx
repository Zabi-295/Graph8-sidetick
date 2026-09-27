import React, { useState, useEffect, useCallback } from 'react';
import { UserSearch, Activity, Inbox, Workflow } from 'lucide-react';
import type { DrawerType } from '../types';
import { fetchSequences, fetchIntentSignals, fetchImportantReplies } from '../services/graph8Client';

interface QuickActionsProps {
  onOpenDrawer: (type: DrawerType, data?: any) => void;
  activeDrawerType?: DrawerType;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenDrawer,
  activeDrawerType
}) => {
  const [sequenceCount, setSequenceCount] = useState<number>(4);
  const [signalsCount, setSignalsCount] = useState<number>(4);
  const [inboxCount, setInboxCount] = useState<number>(2);
  const [prospectsCount] = useState<number>(4);

  const loadTelemetryCounts = useCallback(async () => {
    try {
      const seqs = await fetchSequences();
      if (Array.isArray(seqs) && seqs.length > 0) {
        // Enrolled contacts in primary cadence or total across active sequences
        const activeCadenceContacts = seqs[0]?.contacts?.length;
        const totalEnrolled = typeof activeCadenceContacts === 'number'
          ? activeCadenceContacts
          : seqs.reduce((sum, s) => sum + (s.contacts ? s.contacts.length : (s.contactCount || 0)), 0);

        if (totalEnrolled > 0) {
          setSequenceCount(totalEnrolled);
        }
      }
    } catch (e) {
      console.warn('Failed to refresh sequence count:', e);
    }

    try {
      const sigs = await fetchIntentSignals();
      if (Array.isArray(sigs) && sigs.length > 0) {
        setSignalsCount(sigs.length);
      }
    } catch {}

    try {
      const reps = await fetchImportantReplies();
      if (Array.isArray(reps) && reps.length > 0) {
        setInboxCount(reps.length);
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadTelemetryCounts();

    // Listen to real-time sequence enrollment events triggered anywhere across the app
    const handleEnrollment = () => {
      setSequenceCount((prev) => prev + 1);
      loadTelemetryCounts();
    };

    window.addEventListener('graph8:sequence-enrolled', handleEnrollment);
    return () => {
      window.removeEventListener('graph8:sequence-enrolled', handleEnrollment);
    };
  }, [loadTelemetryCounts]);

  const actions = [
    {
      id: 'quick_prospects' as DrawerType,
      label: 'Find Prospects',
      icon: UserSearch,
      count: prospectsCount,
      badgeColor: 'text-sky-700 bg-sky-50 border-sky-200',
      iconColor: 'text-sky-500'
    },
    {
      id: 'quick_signals' as DrawerType,
      label: 'Intent Signals',
      icon: Activity,
      count: signalsCount,
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-500',
      hasPulse: true
    },
    {
      id: 'quick_inbox' as DrawerType,
      label: 'Inbox',
      icon: Inbox,
      count: inboxCount,
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
      iconColor: 'text-purple-500'
    },
    {
      id: 'quick_sequences' as DrawerType,
      label: 'Sequences',
      icon: Workflow,
      count: sequenceCount,
      badgeColor: 'text-pink-700 bg-pink-50 border-pink-200',
      iconColor: 'text-pink-500'
    }
  ];

  return (
    <div className="px-3.5 pb-2.5">
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100/70 border border-slate-200/80">
        {actions.map((act) => {
          const Icon = act.icon;
          const isActive = activeDrawerType === act.id;
          return (
            <button
              key={act.id}
              onClick={() => onOpenDrawer(isActive ? null : act.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-center transition-all duration-150 relative group ${
                isActive
                  ? 'bg-white shadow-sm border border-purple-300 text-purple-900 font-semibold'
                  : 'hover:bg-white/80 text-slate-600 hover:text-slate-900 border border-transparent'
              }`}
            >
              <div className="relative mb-1">
                <Icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${isActive ? 'text-purple-600' : act.iconColor}`} />
                {act.hasPulse && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                )}
              </div>
              
              <span className="text-[10px] font-medium leading-tight truncate w-full px-0.5">
                {act.label}
              </span>

              {act.count !== undefined && (
                <span className={`text-[8.5px] font-mono px-1 py-0.2 rounded-full border mt-0.5 font-semibold ${act.badgeColor}`}>
                  {act.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
