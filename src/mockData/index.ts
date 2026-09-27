import type { HighIntentCardData, InterestedReplyCardData, FollowUpCardData } from '../types';

export const mockHighIntentCard: HighIntentCardData = {
  id: 'intent-101',
  contactName: 'Elena Rostova',
  company: 'ApexData.io',
  role: 'VP of Infrastructure',
  email: 'elena.rostova@apexdata.io',
  phone: '+1 (512) 840-2911',
  avatar: 'ER',
  intentReason: 'Visited Pricing 4x in 48h; viewed Enterprise SLA specs & Kafka connector',
  signalBadge: {
    label: 'High Intent • 94% score',
    score: 94,
    badgeStyle: 'emerald'
  },
  details: {
    companySize: '150-250 employees (Series B • $32M raised)',
    industry: 'Data Infrastructure & Real-Time Analytics',
    techStack: ['ClickHouse', 'Apache Kafka', 'PostgreSQL', 'Kubernetes', 'Go', 'AWS'],
    timelineEvents: [
      {
        time: 'Today, 2:18 PM',
        title: 'High-Velocity Pricing Visit',
        description: 'Spent 4m 12s on /pricing/enterprise; toggled 50M+ events slider and SOC2 add-on.',
        source: 'Graph8 Radar Web Pixel'
      },
      {
        time: 'Yesterday, 6:45 PM',
        title: 'SDK Documentation Deep Dive',
        description: 'Read Python & Go async ingestion guides with 2 colleagues from Austin subnet.',
        source: 'Developer Docs Telemetry'
      },
      {
        time: 'Sep 24, 11:10 AM',
        title: 'Hiring Signal: Staff Data Pipeline Engineer',
        description: 'Posted job requiring experience migrating from legacy batch to low-latency stream.',
        source: 'Graph8 Talent Radar'
      }
    ],
    talkingPoints: [
      'They run ClickHouse self-hosted and are facing partitioning & replica lag at 35k events/sec.',
      'Elena recently presented at DataEngConf about reducing p99 latency to sub-20ms.',
      'Key buying decision window ends this quarter before their migration freeze in November.'
    ]
  }
};

export const mockInterestedReplyCard: InterestedReplyCardData = {
  id: 'reply-204',
  contactName: 'Marcus Vance',
  company: 'HyperScale Labs',
  role: 'Head of Growth Engineering',
  email: 'marcus.vance@hyperscalelabs.com',
  avatar: 'MV',
  previewMessage: 'Caught the demo on async pipeline sync. We are migrating next month—can you share security docs and pricing for 25 seats?',
  fullMessage: `Hey Jahan,

Caught the demo on async pipeline sync you sent over on Tuesday. Really impressed by the multi-tenant stream isolation.

We are officially migrating away from our homegrown pipeline next month. Can you share the latest SOC2 Type II report, security architecture whitepaper, and a quote for ~25 enterprise seats?

If you have 15 minutes Thursday afternoon, happy to jump on a quick call with our lead architect.

Best,
Marcus Vance
Head of Growth Engineering | HyperScale Labs`,
  threadCount: 3,
  receivedTime: '14m ago',
  aiClassification: {
    label: 'Interested • Demo Request',
    category: 'demo_request',
    sentimentScore: 98
  },
  suggestedReplies: [
    {
      id: 'rep-1',
      title: 'Direct + Booking Link + SOC2',
      tone: 'Confident & Direct',
      subject: 'Re: Async pipeline sync demo + Security docs for HyperScale Labs',
      body: `Hi Marcus,

Thrilled to hear the demo resonated! You're timing this migration perfectly.

Attached is our SOC2 Type II compliance summary and security whitepaper. For 25 seats, our Enterprise tier includes dedicated streaming brokers and 99.99% uptime SLA ($1,850/mo billed annually).

I'd love to loop in our lead solutions engineer for 15 minutes this Thursday. Does 2:30 PM PT or 4:00 PM PT work on your end? Alternatively, grab whatever slot fits your team here: https://cal.graph8.io/jahan/15min

Looking forward to speaking,
Jahan`
    },
    {
      id: 'rep-2',
      title: 'Consultative Technical Walkthrough',
      tone: 'Consultative',
      subject: 'Re: HyperScale Labs migration & architecture specs',
      body: `Hi Marcus,

Appreciate the note! Multi-tenant stream isolation was designed specifically for growth teams running high-throughput experiments without cross-contamination.

I have our security docs and the 25-seat tier breakdown ready to send over. Since your lead architect will be joining Thursday, would it be helpful if I prepared a 1-page reference topology based on your current tech stack?

Let me know what time Thursday works best, or book directly via: https://cal.graph8.io/jahan/15min

Best,
Jahan`
    }
  ]
};

