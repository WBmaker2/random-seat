import React from 'react';
import { PodSeatGroup } from '../utils/seating';
import { SeatCard, GROUP_COLORS } from './SeatCard';

export interface DeskPodProps {
  group: PodSeatGroup;
  groupColorIndex: number;
  isGroupLocked: boolean;
  isRolling: boolean;
  rollingNumbers?: Record<string, number>; // key: `${group.groupIndex}-${seatIdx}`
}

export const DeskPod: React.FC<DeskPodProps> = ({
  group,
  groupColorIndex,
  isGroupLocked,
  isRolling,
  rollingNumbers,
}) => {
  const theme = GROUP_COLORS[Math.abs(groupColorIndex) % GROUP_COLORS.length];
  const isPodRolling = isRolling && !isGroupLocked;

  return (
    <div
      data-testid="desk-pod"
      data-group-index={group.groupIndex}
      className={`flex flex-col rounded-2xl border-2 transition-all duration-300 p-4 bg-white/95 shadow-sm hover:shadow-md ${
        isGroupLocked
          ? 'border-emerald-300/80 shadow-emerald-50/50'
          : isPodRolling
          ? 'border-amber-400 ring-2 ring-amber-300/60 bg-amber-50/20'
          : 'border-slate-200'
      }`}
    >
      {/* Group Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          {/* Group badge */}
          <span
            className={`px-2.5 py-1 rounded-lg font-bold text-sm tracking-tight shadow-xs ${theme.badgeBg} ${theme.badgeText}`}
          >
            {group.groupName}
          </span>
          {/* Member count badge */}
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {group.seatNumbers.length}명
          </span>
        </div>

        {/* Status indicator badge */}
        <div>
          {isGroupLocked ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              배정 완료
            </span>
          ) : isPodRolling ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              추첨 중
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              대기 중
            </span>
          )}
        </div>
      </div>

      {/* Facing Desk Arrangement (2-Column 모둠 책상 레이아웃) */}
      <div className="flex-1 flex flex-col justify-center">
        <div
          data-testid="facing-desk-grid"
          className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50/90 rounded-xl border border-slate-200/80 relative"
        >
          {/* Subtle center table line (마주보는 모둠 테이블 중심선) */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-px border-r border-dashed border-slate-300 pointer-events-none"
          />

          {group.seatNumbers.map((rawSeat, seatIdx) => {
            const rollingKey = `${group.groupIndex}-${seatIdx}`;
            const displayNumber = rollingNumbers ? rollingNumbers[rollingKey] : undefined;
            const seatNumber = rawSeat > 0 ? rawSeat : null;

            return (
              <SeatCard
                key={seatIdx}
                seatNumber={isGroupLocked ? seatNumber : null}
                isLocked={isGroupLocked}
                isRolling={isPodRolling}
                displayNumber={displayNumber}
                groupColorIndex={groupColorIndex}
                deskIndex={seatIdx + 1}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
