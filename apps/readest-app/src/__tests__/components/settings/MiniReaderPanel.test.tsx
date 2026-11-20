// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { SystemSettings } from '@/types/settings';
import { DEFAULT_MINI_READER_SETTINGS } from '@/services/miniReaderSettings';
import { useSettingsStore } from '@/store/settingsStore';

const saveSysSettings = vi.hoisted(() => vi.fn());
const applyWindow = vi.hoisted(() => vi.fn());
const configureShortcuts = vi.hoisted(() => vi.fn().mockResolvedValue([]));

vi.mock('@/hooks/useTranslation', () => ({ useTranslation: () => (text: string) => text }));
vi.mock('@/context/EnvContext', () => ({ useEnv: () => ({ envConfig: {} }) }));
vi.mock('@/helpers/settings', () => ({ saveSysSettings }));
vi.mock('@/services/desktopReader', () => ({
  applyMiniReaderWindowSettings: applyWindow,
  configureMiniReaderShortcuts: configureShortcuts,
}));

import MiniReaderPanel from '@/components/settings/MiniReaderPanel';

describe('MiniReaderPanel', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    configureShortcuts.mockResolvedValue([]);
    saveSysSettings.mockImplementation((_env, key, value) => {
      const state = useSettingsStore.getState();
      state.setSettings({ ...state.settings, [key]: value });
    });
    useSettingsStore.setState({ settings: {} as SystemSettings });
  });

  test('enables the mode without opening a window', async () => {
    render(<MiniReaderPanel onRegisterReset={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Mini Reader' })).toBeTruthy();
    fireEvent.click(screen.getByRole('checkbox', { name: /Enable Mini Reader/ }));
    await waitFor(() =>
      expect(saveSysSettings).toHaveBeenCalledWith({}, 'miniReader', {
        ...DEFAULT_MINI_READER_SETTINGS,
        enabled: true,
      }),
    );
    expect(applyWindow).toHaveBeenCalledWith({ ...DEFAULT_MINI_READER_SETTINGS, enabled: true });
  });

  test('persists independent text and background colors and a progress preference', async () => {
    render(<MiniReaderPanel onRegisterReset={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Text Color'), { target: { value: '#010203' } });
    fireEvent.change(screen.getByLabelText('Background Color'), { target: { value: '#102030' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Show Reading Progress' }));
    await waitFor(() => expect(saveSysSettings).toHaveBeenCalledTimes(3));
    expect(saveSysSettings.mock.calls[0]![2]).toMatchObject({ textColor: '#010203' });
    expect(saveSysSettings.mock.calls[1]![2]).toMatchObject({
      textColor: '#010203',
      backgroundColor: '#102030',
    });
    expect(saveSysSettings.mock.calls[2]![2]).toMatchObject({ showProgress: false });
  });

  test('keeps earlier fields when another setting changes before a rerender', async () => {
    render(<MiniReaderPanel onRegisterReset={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Background Color'), { target: { value: '#102030' } });
    const width = screen.getByLabelText('Mini Reader Width');
    expect(width.getAttribute('min')).toBe('64');
    fireEvent.change(width, { target: { value: '900' } });
    fireEvent.blur(width);

    await waitFor(() => expect(saveSysSettings).toHaveBeenCalledTimes(2));
    expect(saveSysSettings.mock.calls[1]![2]).toMatchObject({
      backgroundColor: '#102030',
      width: 900,
    });
  });

  test('captures a global next-page shortcut', async () => {
    render(<MiniReaderPanel onRegisterReset={vi.fn()} />);
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Next Page' }), {
      key: 'c',
      ctrlKey: true,
    });
    await waitFor(() => expect(configureShortcuts).toHaveBeenCalled());
    expect(saveSysSettings.mock.calls[0]![2].shortcuts.next).toBe('ctrl+c');
  });

  test('captures modifiers from native events with non-enumerable properties', async () => {
    render(<MiniReaderPanel onRegisterReset={vi.fn()} />);
    const event = new KeyboardEvent('keydown', {
      key: 'c',
      code: 'KeyC',
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
    });
    Object.defineProperty(event, 'ctrlKey', { value: true, enumerable: false });
    Object.defineProperty(event, 'shiftKey', { value: true, enumerable: false });
    fireEvent(screen.getByRole('textbox', { name: 'Next Page' }), event);

    await waitFor(() => expect(configureShortcuts).toHaveBeenCalled());
    expect(saveSysSettings.mock.calls[0]![2].shortcuts.next).toBe('ctrl+shift+c');
  });

  test('rejects an unmodified global shortcut', () => {
    render(<MiniReaderPanel onRegisterReset={vi.fn()} />);
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Next Page' }), { key: 'c' });
    expect(screen.getByRole('alert').textContent).toContain('Use Ctrl, Alt, Shift or Cmd');
    expect(saveSysSettings).not.toHaveBeenCalled();
  });
});
