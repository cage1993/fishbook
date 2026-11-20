import clsx from 'clsx';
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { startMiniReaderDrag, startMiniReaderResize } from '@/services/desktopReader';

const MiniReaderDragHandle: React.FC<{
  textColor: string;
  showControls: boolean;
  resizable: boolean;
}> = ({ textColor, showControls, resizable }) => {
  const _ = useTranslation();
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    startMiniReaderDrag(event.nativeEvent).catch((error) => {
      console.warn('Failed to move mini reader:', error);
    });
  };
  const handleResize = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    startMiniReaderResize(event.nativeEvent).catch((error) => {
      console.warn('Failed to resize mini reader:', error);
    });
  };
  const label = _('Drag to move window');
  const resizeLabel = _('Window Size');

  return (
    <>
      {showControls && (
        <div
          aria-hidden
          data-mini-transparent-outline
          className='pointer-events-none absolute inset-0 z-30 border opacity-40'
          style={{ borderColor: textColor }}
        />
      )}
      <div
        role='presentation'
        aria-label={label}
        title={label}
        data-mini-drag-handle='top'
        className={clsx(
          'absolute inset-x-0 top-0 z-40 cursor-move touch-none',
          showControls ? 'h-5' : 'h-3',
        )}
        onMouseDown={handleMouseDown}
      >
        {showControls && (
          <div
            className='pointer-events-none mx-auto mt-1 h-1 w-12 rounded-full opacity-60'
            style={{ backgroundColor: textColor }}
          />
        )}
      </div>
      <div
        role='presentation'
        aria-label={label}
        title={label}
        data-mini-drag-handle='bottom'
        className='absolute inset-x-0 bottom-0 z-40 h-5 cursor-move touch-none'
        onMouseDown={handleMouseDown}
      />
      {showControls && resizable && (
        <button
          type='button'
          aria-label={resizeLabel}
          title={resizeLabel}
          className='absolute bottom-0 right-0 z-50 h-5 w-5 cursor-nwse-resize touch-none p-0.5 opacity-70'
          style={{ color: textColor }}
          onMouseDown={handleResize}
        >
          <svg aria-hidden viewBox='0 0 14 14' className='h-full w-full'>
            <path d='M2 12L12 2M7 12L12 7' fill='none' stroke='currentColor' strokeWidth='1.2' />
          </svg>
        </button>
      )}
    </>
  );
};

export default MiniReaderDragHandle;
