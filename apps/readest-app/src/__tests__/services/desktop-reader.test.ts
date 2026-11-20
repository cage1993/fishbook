// @vitest-environment node
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { AppService } from '@/types/system';
import type { MiniReaderSettings } from '@/types/settings';

const invokeMock = vi.fn().mockResolvedValue(null);
const getByLabel = vi.fn();
const show = vi.fn();
const setFocus = vi.fn();
const setSize = vi.fn();
const setResizable = vi.fn();
const emitTo = vi.fn();
const startDragging = vi.fn();
const startResizeDragging = vi.fn();
const outerPosition = vi.fn();
const outerSize = vi.fn();
const scaleFactor = vi.fn();
const movedHandlers: Array<() => void> = [];
const resizedHandlers: Array<() => void> = [];
const unlisten = vi.fn();
const onMoved = vi.fn((handler: () => void) => {
  movedHandlers.push(handler);
  return Promise.resolve(unlisten);
});
const onResized = vi.fn((handler: () => void) => {
  resizedHandlers.push(handler);
  return Promise.resolve(unlisten);
});
const { saveSysSettings, getSettingsState } = vi.hoisted(() => ({
  saveSysSettings: vi.fn(),
  getSettingsState: vi.fn(),
}));
const { startPointerWindowMove, startPointerWindowResize, needsPointerWindowControls } = vi.hoisted(
  () => ({
    startPointerWindowMove: vi.fn(),
    startPointerWindowResize: vi.fn(),
    needsPointerWindowControls: vi.fn(() => false),
  }),
);

vi.mock('@tauri-apps/api/webviewWindow', () => ({
  WebviewWindow: class {
    static getByLabel(label: string) {
      return getByLabel(label);
    }

    once() {}

    show = show;

    setFocus = setFocus;
  },
}));

vi.mock('@tauri-apps/api/core', () => ({
  invoke: (...args: unknown[]) => invokeMock(...args),
}));

vi.mock('@/services/environment', () => ({ needsPointerWindowControls }));
vi.mock('@/utils/windowPointerDrag', () => ({
  startPointerWindowMove,
  startPointerWindowResize,
}));
vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: () => ({
    startDragging,
    startResizeDragging,
    outerPosition,
    outerSize,
    scaleFactor,
    onMoved,
    onResized,
  }),
  LogicalSize: class {
    constructor(
      public width: number,
      public height: number,
    ) {}
  },
}));

vi.mock('@tauri-apps/api/event', () => ({
  emitTo: (...args: unknown[]) => emitTo(...args),
}));

import * as desktopReader from '@/services/desktopReader';
import { normalizeMiniReaderSettings } from '@/services/miniReaderSettings';

const { openMiniReader } = desktopReader;

const makeAppService = (os: 'macos' | 'windows' | 'linux'): AppService =>
  ({
    isMacOSApp: os === 'macos',
    isWindowsApp: os === 'windows',
    isLinuxApp: os === 'linux',
    osPlatform: os,
    loadSettings: vi.fn().mockResolvedValue({}),
  }) as unknown as AppService;

describe('mini reader dragging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    needsPointerWindowControls.mockReturnValue(false);
  });

  test('starts native dragging with the primary button', async () => {
    const startDrag = (
      desktopReader as { startMiniReaderDrag?: (event: MouseEvent) => Promise<void> }
    ).startMiniReaderDrag;
    await startDrag?.({ button: 0 } as MouseEvent);
    expect(startDragging).toHaveBeenCalledTimes(1);
  });

  test('uses pointer-driven movement where native dragging is unavailable', async () => {
    needsPointerWindowControls.mockReturnValue(true);
    const startDrag = (
      desktopReader as { startMiniReaderDrag?: (event: MouseEvent) => Promise<void> }
    ).startMiniReaderDrag;
    const event = { button: 0 } as MouseEvent;
    await startDrag?.(event);
    expect(startPointerWindowMove).toHaveBeenCalledWith(event);
  });

  test('ignores non-primary mouse buttons', async () => {
    const startDrag = (
      desktopReader as { startMiniReaderDrag?: (event: MouseEvent) => Promise<void> }
    ).startMiniReaderDrag;
    await startDrag?.({ button: 2 } as MouseEvent);
    expect(startDragging).not.toHaveBeenCalled();
    expect(startPointerWindowMove).not.toHaveBeenCalled();
  });

  test('grants the native resize-dragging permission', () => {
    const capabilities = JSON.parse(
      readFileSync(
        new URL('../../../src-tauri/capabilities/default.json', import.meta.url),
        'utf8',
      ),
    ) as { permissions: string[] };
    expect(capabilities.permissions).toContain('core:window:allow-start-resize-dragging');
  });

  test('starts native southeast resizing', async () => {
    const resize = (
      desktopReader as { startMiniReaderResize?: (event: MouseEvent) => Promise<void> }
    ).startMiniReaderResize;
    await resize?.({ button: 0 } as MouseEvent);
    expect(startResizeDragging).toHaveBeenCalledWith('SouthEast');
  });

  test('uses the mini reader minimum size for pointer-driven resizing', async () => {
    needsPointerWindowControls.mockReturnValue(true);
    const resize = (
      desktopReader as { startMiniReaderResize?: (event: MouseEvent) => Promise<void> }
    ).startMiniReaderResize;
    const event = { button: 0 } as MouseEvent;
    await resize?.(event);
    expect(startPointerWindowResize).toHaveBeenCalledWith(event, 'se', { width: 64, height: 64 });
  });
});

