import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from './Header';

describe('Header Component', () => {
  it('renders classroom title and subtitle', () => {
    render(<Header />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('우리 반 자리 뽑기');
    expect(screen.getByText('학생 번호로 공평하고 신나게 뽑는 자리 배치표')).toBeInTheDocument();
  });

  it('renders feature badges', () => {
    render(<Header />);

    expect(screen.getByText(/✨ 1번부터 무작위 추첨/)).toBeInTheDocument();
    expect(screen.getByText(/⚡ 슬롯머신 롤링 & 효과음/)).toBeInTheDocument();
  });

  it('has chalkboard aesthetic classes', () => {
    const { container } = render(<Header />);
    const headerElement = container.querySelector('header');

    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveClass('border-[#8B5A2B]');
  });
});
