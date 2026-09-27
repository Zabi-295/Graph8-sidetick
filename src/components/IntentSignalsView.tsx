import React, { useState, useEffect, useCallback } from 'react';
import type { Graph8IntentSignal, IntentSignalLabel, DrawerType } from '../types';
import { fetchIntentSignals, executeAddToSequence } from '../services/graph8Client';
import { IntentSignalCard } from './cards/IntentSignalCard';
import { ActionConfirmModal } from './modals/ActionConfirmModal';
import {
  RotateCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface IntentSignalsViewProps {
  onOpenDrawer: (type: DrawerType, data: any) => void;
  initialFilter?: string;
  isCompact?: boolean;
}

export const IntentSignalsView: React.FC<IntentSignalsViewProps> = ({
  onOpenDrawer,
  initialFilter = '',
  isCompact = false
}) => {
  const [signals, setSignals] = useState<Graph8IntentSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | IntentSignalLabel>('ALL');
  const [searchQuery, setSearchQuery] = useState(initialFilter);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Consequential Action Confirmation Modal State
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

  const loadSignals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIntentSignals();
      setSignals(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load live signals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSignals();
  }, [loadSignals]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filter signals strictly for verified leads
  const verifiedSignals = signals.filter((sig) => {
    // Drop unverified leads (score < 60 or score 0)
    if (sig.graph8Confidence !== undefined && sig.graph8Confidence < 60) {
      return false;
    }
    // Drop leads with no valid contact method
    if (!sig.email && !sig.phone) {
      return false;
    }
    return true;
  });

  const filteredSignals = verifiedSignals.filter((sig) => {
    // Label filter
    if (activeFilter !== 'ALL' && sig.signalType !== activeFilter) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        sig.contactName.toLowerCase().includes(q) ||
        sig.company.toLowerCase().includes(q) ||
        sig.role.toLowerCase().includes(q) ||
        sig.signalDescription.toLowerCase().includes(q) ||
        sig.signalType.toLowerCase().includes(q) ||
        (sig.department && sig.department.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const getCountForType = (type: IntentSignalLabel) => {
    return verifiedSignals.filter((s) => s.signalType === type).length;
  };

  const handleAddToSequence = (signal: Graph8IntentSignal) => {
    setConfirmModal({
      isOpen: true,
      actionType: 'add_to_sequence',
      targetName: signal.contactName,
      targetSubtitle: `${signal.role} • ${signal.company}`,
      destinationName: 'High Intent Executive Outreach',
      consequenceWarning: `This will enroll ${signal.contactName} into active multi-channel outreach via Graph8. Stop on reply is enabled.`,
      onConfirm: async () => {
        return await executeAddToSequence({
          contactId: signal.crmContactId || signal.id,
          contactName: signal.contactName,
          role: signal.role,
          company: signal.company,
          email: signal.email,
          phone: signal.phone,
          sequenceName: 'High Intent Executive Outreach'
        });
      },
      onSuccessCallback: () => {
        showToast(`Action completed: ${signal.contactName} enrolled into High Intent Executive Outreach.`);
      }
    });
  };

  return (
    <div className={`space-y-2.5 text-slate-800 ${isCompact ? '' : 'p-1'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-2.5 rounded-xl bg-slate-900 text-white text-[11px] shadow-lg flex items-center justify-between animate-fade-in border border-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-[10px] ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Radar Status Banner */}
      <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </div>
          <div>
            <h3 className="text-[12px] font-bold text-slate-900 flex items-center gap-1.5">
              <span>Live Buyer Intent Signals</span>
            </h3>
            <p className="text-[10px] text-slate-500">
              {loading
                ? 'Syncing signals from Graph8 REST API...'
                : `${signals.length} active buyer signals surfaced across telemetry networks`}
            </p>
          </div>
        </div>

        <button
          onClick={loadSignals}
          disabled={loading}
          className="p-1.5 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-slate-50 text-slate-600 hover:text-purple-700 transition-colors disabled:opacity-50"
          title="Refresh Graph8 Signals"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-600' : ''}`} />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by contact, account, role, or keywords..."
          className="w-full bg-white border border-slate-200/90 rounded-xl pl-8 pr-3 py-1.5 text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-400 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Signal Type Filter Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] scrollbar-none select-none">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'ALL'
              ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
          }`}
        >
          <Filter className="w-2.5 h-2.5" />
          <span>All ({signals.length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('HIGH INTENT')}
          className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'HIGH INTENT'
              ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
          }`}
        >
          <span>High Intent ({getCountForType('HIGH INTENT')})</span>
        </button>

        <button
          onClick={() => setActiveFilter('PRICING INTEREST')}
          className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'PRICING INTEREST'
              ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
          }`}
        >
          <span>Pricing ({getCountForType('PRICING INTEREST')})</span>
        </button>

        <button
          onClick={() => setActiveFilter('BUYING SIGNAL')}
          className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'BUYING SIGNAL'
              ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
          }`}
        >
          <span>Buying ({getCountForType('BUYING SIGNAL')})</span>
        </button>

        <button
          onClick={() => setActiveFilter('RESEARCHING')}
          className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'RESEARCHING'
              ? 'bg-sky-50 text-sky-700 border-sky-300 font-bold shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
          }`}
        >
          <span>Researching ({getCountForType('RESEARCHING')})</span>
        </button>

        <button
          onClick={() => setActiveFilter('FOLLOW-UP')}
          className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'FOLLOW-UP'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
          }`}
        >
          <span>Follow-Up ({getCountForType('FOLLOW-UP')})</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && signals.length === 0 && (
        <div className="space-y-2 py-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-white border border-slate-200/90 animate-pulse space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-200" />
                  <div className="space-y-1">
                    <div className="w-24 h-3 bg-slate-200 rounded" />
                    <div className="w-16 h-2.5 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="w-20 h-4 bg-slate-100 rounded-full" />
              </div>
              <div className="w-full h-8 bg-slate-50 rounded" />
              <div className="grid grid-cols-4 gap-1 pt-1">
                <div className="h-6 bg-slate-100 rounded" />
                <div className="h-6 bg-slate-100 rounded" />
                <div className="h-6 bg-slate-100 rounded" />
                <div className="h-6 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Failed to load signals from Graph8</span>
            <p className="text-[10.5px] text-rose-700 mt-0.5">{error}</p>
            <button
              onClick={loadSignals}
              className="mt-1.5 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-semibold hover:bg-rose-500"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Signal Cards Feed */}
      <div className="space-y-2.5">
        {filteredSignals.map((signal) => (
          <IntentSignalCard
            key={signal.id}
            signal={signal}
            onViewProspect={(sig) => {
              onOpenDrawer('prospect_detail', {
                id: sig.id,
                contactName: sig.contactName,
                company: sig.company,
                role: sig.role,
                email: sig.email || `${(sig.firstName || 'contact').toLowerCase()}@${sig.companyDomain || 'account.com'}`,
                phone: sig.phone,
                avatar: sig.contactName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase(),
                intentReason: sig.signalDescription,
                signalBadge: {
                  label: sig.signalType,
                  score: sig.graph8Confidence !== undefined ? sig.graph8Confidence : 85,
                  badgeStyle: sig.signalType === 'HIGH INTENT' ? 'emerald' : 'purple'
                },
                details: {
                  companySize: sig.location || 'Enterprise',
                  industry: sig.department || 'B2B Software',
                  techStack: ['Graph8 Platform', 'REST API', 'CRM Integration'],
                  timelineEvents: [
                    {
                      time: sig.timestamp || 'Just now',
                      title: sig.signalType,
                      description: sig.signalDescription,
                      source: sig.source
                    }
                  ],
                  talkingPoints: [
                    sig.recommendedAction,
                    `Discuss expansion priorities for ${sig.role} at ${sig.company}`,
                    `Share technical integration overview with ${sig.contactName}`
                  ]
                }
              });
            }}
            onFindDecisionMaker={(sig) => {
              onOpenDrawer('quick_prospects', { filter: sig.company });
            }}
            onAddToSequence={handleAddToSequence}
            onCall={(sig) => {
              onOpenDrawer('call_modal', {
                contactName: sig.contactName,
                company: sig.company,
                role: sig.role,
                phone: sig.phone || '+1 (512) 840-2911'
              });
            }}
          />
        ))}

        {!loading && filteredSignals.length === 0 && (
          <div className="py-8 text-center px-4 rounded-xl bg-white border border-slate-200">
            <Filter className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <p className="text-[12px] font-bold text-slate-800">No intent signals match your filter</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Try adjusting your filter pills or search terms.
            </p>
            <button
              onClick={() => {
                setActiveFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-3 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-semibold border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Consequential Action Confirmation Modal */}
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
};
