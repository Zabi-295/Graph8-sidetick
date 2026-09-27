import React, { useState } from 'react';
import type { HighIntentCardData } from '../../types';
import { Calendar, Clock, Link as LinkIcon, Check, Send, Video } from 'lucide-react';

interface BookingDrawerProps {
  data: HighIntentCardData;
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({ data }) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('thu-230');
  const [meetingType, setMeetingType] = useState<'15m' | '30m'>('15m');
  const [copiedLink, setCopiedLink] = useState(false);
  const [booked, setBooked] = useState(false);

  const slots = [
    { id: 'thu-230', day: 'Thursday, Oct 1', time: '2:30 PM - 2:45 PM PT' },
    { id: 'thu-400', day: 'Thursday, Oct 1', time: '4:00 PM - 4:15 PM PT' },
    { id: 'fri-100', day: 'Friday, Oct 2', time: '10:00 AM - 10:15 AM PT' },
    { id: 'fri-140', day: 'Friday, Oct 2', time: '1:30 PM - 1:45 PM PT' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://cal.graph8.io/jahan/${meetingType}?guest=${encodeURIComponent(data.email)}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendInvite = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return (
    <div className="space-y-3.5 text-slate-800">
      {/* Target Attendee */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-[12.5px] font-bold text-slate-900">
            {data.contactName}
          </h4>
          <p className="text-[10.5px] text-slate-500">
            {data.role} • {data.company}
          </p>
          <span className="text-[10.5px] font-mono text-purple-600 font-medium">
            {data.email}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
            Auto-Timezone (US/Central)
          </span>
        </div>
      </div>

      {/* Meeting Type Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMeetingType('15m')}
          className={`p-2.5 rounded-xl border text-left transition-all ${
            meetingType === '15m'
              ? 'bg-purple-50/70 border-purple-300 text-purple-950 shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[11.5px] font-bold mb-0.5">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span>15-min Architecture Sync</span>
          </div>
          <p className="text-[10px] text-slate-500">
            High-intent qualification & technical alignment
          </p>
        </button>

        <button
          onClick={() => setMeetingType('30m')}
          className={`p-2.5 rounded-xl border text-left transition-all ${
            meetingType === '30m'
              ? 'bg-purple-50/70 border-purple-300 text-purple-950 shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[11.5px] font-bold mb-0.5">
            <Video className="w-3.5 h-3.5 text-pink-600" />
            <span>30-min Full Platform Demo</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Custom topology walkthrough with solutions engineer
          </p>
        </button>
      </div>

      {/* Available Slots */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Optimal Open Slots</span>
          </div>
          <span className="text-[9.5px] font-mono text-slate-400">Google Calendar Synced</span>
        </div>

        <div className="space-y-1.5">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-[11px] border transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold shadow-2xs'
                    : 'bg-slate-50/80 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="font-semibold">{slot.day}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{slot.time}</span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleSendInvite}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11.5px] font-semibold shadow-sm transition-colors"
        >
          {booked ? <Check className="w-4 h-4 text-white" /> : <Send className="w-3.5 h-3.5" />}
          <span>{booked ? 'Calendar Invite Sent to Elena!' : 'Send Direct Calendar Invitation'}</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors shadow-2xs"
        >
          {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <LinkIcon className="w-3 h-3 text-slate-400" />}
          <span>{copiedLink ? 'Personalized Cal Link Copied!' : 'Copy Fast Booking Link'}</span>
        </button>
      </div>
    </div>
  );
};
