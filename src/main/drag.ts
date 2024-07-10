import { BrowserWindow } from 'electron';

let dragStart: any;

function onWindowDrag(mainWindow: BrowserWindow) {
  mainWindow.on('mousedown', (event: any) => {
    // 只允许左键拖动，event.button为0表示左键
    if (event.button === 0) {
      dragStart = { x: event.screenX, y: event.screenY };
    }
  });

  // 监听鼠标移动事件，根据移动距离更新窗口位置
  mainWindow.on('mousemove', (event: any) => {
    if (dragStart) {
      const { screenX, screenY } = event;
      const offsetX = screenX - dragStart.x;
      const offsetY = screenY - dragStart.y;
      const { x, y } = mainWindow.getPosition();
      mainWindow.setPosition(x + offsetX, y + offsetY, false);
      dragStart = { x: screenX, y: screenY };
    }
  });

  // 监听鼠标释放事件，停止拖动
  mainWindow.on('mouseup', () => {
    dragStart = null;
  });
}

export default onWindowDrag;
