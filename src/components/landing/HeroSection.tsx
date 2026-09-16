import { Link } from 'react-router-dom';
import { ArrowDown, Leaf } from 'lucide-react';

// ─── HeroSection 컴포넌트 ──────────────────────────────────────
export function HeroSection() {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#1a4a2e] px-4 text-white">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* 장식 원형 */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#2d7a4f] opacity-30 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#4ade80] opacity-20 blur-3xl" />

      {/* 네비게이션 */}
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 md:px-12">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">파우 오피스</span>
        </div>

        {/* 우측 버튼 */}
        <div className="flex items-center gap-3">
          <button
            onClick={scrollToServices}
            className="hidden text-sm font-medium text-white/80 transition hover:text-white md:block"
          >
            서비스 소개
          </button>
          <Link
            to="/login"
            className="rounded-xl border border-white/30 px-5 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            로그인
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-[#1a4a2e] transition hover:bg-white/90"
          >
            회원가입
          </Link>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-3xl text-center">
        {/* 배지 */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          기업 임직원 전문 헬스케어 플랫폼
        </div>

        {/* 헤드라인 */}
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          건강한 직원이
          <br />
          <span className="text-[#4ade80]">건강한 기업</span>을 만듭니다
        </h1>

        {/* 서브카피 */}
        <p className="mt-6 text-lg leading-relaxed text-white/75 md:text-xl">
          파우는 근골격케어, 요가·명상, 멘탈코칭을 통해
          <br className="hidden md:block" />
          임직원의 몸과 마음을 함께 케어합니다.
        </p>

        {/* CTA 버튼 그룹 */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={scrollToServices}
            className="rounded-2xl bg-[#2d7a4f] px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#22c55e] hover:shadow-xl"
          >
            서비스 알아보기
          </button>
          <Link
            to="/login"
            className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            파우 오피스 로그인
          </Link>
        </div>

        {/* 통계 뱃지 */}
        <div className="mt-14 flex flex-wrap justify-center gap-8 text-center">
          {[
            { value: '500+', label: '파트너 기업' },
            { value: '30,000+', label: '케어 임직원' },
            { value: '98%', label: '만족도' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-extrabold text-[#4ade80]">{stat.value}</div>
              <div className="mt-1 text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 스크롤 유도 */}
      <button
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50 transition hover:text-white"
        aria-label="서비스 섹션으로 이동"
      >
        <ArrowDown size={28} />
      </button>
    </section>
  );
}
