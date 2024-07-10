import { BrowserWindow, Tray, globalShortcut } from 'electron';
import TrayBuilder from '../tray';
import { getActiveApp } from '../util';
import globalState from '../state';

const shortcutOpen = (
  mainWindow: BrowserWindow,
  options: {
    trayBuilder: TrayBuilder;
    tray: Tray;
  },
) => {
  if (process.platform === 'darwin') {
    globalShortcut.register('Shift+Command+V', () => {
      getActiveApp((app: any) => {
        globalState.previousApp = app;
      });
      setTimeout(() => {
        options.trayBuilder.handleOpen(true);
      }, 300);
    });
  } else {
    globalShortcut.register('Alt+V', () => {
      getActiveApp((app: any) => {
        globalState.previousApp = app;
      });
      setTimeout(() => {
        options.trayBuilder.handleOpen(true);
      }, 300);
    });
  }
};

export default shortcutOpen;
