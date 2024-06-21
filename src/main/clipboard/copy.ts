import { BrowserWindow, clipboard, globalShortcut } from 'electron';

const shortcutCopy = (mainWindow: BrowserWindow) => {
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    const text = clipboard.readText();
    if (text) {
      mainWindow?.webContents.send('clipboard-changed', text);
    }
  });
};

export default shortcutCopy;
