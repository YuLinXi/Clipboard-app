import { BrowserWindow, clipboard, ipcMain } from 'electron';
import { handlePaste } from './util';
import TrayBuilder from './tray';
import globalState from './state';
import ContextMenu from './context-menu';

export function IPCReceiveMessage(
  mainWindow: BrowserWindow,
  trayBuilder: TrayBuilder,
  contextMenu: ContextMenu,
) {
  ipcMain.on('paste-text', async (event: any, text: string) => {
    await handlePaste(trayBuilder, text);
  });

  ipcMain.on('window-visible', () => {
    trayBuilder.handleOpen(false);
  });

  ipcMain.on('window-resizable', (event: any, type) => {
    if (type === 'mini') {
      mainWindow?.minimize();
    }
  });
  ipcMain.on('window-fixed', (event: any, fixed) => {
    globalState.fixed = fixed;
  });

  ipcMain.on('context-menu', (evenet: any, record: any) => {
    contextMenu.popup(globalState.previousApp, record);
  });
}

export function IPCSendMessage(mainWindow: BrowserWindow) {
  setInterval(() => {
    const currentClipboard = clipboard.readText();
    if (currentClipboard) {
      mainWindow?.webContents.send('clipboard-changed', currentClipboard);
    }
  }, 500);
}
