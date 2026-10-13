import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="relative w-full overflow-hidden rounded-2xl border-4 border-[#8B5A2B] bg-[#1e3f20] px-6 py-6 md:py-8 shadow-xl text-white">
      {/* Blackboard chalk texture overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
        {/* Title and Subtitle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <span className="text-3xl md:text-4xl select-none" role="img" aria-label="칠판">
              🎓
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-50 drop-shadow-sm font-sans">
              우리 반 자리 뽑기
            </h1>
          </div>
          <p className="text-sm md:text-base text-emerald-200/90 font-medium">
            학생 번호로 공평하고 신나게 뽑는 자리 배치표
          </p>
        </div>

        {/* Clean Badges */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5">
          <div className="inline-flex items-center rounded-full bg-emerald-900/80 px-3.5 py-1.5 text-xs md:text-sm font-semibold text-emerald-200 border border-emerald-600/50 shadow-sm backdrop-blur-sm">
            ✨ 1번부터 무작위 추첨
          </div>
          <div className="inline-flex items-center rounded-full bg-amber-950/80 px-3.5 py-1.5 text-xs md:text-sm font-semibold text-amber-200 border border-amber-600/50 shadow-sm backdrop-blur-sm">
            ⚡ 슬롯머신 롤링 &amp; 효과음
          </div>
        </div>
      </div>
    </header>
  );
};
