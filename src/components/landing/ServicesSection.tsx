import { useState } from 'react';
import type { ServiceType } from '@/types/booking.types';
import { BookingModal } from './BookingModal';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

// ─── 서비스 데이터 ─────────────────────────────────────────────
interface ServiceData {
  type: ServiceType;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  accentColor: string;
}

const SERVICES: ServiceData[] = [
  {
    type: '근골격케어',
    icon: '🦴',
    title: '근골격케어',
    subtitle: '몸의 균형을 바로잡다',
    description:
      '전문 물리치료사·운동처방사의 1:1 맞춤 케어로 만성 통증과 자세 불균형을 근본적으로 개선합니다. 직장인의 고질적인 어깨·허리 통증을 해소하세요.',
    imageUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    accentColor: '#2d7a4f',
  },
  {
    type: '요가/명상',
    icon: '🧘',
    title: '요가 / 명상',
    subtitle: '몸과 마음의 조화',
    description:
      '스트레스 해소와 심신 안정을 위한 직장인 맞춤 요가·명상 프로그램입니다. 바쁜 일상 속에서도 내면의 평화를 찾을 수 있도록 전문 강사가 함께합니다.',
    imageUrl:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    accentColor: '#7c3aed',
  },
  {
    type: '멘탈코치',
    icon: '🧠',
    title: '멘탈코치',
    subtitle: '내면의 힘을 키우다',
    description:
      '심리상담 전문가와 함께 직장 내 스트레스 관리, 번아웃 예방, 대인관계 개선을 지원합니다. 더 건강한 직장 환경을 만들어가는 첫걸음이 되어드립니다.',
    imageUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&auto=format&fit=crop',
    accentColor: '#0369a1',
  },
];

// ─── ServiceCard 컴포넌트 ──────────────────────────────────────
interface ServiceCardProps {
  service: ServiceData;
  onBook: (type: ServiceType) => void;
}

function ServiceCard({ service, onBook }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 배경 이미지 */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.title}
          className={cn(
            'h-full w-full object-cover transition-transform duration-500',
            hovered ? 'scale-110' : 'scale-100'
          )}
          loading="lazy"
        />
        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* 아이콘 + 제목 (이미지 위) */}
        <div className="absolute bottom-4 left-5">
          <span className="text-3xl">{service.icon}</span>
          <h3 className="mt-1 text-xl font-bold text-white">{service.title}</h3>
          <p className="text-sm font-medium text-white/80">{service.subtitle}</p>
        </div>
      </div>

      {/* 카드 바디 */}
      <div className="flex flex-1 flex-col bg-white p-6">
        <p className="flex-1 text-sm leading-relaxed text-gray-600">{service.description}</p>

        <button
          onClick={() => onBook(service.type)}
          style={{ backgroundColor: service.accentColor }}
          className={cn(
            'mt-5 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white',
            'transition-all duration-200 hover:opacity-90 active:scale-95'
          )}
        >
          예약하러가기
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

// ─── ServicesSection 컴포넌트 ──────────────────────────────────
export function ServicesSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>('근골격케어');

  const handleBook = (type: ServiceType) => {
    setSelectedService(type);
    setModalOpen(true);
  };

  return (
    <section id="services" className="bg-[#fafafa] px-4 pt-14 pb-20">
      <div className="mx-auto max-w-6xl">
        {/* 섹션 헤더 */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full bg-[#e8f5ee] px-4 py-1.5 text-sm font-semibold text-[#2d7a4f]">
            Our Services
          </span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            파우의 서비스를 소개합니다
          </h2>
          <p className="mt-4 text-gray-500">
            임직원의 신체·정신 건강을 위한 전문 헬스케어 프로그램을 기업에 맞춤 제공합니다.
          </p>
        </div>

        {/* 카드 그리드 */}
        <div className="grid gap-8 md:grid-cols-3">
          {SERVICES.map((svc) => (
            <ServiceCard key={svc.type} service={svc} onBook={handleBook} />
          ))}
        </div>
      </div>

      {/* 예약 모달 */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialService={selectedService}
      />
    </section>
  );
}
