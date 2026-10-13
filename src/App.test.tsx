import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

vi.mock('./utils/confetti', () => ({
  fireConfetti: vi.fn(),
}));

describe('App Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders classroom header and initial controls', () => {
    render(<App />);

    expect(screen.getByText('우리 반 자리 뽑기')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /자리 뽑기/i })).toBeInTheDocument();
    expect(screen.getByText(/칠판 \/ 교탁/i)).toBeInTheDocument();
  });

  it('allows changing student and group count and triggers presets', () => {
    const { container } = render(<App />);

    // Click 20명 4모둠 preset
    const preset20 = screen.getByRole('button', { name: /20명 4모둠/i });
    fireEvent.click(preset20);

    const studentInput = container.querySelector('#student-count-input') as HTMLInputElement;
    const groupInput = container.querySelector('#group-count-input') as HTMLInputElement;

    expect(studentInput.value).toBe('20');
    expect(groupInput.value).toBe('4');
  });

  it('executes roll animation lifecycle to completion', () => {
    render(<App />);

    const rollBtn = screen.getByRole('button', { name: /자리 뽑기/i });
    fireEvent.click(rollBtn);

    // Fast-forward interval and staggered timers
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Should now show "다시 뽑기"
    expect(screen.getByRole('button', { name: /다시 뽑기/i })).toBeInTheDocument();
  });

  it('resets state when reset button is clicked', () => {
    render(<App />);

    const rollBtn = screen.getByRole('button', { name: /자리 뽑기/i });
    fireEvent.click(rollBtn);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const resetBtn = screen.getByRole('button', { name: /초기화/i });
    fireEvent.click(resetBtn);

    expect(screen.getByRole('button', { name: /자리 뽑기/i })).toBeInTheDocument();
  });
});
