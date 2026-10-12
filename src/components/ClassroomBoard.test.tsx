import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClassroomBoard } from './ClassroomBoard';
import { DeskPod } from './DeskPod';
import { PodSeatGroup } from '../utils/seating';

describe('ClassroomBoard Component', () => {
  const sampleSeatingPlan: PodSeatGroup[] = [
    {
      groupIndex: 0,
      groupName: '1모둠',
      seatNumbers: [1, 2, 3, 4],
    },
    {
      groupIndex: 1,
      groupName: '2모둠',
      seatNumbers: [5, 6, 7, 8],
    },
    {
      groupIndex: 2,
      groupName: '3모둠',
      seatNumbers: [9, 10, 11, 12],
    },
  ];

  it('renders "칠판 / 교탁" orientation bar at the top of the classroom board with classroom direction cues', () => {
    render(
      <ClassroomBoard
        seatingPlan={sampleSeatingPlan}
        lockedGroups={new Set([0, 1, 2])}
        isRolling={false}
        studentCount={12}
        groupCount={3}
      />
    );

    // Orientation bar
    const blackboard = screen.getByTestId('blackboard-banner');
    expect(blackboard).toBeInTheDocument();
    expect(blackboard).toHaveTextContent(/칠판 \/ 교탁/);

    // Direction cues (복도 & 창가)
    expect(screen.getByText(/복도측/)).toBeInTheDocument();
    expect(screen.getByText(/창가측/)).toBeInTheDocument();
  });

  it('renders all groups in seatingPlan with their group names and member counts', () => {
    render(
      <ClassroomBoard
        seatingPlan={sampleSeatingPlan}
        lockedGroups={new Set([0, 1, 2])}
        isRolling={false}
        studentCount={12}
        groupCount={3}
      />
    );

    expect(screen.getByText('1모둠')).toBeInTheDocument();
    expect(screen.getByText('2모둠')).toBeInTheDocument();
    expect(screen.getByText('3모둠')).toBeInTheDocument();

    const countBadges = screen.getAllByText('4명');
    expect(countBadges).toHaveLength(3);
  });

  it('arranges desks in each pod in facing pairs (2 columns layout)', () => {
    render(
      <ClassroomBoard
        seatingPlan={sampleSeatingPlan}
        lockedGroups={new Set([0])}
        isRolling={false}
        studentCount={12}
        groupCount={3}
      />
    );

    const deskGrids = screen.getAllByTestId('facing-desk-grid');
    expect(deskGrids.length).toBeGreaterThanOrEqual(1);

    // Verify 2-column grid class for facing desk arrangement
    deskGrids.forEach((grid) => {
      expect(grid.className).toContain('grid-cols-2');
    });

    // Check desk indices within group 1
    expect(screen.getAllByText('1번 책상').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('2번 책상').length).toBeGreaterThanOrEqual(1);
  });

  it('renders placeholder pods according to studentCount and groupCount in pre-roll / idle state', () => {
    render(
      <ClassroomBoard
        seatingPlan={[]}
        lockedGroups={new Set()}
        isRolling={false}
        studentCount={24}
        groupCount={6}
      />
    );

    // 6 placeholder pods should be rendered
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`${i}모둠`)).toBeInTheDocument();
    }

    // All seats should be in idle '빈 자리' state
    const emptySeats = screen.getAllByText('빈 자리');
    expect(emptySeats).toHaveLength(24);

    // Status indicator should show "대기 중"
    const idleBadges = screen.getAllByText('대기 중');
    expect(idleBadges).toHaveLength(6);
  });

  it('displays correct status indicators for locked and rolling groups', () => {
    const rollingNumbers: Record<string, number> = {
      '1-0': 15,
      '1-1': 16,
      '1-2': 17,
      '1-3': 18,
    };

    render(
      <ClassroomBoard
        seatingPlan={sampleSeatingPlan}
        lockedGroups={new Set([0])}
        isRolling={true}
        rollingNumbers={rollingNumbers}
        studentCount={12}
        groupCount={3}
      />
    );

    // Group 0 is locked: "배정 완료"
    expect(screen.getAllByText('배정 완료').length).toBeGreaterThanOrEqual(1);

    // Group 1 and 2 are not locked, rolling is active: "추첨 중"
    const rollingBadges = screen.getAllByText('추첨 중');
    expect(rollingBadges).toHaveLength(2);

    // Group 0 should show its fixed student numbers
    expect(screen.getByText('1번')).toBeInTheDocument();
    expect(screen.getByText('2번')).toBeInTheDocument();
    expect(screen.getByText('3번')).toBeInTheDocument();
    expect(screen.getByText('4번')).toBeInTheDocument();

    // Group 1 is rolling with rolling numbers
    expect(screen.getByText('15번')).toBeInTheDocument();
  });

  it('handles empty classroom gracefully when studentCount or groupCount is 0', () => {
    render(
      <ClassroomBoard
        seatingPlan={[]}
        lockedGroups={new Set()}
        isRolling={false}
        studentCount={0}
        groupCount={0}
      />
    );

    expect(screen.getByTestId('blackboard-banner')).toBeInTheDocument();
    expect(screen.getByText(/학생 수와 모둠 수를 설정해주세요/)).toBeInTheDocument();
  });

  it('renders uneven student distribution accurately in placeholder mode (e.g. 25 students into 6 groups)', () => {
    render(
      <ClassroomBoard
        seatingPlan={[]}
        lockedGroups={new Set()}
        isRolling={false}
        studentCount={25}
        groupCount={6}
      />
    );

    // Group 1 has 5 members, groups 2~6 have 4 members
    expect(screen.getByText('5명')).toBeInTheDocument();
    expect(screen.getAllByText('4명')).toHaveLength(5);
    expect(screen.getAllByText('빈 자리')).toHaveLength(25);
  });
});

describe('DeskPod Component', () => {
  it('renders pod with group badge, member count, and idle state', () => {
    render(
      <DeskPod
        group={{ groupIndex: 0, groupName: '3모둠', seatNumbers: [0, 0, 0, 0] }}
        groupColorIndex={2}
        isGroupLocked={false}
        isRolling={false}
      />
    );

    expect(screen.getByText('3모둠')).toBeInTheDocument();
    expect(screen.getByText('4명')).toBeInTheDocument();
    expect(screen.getByText('대기 중')).toBeInTheDocument();
  });

  it('renders pod in rolling state', () => {
    render(
      <DeskPod
        group={{ groupIndex: 1, groupName: '2모둠', seatNumbers: [1, 2, 3, 4] }}
        groupColorIndex={1}
        isGroupLocked={false}
        isRolling={true}
        rollingNumbers={{ '1-0': 99 }}
      />
    );

    expect(screen.getByText('추첨 중')).toBeInTheDocument();
    expect(screen.getByText('99번')).toBeInTheDocument();
  });

  it('renders pod in locked state', () => {
    render(
      <DeskPod
        group={{ groupIndex: 2, groupName: '3모둠', seatNumbers: [11, 12, 13, 14] }}
        groupColorIndex={2}
        isGroupLocked={true}
        isRolling={false}
      />
    );

    const lockedLabels = screen.getAllByText('배정 완료');
    expect(lockedLabels.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('11번')).toBeInTheDocument();
    expect(screen.getByText('14번')).toBeInTheDocument();
  });
});


