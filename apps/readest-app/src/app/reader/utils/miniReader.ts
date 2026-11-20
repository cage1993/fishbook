import type { ViewSettings } from '@/types/book';
import type { MiniReaderSettings } from '@/types/settings';
import type { CustomFont } from '@/styles/fonts';
import { getStyles, type ThemeCode } from '@/utils/style';
import { getMiniReaderBackground } from '@/services/miniReaderSettings';

export const applyMiniReaderLayout = (
  viewSettings: ViewSettings,
  settings?: Partial<MiniReaderSettings>,
): ViewSettings => ({
  ...viewSettings,
  showHeader: false,
  showFooter: false,
  doubleBorder: false,
  backgroundTextureId: 'none',
  marginTopPx: 8,
  marginBottomPx: settings?.showProgress === false ? 8 : 24,
  marginLeftPx: 12,
  marginRightPx: 12,
});

export const getMiniReaderStyles = (
  viewSettings: ViewSettings,
  settings: MiniReaderSettings,
  themeCode?: ThemeCode,
  customFonts: CustomFont[] = [],
) => `${getStyles(applyMiniReaderLayout(viewSettings, settings), themeCode, customFonts)}
html {
  --theme-bg-color: ${getMiniReaderBackground(settings)};
  --theme-fg-color: ${settings.textColor};
}
html, body, section, aside, blockquote, article, nav, header, footer, main, figure,
div, p, font, h1, h2, h3, h4, h5, h6, li, span, pre,
table, colgroup, col, thead, tbody, tfoot, tr, th, td, caption {
  background-color: transparent !important;
  color: ${settings.textColor} !important;
}
`;
