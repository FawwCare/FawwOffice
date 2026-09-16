import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import type { EventClickArg, EventContentArg } from '@fullcalendar/core';
import koLocale from '@fullcalendar/core/locales/ko';
import type { CalendarEvent, Schedule } from '@/types/schedule.types';
import { cn } from '@/utils/cn';

interface MainCalendarProps {
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (schedule: Schedule) => void;
  selectedDate?: Date | null;
}

const SERVICE_COLORS: Record<string, { bg: string; border: string }> = {
  '근골격케어': { bg: '#10b981', border: '#059669' },
  '요가/명상': { bg: '#8b5cf6', border: '#7c3aed' },
  '멘탈코치': { bg: '#0ea5e9', border: '#0284c7' },
};
const DEFAULT_COLOR = { bg: '#2d7a4f', border: '#1a4a2e' };

/** Schedule 배열 → FullCalendar 이벤트 배열 변환 */
export function schedulesToCalendarEvents(schedules: Schedule[]): CalendarEvent[] {
  return schedules.map((s) => {
    const color = s.serviceType
      ? (SERVICE_COLORS[s.serviceType] ?? DEFAULT_COLOR)
      : DEFAULT_COLOR;
    return {
      id: s.id,
      title: s.title,
      start: s.date,
      end: s.endDate,
      backgroundColor: color.bg,
      borderColor: color.border,
      extendedProps: { schedule: s },
    };
  });
}

// ─── MainCalendar 컴포넌트 ─────────────────────────────────────
export function MainCalendar({
  events,
  onDateClick,
  onEventClick,
}: MainCalendarProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden',
        // 툴바 타이틀
        '[&_.fc-toolbar-title]:text-base [&_.fc-toolbar-title]:font-bold [&_.fc-toolbar-title]:text-gray-900',
        // 버튼 공통
        '[&_.fc-button]:!rounded-xl [&_.fc-button]:!text-sm [&_.fc-button]:!font-medium [&_.fc-button]:!border-none [&_.fc-button]:!shadow-none [&_.fc-button]:!transition-all',
        // 비활성 버튼
        '[&_.fc-button-primary]:!bg-gray-100 [&_.fc-button-primary]:!text-gray-700',
        // 활성 버튼
        '[&_.fc-button-primary.fc-button-active]:!bg-[#2d7a4f] [&_.fc-button-primary.fc-button-active]:!text-white',
        // prev/next/today 버튼
        '[&_.fc-prev-button]:!bg-gray-100 [&_.fc-prev-button]:!text-gray-700',
        '[&_.fc-next-button]:!bg-gray-100 [&_.fc-next-button]:!text-gray-700',
        '[&_.fc-today-button]:!bg-[#2d7a4f] [&_.fc-today-button]:!text-white',
        // 오늘 날짜 강조
        '[&_.fc-day-today]:!bg-[#e8f5ee]',
        '[&_.fc-day-today_.fc-daygrid-day-number]:!text-[#2d7a4f] [&_.fc-day-today_.fc-daygrid-day-number]:!font-bold',
        // 헤더 행
        '[&_.fc-col-header-cell]:!bg-gray-50',
        '[&_.fc-col-header-cell-cushion]:!text-gray-500 [&_.fc-col-header-cell-cushion]:!font-semibold [&_.fc-col-header-cell-cushion]:!no-underline',
        // 날짜 숫자
        '[&_.fc-daygrid-day-number]:!text-gray-600 [&_.fc-daygrid-day-number]:!no-underline',
        // 이벤트
        '[&_.fc-event]:!rounded-lg [&_.fc-event]:cursor-pointer',
        '[&_.fc-list-event]:cursor-pointer',
      )}
    >
      <div className="p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          locale={koLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek',
          }}
          buttonText={{
            today: '오늘',
            month: '월',
            week: '주',
            list: '목록',
          }}
          events={events}
          dateClick={(arg: DateClickArg) => onDateClick(arg.date)}
          eventClick={(arg: EventClickArg) => {
            const schedule: Schedule = arg.event.extendedProps?.schedule;
            if (schedule) onEventClick(schedule);
          }}
          eventContent={(arg: EventContentArg) => {
            const schedule: Schedule | undefined = arg.event.extendedProps?.schedule;
            return (
              <div className="flex items-center gap-1 px-1 py-0.5 text-xs leading-tight overflow-hidden">
                <span className="hidden sm:block whitespace-nowrap text-white/80">{arg.timeText}</span>
                <span className="font-semibold text-white truncate">
                  {schedule?.title ?? arg.event.title}
                </span>
              </div>
            );
          }}
          height="auto"
          fixedWeekCount={false}
          dayMaxEvents={3}
          moreLinkText={(n) => `+${n}개`}
          nowIndicator
        />
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 px-5 py-3">
        <span className="text-xs text-gray-400 font-medium">서비스:</span>
        {Object.entries(SERVICE_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color.bg }}
            />
            <span className="text-xs text-gray-600">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
