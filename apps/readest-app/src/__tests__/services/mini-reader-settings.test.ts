// @vitest-environment node
import { describe, expect, test } from 'vitest';
import {
  DEFAULT_MINI_READER_SETTINGS,
  getMiniReaderBackground,
  getMiniReaderShortcutBindings,
  normalizeMiniReaderSettings,
} from '@/services/miniReaderSettings';

describe('mini reader settings', () => {
  test('uses safe defaults and keeps the mode opt-in', () => {
    const settings = normalizeMiniReaderSettings();
    expect(settings.enabled).toBe(false);
    expect(settings.showProgress).toBe(true);
    expect(settings.shortcuts).toEqual({ toggle: 'alt+v', previous: 'alt+z', next: 'alt+c' });
  });

  test('normalizes dimensions, opacity and colors without mutating the input', () => {
    const input = {
      width: 10,
      height: 5000,
      backgroundColor: 'invalid',
      textColor: 'transparent',
      backgroundOpacity: -1,
      x: -200,
      y: 120,
    };
    const settings = normalizeMiniReaderSettings(input);
    expect(settings).toMatchObject({
      width: 64,
      height: 1200,
      backgroundColor: DEFAULT_MINI_READER_SETTINGS.backgroundColor,
      textColor: DEFAULT_MINI_READER_SETTINGS.textColor,
      backgroundOpacity: 0,
      x: -200,
      y: 120,
    });
    expect(normalizeMiniReaderSettings({ textColor: '#010203' }).textColor).toBe('#010203');
    expect(normalizeMiniReaderSettings({ x: Number.NaN, y: 120 }).x).toBeUndefined();
    expect(normalizeMiniReaderSettings({ x: -200, y: Number.NaN }).y).toBeUndefined();
    expect(input.width).toBe(10);
  });

  test('only the background has alpha', () => {
    expect(getMiniReaderBackground({ backgroundColor: '#102030', backgroundOpacity: 50 })).toBe(
      'rgba(16, 32, 48, 0.5)',
    );
  });

  test('keeps the backup boss key only for the default binding', () => {
    expect(getMiniReaderShortcutBindings(DEFAULT_MINI_READER_SETTINGS)).toContainEqual({
      action: 'toggle',
      shortcut: 'alt+shift+v',
    });
    expect(getMiniReaderShortcutBindings({ shortcuts: { toggle: 'ctrl+shift+b' } })).toHaveLength(
      3,
    );
  });
});
