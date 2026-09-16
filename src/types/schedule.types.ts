export type ScheduleStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Schedule {
  id: string;
  googleEventId?: string;
  title: string;
  date: Date;
  endDate?: Date;
  location: string;               // 출장 장소 (주소)
  clientCompanyId: string;
  clientCompanyName: string;      // 원청 기업명
  contractorCompanyId?: string;
  contractorCompanyName?: string; // 도급 업체명
  instructorIds: string[];        // 배정된 강사 UID 목록
  instructorNames?: string[];     // 강사 이름 목록 (표시용)
  contactPerson: string;          // 담당자 이름
  contactPhone: string;           // 담당자 연락처
  surveyUrl: string;              // 만족도 조사 링크
  notes?: string;
  status: ScheduleStatus;
  serviceType?: '근골격케어' | '요가/명상' | '멘탈코치';
}

/** FullCalendar에 넘겨줄 이벤트 형태 */
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    schedule: Schedule;
  };
}
