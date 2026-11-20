// @vitest-environment happy-dom
import { describe, expect, test } from 'vitest';
import type { ViewSettings } from '@/types/book';
import { applyMiniReaderLayout, getMiniReaderStyles } from '@/app/reader/utils/miniReader';
import { normalizeMiniReaderSettings } from '@/services/miniReaderSettings';
import { getDefaultViewSettings, type Context } from '@/services/settingsService';

describe('applyMiniReaderLayout', () => {
  test('removes reader chrome without mutating the saved view settings', () => {
    const saved = {
      showHeader: true,
      showFooter: true,
      doubleBorder: true,
      vertical: true,
      fontSize: 18,
    } as unknown as ViewSettings;

    const mini = applyMiniReaderLayout(saved);

    expect(mini).not.toBe(saved);
    expect(mini).toMatchObject({
      showHeader: false,
      showFooter: false,
      doubleBorder: false,
      vertical: true,
      fontSize: 18,
    });
    expect(saved).toMatchObject({
      showHeader: true,
      showFooter: true,
      doubleBorder: true,
    });
  });

  test('reserves a compact progress band without changing the saved layout', () => {
    const saved = {
      marginTopPx: 44,
      marginBottomPx: 44,
      marginLeftPx: 16,
      marginRightPx: 16,
    } as ViewSettings;

    const mini = applyMiniReaderLayout(saved, { showProgress: true });

    expect(mini).toMatchObject({
      marginTopPx: 8,
      marginBottomPx: 24,
      marginLeftPx: 12,
      marginRightPx: 12,
    });
    expect(saved.marginBottomPx).toBe(44);
  });

  test('uses the configured background instead of the opaque theme canvas', () => {
    const saved = {
      ...getDefaultViewSettings({ isMobile: false, isEink: false } as Context),
      backgroundTextureId: 'paper',
    };
    const settings = normalizeMiniReaderSettings({
      backgroundColor: '#112233',
      backgroundOpacity: 50,
      textColor: '#010203',
    });

    const css = getMiniReaderStyles(saved, settings);

    expect(css).toContain('--theme-bg-color: rgba(17, 34, 51, 0.5)');
    expect(css).toContain('--theme-fg-color: #010203');
    expect(css).toContain('--bg-texture-id: none');

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    const paragraph = document.createElement('p');
    paragraph.style.color = '#fedcba';
    paragraph.textContent = 'Mini reader text';
    document.body.appendChild(paragraph);
    expect(getComputedStyle(paragraph).color).toBe('#010203');
    style.remove();
    paragraph.remove();
  });
});