describe('mini reader bounds persistence', () => {
  const watch = () =>
    (
      desktopReader as {
        watchMiniReaderBounds?: (
          getSettings: () => MiniReaderSettings | undefined,
          saveSettings: (settings: MiniReaderSettings) => Promise<void>,
        ) => () => void;
      }
    ).watchMiniReaderBounds?.(getSettingsState, saveSysSettings);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    movedHandlers.length = 0;
    resizedHandlers.length = 0;
    outerPosition.mockResolvedValue({ x: -300, y: 160 });
    outerSize.mockResolvedValue({ width: 1200, height: 300 });
    scaleFactor.mockResolvedValue(1.5);
    getSettingsState.mockReturnValue({ enabled: true, backgroundColor: '#319b58' });
  });

  afterEach(() => vi.useRealTimers());

  test('saves logical position and size once after moving and resizing', async () => {
    const stop = watch();
    movedHandlers.forEach((handler) => handler());
    resizedHandlers.forEach((handler) => handler());
    expect(saveSysSettings).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(250);

    expect(saveSysSettings).toHaveBeenCalledTimes(1);
    expect(saveSysSettings.mock.calls[0]![0]).toMatchObject({
      enabled: true,
      backgroundColor: '#319b58',
      width: 800,
      height: 200,
      x: -200,
      y: 107,
    });
    stop?.();
    await vi.advanceTimersByTimeAsync(0);
    expect(unlisten).toHaveBeenCalledTimes(2);
  });

  test('flushes a pending bounds save when stopped', async () => {
    const stop = watch();
    resizedHandlers.forEach((handler) => handler());
    stop?.();
    await vi.advanceTimersByTimeAsync(0);
    expect(saveSysSettings).toHaveBeenCalledTimes(1);
  });

  test('does not rewrite unchanged bounds', async () => {
    getSettingsState.mockReturnValue({ width: 800, height: 200, x: -200, y: 107 });
    const stop = watch();
    movedHandlers.forEach((handler) => handler());
    await vi.advanceTimersByTimeAsync(250);
    expect(saveSysSettings).not.toHaveBeenCalled();
    stop?.();
  });
});

describe('applyMiniReaderWindowSettings', () => {
  test('sends the current appearance to an open mini reader', async () => {
    getByLabel.mockResolvedValue({ setSize, setResizable });
    const settings = normalizeMiniReaderSettings({
      backgroundColor: '#123456',
      backgroundOpacity: 42,
    });

    await desktopReader.applyMiniReaderWindowSettings(settings);

    expect(emitTo).toHaveBeenCalledWith('reader-mini', 'mini-reader-appearance', settings);
  });
});

describe('openMiniReader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getByLabel.mockResolvedValue(null);
  });

  test('creates an always-on-top mini reader that stays out of the taskbar', async () => {
    await openMiniReader(makeAppService('windows'), 'book-1');

    expect(invokeMock).toHaveBeenCalledTimes(1);
    const [command, args] = invokeMock.mock.calls[0]!;
    expect(command).toBe('plugin:webview|create_webview_window');
    expect(args.options.label).toBe('reader-mini');
    expect(args.options).toMatchObject({
      url: '/reader?ids=book-1&mini=1',
      width: 800,
      height: 140,
      alwaysOnTop: true,
      skipTaskbar: true,
      decorations: false,
      transparent: true,
      scrollBarStyle: 'fluentOverlay',
      visible: true,
    });
  });

  test('keeps the mini reader opaque on Linux', async () => {
    await openMiniReader(makeAppService('linux'), 'book-1');

    const [, args] = invokeMock.mock.calls[0]!;
    expect(args.options['transparent']).toBe(false);
  });

  test('uses the saved window bounds and resize preference', async () => {
    const appService = makeAppService('windows');
    appService.loadSettings = vi.fn().mockResolvedValue({
      miniReader: { width: 960, height: 160, x: -200, y: 120, resizable: false },
    });

    await openMiniReader(appService, 'book-1');

    expect(invokeMock.mock.calls[0]![1].options).toMatchObject({
      width: 960,
      height: 160,
      x: -200,
      y: 120,
      center: false,
      resizable: false,
    });
  });

  test('switches an existing mini reader to the newly selected book', async () => {
    getByLabel.mockResolvedValue({ show, setFocus, setSize, setResizable });

    await openMiniReader(makeAppService('windows'), 'book-2', 'cfi=chapter-3');

    expect(invokeMock).not.toHaveBeenCalled();
    expect(emitTo).toHaveBeenCalledWith('reader-mini', 'mini-reader-open-book', {
      bookId: 'book-2',
      cfi: 'chapter-3',
    });
    expect(show).toHaveBeenCalledTimes(1);
    expect(setFocus).toHaveBeenCalledTimes(1);
  });

  test('deduplicates concurrent launches', async () => {
    await Promise.all([
      openMiniReader(makeAppService('windows'), 'book-1'),
      openMiniReader(makeAppService('windows'), 'book-1'),
    ]);

    expect(invokeMock).toHaveBeenCalledTimes(1);
  });

  test('rejects opening without a book', async () => {
    await expect(openMiniReader(makeAppService('windows'), '')).rejects.toThrow(
      'A book must be open before starting Mini Reader',
    );
    expect(invokeMock).not.toHaveBeenCalled();
  });
});
