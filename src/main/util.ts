/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { exec } from 'child_process';
import { keyboard, Key } from '@nut-tree/nut-js';
import { app, clipboard } from 'electron';
import globalState from './state';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

export const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export const getActiveApp = (callback: (app: string) => void) => {
  exec(
    'osascript -e \'tell application "System Events" to get name of first process whose frontmost is true\'',
    (error, stdout) => {
      if (error) {
        console.error(`getActjveAppError: ${error}`);
        return;
      }
      callback(stdout.trim());
    },
  );
};

export const activateApp = (appName: string) => {
  exec(
    `osascript -e 'tell application "${appName}" to activate'`,
    (error: any) => {
      if (error) {
        console.error(`Active error: ${error}`);
      }
    },
  );
};

export const handlePaste = async (trayBuilder: any, text: string) => {
  clipboard.writeText(text);
  if (globalState.previousApp) {
    trayBuilder.handleOpen(false);
    activateApp(globalState.previousApp);
    // 模拟按下 Cmd/Ctrl + V
    await keyboard.pressKey(Key.LeftCmd);
    await keyboard.pressKey(Key.V);

    // 等待一小段时间确保粘贴命令被发送
    await keyboard.releaseKey(Key.V);
    await keyboard.releaseKey(Key.LeftCmd);
  }
};
