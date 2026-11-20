import type { MiniReaderSettings } from '@/types/settings';

export const DEFAULT_MINI_READER_SETTINGS: MiniReaderSettings = {
  enabled: false,
  width: 800,
  height: 140,
  backgroundColor: '#ffffff',
  textColor: '#2b2b2b',
  backgroundOpacity: 90,
  showProgress: true,
  resizable: true,
  shortcuts: {
    toggle: 'alt+v',
    previous: 'alt+z',
    next: 'alt+c',
  },
};

export type MiniReaderSettingsPatch = Omit<Partial<MiniReaderSettings>, 'shortcuts'> & {
  shortcuts?: Partial<MiniReaderSettings['shortcuts']>;
};

export type MiniReaderShortcutBinding = {
  action: 'toggle' | 'previous' | 'next';
  shortcut: string;
};

const clamp = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;

export const normalizeMiniReaderSettings = (
  settings?: MiniReaderSettingsPatch,
): MiniReaderSettings => {
  const { x, y, ...merged } = { ...DEFAULT_MINI_READER_SETTINGS, ...settings };
  const position =
    typeof x === 'number' && Number.isFinite(x) && typeof y === 'number' && Number.isFinite(y)
      ? { x: Math.round(x), y: Math.round(y) }
      : {};
  return {
    ...merged,
    ...position,
    width: clamp(merged.width, 64, 2400, DEFAULT_MINI_READER_SETTINGS.width),
    height: clamp(merged.height, 64, 1200, DEFAULT_MINI_READER_SETTINGS.height),
    backgroundColor: /^#[0-9a-f]{6}$/i.test(merged.backgroundColor)
      ? merged.backgroundColor
      : DEFAULT_MINI_READER_SETTINGS.backgroundColor,
    textColor: /^#[0-9a-f]{6}$/i.test(merged.textColor)
      ? merged.textColor
      : DEFAULT_MINI_READER_SETTINGS.textColor,
    backgroundOpacity: clamp(
      merged.backgroundOpacity,
      0,
      100,
      DEFAULT_MINI_READER_SETTINGS.backgroundOpacity,
    ),
    shortcuts: { ...DEFAULT_MINI_READER_SETTINGS.shortcuts, ...settings?.shortcuts },
  };
};

export const getMiniReaderBackground = (settings: MiniReaderSettingsPatch) => {
  const { backgroundColor, backgroundOpacity } = normalizeMiniReaderSettings(settings);
  const red = parseInt(backgroundColor.slice(1, 3), 16);
  const green = parseInt(backgroundColor.slice(3, 5), 16);
  const blue = parseInt(backgroundColor.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${backgroundOpacity / 100})`;
};

export const getMiniReaderShortcutBindings = (
  settings: MiniReaderSettingsPatch,
): MiniReaderShortcutBinding[] => {
  const { shortcuts } = normalizeMiniReaderSettings(settings);
  const bindings: MiniReaderShortcutBinding[] = [
    { action: 'toggle', shortcut: shortcuts.toggle },
    { action: 'previous', shortcut: shortcuts.previous },
    { action: 'next', shortcut: shortcuts.next },
  ];
  if (shortcuts.toggle === 'alt+v') {
    bindings.push({ action: 'toggle', shortcut: 'alt+shift+v' });
  }
  return bindings;
};
