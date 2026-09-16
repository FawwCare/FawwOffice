import { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MOCK_SCHEDULES, getSchedulesByRole } from '@/data/mockSchedules';
import { ScheduleSummaryCard } from '@/components/calendar/ScheduleSummaryCard';
import { ROLE_LABELS } from '@/utils/permissions';
import type { Schedule, ScheduleStatus } from '@/types/schedule.types';
import { cn } from '@/utils/cn';
import { Search, SlidersHorizontal } from 'lucide-react';

type FilterStatus = 'all' | ScheduleStatus;

const SERVICE_ICONS: Record<string, string> = {
  '근골격케어': '🦴',
  '요가/명상': '🧘',
  '멘탈코치': '🧠',
};

const STATUS_LABELS: Record<FilterStatus, string> = {
  all: '전체',
  upcoming: '예정',
  completed: '완료',
  cancelled: '취소',
};

// ─── MySchedulesPage ──────────────────────────────────────────
export default function MySchedulesPage() {
  const { user } = useAuthStore();

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const mySchedules = useMemo(() => {
    if (!user) return [];
    return getSchedulesByRole(
      MOCK_SCHEDULES,
      user.role,
      user.companyId,
      user.instructorId
    );
  }, [user]);

  const filteredSchedules = useMemo(() => {
    return mySchedules
      .filter((s) => filterStatus === 'all' || s.status === filterStatus)
      .filter((s) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.clientCompanyName.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [mySchedules, filterStatus, searchQuery]);

  return (
    <div className="min-h-full bg-gray-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white px-5 py-4">
        <h1 className="text-lg font-bold text-gray-900">내 일정</h1>
        {user && (
          <p className="text-xs text-gray-400">{ROLE_LABELS[user.role]} · 총 {mySchedules.length}개 일정</p>
        )}
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-4">
        {/* 검색 + 필터 */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* 검색 */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="기업명, 장소, 일정 제목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20"
            />
          </div>

          {/* 상태 필터 */}
          <div className="flex gap-1.5">
            {(Object.keys(STATUS_LABELS) as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  'rounded-xl px-4 py-2.5 text-sm font-medium transition',
                  filterStatus === status
                    ? 'bg-[#2d7a4f] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2d7a4f] hover:text-[#2d7a4f]'
                )}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>

        {/* 레이아웃: 목록 + 상세 (PC에서 2열) */}
        <div className="grid gap-4 lg:grid-cols-5">
          {/* 일정 목록 */}
          <div className="lg:col-span-2 space-y-2">
            {filteredSchedules.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-gray-600">일정이 없습니다.</p>
              </div>
            ) : (
              filteredSchedules.map((schedule) => (
                <ScheduleListItem
                  key={schedule.id}
                  schedule={schedule}
                  isSelected={selectedSchedule?.id === schedule.id}
                  onClick={() => setSelectedSchedule(schedule)}
                />
              ))
            )}
          </div>

          {/* 일정 상세 (PC에서 우측 고정 패널) */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              {selectedSchedule ? (
                <ScheduleSummaryCard schedule={selectedSchedule} />
              ) : (
                <div className="hidden lg:flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
                  <SlidersHorizontal size={32} className="mb-3 text-gray-300" />
                  <p className="font-semibold text-gray-500">왼쪽에서 일정을 선택하세요</p>
                  <p className="mt-1 text-sm text-gray-400">상세 정보가 여기에 표시됩니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ScheduleListItem ─────────────────────────────────────────
interface ScheduleListItemProps {
  schedule: Schedule;
  isSelected: boolean;
  onClick: () => void;
}

const STATUS_BADGE: Record<ScheduleStatus, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-500',
};

const STATUS_KO: Record<ScheduleStatus, string> = {
  upcoming: '예정',
  completed: '완료',
  cancelled: '취소',
};

function ScheduleListItem({ schedule, isSelected, onClick }: ScheduleListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-2xl border bg-white px-4 py-4 text-left transition',
        isSelected
          ? 'border-[#2d7a4f] ring-2 ring-[#2d7a4f]/20 shadow-sm'
          : 'border-gray-100 hover:border-[#2d7a4f]/40 hover:shadow-sm'
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">
          {schedule.serviceType ? SERVICE_ICONS[schedule.serviceType] ?? '📅' : '📅'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', STATUS_BADGE[schedule.status])}>
              {STATUS_KO[schedule.status]}
            </span>
            {schedule.serviceType && (
              <span className="text-xs text-gray-400">{schedule.serviceType}</span>
            )}
          </div>
          <p className={cn('font-semibold text-sm truncate', isSelected ? 'text-[#2d7a4f]' : 'text-gray-900')}>
            {schedule.title}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {schedule.date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' })}
            {' '}
            {schedule.date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="mt-0.5 text-xs text-gray-400 truncate">{schedule.clientCompanyName}</p>
        </div>
      </div>
    </button>
  );
}
