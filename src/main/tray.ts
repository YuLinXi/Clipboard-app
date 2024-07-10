import { app, BrowserWindow, Menu, Tray, screen } from 'electron';
import { getAssetPath } from './util';

export default class TrayBuilder {
  mainWindow: BrowserWindow;

  tray: Tray;

  contextMenu: Menu;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.tray = new Tray(getAssetPath('icons', '16x16_tray.png'));
    this.contextMenu = Menu.buildFromTemplate([
      {
        label: '退出',
        click: () => {
          app.quit();
        },
      },
    ]);
    this.tray.setToolTip('Smart Clipboard');
    this.onTrayEventListener();
  }

  onTrayEventListener() {
    this.tray.on('click', () => {
      this.handleOpen();
    });
    this.tray.on('right-click', () => {
      this.tray.popUpContextMenu(this.contextMenu);
    });
  }

  handleOpen = (follow = false) => {
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      if (!follow) {
        const position = this.tray.getBounds();
        this.mainWindow.setPosition(
          position.x,
          position.y - this.mainWindow.getBounds().height,
        );
      } else {
        const { x, y } = screen.getCursorScreenPoint();
        this.mainWindow.setPosition(x, y);
      }
      this.mainWindow.show();
    }
  };

  animation() {
    console.log(this.tray.rotation);
    // this.tray.rotate()
  }
}
