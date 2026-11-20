// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import type { BookProgress } from '@/types/book';
import { clearBookProgress, setBookProgress } from '@/store/readerProgressStore';

vi.mock('@/hooks/useTranslation', () => ({ useTranslation: () => (text: string) => text }));
vi.mock('@/store/readerStore', () => ({
  useReaderStore: (selector: (state: unknown) => unknown) =>
    selector({ getViewSettings: () => ({ isEink: false }) }),
}));

import MiniReaderProgress from '@/app/reader/components/MiniReaderProgress';

const bookKey = 'mini-book';
const setFraction = (fraction: number) =>
  setBookProgress(bookKey, {
    fraction,
    pageinfo: { current: 0, total: 100 },
  } as BookProgress);

describe('MiniReaderProgress', () => {
  afterEach(() => {
    cleanup();
    clearBookProgress(bookKey);
  });

  test('shows two decimal places without reducing the progress bar precision', () => {
    setFraction(0.123456);
    const { container } = render(<MiniReaderProgress bookKey={bookKey} textColor='#010203' />);

    expect(screen.getByText('12.35%')).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('12.35');
    expect((container.querySelector('.sticky-progress-fill') as HTMLElement).style.width).toBe(
      '12.3456%',
    );
  });

  test('shows zero with two decimal places before the first relocation', () => {
    render(<MiniReaderProgress bookKey={bookKey} textColor='#010203' />);
    expect(screen.getByText('0.00%')).toBeTruthy();
  });

  test.each([
    { fraction: -0.1, expected: '0.00%' },
    { fraction: 1.1, expected: '100.00%' },
  ])('clamps $fraction to $expected', ({ fraction, expected }) => {
    setFraction(fraction);
    render(<MiniReaderProgress bookKey={bookKey} textColor='#010203' />);
    expect(screen.getByText(expected)).toBeTruthy();
  });

  test('uses the configured text color for the percentage and bar', () => {
    render(<MiniReaderProgress bookKey={bookKey} textColor='#010203' />);
    expect(getComputedStyle(screen.getByRole('progressbar')).color).toBe('#010203');
  });

  test('leaves room for the transparent-mode resize handle', () => {
    render(<MiniReaderProgress bookKey={bookKey} textColor='#010203' reserveResizeHandle />);
    expect(screen.getByRole('progressbar').className).toContain('pr-7');
  });
});
