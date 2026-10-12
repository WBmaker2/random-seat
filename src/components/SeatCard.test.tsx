import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SeatCard, GROUP_COLORS } from './SeatCard';

describe('SeatCard Component', () => {
  it('renders idle empty desk state with "빈 자리" and accessible attributes', () => {
    render(
      <SeatCard
        seatNumber={null}
        isLocked={false}
        isRolling={false}
        deskIndex={1}
      />
    );

    const card = screen.getByTestId('seat-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('aria-label');
    expect(card).toHaveAttribute('data-state', 'idle');
    expect(screen.getByText('빈 자리')).toBeInTheDocument();
    expect(screen.getByText('1번 책상')).toBeInTheDocument();
  });

  it('renders idle state gracefully when deskIndex is omitted', () => {
    render(
      <SeatCard
        seatNumber={null}
        isLocked={false}
        isRolling={false}
      />
    );

    const card = screen.getByTestId('seat-card');
    expect(card).toBeInTheDocument();
    expect(screen.getByText('빈 자리')).toBeInTheDocument();
  });

  it('renders rolling state with displayNumber and dynamic styling', () => {
    render(
      <SeatCard
        seatNumber={null}
        isLocked={false}
        isRolling={true}
        displayNumber={14}
        deskIndex={2}
      />
    );

    const card = screen.getByTestId('seat-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('data-state', 'rolling');
    expect(screen.getByText('14번')).toBeInTheDocument();
    expect(screen.queryByText('빈 자리')).not.toBeInTheDocument();
  });

  it('renders locked state with seatNumber and "번" suffix prominently', () => {
    render(
      <SeatCard
        seatNumber={7}
        isLocked={true}
        isRolling={false}
        deskIndex={3}
      />
    );

    const card = screen.getByTestId('seat-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('data-state', 'locked');
    expect(screen.getByText('7번')).toBeInTheDocument();
    expect(card.getAttribute('aria-label')).toContain('7번');
  });

  it('applies distinct group color accents based on groupColorIndex', () => {
    const { rerender } = render(
      <SeatCard
        seatNumber={5}
        isLocked={true}
        isRolling={false}
        groupColorIndex={0}
      />
    );

    let card = screen.getByTestId('seat-card');
    expect(card).toHaveAttribute('data-group-color');
    const color0 = card.getAttribute('data-group-color');
    expect(GROUP_COLORS.length).toBeGreaterThanOrEqual(6);

    rerender(
      <SeatCard
        seatNumber={5}
        isLocked={true}
        isRolling={false}
        groupColorIndex={1}
      />
    );

    card = screen.getByTestId('seat-card');
    const color1 = card.getAttribute('data-group-color');
    expect(color0).not.toEqual(color1);
  });

  it('contains smooth transition classes and classroom desk styling', () => {
    render(
      <SeatCard
        seatNumber={12}
        isLocked={true}
        isRolling={false}
        groupColorIndex={2}
      />
    );

    const card = screen.getByTestId('seat-card');
    expect(card.className).toContain('transition-all');
    expect(card.className).toContain('duration-300');
  });
});
