import React from 'react';

export interface GroupTheme {
  id: string;
  name: string;
  badgeBg: string;
  badgeText: string;
  borderLocked: string;
  bgLocked: string;
  glow: string;
}

export const GROUP_COLORS: GroupTheme[] = [
  {
    id: 'emerald',
    name: '에메랄드',
    badgeBg: 'bg-emerald-500',
    badgeText: 'text-white',
    borderLocked: 'border-emerald-400',
    bgLocked: 'bg-emerald-50/80',
    glow: 'shadow-emerald-200',
  },
  {
    id: 'indigo',
    name: '인디고',
    badgeBg: 'bg-indigo-500',
    badgeText: 'text-white',
    borderLocked: 'border-indigo-400',
    bgLocked: 'bg-indigo-50/80',
    glow: 'shadow-indigo-200',
  },
  {
    id: 'amber',
    name: '앰버',
    badgeBg: 'bg-amber-500',
    badgeText: 'text-white',
    borderLocked: 'border-amber-400',
    bgLocked: 'bg-amber-50/80',
    glow: 'shadow-amber-200',
  },
  {
    id: 'rose',
    name: '로즈',
    badgeBg: 'bg-rose-500',
    badgeText: 'text-white',
    borderLocked: 'border-rose-400',
    bgLocked: 'bg-rose-50/80',
    glow: 'shadow-rose-200',
  },
  {
    id: 'sky',
    name: '스카이',
    badgeBg: 'bg-sky-500',
    badgeText: 'text-white',
    borderLocked: 'border-sky-400',
    bgLocked: 'bg-sky-50/80',
    glow: 'shadow-sky-200',
  },
  {
    id: 'purple',
    name: '퍼플',
    badgeBg: 'bg-purple-500',
    badgeText: 'text-white',
    borderLocked: 'border-purple-400',
    bgLocked: 'bg-purple-50/80',
    glow: 'shadow-purple-200',
  },
  {
    id: 'teal',
    name: '틸',
    badgeBg: 'bg-teal-500',
    badgeText: 'text-white',
    borderLocked: 'border-teal-400',
    bgLocked: 'bg-teal-50/80',
    glow: 'shadow-teal-200',
  },
  {
    id: 'orange',
    name: '오렌지',
    badgeBg: 'bg-orange-500',
    badgeText: 'text-white',
    borderLocked: 'border-orange-400',
    bgLocked: 'bg-orange-50/80',
    glow: 'shadow-orange-200',
  },
];

export interface SeatCardProps {
  seatNumber: number | null;
  isLocked: boolean;
  isRolling: boolean;
  displayNumber?: number;
  groupColorIndex?: number;
  deskIndex?: number;
}

export const SeatCard: React.FC<SeatCardProps> = ({
  seatNumber,
  isLocked,
  isRolling,
  displayNumber,
  groupColorIndex = 0,
  deskIndex,
}) => {
  const theme = GROUP_COLORS[Math.abs(groupColorIndex) % GROUP_COLORS.length];

  // Determine current display state
  const state = isLocked ? 'locked' : isRolling ? 'rolling' : 'idle';

  let ariaLabel = deskIndex ? `${deskIndex}번 책상` : '책상';
  if (state === 'locked' && seatNumber !== null) {
    ariaLabel += `: 학생 ${seatNumber}번`;
  } else if (state === 'rolling' && displayNumber !== undefined) {
    ariaLabel += `: 추첨 중 (${displayNumber}번)`;
  } else {
    ariaLabel += ': 빈 자리';
  }

  return (
    <div
      data-testid="seat-card"
      data-state={state}
      data-group-color={theme.id}
      aria-label={ariaLabel}
      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 select-none min-h-[90px] w-full ${
        state === 'locked'
          ? `${theme.borderLocked} ${theme.bgLocked} shadow-md scale-100`
          : state === 'rolling'
          ? 'border-amber-400 bg-amber-50/90 shadow-lg ring-2 ring-amber-300 ring-offset-1 animate-pulse scale-[1.02]'
          : 'border-dashed border-slate-300 bg-white/70 hover:border-slate-400 shadow-sm'
      }`}
    >
      {/* Desk tag label (e.g. 1번 책상) */}
      {deskIndex !== undefined && (
        <span className="absolute top-1.5 left-2 text-[10px] font-semibold text-slate-400 tracking-wider">
          {deskIndex}번 책상
        </span>
      )}

      {/* Main Seat Display */}
      {state === 'locked' && seatNumber !== null ? (
        <div className="flex flex-col items-center justify-center space-y-0.5 mt-2">
          <div
            className={`px-3 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText} font-black text-xl tracking-tight shadow-sm transition-transform duration-200 animate-in fade-in zoom-in-95`}
          >
            {seatNumber}번
          </div>
          <span className="text-[11px] font-medium text-slate-500">배정 완료</span>
        </div>
      ) : state === 'rolling' ? (
        <div className="flex flex-col items-center justify-center mt-2">
          <div className="px-3 py-1 rounded-full bg-amber-500 text-white font-black text-xl tracking-tight shadow-md animate-bounce">
            {displayNumber !== undefined ? `${displayNumber}번` : '...'}
          </div>
          <span className="text-[11px] font-semibold text-amber-600 animate-pulse mt-0.5">
            돌아가는 중...
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-2 text-slate-400">
          <span className="text-sm font-semibold tracking-wide">빈 자리</span>
          <span className="text-[10px] text-slate-400">추첨 대기</span>
        </div>
      )}
    </div>
  );
};
