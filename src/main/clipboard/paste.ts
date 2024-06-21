import { BrowserWindow, globalShortcut, ipcMain, clipboard } from 'electron';

const shortcutPaste = (mainWindow: BrowserWindow) => {
  globalShortcut.register('CommandOrControl+Shift+V', () => {
    mainWindow?.webContents.send('toggle-record-list');
  });

  ipcMain.on('paste-text', (event, text: string) => {
    clipboard.writeText(text);
  });
};

export default shortcutPaste;