export const mockFollowUpCard: FollowUpCardData = {
  id: 'followup-309',
  contactName: 'Sarah Lin',
  company: 'OmniStack AI',
  role: 'Director of Revenue Ops',
  email: 's.lin@omnistack.ai',
  avatar: 'SL',
  followUpReason: 'Proposal sent 3 days ago ($48k ARR). No reply since contract review email. 2 key stakeholders active on LinkedIn.',
  daysStalled: 3,
  dealSize: '$48,000 ARR',
  stage: 'Contract & Legal Review',
  lastTouchType: 'proposal',
  lastTouchDate: '3 days ago (Tue)',
  suggestedNudge: 'Send non-pushy touchpoint offering standard mutual NDA and redline coordination to unblock legal.',
  socialSignals: 'Sarah & CTO David Kim both engaged with modern data stack infrastructure posts in the last 6 hours.'
};

export const mockProspectsList = [
  {
    id: 'p-1',
    name: 'Devon Miles',
    company: 'NeuralFlow Inc',
    role: 'Chief Technology Officer',
    location: 'San Francisco, CA',
    intentScore: 91,
    employees: '85',
    verifiedEmail: 'devon@neuralflow.ai',
    recentSignal: 'Series A announced ($14M), expanding data engineering team'
  },
  {
    id: 'p-2',
    name: 'Claire Beauchamp',
    company: 'Synthetix Data',
    role: 'VP of Data Architecture',
    location: 'New York, NY',
    intentScore: 88,
    employees: '320',
    verifiedEmail: 'c.beauchamp@synthetix.com',
    recentSignal: 'Visited Pricing 3x, evaluated API rate limits'
  },
  {
    id: 'p-3',
    name: 'Tariq Al-Mansoor',
    company: 'VectorScale Cloud',
    role: 'Head of Engineering',
    location: 'Austin, TX',
    intentScore: 84,
    employees: '140',
    verifiedEmail: 'tariq@vectorscale.cloud',
    recentSignal: 'Searching for Kafka alternatives on G2 and Google'
  },
  {
    id: 'p-4',
    name: 'Ananya Sharma',
    company: 'NexusLogic',
    role: 'Director of DevOps',
    location: 'Seattle, WA',
    intentScore: 79,
    employees: '210',
    verifiedEmail: 'a.sharma@nexuslogic.io',
    recentSignal: 'Mentioned real-time ingestion in recent conference keynote'
  }
];

export const mockIntentSignals = [
  {
    id: 'sig-1',
    company: 'ApexData.io',
    type: 'Pricing Surge',
    score: 94,
    detail: '4 page views on /pricing/enterprise, 2 on /sla-specs in 48h',
    badge: 'Urgent',
    time: '8m ago'
  },
  {
    id: 'sig-2',
    company: 'CloudMatrix Systems',
    type: 'Competitor Evaluation',
    score: 87,
    detail: 'Comparing Graph8 vs Segment and Rudderstack on vendor review site',
    badge: 'Competitive',
    time: '24m ago'
  },
  {
    id: 'sig-3',
    company: 'FinPulse Technologies',
    type: 'Executive Hiring',
    score: 82,
    detail: 'Hired new VP of Growth Engineering from Stripe',
    badge: 'Hiring',
    time: '1h ago'
  },
  {
    id: 'sig-4',
    company: 'OmniStack AI',
    type: 'Security Document Download',
    score: 90,
    detail: 'Legal team accessed SOC2 compliance report via shared link',
    badge: 'Deal Progress',
    time: '2h ago'
  }
];

export const mockInboxThreads = [
  {
    id: 'inb-1',
    contact: 'Marcus Vance',
    company: 'HyperScale Labs',
    preview: 'We are migrating next month—can you share security docs and pricing for 25 seats?',
    classification: 'Demo Request',
    confidence: '98%',
    time: '14m ago',
    unread: true
  },
  {
    id: 'inb-2',
    contact: 'Kavita Patel',
    company: 'ZetaMetric',
    preview: 'Quick question: does the SDK support bidirectional CDC streaming from MongoDB Atlas?',
    classification: 'Technical Inquiry',
    confidence: '94%',
    time: '1h ago',
    unread: false
  },
  {
    id: 'inb-3',
    contact: 'Liam O’Connor',
    company: 'StreamVolt',
    preview: 'Let’s lock in a demo for next Tuesday at 10 AM EST. Adding our VP of Eng.',
    classification: 'Meeting Confirmation',
    confidence: '99%',
    time: '3h ago',
    unread: false
  }
];

export const mockSequences = [
  {
    id: 'seq-1',
    name: 'Tier-1 VP Infra Outbound',
    activeCount: 142,
    openRate: '68.4%',
    replyRate: '19.2%',
    status: 'Healthy',
    nextScheduled: '28 emails in queue for 9:00 AM'
  },
  {
    id: 'seq-2',
    name: 'High Intent Radar Retargeting',
    activeCount: 64,
    openRate: '81.0%',
    replyRate: '34.8%',
    status: 'High Performer',
    nextScheduled: '12 personalized nudges queued'
  },
  {
    id: 'seq-3',
    name: 'Post-Demo Follow-up & Redlines',
    activeCount: 18,
    openRate: '92.5%',
    replyRate: '56.0%',
    status: 'Active',
    nextScheduled: '4 follow-ups awaiting manual approval'
  }
];
