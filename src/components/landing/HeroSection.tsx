import { Link } from 'react-router-dom';
import { ArrowDown, Leaf } from 'lucide-react';

// ─── HeroSection 컴포넌트 ──────────────────────────────────────
export function HeroSection() {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-[88vh] md:min-h-[90vh] flex-col items-center justify-between overflow-hidden bg-[#fafafa] px-4 pt-24 pb-10 text-white">
      {/* 
        [초록색 배경 레이어]
        상단 0%~68%까지는 100% 짙은 숲속 초록색을 완전 불투명하게 유지하고, 
        68%부터 맨 하단(100%)까지 균일하고 부드럽게 투명해지는 스무스 알파 마스크
      */}
      <div
        className="absolute inset-0 bg-[#1a4a2e] pointer-events-none"
        style={{
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 68%, rgba(0,0,0,0.92) 75%, rgba(0,0,0,0.76) 82%, rgba(0,0,0,0.52) 89%, rgba(0,0,0,0.26) 95%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 68%, rgba(0,0,0,0.92) 75%, rgba(0,0,0,0.76) 82%, rgba(0,0,0,0.52) 89%, rgba(0,0,0,0.26) 95%, rgba(0,0,0,0) 100%)',
        }}
      >
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

        {/* 장식 원형 글로우 */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#2d7a4f] opacity-35 blur-3xl" />
        <div className="absolute -bottom-16 -left-32 h-96 w-96 rounded-full bg-[#4ade80] opacity-25 blur-3xl" />
      </div>

      {/* 상단 네비게이션 */}
      <nav className="relative z-20 w-full max-w-7xl flex items-center justify-between px-2 sm:px-6 md:px-8 mb-6">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur shadow-xs">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">파우 오피스</span>
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
            className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-[#1a4a2e] transition hover:bg-white/90 shadow-sm"
          >
            회원가입
          </Link>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-3xl text-center my-auto px-2">
        {/* 배지 */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs md:text-sm backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          기업 임직원 전문 헬스케어 플랫폼
        </div>

        {/* 헤드라인 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
          건강한 직원이
          <br />
          <span className="text-[#4ade80]">건강한 기업</span>을 만듭니다
        </h1>

        {/* 서브카피 */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg leading-relaxed text-white/85 md:text-xl max-w-2xl mx-auto">
          파우는 근골격케어, 요가·명상, 멘탈코칭을 통해
          <br className="hidden sm:block" />
          임직원의 몸과 마음을 함께 케어합니다.
        </p>

        {/* CTA 버튼 그룹 */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={scrollToServices}
            className="rounded-2xl bg-[#2d7a4f] px-7 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg transition hover:bg-[#22c55e] hover:shadow-xl active:scale-95"
          >
            서비스 알아보기
          </button>
          <Link
            to="/login"
            className="rounded-2xl border border-white/35 bg-white/15 px-7 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-white backdrop-blur transition hover:bg-white/25 active:scale-95"
          >
            파우 오피스 로그인
          </Link>
        </div>

        {/* 통계 뱃지 */}
        <div className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-8 text-center">
          {[
            { value: '500+', label: '파트너 기업' },
            { value: '30,000+', label: '케어 임직원' },
            { value: '98%', label: '만족도' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#4ade80]">{stat.value}</div>
              <div className="mt-0.5 text-xs sm:text-sm text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 스크롤 유도 버튼 (투명해진 배경과 조화) */}
      <button
        onClick={scrollToServices}
        className="relative z-20 mt-4 flex flex-col items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#2d7a4f] transition group"
        aria-label="서비스 섹션으로 이동"
      >
        <span className="text-[11px] tracking-wider text-gray-400 group-hover:text-[#2d7a4f]">SCROLL</span>
        <ArrowDown size={18} className="animate-bounce text-[#2d7a4f]" />
      </button>
    </section>
  );
}
