import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { ClassroomBoard } from './components/ClassroomBoard';
import { PodSeatGroup, generateSeatingPlan } from './utils/seating';
import { soundEffects } from './utils/sound';
import { fireConfetti } from './utils/confetti';

export const App: React.FC = () => {
  // Configuration state
  const [studentCount, setStudentCount] = useState<number>(24);
  const [groupCount, setGroupCount] = useState<number>(6);

  // Lottery state
  const [seatingPlan, setSeatingPlan] = useState<PodSeatGroup[]>([]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [lockedGroups, setLockedGroups] = useState<Set<number>>(new Set());
  const [rollingNumbers, setRollingNumbers] = useState<Record<string, number>>({});

  // Environment & settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Animation interval and timeout references for cleanup
  const rollIntervalRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);

  // Keep soundEffects enabled state synchronized
  useEffect(() => {
    soundEffects.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Cleanup all animation timers
  const clearAllTimers = useCallback(() => {
    if (rollIntervalRef.current !== null) {
      window.clearInterval(rollIntervalRef.current);
      rollIntervalRef.current = null;
    }
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
      soundEffects.close();
    };
  }, [clearAllTimers]);

  // Handle Lottery Roll with Sequential Locking Animation
  const handleRoll = useCallback(() => {
    if (isRolling) return;
    if (studentCount < groupCount || studentCount <= 0 || groupCount <= 0) return;

    // 1. Clear previous timers
    clearAllTimers();

    // 2. Generate final randomized plan using Fisher-Yates and Round-Robin
    const finalPlan = generateSeatingPlan(studentCount, groupCount);
    setSeatingPlan(finalPlan);
    setIsRolling(true);
    setIsCompleted(false);
    setLockedGroups(new Set());

    // 3. Start high-speed slot-machine rolling animation
    rollIntervalRef.current = window.setInterval(() => {
      soundEffects.playTick();
      const nextRollingMap: Record<string, number> = {};
      finalPlan.forEach((group) => {
        group.seatNumbers.forEach((_, seatIdx) => {
          // Generate a random student number between 1 and studentCount
          nextRollingMap[`${group.groupIndex}-${seatIdx}`] =
            Math.floor(Math.random() * studentCount) + 1;
        });
      });
      setRollingNumbers(nextRollingMap);
    }, 60);

    // 4. Staggered group-by-group locking for suspense and anticipation
    const baseInitialDelay = 1200; // roll for 1.2s before the first group locks
    const staggerInterval = 380; // each group settles 380ms after the previous

    finalPlan.forEach((group, index) => {
      const lockDelay = baseInitialDelay + index * staggerInterval;
      const timerId = window.setTimeout(() => {
        // Lock this group in place
        setLockedGroups((prev) => {
          const next = new Set(prev);
          next.add(group.groupIndex);
          return next;
        });
        soundEffects.playLock();

        // If this is the last group to lock, finish lottery
        if (index === finalPlan.length - 1) {
          if (rollIntervalRef.current !== null) {
            window.clearInterval(rollIntervalRef.current);
            rollIntervalRef.current = null;
          }
          setIsRolling(false);
          setIsCompleted(true);

          // Triumphant celebration
          soundEffects.playFanfare();
          fireConfetti();
        }
      }, lockDelay);

      timersRef.current.push(timerId);
    });
  }, [isRolling, studentCount, groupCount, clearAllTimers]);

  // Handle Reset
  const handleReset = useCallback(() => {
    clearAllTimers();
    setIsRolling(false);
    setIsCompleted(false);
    setLockedGroups(new Set());
    setRollingNumbers({});
    setSeatingPlan([]);
  }, [clearAllTimers]);

  // Keyboard shortcut listener (Space or Enter to roll/re-roll)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input element
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        if (!isRolling) {
          handleRoll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRolling, handleRoll]);

  // Toggle sound
  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  // Toggle fullscreen
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Print layout
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white print:bg-white print:p-0">
      {/* Header Banner */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col space-y-6">
        {/* Interactive Control Panel */}
        <div className="print:hidden">
          <ControlPanel
            studentCount={studentCount}
            groupCount={groupCount}
            onStudentCountChange={(count) => {
              if (!isRolling) setStudentCount(count);
            }}
            onGroupCountChange={(count) => {
              if (!isRolling) setGroupCount(count);
            }}
            onRoll={handleRoll}
            onReset={handleReset}
            isRolling={isRolling}
            isCompleted={isCompleted}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            onPrint={handlePrint}
          />
        </div>

        {/* Classroom Blackboard and Desk Pod Grid */}
        <div className="flex-1 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 print:p-0 print:border-none print:shadow-none">
          <ClassroomBoard
            seatingPlan={seatingPlan}
            lockedGroups={lockedGroups}
            isRolling={isRolling}
            rollingNumbers={rollingNumbers}
            studentCount={studentCount}
            groupCount={groupCount}
          />
        </div>

        {/* Footer info note */}
        <footer className="text-center text-xs text-slate-400 py-3 print:hidden flex items-center justify-center space-x-2">
          <span>💡 단축키: <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-slate-600">Space</kbd> 또는 <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-slate-600">Enter</kbd> 키로 자리 뽑기 가능</span>
          <span>•</span>
          <span>학생 이름 없이 1번부터 번호로만 공정하게 배정됩니다.</span>
        </footer>
      </main>
    </div>
  );
};

export default App;
