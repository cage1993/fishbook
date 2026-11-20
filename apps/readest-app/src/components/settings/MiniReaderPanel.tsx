import React, { useEffect, useRef, useState } from 'react';
import { useEnv } from '@/context/EnvContext';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslation } from '@/hooks/useTranslation';
import { saveSysSettings } from '@/helpers/settings';
import { isMacPlatform } from '@/services/environment';
import {
  DEFAULT_MINI_READER_SETTINGS,
  normalizeMiniReaderSettings,
  type MiniReaderSettingsPatch,
} from '@/services/miniReaderSettings';
import {
  applyMiniReaderWindowSettings,
  configureMiniReaderShortcuts,
} from '@/services/desktopReader';
import type { MiniReaderSettings } from '@/types/settings';
import { formatKeyForDisplay, getShortcutFromKeyboardEvent } from '@/utils/shortcutKeys';
import { BoxedList, SettingsInput, SettingsRow, SettingsSwitchRow, Tips } from './primitives';
import type { SettingsPanelPanelProp } from './SettingsDialog';

type ShortcutAction = keyof MiniReaderSettings['shortcuts'];

const MiniReaderPanel: React.FC<Pick<SettingsPanelPanelProp, 'onRegisterReset'>> = ({
  onRegisterReset,
}) => {
  const _ = useTranslation();
  const { envConfig } = useEnv();
  const savedSettings = useSettingsStore((state) => state.settings.miniReader);
  const settings = normalizeMiniReaderSettings(savedSettings);
  const [shortcutError, setShortcutError] = useState('');
  const isMac = isMacPlatform();

  const update = async (patch: MiniReaderSettingsPatch) => {
    const latest = useSettingsStore.getState().settings.miniReader;
    const normalized = normalizeMiniReaderSettings({
      ...latest,
      ...patch,
      shortcuts: { ...latest?.shortcuts, ...patch.shortcuts },
    });
    await saveSysSettings(envConfig, 'miniReader', normalized);
    await applyMiniReaderWindowSettings(normalized);
    return normalized;
  };

  const updateShortcut = async (
    action: ShortcutAction,
    event: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.key === 'Escape') {
      setShortcutError('');
      return;
    }
    const key = /^Key[A-Z]$/.test(event.code) ? event.code.slice(3).toLowerCase() : event.key;
    const shortcut = getShortcutFromKeyboardEvent({
      key,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      getModifierState: (modifier) => event.getModifierState(modifier),
    })?.toLowerCase();
    if (!shortcut) return;
    if (!['ctrl', 'alt', 'meta', 'shift'].some((modifier) => shortcut.includes(modifier))) {
      setShortcutError(_('Use Ctrl, Alt, Shift or Cmd together with another key'));
      return;
    }
    if (
      Object.entries(settings.shortcuts).some(
        ([key, value]) => key !== action && value === shortcut,
      )
    ) {
      setShortcutError(_('This shortcut is already assigned'));
      return;
    }
    setShortcutError('');
    const next = await update({ shortcuts: { [action]: shortcut } });
    try {
      const failures = await configureMiniReaderShortcuts(next);
      if (failures.length > 0) {
        setShortcutError(
          _('Could not register {{shortcut}}. It may be used by another application.', {
            shortcut: failures.map((failure) => failure.shortcut).join(', '),
          }),
        );
      }
    } catch {
      setShortcutError(
        _('Could not register {{shortcut}}. It may be used by another application.', { shortcut }),
      );
    }
  };

  const updateShortcutRef = useRef(updateShortcut);
  updateShortcutRef.current = updateShortcut;

  useEffect(() => {
    const capture = (event: KeyboardEvent) => {
      const action = (event.target as HTMLElement | null)?.dataset['miniShortcut'] as
        | ShortcutAction
        | undefined;
      if (!action) return;
      event.stopImmediatePropagation();
      void updateShortcutRef.current(action, event);
    };
    window.addEventListener('keydown', capture, true);
    return () => window.removeEventListener('keydown', capture, true);
  }, []);

  useEffect(() => {
    onRegisterReset(() => void update(DEFAULT_MINI_READER_SETTINGS));
  });

  const shortcutLabels: Record<ShortcutAction, string> = {
    toggle: _('Show / Hide Mini Reader'),
    previous: _('Previous Page'),
    next: _('Next Page'),
  };

  return (
    <div className='w-full'>
      <div className='mb-6'>
        <h2 className='mb-1.5 text-lg font-semibold tracking-tight'>{_('Mini Reader')}</h2>
        <p className='text-base-content/70 leading-relaxed'>
          {_('Open books in a compact, always-on-top window on this device')}
        </p>
      </div>
      <div className='space-y-6 pb-4'>
        <BoxedList>
          <SettingsSwitchRow
            label={_('Enable Mini Reader')}
            description={_('Opening a book from the library uses the mini reader')}
            checked={settings.enabled}
            onChange={() => void update({ enabled: !settings.enabled })}
            data-setting-id='settings.mini.enabled'
          />
          <SettingsSwitchRow
            label={_('Show Reading Progress')}
            checked={settings.showProgress}
            onChange={() => void update({ showProgress: !settings.showProgress })}
            data-setting-id='settings.mini.showProgress'
          />
          <SettingsSwitchRow
            label={_('Allow Window Resizing')}
            checked={settings.resizable}
            onChange={() => void update({ resizable: !settings.resizable })}
            data-setting-id='settings.mini.resizable'
          />
        </BoxedList>

        <BoxedList
          title={_('Appearance')}
          description={_('Transparency affects the background, not the book text')}
        >
          <SettingsRow label={_('Text Color')}>
            <input
              type='color'
              aria-label={_('Text Color')}
              value={settings.textColor}
              onChange={(event) => void update({ textColor: event.target.value })}
              className='eink-bordered border-base-300 h-8 w-12 cursor-pointer rounded-md border bg-transparent p-0.5'
            />
          </SettingsRow>
          <SettingsRow label={_('Background Color')}>
            <input
              type='color'
              aria-label={_('Background Color')}
              value={settings.backgroundColor}
              onChange={(event) => void update({ backgroundColor: event.target.value })}
              className='eink-bordered border-base-300 h-8 w-12 cursor-pointer rounded-md border bg-transparent p-0.5'
            />
          </SettingsRow>
          <SettingsRow label={_('Background Opacity')}>
            <div className='flex items-center gap-3'>
              <input
                type='range'
                min='0'
                max='100'
                step='1'
                aria-label={_('Background Opacity')}
                value={settings.backgroundOpacity}
                onChange={(event) => void update({ backgroundOpacity: Number(event.target.value) })}
                className='range range-sm w-32'
              />
              <span className='w-10 text-end tabular-nums'>{settings.backgroundOpacity}%</span>
            </div>
          </SettingsRow>
        </BoxedList>

        <BoxedList
          title={_('Window Size')}
          description={_('Size in logical pixels, saved only on this device')}
        >
          <SettingsRow label={_('Width')}>
            <SettingsInput
              key={settings.width}
              type='number'
              aria-label={_('Mini Reader Width')}
              min='64'
              max='2400'
              defaultValue={settings.width}
              onBlur={(event) => {
                if (event.target.valueAsNumber >= 64 && event.target.valueAsNumber <= 2400) {
                  void update({ width: event.target.valueAsNumber });
                } else {
                  event.target.value = String(settings.width);
                }
              }}
            />
          </SettingsRow>
          <SettingsRow label={_('Height')}>
            <SettingsInput
              key={settings.height}
              type='number'
              aria-label={_('Mini Reader Height')}
              min='64'
              max='1200'
              defaultValue={settings.height}
              onBlur={(event) => {
                if (event.target.valueAsNumber >= 64 && event.target.valueAsNumber <= 1200) {
                  void update({ height: event.target.valueAsNumber });
                } else {
                  event.target.value = String(settings.height);
                }
              }}
            />
          </SettingsRow>
        </BoxedList>

        <BoxedList
          title={_('Global Shortcuts')}
          description={_(
            'Shortcuts work even when Readest is not focused. Alt+Shift+V is a backup when Alt+V is unavailable.',
          )}
        >
          {(Object.keys(shortcutLabels) as ShortcutAction[]).map((action) => (
            <SettingsRow key={action} label={shortcutLabels[action]}>
              <SettingsInput
                readOnly
                aria-label={shortcutLabels[action]}
                value={formatKeyForDisplay(settings.shortcuts[action], isMac)}
                placeholder={_('Press a shortcut')}
                data-mini-shortcut={action}
              />
            </SettingsRow>
          ))}
        </BoxedList>
        {shortcutError && (
          <p role='alert' className='text-error text-[0.85em]'>
            {shortcutError}
          </p>
        )}
        <Tips>{_('Font and spacing continue to use your existing reading settings')}</Tips>
      </div>
    </div>
  );
};

export default MiniReaderPanel;
