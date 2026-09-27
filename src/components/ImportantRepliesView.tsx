import React, { useState, useEffect, useCallback } from 'react';
import type { Graph8ImportantReply, ReplyCategory, DrawerType } from '../types';
import { fetchImportantReplies, executeAddToSequence } from '../services/graph8Client';
import { ImportantReplyCard } from './cards/ImportantReplyCard';
import { ActionConfirmModal } from './modals/ActionConfirmModal';
import {
  RotateCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Inbox
} from 'lucide-react';

interface ImportantRepliesViewProps {
  onOpenDrawer: (type: DrawerType, data: any) => void;
  initialFilter?: string;
  isCompact?: boolean;
}

export const ImportantRepliesView: React.FC<ImportantRepliesViewProps> = ({
  onOpenDrawer,
  initialFilter = '',
  isCompact = false
}) => {
  const [replies, setReplies] = useState<Graph8ImportantReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | ReplyCategory>('ALL');
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

  const loadReplies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchImportantReplies();
      setReplies(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load replies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReplies();
  }, [loadReplies]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filter replies
  const filteredReplies = replies.filter((reply) => {
    // Category filter
    if (activeFilter !== 'ALL' && reply.classification !== activeFilter) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        reply.contactName.toLowerCase().includes(q) ||
        reply.company.toLowerCase().includes(q) ||
        reply.role.toLowerCase().includes(q) ||
        reply.preview.toLowerCase().includes(q) ||
        reply.classification.toLowerCase().includes(q) ||
        reply.channel.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const tier1Count = replies.filter((r) => r.priorityTier === 1).length;
  const tier2Count = replies.filter((r) => r.priorityTier === 2).length;

  const handleOpenConversation = (reply: Graph8ImportantReply) => {
    onOpenDrawer('conversation_thread', reply);
  };

  const handleReply = (reply: Graph8ImportantReply) => {
    onOpenDrawer('reply_composer', {
      id: reply.id,
      contactName: reply.contactName,
      company: reply.company,
      role: reply.role,
      email: reply.email,
      previewMessage: reply.preview,
      fullMessage: reply.fullMessage,
      threadCount: 2,
      receivedTime: reply.receivedTime,
      aiClassification: {
        label: `${reply.classificationSource}: ${reply.classification}`,
        category: reply.classification === 'Wants Demo' ? 'demo_request' : reply.classification === 'Pricing Question' ? 'pricing' : 'positive',
        sentimentScore: reply.priorityTier === 1 ? 0.95 : 0.7
      },
      suggestedReplies: reply.suggestedReplies || [
        {
          id: 'def-1',
          title: 'Quick Response',
          subject: `Re: Follow up with ${reply.company}`,
          body: `Hi ${reply.contactName},\n\nThank you for getting back to us. ${reply.suggestedNextAction}.\n\nBest,\nTeam`,
          tone: 'Confident & Direct'
        }
      ]
    });
  };

  const handleCall = (reply: Graph8ImportantReply) => {
    onOpenDrawer('call_modal', {
      contactName: reply.contactName,
      company: reply.company,
      role: reply.role,
      phone: reply.phone || '+1 (512) 840-2911'
    });
  };

  const handleBookMeeting = (reply: Graph8ImportantReply) => {
    onOpenDrawer('book_meeting', {
      contactName: reply.contactName,
      company: reply.company,
      role: reply.role,
      email: reply.email
    });
  };

  const handleAddToSequence = (reply: Graph8ImportantReply) => {
    setConfirmModal({
      isOpen: true,
      actionType: 'add_to_sequence',
      targetName: reply.contactName,
      targetSubtitle: `${reply.role} • ${reply.company}`,
      destinationName: 'High Intent Executive Outreach',
      consequenceWarning: `This will enroll ${reply.contactName} into automated follow-up outreach via Graph8. Stop on reply is enabled.`,
      onConfirm: async () => {
        return await executeAddToSequence({
          contactId: reply.crmContactId || reply.id,
          contactName: reply.contactName,
          sequenceName: 'High Intent Executive Outreach'
        });
      },
      onSuccessCallback: () => {
        showToast(`Action completed: ${reply.contactName} enrolled into High Intent Executive Outreach.`);
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

      {/* Priority Summary Banner */}
      <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 flex-shrink-0">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[12px] font-bold text-slate-900 flex items-center gap-1.5">
              <span>Important Buyer Replies</span>
              <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-bold">
                Triage
              </span>
            </h3>
            <p className="text-[10px] text-slate-500">
              {loading ? (
                'Connecting to Graph8 inbox...'
              ) : (
                <span>
                  <strong className="text-emerald-700 font-semibold">{tier1Count} Interested</strong> •{' '}
                  <strong className="text-amber-700 font-semibold">{tier2Count} Need Attention</strong> • No noise
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={loadReplies}
          disabled={loading}
          className="p-1.5 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-slate-50 text-slate-600 hover:text-purple-700 transition-colors disabled:opacity-50"
          title="Refresh Inbox Replies"
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
          placeholder="Filter replies by contact, message, or channel..."
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

      {/* Filter Pills */}
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
          <span>All ({replies.length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('Wants Demo')}
          className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'Wants Demo'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
          }`}
        >
          <span>Wants Demo ({replies.filter((r) => r.classification === 'Wants Demo').length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('Interested')}
          className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'Interested'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
          }`}
        >
          <span>Interested ({replies.filter((r) => r.classification === 'Interested').length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('Pricing Question')}
          className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'Pricing Question'
              ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
          }`}
        >
          <span>Pricing ({replies.filter((r) => r.classification === 'Pricing Question').length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('Needs Human')}
          className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'Needs Human'
              ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
          }`}
        >
          <span>Needs Human ({replies.filter((r) => r.classification === 'Needs Human').length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('Follow Up')}
          className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'Follow Up'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
          }`}
        >
          <span>Follow Up ({replies.filter((r) => r.classification === 'Follow Up').length})</span>
        </button>

        <button
          onClick={() => setActiveFilter('Negative/Not Interested')}
          className={`px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
            activeFilter === 'Negative/Not Interested'
              ? 'bg-slate-200 text-slate-800 border-slate-300 font-bold shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
          }`}
        >
          <span>Negative ({replies.filter((r) => r.classification === 'Negative/Not Interested').length})</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && replies.length === 0 && (
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
              <div className="grid grid-cols-5 gap-1 pt-1">
                <div className="h-6 bg-slate-100 rounded" />
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
            <span className="font-semibold block">Failed to load replies from Graph8</span>
            <p className="text-[10.5px] text-rose-700 mt-0.5">{error}</p>
            <button
              onClick={loadReplies}
              className="mt-1.5 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-semibold hover:bg-rose-500"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Prioritized Replies Feed */}
      <div className="space-y-2.5">
        {filteredReplies.map((reply) => (
          <ImportantReplyCard
            key={reply.id}
            reply={reply}
            onOpenConversation={handleOpenConversation}
            onReply={handleReply}
            onCall={handleCall}
            onBookMeeting={handleBookMeeting}
            onAddToSequence={handleAddToSequence}
          />
        ))}

        {!loading && filteredReplies.length === 0 && (
          <div className="py-8 text-center px-4 rounded-xl bg-white border border-slate-200">
            <Filter className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <p className="text-[12px] font-bold text-slate-800">No replies match your criteria</p>
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
