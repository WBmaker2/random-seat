import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SoundEffects } from './sound';
import { fireConfetti } from './confetti';
import confetti from 'canvas-confetti';

vi.mock('canvas-confetti', () => {
  return {
    default: vi.fn(),
  };
});

describe('SoundEffects', () => {
  let originalAudioContext: unknown;

  beforeEach(() => {
    originalAudioContext = (window as unknown as { AudioContext?: unknown }).AudioContext;
  });

  afterEach(() => {
    (window as unknown as { AudioContext?: unknown }).AudioContext = originalAudioContext;
    vi.restoreAllMocks();
  });

  describe('enabled state management', () => {
    it('defaults enabled to true when no argument is passed', () => {
      const sound = new SoundEffects();
      expect(sound.isEnabled()).toBe(true);
    });

    it('respects false passed to constructor', () => {
      const sound = new SoundEffects(false);
      expect(sound.isEnabled()).toBe(false);
    });

    it('respects true passed to constructor', () => {
      const sound = new SoundEffects(true);
      expect(sound.isEnabled()).toBe(true);
    });

    it('toggles enabled status via setEnabled', () => {
      const sound = new SoundEffects();
      expect(sound.isEnabled()).toBe(true);

      sound.setEnabled(false);
      expect(sound.isEnabled()).toBe(false);

      sound.setEnabled(true);
      expect(sound.isEnabled()).toBe(true);
    });
  });

  describe('graceful handling when AudioContext is absent', () => {
    beforeEach(() => {
      delete (window as unknown as { AudioContext?: unknown }).AudioContext;
      delete (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext;
    });

    it('does not throw on playTick when AudioContext is unsupported', () => {
      const sound = new SoundEffects();
      expect(() => sound.playTick()).not.toThrow();
    });

    it('does not throw on playLock when AudioContext is unsupported', () => {
      const sound = new SoundEffects();
      expect(() => sound.playLock()).not.toThrow();
    });

    it('does not throw on playFanfare when AudioContext is unsupported', () => {
      const sound = new SoundEffects();
      expect(() => sound.playFanfare()).not.toThrow();
    });
  });

  describe('audio playback with mocked AudioContext', () => {
    let mockOscillator: {
      type: string;
      frequency: {
        value: number;
        setValueAtTime: ReturnType<typeof vi.fn>;
        exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
      };
      connect: ReturnType<typeof vi.fn>;
      start: ReturnType<typeof vi.fn>;
      stop: ReturnType<typeof vi.fn>;
    };

    let mockGain: {
      gain: {
        value: number;
        setValueAtTime: ReturnType<typeof vi.fn>;
        exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
        linearRampToValueAtTime: ReturnType<typeof vi.fn>;
      };
      connect: ReturnType<typeof vi.fn>;
    };

    let mockCtx: {
      state: AudioContextState;
      currentTime: number;
      resume: ReturnType<typeof vi.fn>;
      createOscillator: ReturnType<typeof vi.fn>;
      createGain: ReturnType<typeof vi.fn>;
      destination: object;
    };

    beforeEach(() => {
      mockOscillator = {
        type: 'sine',
        frequency: {
          value: 440,
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };

      mockGain = {
        gain: {
          value: 1,
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      };

      mockCtx = {
        state: 'suspended',
        currentTime: 0,
        resume: vi.fn().mockResolvedValue(undefined),
        createOscillator: vi.fn().mockReturnValue(mockOscillator),
        createGain: vi.fn().mockReturnValue(mockGain),
        destination: {},
      };

      (window as unknown as { AudioContext: unknown }).AudioContext = vi.fn().mockImplementation(() => mockCtx);
    });

    it('lazy initializes AudioContext and resumes if suspended', () => {
      const sound = new SoundEffects();
      expect(mockCtx.resume).not.toHaveBeenCalled();

      sound.playTick();
      expect(mockCtx.resume).toHaveBeenCalled();
    });

    it('plays tick sound with short duration and high pitch', () => {
      const sound = new SoundEffects();
      sound.playTick();

      expect(mockCtx.createOscillator).toHaveBeenCalled();
      expect(mockCtx.createGain).toHaveBeenCalled();
      expect(mockOscillator.frequency.value).toBeGreaterThanOrEqual(900);
      expect(mockOscillator.frequency.value).toBeLessThanOrEqual(1200);
      expect(mockOscillator.start).toHaveBeenCalled();
      expect(mockOscillator.stop).toHaveBeenCalled();
    });

    it('plays lock sound with punchy frequency ~520Hz', () => {
      const sound = new SoundEffects();
      sound.playLock();

      expect(mockCtx.createOscillator).toHaveBeenCalled();
      expect(mockCtx.createGain).toHaveBeenCalled();
      expect(mockOscillator.frequency.value).toBe(520);
      expect(mockOscillator.start).toHaveBeenCalled();
      expect(mockOscillator.stop).toHaveBeenCalled();
    });

    it('plays fanfare arpeggio chords', () => {
      const sound = new SoundEffects();
      sound.playFanfare();

      // Fanfare plays 4 notes (C5, E5, G5, C6)
      expect(mockCtx.createOscillator).toHaveBeenCalledTimes(4);
      expect(mockOscillator.start).toHaveBeenCalledTimes(4);
      expect(mockOscillator.stop).toHaveBeenCalledTimes(4);
    });

    it('does not play any sounds when disabled', () => {
      const sound = new SoundEffects(false);

      sound.playTick();
      sound.playLock();
      sound.playFanfare();

      expect(mockCtx.createOscillator).not.toHaveBeenCalled();
      expect(mockCtx.createGain).not.toHaveBeenCalled();
    });
  });
});

describe('fireConfetti', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('triggers canvas-confetti calls with side cannons and burst', () => {
    fireConfetti();

    expect(confetti).toHaveBeenCalled();
    const calls = vi.mocked(confetti).mock.calls;
    // Expected to fire multiple bursts: left cannon (angle 60), right cannon (angle 120), center burst
    expect(calls.length).toBeGreaterThanOrEqual(2);

    const angles = calls.map(call => call[0]?.angle);
    expect(angles).toContain(60);
    expect(angles).toContain(120);
  });

  it('safely runs without throwing when window is undefined', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error simulating ssr
    delete globalThis.window;

    try {
      expect(() => fireConfetti()).not.toThrow();
    } finally {
      globalThis.window = originalWindow;
    }
  });
});
