import { BrowserWindow, clipboard, Menu } from 'electron';
import { handlePaste } from './util';
import globalState from './state';

const createMenuItem = (
  mainWindow: BrowserWindow,
  appName: string,
  record: any,
) => {
  const templates = [
    {
      label: '复制',
      click: () => {
        clipboard.writeText(record.text);
      },
    },
    {
      label: '删除',
      click: () => {
        mainWindow?.webContents.send('record-delete', record);
      },
    },
  ];

  if (!appName) {
    return templates;
  }

  return [
    {
      label: `粘贴至"${appName}"`,
      click: async () => {
        await handlePaste(globalState.trayIns, record.text);
      },
    },
    ...templates,
  ];
};

class ContextMenu {
  mainWindow: BrowserWindow;

  menu: Menu | null;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.menu = null;
  }

  popup(appName: string, record: any) {
    const templates = createMenuItem(this.mainWindow, appName, record);
    this.menu = Menu.buildFromTemplate(templates as any);
    this.menu.popup();
  }
}

export default ContextMenu;
