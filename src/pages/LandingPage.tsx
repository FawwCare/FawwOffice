import { HeroSection } from '@/components/landing/HeroSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { Leaf, Mail, Phone } from 'lucide-react';

// ─── LandingPage ───────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* 1. 히어로 섹션 */}
      <HeroSection />

      {/* 2. 서비스 소개 섹션 */}
      <ServicesSection />

      {/* 3. Why Faww 섹션 */}
      <WhyFawwSection />

      {/* 4. 푸터 */}
      <Footer />
    </div>
  );
}

// ─── Why Faww 섹션 ─────────────────────────────────────────────
function WhyFawwSection() {
  const features = [
    {
      icon: '🎯',
      title: '맞춤형 기업 프로그램',
      desc: '기업 규모와 직종 특성에 맞춰 최적화된 헬스케어 커리큘럼을 설계합니다.',
    },
    {
      icon: '📊',
      title: '데이터 기반 성과 관리',
      desc: '참여 현황, 만족도 조사 결과를 실시간 대시보드로 투명하게 제공합니다.',
    },
    {
      icon: '👩‍⚕️',
      title: '전문 자격 보유 강사진',
      desc: '물리치료사, 운동처방사, 공인 요가 강사, 심리상담사로 구성된 전문 팀입니다.',
    },
    {
      icon: '🚀',
      title: '빠른 현장 방문 서비스',
      desc: '별도 이동 없이 사내에서 프로그램을 진행해 직원 참여율을 극대화합니다.',
    },
  ];

  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-[#e8f5ee] px-4 py-1.5 text-sm font-semibold text-[#2d7a4f]">
            Why Faww
          </span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            파우를 선택해야 하는 이유
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition hover:border-[#2d7a4f]/30 hover:shadow-md"
            >
              <div className="mb-3 text-4xl">{f.icon}</div>
              <h3 className="mb-2 font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#1a4a2e] px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* 브랜드 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <Leaf size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold">파우 (Faww)</span>
            </div>
            <p className="max-w-xs text-sm text-white/60 leading-relaxed">
              기업 임직원의 건강하고 행복한 직장 생활을 위한 전문 헬스케어 파트너
            </p>
          </div>

          {/* 연락처 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white/90">문의</h4>
            <a
              href="mailto:mail.hon9g@gmail.com"
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
            >
              <Mail size={14} />
              mail.hon9g@gmail.com
            </a>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Phone size={14} />
              대표번호 등록 예정
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © 2026 Faww. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
