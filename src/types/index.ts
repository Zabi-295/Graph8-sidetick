export type IntentSignalLabel = 
  | 'HIGH INTENT' 
  | 'RESEARCHING' 
  | 'PRICING INTEREST' 
  | 'BUYING SIGNAL' 
  | 'FOLLOW-UP';

export interface Graph8IntentSignal {
  id: string;
  crmContactId?: number;
  contactName: string;
  firstName?: string;
  lastName?: string;
  company: string;
  companyDomain?: string;
  role: string;
  department?: string;
  seniority?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  location?: string;
  signalType: IntentSignalLabel;
  signalDescription: string;
  timestamp?: string;
  graph8Confidence?: number; // Only present when Graph8 actually returned confidence_score
  recommendedAction: string;
  source: string;
}

export interface HighIntentCardData {
  id: string;
  contactName: string;
  company: string;
  role: string;
  email: string;
  phone?: string;
  avatar?: string;
  intentReason: string;
  signalBadge: {
    label: string;
    score: number;
    badgeStyle: 'emerald' | 'blue' | 'purple' | 'amber';
  };
  details: {
    companySize: string;
    industry: string;
    techStack: string[];
    timelineEvents: Array<{
      time: string;
      title: string;
      description: string;
      source: string;
    }>;
    talkingPoints: string[];
  };
}

export interface InterestedReplyCardData {
  id: string;
  contactName: string;
  company: string;
  role: string;
  email: string;
  avatar?: string;
  previewMessage: string;
  fullMessage: string;
  threadCount: number;
  receivedTime: string;
  aiClassification: {
    label: string;
    category: 'demo_request' | 'pricing' | 'integration' | 'positive';
    sentimentScore: number;
  };
  suggestedReplies: Array<{
    id: string;
    title: string;
    subject: string;
    body: string;
    tone: 'Confident & Direct' | 'Consultative' | 'Quick Cal Link';
  }>;
}

export type ReplyCategory = 
  | 'Interested' 
  | 'Wants Demo' 
  | 'Pricing Question' 
  | 'Follow Up' 
  | 'Needs Human' 
  | 'Negative/Not Interested';

export interface Graph8ImportantReply {
  id: string;
  crmContactId?: number;
  contactName: string;
  firstName?: string;
  lastName?: string;
  company: string;
  companyDomain?: string;
  role: string;
  email: string;
  phone?: string;
  channel: 'Email' | 'LinkedIn' | 'SMS';
  preview: string;
  fullMessage: string;
  receivedTime: string;
  classification: ReplyCategory;
  classificationSource: 'Graph8 AI' | 'AI suggestion';
  priorityTier: 1 | 2 | 3; // 1: Interested/Demo/Pricing, 2: Needs Human/Follow Up, 3: Negative/Other
  suggestedNextAction: string;
  unread: boolean;
  suggestedReplies?: Array<{
    id: string;
    title: string;
    subject: string;
    body: string;
    tone: string;
  }>;
}

export interface FollowUpCardData {
  id: string;
  contactName: string;
  company: string;
  role: string;
  email: string;
  avatar?: string;
  followUpReason: string;
  daysStalled: number;
  dealSize?: string;
  stage?: string;
  lastTouchType: 'email' | 'call' | 'demo' | 'proposal';
  lastTouchDate: string;
  suggestedNudge: string;
  socialSignals: string;
}

export type QuickActionType = 'prospects' | 'signals' | 'inbox' | 'sequences';

export interface QuickActionItem {
  id: QuickActionType;
  label: string;
  shortLabel: string;
  badge?: number;
  badgeStyle?: string;
  iconName: string;
}

export interface CommandItem {
  id: string;
  title: string;
  category: 'prospects' | 'signals' | 'inbox' | 'action';
  action: () => void;
  badge?: string;
  shortcut?: string;
}

export type DrawerType =
  | 'prospect_detail'
  | 'call_modal'
  | 'book_meeting'
  | 'reply_composer'
  | 'conversation_thread'
  | 'followup_action'
  | 'quick_prospects'
  | 'quick_signals'
  | 'quick_inbox'
  | 'quick_sequences'
  | 'settings'
  | 'demo_lab'
  | null;

export interface DrawerState {
  isOpen: boolean;
  type: DrawerType;
  data?: any;
}
