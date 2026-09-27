/**
 * demoRemote.ts
 * Facilitates real-time bidirectional synchronization between the full-screen
 * localhost browser dashboard (port 5175) and the floating desktop companion (Electron on port 5178).
 * 
 * Clicking "Incoming Call", "Urgent Reply", or "Intent Spike" in Chrome/Edge
 * immediately transmits the event across processes to ring/notify the floating desktop app!
 */

export type DemoTriggerType = 'call' | 'reply' | 'signal';

const BROADCAST_CHANNEL_NAME = 'graph8_sidekick_demo_channel';
const LOCAL_STORAGE_KEY = 'graph8_remote_demo_trigger';
const ELECTRON_SERVER_TRIGGER_URL = 'http://127.0.0.1:5178/api/demo/trigger';

/**
 * Dispatches a demo event to the floating desktop application and any open browser tabs.
 */
export async function sendRemoteDemoTrigger(type: DemoTriggerType): Promise<{ success: boolean; deliveredToDesktop: boolean }> {
  let deliveredToDesktop = false;

  // 1. BroadcastChannel (fast intra-browser & webview communication)
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({ type, timestamp: Date.now() });
      channel.close();
    }
  } catch (e) {
    console.warn('[DemoRemote] BroadcastChannel dispatch skipped:', e);
  }

  // 2. LocalStorage event (cross-tab event fallback)
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ type, timestamp: Date.now() }));
    }
  } catch (e) {
    console.warn('[DemoRemote] LocalStorage dispatch skipped:', e);
  }

  // 3. Direct HTTP call to Electron desktop server (port 5178)
  try {
    const res = await fetch(ELECTRON_SERVER_TRIGGER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, origin: 'browser_dashboard', timestamp: Date.now() })
    });
    if (res.ok) {
      deliveredToDesktop = true;
      console.log(`[DemoRemote] Successfully delivered '${type}' trigger to desktop Electron app.`);
    }
  } catch (err) {
    // Desktop app might be closed or running on alternate port
    console.log('[DemoRemote] Electron internal server not reachable on 5178 (may be offline or starting):', err);
  }

  return { success: true, deliveredToDesktop };
}

/**
 * Listens for remote demo triggers coming from the localhost browser dashboard
 * or other browser windows.
 */
export function listenToDemoTrigger(callback: (type: DemoTriggerType) => void): () => void {
  const cleanups: Array<() => void> = [];

  // A. Native Electron IPC listener
  if (typeof window !== 'undefined' && (window as any).electronAPI?.onRemoteTrigger) {
    const unsub = (window as any).electronAPI.onRemoteTrigger((data: { type: DemoTriggerType }) => {
      if (data && data.type) {
        console.log('[DemoRemote] Electron IPC received remote trigger:', data.type);
        callback(data.type);
      }
    });
    cleanups.push(unsub);
  }

  // B. BroadcastChannel listener
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data && event.data.type) {
          console.log('[DemoRemote] BroadcastChannel received remote trigger:', event.data.type);
          callback(event.data.type);
        }
      };
      cleanups.push(() => channel.close());
    }
  } catch (e) {
    console.warn('[DemoRemote] BroadcastChannel listener failed:', e);
  }

  // C. Storage event listener (cross-tab fallback)
  if (typeof window !== 'undefined') {
    const storageHandler = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.type) {
            console.log('[DemoRemote] Storage event received remote trigger:', parsed.type);
            callback(parsed.type);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', storageHandler);
    cleanups.push(() => window.removeEventListener('storage', storageHandler));
  }

  return () => {
    cleanups.forEach((cleanup) => {
      try { cleanup(); } catch {}
    });
  };
}
