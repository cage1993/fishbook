import clsx from 'clsx';
import React from 'react';
import { useBookProgress } from '@/store/readerProgressStore';
import { useReaderStore } from '@/store/readerStore';
import { useTranslation } from '@/hooks/useTranslation';
import StickyProgressBar from './StickyProgressBar';

const MiniReaderProgress: React.FC<{
  bookKey: string;
  textColor: string;
  reserveResizeHandle?: boolean;
}> = ({ bookKey, textColor, reserveResizeHandle = false }) => {
  const _ = useTranslation();
  const progress = useBookProgress(bookKey);
  const isEink = useReaderStore((state) => state.getViewSettings(bookKey)?.isEink);
  const fraction =
    progress?.fraction ??
    (progress?.pageinfo.total ? (progress.pageinfo.current + 1) / progress.pageinfo.total : 0);
  const percent = Math.min(1, Math.max(0, fraction)) * 100;

  return (
    <div
      role='progressbar'
      aria-label={_('Reading Progress')}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Number(percent.toFixed(2))}
      className={clsx(
        'text-base-content pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-5 items-center gap-2 px-3 text-[10px]',
        reserveResizeHandle && 'pr-7',
      )}
      style={{ color: textColor }}
    >
      <StickyProgressBar
        className='h-3 flex-1'
        fraction={percent / 100}
        tickFractions={[]}
        isEink={isEink}
      />
      <span className='w-14 text-end tabular-nums'>{percent.toFixed(2)}%</span>
    </div>
  );
};

export default MiniReaderProgress;
