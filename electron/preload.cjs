const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  expandWindow: () => ipcRenderer.send('window:expand'),
  collapseWindow: () => ipcRenderer.send('window:collapse'),
  showNotificationMode: () => ipcRenderer.send('window:show-notification-mode'),
  setWindowSize: (width, height) => ipcRenderer.send('window:set-size', { width, height }),
  setWindowPosition: (x, y) => ipcRenderer.send('window:set-position', { x, y }),
  setOpacity: (opacity) => ipcRenderer.send('window:set-opacity', opacity),
  togglePin: (pinned) => ipcRenderer.send('window:toggle-pin', pinned),
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  onToggleShortcut: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('shortcut:toggle', handler);
    return () => ipcRenderer.removeListener('shortcut:toggle', handler);
  },
  onBlurCollapse: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('window:collapsed-by-blur', handler);
    return () => ipcRenderer.removeListener('window:collapsed-by-blur', handler);
  },
  onRemoteTrigger: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('demo:remote-trigger', handler);
    return () => ipcRenderer.removeListener('demo:remote-trigger', handler);
  },
  openExternal: (url) => ipcRenderer.send('app:open-external', url)
});
