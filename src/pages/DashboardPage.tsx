import { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MOCK_SCHEDULES, getSchedulesByRole } from '@/data/mockSchedules';
import { MainCalendar, schedulesToCalendarEvents } from '@/components/calendar/MainCalendar';
import { ScheduleSummaryCard } from '@/components/calendar/ScheduleSummaryCard';
import { ROLE_LABELS } from '@/utils/permissions';
import type { Schedule } from '@/types/schedule.types';
import { Bell, RefreshCw, CalendarX, ChevronRight } from 'lucide-react';
import { ServiceIcon } from '@/components/common/ServiceIcon';

// ─── DashboardPage ────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuthStore();

  // 클릭된 날짜 상태
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // 클릭된 일정 (이벤트 클릭 시)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  // 역할에 따라 필터링된 일정
  const mySchedules = useMemo(() => {
    if (!user) return [];
    return getSchedulesByRole(
      MOCK_SCHEDULES,
      user.role,
      user.companyId,
      user.instructorId
    );
  }, [user]);

  // 캘린더용 이벤트 변환
  const calendarEvents = useMemo(
    () => schedulesToCalendarEvents(mySchedules),
    [mySchedules]
  );

  // 날짜 클릭 → 해당 날짜 일정 조회
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedSchedule(null);

    const found = mySchedules.find(
      (s) => s.date.toDateString() === date.toDateString()
    );
    setSelectedSchedule(found ?? null);
  };

  // 이벤트 클릭 → 해당 일정 선택
  const handleEventClick = (schedule: Schedule) => {
    setSelectedDate(schedule.date);
    setSelectedSchedule(schedule);
  };

  // 표시할 일정: 클릭된 일정 > 다가오는 가장 가까운 일정
  const displayedSchedule = useMemo(() => {
    if (selectedSchedule) return selectedSchedule;
    // 오늘 이후 일정 중 가장 가까운 것
    const now = new Date();
    const upcoming = mySchedules
      .filter((s) => s.date >= now && s.status === 'upcoming')
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return upcoming[0] ?? mySchedules[0] ?? null;
  }, [selectedSchedule, mySchedules]);

  const isUpcoming = !selectedSchedule && !!displayedSchedule;

  // 통계 요약
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: mySchedules.length,
      upcoming: mySchedules.filter((s) => s.date >= now && s.status === 'upcoming').length,
      completed: mySchedules.filter((s) => s.status === 'completed').length,
    };
  }, [mySchedules]);

  return (
    <div className="min-h-full bg-gray-50">
      {/* 페이지 헤더 */}
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">대시보드</h1>
            {user && (
              <p className="text-xs text-gray-400">
                {ROLE_LABELS[user.role]} · {user.displayName}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
              title="알림"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button
              onClick={() => { setSelectedDate(null); setSelectedSchedule(null); }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
              title="새로고침"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-4xl mx-auto">
        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="전체 일정" value={stats.total} color="text-gray-700" bg="bg-white" />
          <StatCard label="예정된 일정" value={stats.upcoming} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="완료된 일정" value={stats.completed} color="text-green-600" bg="bg-green-50" />
        </div>

        {/* 캘린더 */}
        <MainCalendar
          events={calendarEvents}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
          selectedDate={selectedDate}
        />

        {/* 일정 요약 섹션 */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {selectedDate
              ? `${selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 일정`
              : '일정 요약'}
          </h2>

          {/* 선택 날짜에 여러 일정이 있을 경우 */}
          {selectedDate && !selectedSchedule ? (
            <MultipleScheduleList
              date={selectedDate}
              schedules={mySchedules}
              onSelect={setSelectedSchedule}
            />
          ) : (
            <ScheduleSummaryCard schedule={displayedSchedule} isUpcoming={isUpcoming} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 통계 카드 ─────────────────────────────────────────────────
function StatCard({
  label, value, color, bg,
}: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={`rounded-2xl ${bg} border border-gray-100 px-4 py-3.5 text-center shadow-sm`}>
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs text-gray-500">{label}</p>
    </div>
  );
}

// ─── 같은 날짜에 여러 일정이 있을 경우 목록 ────────────────────
function MultipleScheduleList({
  date, schedules, onSelect,
}: { date: Date; schedules: Schedule[]; onSelect: (s: Schedule) => void }) {
  const daySchedules = schedules.filter(
    (s) => s.date.toDateString() === date.toDateString()
  );

  if (daySchedules.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <div className="mb-3 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          <CalendarX size={22} strokeWidth={1.75} />
        </div>
        <p className="font-semibold text-gray-700 text-sm">이 날짜에 일정이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {daySchedules.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s)}
          className="w-full rounded-2xl bg-white border border-gray-100 px-5 py-4 text-left shadow-sm hover:border-[#2d7a4f] transition group"
        >
          <div className="flex items-start gap-3">
            <ServiceIcon serviceType={s.serviceType} size={18} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 group-hover:text-[#2d7a4f] truncate">{s.title}</p>
              <p className="text-sm text-gray-400 mt-0.5">
                {s.date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                {' · '}{s.location.split(' ').slice(0, 3).join(' ')}...
              </p>
            </div>
            <span className="text-gray-300 group-hover:text-[#2d7a4f] mt-1 transition">
              <ChevronRight size={18} />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
