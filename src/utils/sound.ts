/**
 * Web Audio API synthesizer for interactive seating lottery effects.
 * Provides lightweight, zero-dependency synthesizers for slot roll ticks,
 * lock punch sounds, and celebration fanfares.
 */
export class SoundEffects {
  private enabled: boolean;
  private ctx: AudioContext | null = null;

  constructor(enabled: boolean = true) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public close(): void {
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') {
      return null;
    }

    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          this.ctx = null;
        }
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Autoplay policy may block resume until user gesture
      });
    }

    return this.ctx;
  }

  /**
   * Fast, short high-pitch click for rapid rolling slots.
   * Frequency 900Hz~1200Hz, duration ~0.03s.
   */
  public playTick(): void {
    if (!this.enabled) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = 1050; // In 900Hz~1200Hz range

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    } catch {
      // Graceful fallback if Web Audio fails
    }
  }

  /**
   * Crisp punchy lock sound for when a seat/group finishes rolling and settles.
   * Triangle/sine wave, frequency 520Hz with quick decay ~0.15s.
   */
  public playLock(): void {
    if (!this.enabled) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = 520;

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Triumphant C major chord arpeggio played when the entire lottery finishes.
   * C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
   * Timed sequence: 0ms, 120ms, 240ms, 380ms.
   */
  public playFanfare(): void {
    if (!this.enabled) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, delay: 0.0, duration: 0.18, vol: 0.2 },
        { freq: 659.25, delay: 0.12, duration: 0.18, vol: 0.22 },
        { freq: 783.99, delay: 0.24, duration: 0.2, vol: 0.25 },
        { freq: 1046.5, delay: 0.38, duration: 0.5, vol: 0.3 },
      ];

      notes.forEach(({ freq, delay, duration, vol }) => {
        const startTime = now + delay;
        const stopTime = startTime + duration;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(vol, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, stopTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(stopTime);

        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
      });
    } catch {
      // Graceful fallback
    }
  }
}

export const soundEffects = new SoundEffects();
