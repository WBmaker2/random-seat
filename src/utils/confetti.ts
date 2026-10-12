import confetti from 'canvas-confetti';

/**
 * Trigger celebratory confetti burst across the screen with dual side cannons
 * and a center starburst explosion.
 * Safe in SSR and headless environments.
 */
export function fireConfetti(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Left side cannon
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      disableForReducedMotion: true,
    });

    // Right side cannon
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      disableForReducedMotion: true,
    });

    // Center starburst explosion
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      startVelocity: 35,
      colors: ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#fbbf24'],
      disableForReducedMotion: true,
    });
  } catch {
    // Graceful fallback if canvas is not supported in the running environment
  }
}
