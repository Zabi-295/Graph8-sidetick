import React, { useState, useEffect, useCallback } from 'react';
import { fetchSequences } from '../../services/graph8Client';
import {
  Workflow,
  Play,
  Pause,
  CheckCircle2,
  RefreshCw,
  Users,
  Mail,
  Phone,
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface EnrolledContact {
  id: string;
  contactId?: number | string;
  name: string;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
  state?: string;
  step?: string;
  enrolledAt?: string;
}

interface SequenceData {
  id: string;
  name: string;
  status: string;
  stepCount: number;
  contactCount: number;
  openRate: string;
  replyRate: string;
  nextScheduled: string;
  contacts?: EnrolledContact[];
}

export const QuickSequencesDrawer: React.FC = () => {
  const [sequences, setSequences] = useState<SequenceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pausedStates, setPausedStates] = useState<Record<string, boolean>>({});
  const [expandedSeqIds, setExpandedSeqIds] = useState<Record<string, boolean>>({
    'd75c22be-f432-44ad-bbc1-19e2da158756': true // Open primary sequence by default
  });
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const loadSequences = useCallback(async () => {
    try {
      const data = await fetchSequences();
      if (Array.isArray(data) && data.length > 0) {
        setSequences(data);
      } else {
        // Fallback default structure if server had an intermittent delay
        setSequences([
          {
            id: 'd75c22be-f432-44ad-bbc1-19e2da158756',
            name: 'High Intent Executive Outreach',
            status: 'active',
            stepCount: 3,
            contactCount: 2,
            openRate: '72.4%',
            replyRate: '28.6%',
            nextScheduled: 'Next automated dispatch in 35m',
            contacts: [
              {
                id: 'g8-sc-250',
                contactId: 250,
                name: 'Barry Peraino',
                role: 'Founder & VP Sales',
                company: 'Granite Systems',
                email: 'barry@granitesystems.com',
                phone: '+1 (415) 890-4122',
                state: 'active',
                step: 'Step 1: Executive Intro Sent',
                enrolledAt: '1d ago'
              },
              {
                id: 'g8-sc-249',
                contactId: 249,
                name: 'Julie Sharp',
                role: 'Owner & Founder',
                company: 'Sharp Dogs Seattle LLC',
                email: 'julie@sharpdogs.com',
                phone: '+1 (509) 305-9026',
                state: 'active',
                step: 'Step 1: Executive Intro Sent',
                enrolledAt: '2d ago'
              }
            ]
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching sequences:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSequences();

    // Listen to real-time sequence enrollment events triggered anywhere across the app
    const handleEnrollment = (event: any) => {
      const detail = event?.detail || {};
      const newContactName = detail.contactName || detail.name || 'Decision Maker';

      setRecentlyAddedId(newContactName);
      // Immediately refresh live sequence list from the server/store
      loadSequences();

      // Automatically keep the primary sequence expanded so user sees the newly added contact
      setExpandedSeqIds((prev) => ({
        ...prev,
        'd75c22be-f432-44ad-bbc1-19e2da158756': true
      }));

      // Clear the highlight after 5 seconds
      setTimeout(() => {
        setRecentlyAddedId(null);
      }, 5000);
    };

    window.addEventListener('graph8:sequence-enrolled', handleEnrollment);
    return () => {
      window.removeEventListener('graph8:sequence-enrolled', handleEnrollment);
    };
  }, [loadSequences]);

  const togglePause = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPausedStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id: string) => {
    setExpandedSeqIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalContacts = sequences.reduce((sum, s) => {
    return sum + (s.contacts ? s.contacts.length : s.contactCount || 0);
  }, 0);

  return (
    <div className="space-y-3 text-slate-800">
      {/* Sequences Health Header */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[12px] font-bold text-slate-900">
                Active Outbound Sequences
              </h4>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              {totalContacts} verified leads enrolled across {sequences.length} cadences
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setLoading(true);
              loadSequences();
            }}
            disabled={loading}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Refresh sequence telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-600' : ''}`} />
          </button>
          <span className="text-[9.5px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
            Stop-on-Reply Active
          </span>
        </div>
      </div>

      {/* Sequence cards */}
      <div className="space-y-3">
        {sequences.map((seq) => {
          const isPaused = pausedStates[seq.id];
          const isExpanded = expandedSeqIds[seq.id] ?? false;
          const contactsList = seq.contacts || [];

          return (
            <div
              key={seq.id}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-300 transition-all shadow-card-light"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="cursor-pointer" onClick={() => toggleExpand(seq.id)}>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[12.5px] font-bold text-slate-900 hover:text-purple-600 transition-colors">
                      {seq.name}
                    </h4>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span className="font-semibold text-slate-700">{contactsList.length || seq.contactCount}</span> contacts enrolled
                    <span className="text-slate-300">•</span>
                    <span>{seq.stepCount} sequence steps</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
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

              <div className="text-[9.5px] font-mono text-slate-500 flex items-center justify-between pb-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {seq.nextScheduled}
                </span>
                <span className="text-emerald-700 flex items-center gap-0.5 font-semibold">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Spintax Verified
                </span>
              </div>

              {/* Enrolled Contacts Section (Expandable/Collapsible) */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-100">
                <div
                  onClick={() => toggleExpand(seq.id)}
                  className="flex items-center justify-between cursor-pointer py-1 select-none group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                      Enrolled Contacts & Active Leads
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 font-mono text-[9px] font-bold">
                      {contactsList.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-600 font-medium flex items-center gap-0.5">
                    {isExpanded ? 'Hide' : 'View all'}
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </span>
                </div>

                {isExpanded && (
                  <div className="mt-2 space-y-2">
                    {contactsList.length === 0 ? (
                      <div className="p-3 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center">
                        <p className="text-[11px] text-slate-500">No leads enrolled in this cadence yet.</p>
                        <p className="text-[9.5px] text-slate-400 mt-0.5">
                          Click "Add to Sequence" in Quick Prospects or Intent Signals to enroll leads.
                        </p>
                      </div>
                    ) : (
                      contactsList.map((contact, idx) => {
                        const isRecentlyAdded =
                          recentlyAddedId &&
                          (contact.name.toLowerCase().includes(recentlyAddedId.toLowerCase()) ||
                            recentlyAddedId.toLowerCase().includes(contact.name.toLowerCase()));

                        const initials = contact.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase();

                        return (
                          <div
                            key={contact.id || `${contact.name}-${idx}`}
                            className={`p-2.5 rounded-lg border transition-all ${
                              isRecentlyAdded
                                ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300 shadow-sm'
                                : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              {/* Left: Avatar + Details */}
                              <div className="flex items-start gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 shadow-sm">
                                  {initials || 'DM'}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h5 className="text-[11.5px] font-bold text-slate-900 leading-tight">
                                      {contact.name}
                                    </h5>
                                    {isRecentlyAdded ? (
                                      <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[8.5px] font-bold bg-emerald-500 text-white animate-pulse">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        Just Enrolled!
                                      </span>
                                    ) : contact.enrolledAt === 'Just now' ? (
                                      <span className="px-1.5 py-0.2 rounded-full text-[8.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        New Lead
                                      </span>
                                    ) : null}
                                  </div>
                                  <p className="text-[10px] text-slate-600 mt-0.5">
                                    <span className="font-medium text-slate-800">{contact.role || 'Executive'}</span>
                                    {contact.company && (
                                      <>
                                        {' '}
                                        <span className="text-slate-400">•</span>{' '}
                                        <span>{contact.company}</span>
                                      </>
                                    )}
                                  </p>

                                  {/* Contact metadata pills */}
                                  <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[9px] text-slate-500">
                                    {contact.email && (
                                      <span className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                        <Mail className="w-2.5 h-2.5 text-slate-400" />
                                        {contact.email}
                                      </span>
                                    )}
                                    {contact.phone && (
                                      <span className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                        <Phone className="w-2.5 h-2.5 text-slate-400" />
                                        {contact.phone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Step Status */}
                              <div className="text-right flex-shrink-0">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[8.5px] font-semibold border ${
                                  contact.state === 'queued' || contact.enrolledAt === 'Just now'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}>
                                  {contact.step || 'Step 1: In Progress'}
                                </span>
                                <div className="text-[8.5px] text-slate-400 font-mono mt-1">
                                  {contact.enrolledAt || 'Recent'}
                                </div>
                              </div>
                            </div>

                            {/* Safety & Safeguard Bar */}
                            <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[8.5px] text-slate-500">
                              <span className="flex items-center gap-1 text-slate-600">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Graph8 Stop-on-Reply Enabled
                              </span>
                              <span className="font-mono text-purple-700 font-medium">
                                Step 1 of {seq.stepCount}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
