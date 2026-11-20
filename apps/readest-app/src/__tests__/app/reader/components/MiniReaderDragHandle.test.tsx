// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const startDrag = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const startResize = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
vi.mock('@/services/desktopReader', () => ({
  startMiniReaderDrag: startDrag,
  startMiniReaderResize: startResize,
}));
vi.mock('@/hooks/useTranslation', () => ({ useTranslation: () => (text: string) => text }));

import MiniReaderDragHandle from '@/app/reader/components/MiniReaderDragHandle';

const defaultProps = { textColor: '#e2e8f0', showControls: false, resizable: true };

describe('MiniReaderDragHandle', () => {
  beforeEach(() => {
    startDrag.mockClear();
    startResize.mockClear();
  });
  afterEach(cleanup);

  test('starts window movement from both drag regions', () => {
    const { container } = render(<MiniReaderDragHandle {...defaultProps} />);
    for (const region of ['top', 'bottom']) {
      fireEvent.mouseDown(container.querySelector(`[data-mini-drag-handle="${region}"]`)!, {
        button: 0,
      });
    }
    expect(startDrag).toHaveBeenCalledTimes(2);
    expect(startDrag.mock.calls[0]![0]).toBeInstanceOf(MouseEvent);
    expect(container.querySelector('[data-mini-transparent-outline]')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Window Size' })).toBeNull();
  });

  test('does not start movement for a non-primary button', () => {
    const { container } = render(<MiniReaderDragHandle {...defaultProps} />);
    fireEvent.mouseDown(container.querySelector('[data-mini-drag-handle="top"]')!, { button: 2 });
    expect(startDrag).not.toHaveBeenCalled();
  });

  test('shows a boundary and a working resize grip only for transparent mode', () => {
    const { container, rerender } = render(<MiniReaderDragHandle {...defaultProps} showControls />);
    expect(container.querySelector('[data-mini-transparent-outline]')).not.toBeNull();
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Window Size' }), { button: 0 });
    expect(startResize).toHaveBeenCalledTimes(1);
    expect(startDrag).not.toHaveBeenCalled();

    rerender(<MiniReaderDragHandle {...defaultProps} showControls resizable={false} />);
    expect(screen.queryByRole('button', { name: 'Window Size' })).toBeNull();
    expect(container.querySelector('[data-mini-transparent-outline]')).not.toBeNull();
  });
});
