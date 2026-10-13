import React from 'react';
import {
  Users,
  LayoutGrid,
  Minus,
  Plus,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Printer,
  RotateCcw,
  Dices,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export interface ControlPanelProps {
  studentCount: number;
  groupCount: number;
  onStudentCountChange: (count: number) => void;
  onGroupCountChange: (count: number) => void;
  onRoll: () => void;
  onReset: () => void;
  isRolling: boolean;
  isCompleted: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onPrint: () => void;
}

interface PresetOption {
  studentCount: number;
  groupCount: number;
  label: string;
  subLabel: string;
}

const PRESETS: PresetOption[] = [
  { studentCount: 20, groupCount: 4, label: '20명 4모둠', subLabel: '5명씩' },
  { studentCount: 24, groupCount: 6, label: '24명 6모둠', subLabel: '4명씩' },
  { studentCount: 28, groupCount: 7, label: '28명 7모둠', subLabel: '4명씩' },
  { studentCount: 30, groupCount: 6, label: '30명 6모둠', subLabel: '5명씩' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  studentCount,
  groupCount,
  onStudentCountChange,
  onGroupCountChange,
  onRoll,
  onReset,
  isRolling,
  isCompleted,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  onPrint,
}) => {
  const isInvalid = studentCount < groupCount || studentCount < 1 || groupCount < 1;

  const handleStudentDecrement = () => {
    if (studentCount > 1 && !isRolling) {
      onStudentCountChange(Math.max(1, studentCount - 1));
    }
  };

  const handleStudentIncrement = () => {
    if (studentCount < 60 && !isRolling) {
      onStudentCountChange(Math.min(60, studentCount + 1));
    }
  };

  const handleGroupDecrement = () => {
    if (groupCount > 1 && !isRolling) {
      onGroupCountChange(Math.max(1, groupCount - 1));
    }
  };

  const handleGroupIncrement = () => {
    if (groupCount < 15 && !isRolling) {
      onGroupCountChange(Math.min(15, groupCount + 1));
    }
  };

  const handleStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onStudentCountChange(val);
    }
  };

  const handleGroupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onGroupCountChange(val);
    }
  };

  const rollButtonLabel = isRolling
    ? '자리 뽑는 중...'
    : isCompleted
    ? '다시 뽑기'
    : '자리 뽑기';

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border-2 border-emerald-100 shadow-xl p-4 sm:p-6 space-y-5 transition-all">
      {/* Top Grid: Input Cards and Quick Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Student Count Card */}
        <div className="lg:col-span-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="student-count-input"
              className="flex items-center space-x-2 text-sm font-bold text-emerald-950"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>학생 수</span>
            </label>
            <span className="text-xs font-semibold text-emerald-600/80 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              1 ~ 60명
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              aria-label="학생 수 감소"
              disabled={isRolling || studentCount <= 1}
              onClick={handleStudentDecrement}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/70 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm font-bold"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="relative flex-1">
              <input
                id="student-count-input"
                aria-label="학생 수"
                type="number"
                min={1}
                max={60}
                value={studentCount}
                disabled={isRolling}
                onChange={handleStudentInputChange}
                className="w-full text-center text-xl font-extrabold text-emerald-950 bg-white border border-emerald-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner disabled:bg-emerald-100/50 disabled:text-emerald-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-600 pointer-events-none">
                명
              </span>
            </div>
            <button
              type="button"
              aria-label="학생 수 증가"
              disabled={isRolling || studentCount >= 60}
              onClick={handleStudentIncrement}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/70 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Group Count Card */}
        <div className="lg:col-span-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="group-count-input"
              className="flex items-center space-x-2 text-sm font-bold text-emerald-950"
            >
              <LayoutGrid className="w-4 h-4 text-emerald-600" />
              <span>모둠 수</span>
            </label>
            <span className="text-xs font-semibold text-emerald-600/80 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              1 ~ 15모둠
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              aria-label="모둠 수 감소"
              disabled={isRolling || groupCount <= 1}
              onClick={handleGroupDecrement}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/70 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm font-bold"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="relative flex-1">
              <input
                id="group-count-input"
                aria-label="모둠 수"
                type="number"
                min={1}
                max={15}
                value={groupCount}
                disabled={isRolling}
                onChange={handleGroupInputChange}
                className="w-full text-center text-xl font-extrabold text-emerald-950 bg-white border border-emerald-300 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner disabled:bg-emerald-100/50 disabled:text-emerald-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-600 pointer-events-none">
                모둠
              </span>
            </div>
            <button
              type="button"
              aria-label="모둠 수 증가"
              disabled={isRolling || groupCount >= 15}
              onClick={handleGroupIncrement}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/70 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="lg:col-span-4 bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center space-x-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-950">빠른 프리셋</span>
            <span className="text-[11px] text-amber-700/80 font-medium">(클릭 시 자동 설정)</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => {
              const isActive =
                studentCount === preset.studentCount && groupCount === preset.groupCount;
              return (
                <button
                  key={preset.label}
                  type="button"
                  aria-label={`${preset.label} (${preset.subLabel})`}
                  disabled={isRolling}
                  onClick={() => {
                    onStudentCountChange(preset.studentCount);
                    onGroupCountChange(preset.groupCount);
                  }}
                  className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-lg border text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
                    isActive
                      ? 'bg-amber-600 border-amber-700 text-white shadow-md ring-2 ring-amber-400/50'
                      : 'bg-white border-amber-200/90 text-amber-950 hover:bg-amber-100/70 hover:border-amber-300'
                  }`}
                >
                  <span>{preset.label}</span>
                  <span
                    className={`text-[10px] font-normal ${
                      isActive ? 'text-amber-100' : 'text-amber-700/80'
                    }`}
                  >
                    ({preset.subLabel})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Validation Banner when studentCount < groupCount */}
      {studentCount < groupCount && (
        <div
          role="alert"
          className="flex items-center space-x-3 bg-rose-50 border-2 border-rose-300 text-rose-800 px-4 py-3 rounded-xl shadow-sm animate-pop-in"
        >
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">
            {`학생 수(${studentCount}명)가 모둠 수(${groupCount}모둠)보다 적습니다. 모둠 수 이하로는 편성할 수 없습니다.`}
          </p>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-emerald-100/80">
        {/* Primary Action Button (🎲 자리 뽑기 / 🔄 다시 뽑기) & Reset Button */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          <button
            type="button"
            aria-label={rollButtonLabel}
            disabled={isRolling || isInvalid}
            onClick={onRoll}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-extrabold text-base md:text-lg transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isCompleted
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-amber-500/25'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/30 ring-2 ring-emerald-400/30'
            }`}
          >
            {isCompleted ? (
              <RotateCcw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            ) : (
              <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            )}
            <span>{rollButtonLabel}</span>
          </button>

          <button
            type="button"
            aria-label="초기화"
            disabled={isRolling}
            onClick={onReset}
            className="flex items-center space-x-1 px-3.5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            title="초기화"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">초기화</span>
          </button>
        </div>

        {/* Utility Icon Buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {/* Sound Toggle */}
          <button
            type="button"
            aria-label={soundEnabled ? '효과음 켜짐' : '효과음 꺼짐'}
            onClick={onToggleSound}
            className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 ${
              soundEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'
            }`}
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
            <span className="hidden md:inline">
              {soundEnabled ? '효과음 켜짐' : '효과음 꺼짐'}
            </span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            aria-label={isFullscreen ? '전체화면 해제 (창 모드)' : '전체화면 모드'}
            onClick={onToggleFullscreen}
            className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 ${
              isFullscreen
                ? 'bg-indigo-50 border-indigo-300 text-indigo-800 hover:bg-indigo-100'
                : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title={isFullscreen ? '창 모드로 전환' : '전체화면으로 전환'}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-indigo-600" />
            ) : (
              <Maximize className="w-4 h-4 text-slate-600" />
            )}
            <span className="hidden md:inline">
              {isFullscreen ? '창 모드' : '전체화면'}
            </span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            aria-label="배치표 인쇄"
            onClick={onPrint}
            className="flex items-center space-x-1.5 px-3 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
            title="배치표 인쇄 / PDF 저장"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden md:inline">인쇄/저장</span>
          </button>
        </div>
      </div>
    </div>
  );
};
