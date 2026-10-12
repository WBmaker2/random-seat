import React from 'react';
import { PodSeatGroup } from '../utils/seating';
import { DeskPod } from './DeskPod';

export interface ClassroomBoardProps {
  seatingPlan: PodSeatGroup[];
  lockedGroups: Set<number>;
  isRolling: boolean;
  rollingNumbers?: Record<string, number>; // key: `${groupIndex}-${seatIdx}`
  studentCount: number;
  groupCount: number;
}

/**
 * Generates placeholder groups for the idle / pre-roll state,
 * so students and teachers can preview the classroom desk layout.
 */
export function getPlaceholderGroups(studentCount: number, groupCount: number): PodSeatGroup[] {
  const totalStudents = Math.floor(studentCount);
  const totalGroups = Math.floor(groupCount);
  if (totalStudents <= 0 || totalGroups <= 0) return [];
  const validGroups = Math.min(totalGroups, totalStudents);

  const baseCount = Math.floor(totalStudents / validGroups);
  const remainder = totalStudents % validGroups;

  const result: PodSeatGroup[] = [];
  for (let g = 0; g < validGroups; g++) {
    const size = g < remainder ? baseCount + 1 : baseCount;
    result.push({
      groupIndex: g,
      groupName: `${g + 1}모둠`,
      seatNumbers: Array(size).fill(0),
    });
  }

  return result;
}

export const ClassroomBoard: React.FC<ClassroomBoardProps> = ({
  seatingPlan,
  lockedGroups,
  isRolling,
  rollingNumbers,
  studentCount,
  groupCount,
}) => {
  const isPreRoll = seatingPlan.length === 0;
  const displayGroups = isPreRoll
    ? getPlaceholderGroups(studentCount, groupCount)
    : seatingPlan;

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Classroom Orientation Bar (칠판 & 교탁) */}
      <div
        data-testid="blackboard-banner"
        className="relative overflow-hidden rounded-2xl border-4 border-[#8B5A2B] bg-[#1e3f20] shadow-lg text-emerald-50 px-4 py-3 md:px-6 md:py-4"
      >
        {/* Blackboard chalk texture overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
        />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Corridor Cue (복도측) */}
          <div className="flex items-center space-x-1.5 text-xs md:text-sm font-medium text-emerald-200/90 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/50">
            <span className="text-amber-300">←</span>
            <span>복도측 (창가 반대)</span>
          </div>

          {/* Blackboard / Teacher Podium Badge */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-600/60 shadow-inner">
              <span className="text-lg md:text-xl">🏫</span>
              <span className="font-bold text-base md:text-lg tracking-wider text-white">
                칠판 / 교탁 (교실 앞쪽)
              </span>
            </div>
            <span className="text-[11px] text-emerald-300/80 mt-1 font-sans">
              ※ 학생들이 앞쪽 칠판을 바라보는 시점입니다
            </span>
          </div>

          {/* Window Cue (창가측) */}
          <div className="flex items-center space-x-1.5 text-xs md:text-sm font-medium text-emerald-200/90 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/50">
            <span>창가측 (복도 반대)</span>
            <span className="text-amber-300">→</span>
          </div>
        </div>
      </div>

      {/* Classroom Pod Grid */}
      {displayGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white/80 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 space-y-2">
          <span className="text-3xl">📋</span>
          <p className="font-semibold text-base">학생 수와 모둠 수를 설정해주세요 (1명 이상)</p>
          <p className="text-xs text-slate-400">설정한 모둠 수에 맞게 교실 자리 배치도가 표시됩니다.</p>
        </div>
      ) : (
        <div
          data-testid="classroom-pod-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-slate-100/60 rounded-2xl border border-slate-200"
        >
          {displayGroups.map((group) => {
            const isGroupLocked = isPreRoll ? false : lockedGroups.has(group.groupIndex);
            return (
              <DeskPod
                key={group.groupIndex}
                group={group}
                groupColorIndex={group.groupIndex}
                isGroupLocked={isGroupLocked}
                isRolling={isRolling}
                rollingNumbers={rollingNumbers}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
