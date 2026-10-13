import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ControlPanel, ControlPanelProps } from './ControlPanel';

describe('ControlPanel Component', () => {
  const defaultProps: ControlPanelProps = {
    studentCount: 24,
    groupCount: 6,
    onStudentCountChange: vi.fn(),
    onGroupCountChange: vi.fn(),
    onRoll: vi.fn(),
    onReset: vi.fn(),
    isRolling: false,
    isCompleted: false,
    soundEnabled: true,
    onToggleSound: vi.fn(),
    isFullscreen: false,
    onToggleFullscreen: vi.fn(),
    onPrint: vi.fn(),
  };

  const renderComponent = (props: Partial<ControlPanelProps> = {}) => {
    return render(<ControlPanel {...defaultProps} {...props} />);
  };

  describe('Student and Group Count Inputs & Steppers', () => {
    it('renders current studentCount and groupCount in numeric inputs', () => {
      renderComponent({ studentCount: 28, groupCount: 7 });

      const studentInput = screen.getByLabelText('학생 수') as HTMLInputElement;
      const groupInput = screen.getByLabelText('모둠 수') as HTMLInputElement;

      expect(studentInput).toBeInTheDocument();
      expect(studentInput.value).toBe('28');
      expect(groupInput).toBeInTheDocument();
      expect(groupInput.value).toBe('7');
    });

    it('triggers onStudentCountChange on direct input change', () => {
      const onStudentCountChange = vi.fn();
      renderComponent({ onStudentCountChange });

      const studentInput = screen.getByLabelText('학생 수');
      fireEvent.change(studentInput, { target: { value: '30' } });

      expect(onStudentCountChange).toHaveBeenCalledWith(30);
    });

    it('triggers onGroupCountChange on direct input change', () => {
      const onGroupCountChange = vi.fn();
      renderComponent({ onGroupCountChange });

      const groupInput = screen.getByLabelText('모둠 수');
      fireEvent.change(groupInput, { target: { value: '8' } });

      expect(onGroupCountChange).toHaveBeenCalledWith(8);
    });

    it('increments and decrements student count via stepper buttons', () => {
      const onStudentCountChange = vi.fn();
      renderComponent({ studentCount: 24, onStudentCountChange });

      const decrementBtn = screen.getByRole('button', { name: /학생 수 감소/i });
      const incrementBtn = screen.getByRole('button', { name: /학생 수 증가/i });

      fireEvent.click(decrementBtn);
      expect(onStudentCountChange).toHaveBeenCalledWith(23);

      fireEvent.click(incrementBtn);
      expect(onStudentCountChange).toHaveBeenCalledWith(25);
    });

    it('increments and decrements group count via stepper buttons', () => {
      const onGroupCountChange = vi.fn();
      renderComponent({ groupCount: 6, onGroupCountChange });

      const decrementBtn = screen.getByRole('button', { name: /모둠 수 감소/i });
      const incrementBtn = screen.getByRole('button', { name: /모둠 수 증가/i });

      fireEvent.click(decrementBtn);
      expect(onGroupCountChange).toHaveBeenCalledWith(5);

      fireEvent.click(incrementBtn);
      expect(onGroupCountChange).toHaveBeenCalledWith(7);
    });

    it('clamps stepper changes within min/max bounds (students: 1~60, groups: 1~15)', () => {
      const onStudentCountChange = vi.fn();
      const onGroupCountChange = vi.fn();

      const { rerender } = render(
        <ControlPanel
          {...defaultProps}
          studentCount={1}
          groupCount={1}
          onStudentCountChange={onStudentCountChange}
          onGroupCountChange={onGroupCountChange}
        />
      );

      const studentDecBtn = screen.getByRole('button', { name: /학생 수 감소/i });
      const groupDecBtn = screen.getByRole('button', { name: /모둠 수 감소/i });

      fireEvent.click(studentDecBtn);
      expect(onStudentCountChange).not.toHaveBeenCalled();

      fireEvent.click(groupDecBtn);
      expect(onGroupCountChange).not.toHaveBeenCalled();

      rerender(
        <ControlPanel
          {...defaultProps}
          studentCount={60}
          groupCount={15}
          onStudentCountChange={onStudentCountChange}
          onGroupCountChange={onGroupCountChange}
        />
      );

      const studentIncBtn = screen.getByRole('button', { name: /학생 수 증가/i });
      const groupIncBtn = screen.getByRole('button', { name: /모둠 수 증가/i });

      fireEvent.click(studentIncBtn);
      expect(onStudentCountChange).not.toHaveBeenCalled();

      fireEvent.click(groupIncBtn);
      expect(onGroupCountChange).not.toHaveBeenCalled();
    });
  });

  describe('Quick Presets', () => {
    it('renders all quick preset buttons', () => {
      renderComponent();

      expect(screen.getByRole('button', { name: /20명 4모둠/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /24명 6모둠/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /28명 7모둠/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /30명 6모둠/i })).toBeInTheDocument();
    });

    it('sets studentCount to 24 and groupCount to 6 when clicking [24명 6모둠] preset', () => {
      const onStudentCountChange = vi.fn();
      const onGroupCountChange = vi.fn();

      renderComponent({ onStudentCountChange, onGroupCountChange });

      const preset24Btn = screen.getByRole('button', { name: /24명 6모둠/i });
      fireEvent.click(preset24Btn);

      expect(onStudentCountChange).toHaveBeenCalledWith(24);
      expect(onGroupCountChange).toHaveBeenCalledWith(6);
    });

    it('sets studentCount to 20 and groupCount to 4 when clicking [20명 4모둠] preset', () => {
      const onStudentCountChange = vi.fn();
      const onGroupCountChange = vi.fn();

      renderComponent({ onStudentCountChange, onGroupCountChange });

      const preset20Btn = screen.getByRole('button', { name: /20명 4모둠/i });
      fireEvent.click(preset20Btn);

      expect(onStudentCountChange).toHaveBeenCalledWith(20);
      expect(onGroupCountChange).toHaveBeenCalledWith(4);
    });
  });

  describe('Roll and Reset Buttons', () => {
    it('shows "자리 뽑기" when isCompleted is false', () => {
      renderComponent({ isCompleted: false });

      const rollBtn = screen.getByRole('button', { name: /자리 뽑기/i });
      expect(rollBtn).toBeInTheDocument();
      expect(rollBtn).toHaveTextContent(/자리 뽑기/);
    });

    it('shows "다시 뽑기" when isCompleted is true', () => {
      renderComponent({ isCompleted: true });

      const rerollBtn = screen.getByRole('button', { name: /다시 뽑기/i });
      expect(rerollBtn).toBeInTheDocument();
      expect(rerollBtn).toHaveTextContent(/다시 뽑기/);
    });

    it('calls onRoll when the roll button is clicked', () => {
      const onRoll = vi.fn();
      renderComponent({ onRoll, isRolling: false });

      const rollBtn = screen.getByRole('button', { name: /자리 뽑기/i });
      fireEvent.click(rollBtn);

      expect(onRoll).toHaveBeenCalledTimes(1);
    });

    it('calls onReset when reset button is clicked', () => {
      const onReset = vi.fn();
      renderComponent({ onReset });

      const resetBtn = screen.getByRole('button', { name: /초기화/i });
      fireEvent.click(resetBtn);

      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('Disabled States when isRolling is true', () => {
    it('disables roll button, stepper buttons, input fields, and presets during isRolling', () => {
      renderComponent({ isRolling: true });

      const rollBtn = screen.getByRole('button', { name: /추첨 중|자리 뽑기|뽑는 중/i });
      expect(rollBtn).toBeDisabled();

      const studentInput = screen.getByLabelText('학생 수');
      const groupInput = screen.getByLabelText('모둠 수');
      expect(studentInput).toBeDisabled();
      expect(groupInput).toBeDisabled();

      const studentDecBtn = screen.getByRole('button', { name: /학생 수 감소/i });
      const studentIncBtn = screen.getByRole('button', { name: /학생 수 증가/i });
      const groupDecBtn = screen.getByRole('button', { name: /모둠 수 감소/i });
      const groupIncBtn = screen.getByRole('button', { name: /모둠 수 증가/i });
      expect(studentDecBtn).toBeDisabled();
      expect(studentIncBtn).toBeDisabled();
      expect(groupDecBtn).toBeDisabled();
      expect(groupIncBtn).toBeDisabled();

      const preset24Btn = screen.getByRole('button', { name: /24명 6모둠/i });
      expect(preset24Btn).toBeDisabled();

      const resetBtn = screen.getByRole('button', { name: /초기화/i });
      expect(resetBtn).toBeDisabled();
    });
  });

  describe('Validation Banner and Roll Button State', () => {
    it('displays validation message when studentCount < groupCount and disables roll button', () => {
      renderComponent({ studentCount: 4, groupCount: 6 });

      const expectedWarning = '학생 수(4명)가 모둠 수(6모둠)보다 적습니다. 모둠 수 이하로는 편성할 수 없습니다.';
      expect(screen.getByText(expectedWarning)).toBeInTheDocument();

      const rollBtn = screen.getByRole('button', { name: /자리 뽑기/i });
      expect(rollBtn).toBeDisabled();
    });

    it('does not display validation warning when studentCount >= groupCount', () => {
      renderComponent({ studentCount: 24, groupCount: 6 });

      expect(screen.queryByText(/모둠 수 이하로는 편성할 수 없습니다/i)).not.toBeInTheDocument();

      const rollBtn = screen.getByRole('button', { name: /자리 뽑기/i });
      expect(rollBtn).not.toBeDisabled();
    });
  });

  describe('Utility Actions (Sound, Fullscreen, Print)', () => {
    it('calls onToggleSound when sound button is clicked', () => {
      const onToggleSound = vi.fn();
      renderComponent({ soundEnabled: true, onToggleSound });

      const soundBtn = screen.getByRole('button', { name: /효과음/i });
      fireEvent.click(soundBtn);

      expect(onToggleSound).toHaveBeenCalledTimes(1);
    });

    it('calls onToggleFullscreen when fullscreen button is clicked', () => {
      const onToggleFullscreen = vi.fn();
      renderComponent({ isFullscreen: false, onToggleFullscreen });

      const fsBtn = screen.getByRole('button', { name: /전체화면/i });
      fireEvent.click(fsBtn);

      expect(onToggleFullscreen).toHaveBeenCalledTimes(1);
    });

    it('calls onPrint when print button is clicked', () => {
      const onPrint = vi.fn();
      renderComponent({ onPrint });

      const printBtn = screen.getByRole('button', { name: /인쇄|배치표 인쇄|출력/i });
      fireEvent.click(printBtn);

      expect(onPrint).toHaveBeenCalledTimes(1);
    });
  });
});
