const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File system operations
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // Event listeners
  onDownloadFolderSelected: (callback) => {
    ipcRenderer.on('download-folder-selected', (event, folderPath) => {
      callback(folderPath);
    });
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // Platform info
  platform: process.platform,
  
  // App info
  getVersion: () => ipcRenderer.invoke('get-app-version')
});

// Prevent new window creation
window.addEventListener('DOMContentLoaded', () => {
  // Prevent drag and drop of files
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    return false;
  });
  
  document.addEventListener('drop', (e) => {
    e.preventDefault();
    return false;
  });
});