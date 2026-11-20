import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { getCurrentWindow, LogicalSize, ScrollBarStyle } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';
import { emitTo } from '@tauri-apps/api/event';
import type { AppService } from '@/types/system';
import type { MiniReaderSettings } from '@/types/settings';
import { getMiniReaderShortcutBindings, normalizeMiniReaderSettings } from './miniReaderSettings';
import { needsPointerWindowControls } from './environment';
import { startPointerWindowMove, startPointerWindowResize } from '@/utils/windowPointerDrag';

export const startMiniReaderDrag = async (event: MouseEvent) => {
  if (event.button !== 0) return;
  if (needsPointerWindowControls()) {
    await startPointerWindowMove(event);
  } else {
    await getCurrentWindow().startDragging();
  }
};

export const startMiniReaderResize = async (event: MouseEvent) => {
  if (event.button !== 0) return;
  if (needsPointerWindowControls()) {
    await startPointerWindowResize(event, 'se', { width: 64, height: 64 });
  } else {
    await getCurrentWindow().startResizeDragging('SouthEast');
  }
};

export const watchMiniReaderBounds = (
  getSettings: () => MiniReaderSettings | undefined,
  saveSettings: (settings: MiniReaderSettings) => Promise<void>,
) => {
  const win = getCurrentWindow();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;

  const save = () => {
    void (async () => {
      const [position, size, scale] = await Promise.all([
        win.outerPosition(),
        win.outerSize(),
        win.scaleFactor(),
      ]);
      const latest = getSettings();
      const next = normalizeMiniReaderSettings({
        ...latest,
        width: Math.round(size.width / scale),
        height: Math.round(size.height / scale),
        x: Math.round(position.x / scale),
        y: Math.round(position.y / scale),
      });
      if (
        latest?.width === next.width &&
        latest.height === next.height &&
        latest.x === next.x &&
        latest.y === next.y
      ) {
        return;
      }
      await saveSettings(next);
    })().catch((error) => console.warn('Failed to save mini reader bounds:', error));
  };

  const schedule = () => {
    if (stopped) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      save();
    }, 250);
  };
  const subscriptions = Promise.all([win.onMoved(schedule), win.onResized(schedule)]).catch(
    (error) => {
      console.warn('Failed to watch mini reader bounds:', error);
      return [];
    },
  );

  return () => {
    const flush = timer !== undefined;
    stopped = true;
    if (timer) clearTimeout(timer);
    timer = undefined;
    void subscriptions.then((unlisteners) => unlisteners.forEach((unlisten) => unlisten()));
    if (flush) save();
  };
};

export const MINI_READER_LABEL = 'reader-mini';

let pendingMiniReader: Promise<void> | null = null;

export type MiniReaderShortcutFailure = { shortcut: string; message: string };

export const configureMiniReaderShortcuts = async (settings: MiniReaderSettings) =>
  invoke<MiniReaderShortcutFailure[]>('configure_mini_reader_shortcuts', {
    bindings: getMiniReaderShortcutBindings(settings),
  });

export const applyMiniReaderWindowSettings = async (settings: MiniReaderSettings) => {
  const normalized = normalizeMiniReaderSettings(settings);
  const existing = await WebviewWindow.getByLabel(MINI_READER_LABEL);
  if (!existing) return;
  await existing.setSize(new LogicalSize(normalized.width, normalized.height));
  await existing.setResizable(normalized.resizable);
  await emitTo(MINI_READER_LABEL, 'mini-reader-appearance', normalized);
};

const createMiniReader = async (appService: AppService, bookId: string, queryParams?: string) => {
  const settings = normalizeMiniReaderSettings((await appService.loadSettings()).miniReader);
  const existing = await WebviewWindow.getByLabel(MINI_READER_LABEL);
  if (existing) {
    const params = new URLSearchParams(queryParams || '');
    await emitTo(MINI_READER_LABEL, 'mini-reader-open-book', {
      bookId,
      cfi: params.get('cfi') || undefined,
    });
    await applyMiniReaderWindowSettings(settings);
    await existing.show();
    await existing.setFocus();
    return;
  }

  const params = new URLSearchParams(queryParams || '');
  params.set('ids', bookId);
  params.set('mini', '1');
  const options = {
    url: `/reader?${params.toString()}`,
    width: settings.width,
    height: settings.height,
    center: settings.x === undefined || settings.y === undefined,
    ...(settings.x !== undefined && settings.y !== undefined
      ? { x: settings.x, y: settings.y }
      : {}),
    resizable: settings.resizable,
    title: 'Readest Mini',
    decorations: false,
    transparent: !appService.isLinuxApp,
    visible: true,
    shadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    scrollBarStyle: (appService.osPlatform === 'windows'
      ? 'fluentOverlay'
      : 'default') as unknown as ScrollBarStyle,
  };
  await invoke('plugin:webview|create_webview_window', {
    options: { ...options, label: MINI_READER_LABEL },
  });
};

export const openMiniReader = (appService: AppService, bookId: string, queryParams?: string) => {
  if (!bookId) {
    return Promise.reject(new Error('A book must be open before starting Mini Reader'));
  }
  if (!pendingMiniReader) {
    pendingMiniReader = createMiniReader(appService, bookId, queryParams);
  }
  return pendingMiniReader.finally(() => {
    pendingMiniReader = null;
  });
};
