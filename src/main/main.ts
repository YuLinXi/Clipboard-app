/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { isDebug, resolveHtmlPath } from './util';
import { shortcutOpen } from './shortcut';
import TrayBuilder from './tray';
import onWindowDrag from './drag';
import { IPCReceiveMessage, IPCSendMessage } from './ipc';
import globalState from './state';
import ContextMenu from './context-menu';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 350,
    height: 600,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    alwaysOnTop: true,
  });

  mainWindow.setBackgroundColor('rgba(255,255,255)');

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  const trayBuilder = new TrayBuilder(mainWindow);

  const contextMenu = new ContextMenu(mainWindow);

  onWindowDrag(mainWindow);
  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  return {
    trayBuilder,
    contextMenu,
  };
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('browser-window-blur', () => {
  if (mainWindow && mainWindow.isVisible() && !globalState.fixed) {
    mainWindow.hide();
  }
});

app
  .whenReady()
  .then(async () => {
    const { trayBuilder, contextMenu } = await createWindow();
    shortcutOpen(mainWindow!, {
      trayBuilder,
      tray: trayBuilder.tray,
    });
    globalState.trayIns = trayBuilder;
    globalState.contextMenuIns = contextMenu;

    IPCSendMessage(mainWindow!);
    IPCReceiveMessage(mainWindow!, trayBuilder, contextMenu);

    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
