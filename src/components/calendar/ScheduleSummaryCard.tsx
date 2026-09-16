import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, User, Copy, QrCode,
  ChevronRight, CheckCircle, Clock, XCircle,
  Building2, CalendarX, Award,
} from 'lucide-react';
import type { Schedule } from '@/types/schedule.types';
import { QRCodeModal } from '@/components/qr/QRCodeModal';
import { cn } from '@/utils/cn';

interface ScheduleSummaryCardProps {
  schedule: Schedule | null;
  /** 선택된 날짜에 일정이 없고 다가오는 일정 표시 시 true */
  isUpcoming?: boolean;
}

const STATUS_CONFIG = {
  upcoming: { label: '예정', color: 'bg-blue-100 text-blue-700', icon: <Clock size={12} /> },
  completed: { label: '완료', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> },
  cancelled: { label: '취소', color: 'bg-red-100 text-red-600', icon: <XCircle size={12} /> },
};

const SERVICE_COLORS: Record<string, string> = {
  '근골격케어': 'bg-emerald-500',
  '요가/명상': 'bg-purple-500',
  '멘탈코치': 'bg-sky-500',
};

export function ScheduleSummaryCard({ schedule, isUpcoming = false }: ScheduleSummaryCardProps) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const navigate = useNavigate();

  if (!schedule) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          <CalendarX size={22} strokeWidth={1.75} />
        </div>
        <p className="font-semibold text-gray-700 text-sm">선택한 날짜에 일정이 없습니다.</p>
        <p className="mt-1 text-xs text-gray-400">다른 날짜를 선택해 주세요.</p>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[schedule.status];
  const serviceColor = schedule.serviceType ? SERVICE_COLORS[schedule.serviceType] : 'bg-gray-400';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(schedule.surveyUrl);
    } catch {
      const el = document.createElement('textarea');
      el.value = schedule.surveyUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        {/* 컬러 액센트 바 */}
        <div className={cn('h-1.5 w-full', serviceColor)} />

        <div className="p-5">
          {/* 헤더 */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              {isUpcoming && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2d7a4f]" />
                  <span className="text-[11px] font-bold text-[#2d7a4f] tracking-wide uppercase">다가오는 일정</span>
                </div>
              )}
              <h3 className="font-bold text-gray-900 leading-snug">{schedule.title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {schedule.date.toLocaleDateString('ko-KR', {
                  month: 'long', day: 'numeric', weekday: 'short',
                })}
                {' '}
                {schedule.date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                {schedule.endDate && (
                  <> ~ {schedule.endDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</>
                )}
              </p>
            </div>
            {/* 상태 배지 */}
            <span className={cn('flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold flex-shrink-0', statusCfg.color)}>
              {statusCfg.icon}
              {statusCfg.label}
            </span>
          </div>

          {/* 정보 그리드 */}
          <div className="space-y-2.5 text-sm">
            <InfoRow icon={<MapPin size={15} />} label="장소">
              <a
                href={`https://map.kakao.com/link/search/${encodeURIComponent(schedule.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-[#2d7a4f] hover:underline"
              >
                {schedule.location}
              </a>
            </InfoRow>

            <InfoRow icon={<Building2 size={15} />} label="기업">
              <span className="text-gray-700">{schedule.clientCompanyName}</span>
              {schedule.contractorCompanyName && (
                <span className="ml-1 text-gray-400">· {schedule.contractorCompanyName}</span>
              )}
            </InfoRow>

            <InfoRow icon={<User size={15} />} label="담당자">
              <span className="text-gray-700">{schedule.contactPerson}</span>
            </InfoRow>

            <InfoRow icon={<Phone size={15} />} label="연락처">
              <a href={`tel:${schedule.contactPhone}`} className="text-gray-700 hover:text-[#2d7a4f]">
                {schedule.contactPhone}
              </a>
            </InfoRow>

            {schedule.instructorNames && schedule.instructorNames.length > 0 && (
              <InfoRow icon={<Award size={15} />} label="강사">
                <span className="text-gray-700">{schedule.instructorNames.join(', ')}</span>
              </InfoRow>
            )}
          </div>

          {/* 구분선 */}
          <div className="my-4 border-t border-gray-100" />

          {/* 액션 버튼 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-[#2d7a4f] hover:text-[#2d7a4f]"
            >
              {copied ? <CheckCircle size={15} className="text-green-500" /> : <Copy size={15} />}
              {copied ? '복사됨!' : '링크 복사'}
            </button>

            <button
              onClick={() => setQrOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-[#2d7a4f] hover:text-[#2d7a4f]"
            >
              <QrCode size={15} />
              QR 코드
            </button>

            <button
              onClick={() => navigate(`/surveys/${schedule.id}`)}
              className="ml-auto flex items-center gap-1.5 rounded-xl bg-[#2d7a4f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a4a2e]"
            >
              만족도 결과 보기
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* QR 코드 모달 */}
      <QRCodeModal isOpen={qrOpen} onClose={() => setQrOpen(false)} schedule={schedule} />
    </>
  );
}

// ─── InfoRow 헬퍼 ──────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 flex-shrink-0 text-gray-400">{icon}</span>
      <span className="w-14 flex-shrink-0 text-gray-400">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
