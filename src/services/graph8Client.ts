export interface Graph8StatusResponse {
  connected: boolean;
  status?: number;
  message?: string;
  timestamp?: string;
}

import type { Graph8IntentSignal, Graph8ImportantReply } from '../types';

/**
 * Checks Graph8 connection status via our own server API endpoint.
 * The client does NOT communicate directly with Graph8 or handle API keys.
 */
export async function checkGraph8Status(): Promise<Graph8StatusResponse> {
  try {
    const response = await fetch('/api/graph8/status', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    return {
      connected: Boolean(data.connected),
      status: data.status,
      message: data.message,
      timestamp: data.timestamp
    };
  } catch (error: any) {
    return {
      connected: false,
      message: 'Failed to contact local server endpoint /api/graph8/status'
    };
  }
}

/**
 * Fetches real-time buyer intent signals surfaced from Graph8.
 * Calls our server endpoint /api/graph8/intent-signals.
 */
export async function fetchIntentSignals(): Promise<Graph8IntentSignal[]> {
  try {
    const response = await fetch('/api/graph8/intent-signals', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.signals || [];
  } catch (error) {
    console.error('Failed to load intent signals from server API:', error);
    return [];
  }
}

/**
 * Fetches prioritized buyer replies requiring human attention from Graph8.
 * Calls our server endpoint /api/graph8/important-replies.
 */
export async function fetchImportantReplies(): Promise<Graph8ImportantReply[]> {
  try {
    const response = await fetch('/api/graph8/important-replies', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.replies || [];
  } catch (error) {
    console.error('Failed to load important replies from server API:', error);
    return [];
  }
}

/**
 * Fetches available sequences from Graph8 via our server endpoint.
 */
export async function fetchSequences(): Promise<any[]> {
  try {
    const response = await fetch('/api/graph8/sequences', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.sequences || [];
  } catch (error) {
    console.error('Failed to load sequences from server API:', error);
    return [];
  }
}

/**
 * Searches Graph8's 300M+ contact index for prospects matching role, company, or query.
 */
export async function fetchProspects(query?: string, limit: number = 25): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query.trim());
    params.append('limit', String(limit));

    const response = await fetch(`/api/graph8/prospects?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.prospects || [];
  } catch (error) {
    console.error('Failed to search Graph8 prospects:', error);
    return [];
  }
}

/**
 * Fetches contact profile from Graph8 CRM via our server endpoint.
 */
export async function getContactProfile(contactId: number | string): Promise<any | null> {
  try {
    const cleanId = String(contactId).replace(/^g8-(crm|sig)-/, '');
    const response = await fetch(`/api/graph8/contacts/${cleanId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.contact || null;
  } catch (error) {
    console.error(`Failed to load contact profile for ${contactId}:`, error);
    return null;
  }
}

export interface SequenceActionRequest {
  contactId: number | string;
  contactName?: string;
  sequenceId?: string;
  sequenceName?: string;
  listId?: number;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
}

export interface SequenceActionResult {
  success: boolean;
  preview?: boolean;
  status?: string;
  sequenceId?: string;
  sequenceName?: string;
  contactId?: number | string;
  contactName?: string;
  contactsAffected?: number;
  warning?: string;
  message: string;
  error?: string;
}

/**
 * Requests dry-run confirmation preview before enrolling a contact into a Graph8 sequence.
 */
export async function previewAddToSequence(req: SequenceActionRequest): Promise<SequenceActionResult> {
  try {
    const response = await fetch('/api/graph8/actions/add-to-sequence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...req,
        dryRun: true
      })
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to request sequence preview: ${error?.message || 'Network error'}`
    };
  }
}

/**
 * Executes real enrollment of a contact into an outbound Graph8 sequence.
 */
export async function executeAddToSequence(req: SequenceActionRequest): Promise<SequenceActionResult> {
  try {
    const response = await fetch('/api/graph8/actions/add-to-sequence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...req,
        dryRun: false
      })
    });

    const data = await response.json();
    if (data.success && typeof window !== 'undefined') {
      // Broadcast live event so Sequence drawer and status counters update immediately
      window.dispatchEvent(new CustomEvent('graph8:sequence-enrolled', {
        detail: {
          ...req,
          ...data,
          timestamp: new Date().toISOString()
        }
      }));
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to enroll contact into sequence: ${error?.message || 'Network error'}`
    };
  }
}

export interface CallActionRequest {
  contactId?: number | string;
  contactName: string;
  phone: string;
}

export interface CallActionResult {
  success: boolean;
  preview?: boolean;
  sessionId?: string;
  status?: string;
  roomName?: string;
  fromPhone?: string;
  toPhone?: string;
  contactName?: string;
  warning?: string;
  message: string;
  error?: string;
  canFallback?: boolean;
}

/**
 * Requests dry-run confirmation preview before initiating a voice call via Graph8.
 */
export async function previewInitiateCall(req: CallActionRequest): Promise<CallActionResult> {
  try {
    const response = await fetch('/api/graph8/actions/initiate-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...req,
        dryRun: true
      })
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to request call preview: ${error?.message || 'Network error'}`
    };
  }
}

/**
 * Executes documented Graph8 voice dialer session or ad-hoc call.
 */
export async function executeInitiateCall(req: CallActionRequest): Promise<CallActionResult> {
  try {
    const response = await fetch('/api/graph8/actions/initiate-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...req,
        dryRun: false
      })
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to dispatch call: ${error?.message || 'Network error'}`
    };
  }
}



