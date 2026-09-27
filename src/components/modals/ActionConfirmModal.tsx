import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Send,
  Phone,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';

export type ActionModalType = 'add_to_sequence' | 'initiate_call';

export interface ActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionModalType;
  targetName: string;
  targetSubtitle?: string;
  destinationName: string;
  consequenceWarning?: string;
  onConfirm: () => Promise<{
    success: boolean;
    message?: string;
    error?: string;
    status?: string;
    id?: string;
    contactsAffected?: number;
  }>;
  onSuccessCallback?: (result: any) => void;
}

export const ActionConfirmModal: React.FC<ActionConfirmModalProps> = ({
  isOpen,
  onClose,
  actionType,
  targetName,
  targetSubtitle,
  destinationName,
  consequenceWarning,
  onConfirm,
  onSuccessCallback
}) => {
  const [stage, setStage] = useState<'confirming' | 'executing' | 'success' | 'error'>('confirming');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [resultDetails, setResultDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setStage('confirming');
      setResultMessage('');
      setResultDetails(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  // Handle keyboard shortcuts (Enter to confirm, Esc to cancel)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (stage !== 'executing') {
          onClose();
        }
      } else if (e.key === 'Enter') {
        if (stage === 'confirming') {
          handleExecute();
        } else if (stage === 'success') {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, stage]);

  if (!isOpen) return null;

  const handleExecute = async () => {
    setStage('executing');
    try {
      const res = await onConfirm();
      if (res.success) {
        setStage('success');
        setResultMessage(res.message || 'Action completed');
        setResultDetails(res);
        if (onSuccessCallback) {
          onSuccessCallback(res);
        }
      } else {
        setStage('error');
        setErrorMessage(res.error || res.message || 'The action could not be completed.');
      }
    } catch (err: any) {
      setStage('error');
      setErrorMessage(err?.message || 'Unexpected network or server error.');
    }
  };

  const isSequence = actionType === 'add_to_sequence';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in select-none">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[380px] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-scale-up"
      >
        {/* Top Header Accent */}
        <div
          className="h-1.5 w-full"
          style={{
            background: isSequence
              ? 'linear-gradient(90deg, #9b51e0, #ff2a85)'
              : 'linear-gradient(90deg, #00d2ff, #9b51e0)'
          }}
        />

        {/* Close Button */}
        {stage !== 'executing' && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="p-4 space-y-3.5">
          {/* STAGE 1: CONFIRMING */}
          {stage === 'confirming' && (
            <>
              {/* Action Category Badge */}
              <div className="flex items-center gap-1.5">
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                  {isSequence ? (
                    <Send className="w-3.5 h-3.5 text-purple-600" />
                  ) : (
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                  )}
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-purple-700">
                  {isSequence ? 'Graph8 Sequence Enrollment' : 'Graph8 Voice Dialer'}
                </span>
              </div>

              {/* Consequential Question */}
              <div>
                <h3 className="text-[14px] font-bold text-slate-900 leading-snug">
                  {isSequence
                    ? `Add ${targetName} to ${destinationName}?`
                    : `Start direct call to ${targetName}?`}
                </h3>
                {targetSubtitle && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{targetSubtitle}</p>
                )}
              </div>

              {/* Action Transfer Visual Card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-2">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold">{targetName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-purple-700 truncate max-w-[170px]" title={destinationName}>
                    {destinationName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authenticated via Graph8 REST API (Active Org)</span>
                </div>
              </div>

              {/* Warning Notice */}
              <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-[10.5px] flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">
                  {consequenceWarning ||
                    (isSequence
                      ? 'This enrolls the contact into automated outreach messages. Stop on reply is enabled.'
                      : 'This will dispatch an AI voice call to the prospect’s registered number.')}
                </span>
              </div>

              {/* Buttons: [Cancel] and [Confirm] */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-[11.5px] font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecute}
                  className="flex-1 py-2 px-3 rounded-xl text-white text-[11.5px] font-semibold shadow-sm hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                  style={{
                    background: 'linear-gradient(135deg, #00d2ff 0%, #9b51e0 50%, #ff2a85 100%)'
                  }}
                >
                  <span>Confirm</span>
                </button>
              </div>
            </>
          )}

          {/* STAGE 2: EXECUTING */}
          {stage === 'executing' && (
            <div className="py-6 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
              <div>
                <h4 className="text-[13px] font-bold text-slate-900">Executing Graph8 Action...</h4>
                <p className="text-[10.5px] text-slate-500 mt-1">
                  Communicating securely with Graph8 REST API
                </p>
              </div>
            </div>
          )}

          {/* STAGE 3: SUCCESS */}
          {stage === 'success' && (
            <div className="py-2 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <h4 className="text-[13.5px] font-bold text-slate-900">Action completed</h4>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900 space-y-1.5">
                <p className="font-medium">{resultMessage}</p>
                {resultDetails?.status && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-800 pt-1 border-t border-emerald-200/60">
                    <span>Status: <span className="font-bold">{resultDetails.status}</span></span>
                    {resultDetails?.sequenceId && (
                      <span>• Seq ID: {resultDetails.sequenceId.slice(0, 8)}...</span>
                    )}
                    {resultDetails?.sessionId && (
                      <span>• Session: {resultDetails.sessionId.slice(0, 8)}...</span>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11.5px] font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* STAGE 4: ERROR */}
          {stage === 'error' && (
            <div className="py-2 space-y-3">
              <div className="flex items-center gap-2 text-rose-700">
                <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <h4 className="text-[13.5px] font-bold text-slate-900">Action could not complete</h4>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-[11px] text-rose-900">
                <p className="font-medium leading-relaxed">{errorMessage}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-[11.5px] font-semibold hover:bg-slate-50 transition-colors"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={handleExecute}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11.5px] font-semibold transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
