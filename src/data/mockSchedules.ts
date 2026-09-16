import type { Schedule } from '@/types/schedule.types';

/** 현재 날짜 기준으로 상대적인 Date 생성 헬퍼 */
const d = (offsetDays: number, hour = 10): Date => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hour, 0, 0, 0);
  return dt;
};
const end = (offsetDays: number, hour = 12): Date => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hour, 0, 0, 0);
  return dt;
};

export const MOCK_SCHEDULES: Schedule[] = [
  {
    id: 'sch-001',
    title: '근골격케어 프로그램 — 근로복지공단 서울지사',
    date: d(1, 10),
    endDate: end(1, 12),
    location: '서울특별시 영등포구 여의대로 38 근로복지공단 서울지사 6층 강의실',
    clientCompanyId: 'comp-001',
    clientCompanyName: '근로복지공단',
    contractorCompanyId: 'contr-001',
    contractorCompanyName: '(주)헬스파트너스',
    instructorIds: ['inst-001'],
    instructorNames: ['김지훈 트레이너'],
    contactPerson: '이미래 과장',
    contactPhone: '010-1234-5678',
    surveyUrl: 'https://forms.google.com/faww-survey-001',
    status: 'upcoming',
    serviceType: '근골격케어',
    notes: '참가 인원 약 20명. 강의실 내 매트 준비 필요.',
  },
  {
    id: 'sch-002',
    title: '요가/명상 — 삼성전자 수원사업장',
    date: d(3, 14),
    endDate: end(3, 16),
    location: '경기도 수원시 영통구 삼성로 129 삼성전자 수원사업장 복지관 B1',
    clientCompanyId: 'comp-002',
    clientCompanyName: '삼성전자',
    instructorIds: ['inst-002'],
    instructorNames: ['박소연 강사'],
    contactPerson: '최준호 대리',
    contactPhone: '010-9876-5432',
    surveyUrl: 'https://forms.google.com/faww-survey-002',
    status: 'upcoming',
    serviceType: '요가/명상',
  },
  {
    id: 'sch-003',
    title: '멘탈코치 세션 — 현대자동차 울산공장',
    date: d(5, 9),
    endDate: end(5, 11),
    location: '울산광역시 북구 양정동 700번지 현대자동차 울산공장 교육센터',
    clientCompanyId: 'comp-003',
    clientCompanyName: '현대자동차',
    contractorCompanyId: 'contr-002',
    contractorCompanyName: '(주)웰빙솔루션',
    instructorIds: ['inst-003'],
    instructorNames: ['정하늘 상담사'],
    contactPerson: '강민준 팀장',
    contactPhone: '010-5555-7777',
    surveyUrl: 'https://forms.google.com/faww-survey-003',
    status: 'upcoming',
    serviceType: '멘탈코치',
  },
  {
    id: 'sch-004',
    title: '근골격케어 — LG전자 평택캠퍼스',
    date: d(7, 13),
    endDate: end(7, 15),
    location: '경기도 평택시 진위면 LG전자 평택캠퍼스 생산동 1층',
    clientCompanyId: 'comp-004',
    clientCompanyName: 'LG전자',
    instructorIds: ['inst-001', 'inst-004'],
    instructorNames: ['김지훈 트레이너', '오세진 트레이너'],
    contactPerson: '한예진 주임',
    contactPhone: '010-2222-3333',
    surveyUrl: 'https://forms.google.com/faww-survey-004',
    status: 'upcoming',
    serviceType: '근골격케어',
    notes: '2인 강사 파견. 총 40명 분반 진행.',
  },
  {
    id: 'sch-005',
    title: '요가/명상 — 포스코 포항제철소',
    date: d(10, 15),
    endDate: end(10, 17),
    location: '경상북도 포항시 남구 동해안로 6261 포스코 포항제철소 연수원',
    clientCompanyId: 'comp-005',
    clientCompanyName: '포스코',
    instructorIds: ['inst-002'],
    instructorNames: ['박소연 강사'],
    contactPerson: '윤성현 과장',
    contactPhone: '010-4444-6666',
    surveyUrl: 'https://forms.google.com/faww-survey-005',
    status: 'upcoming',
    serviceType: '요가/명상',
  },
  {
    id: 'sch-006',
    title: '근골격케어 — SK하이닉스 이천캠퍼스',
    date: d(-5, 10),
    endDate: end(-5, 12),
    location: '경기도 이천시 부발읍 이천대로 2091 SK하이닉스 이천캠퍼스',
    clientCompanyId: 'comp-006',
    clientCompanyName: 'SK하이닉스',
    instructorIds: ['inst-001'],
    instructorNames: ['김지훈 트레이너'],
    contactPerson: '임채원 대리',
    contactPhone: '010-8888-9999',
    surveyUrl: 'https://forms.google.com/faww-survey-006',
    status: 'completed',
    serviceType: '근골격케어',
  },
  {
    id: 'sch-007',
    title: '멘탈코치 — 롯데케미칼 여수공장',
    date: d(-10, 14),
    endDate: end(-10, 16),
    location: '전라남도 여수시 율촌면 산단3로 365 롯데케미칼 여수공장',
    clientCompanyId: 'comp-007',
    clientCompanyName: '롯데케미칼',
    instructorIds: ['inst-003'],
    instructorNames: ['정하늘 상담사'],
    contactPerson: '서도윤 팀장',
    contactPhone: '010-1111-2222',
    surveyUrl: 'https://forms.google.com/faww-survey-007',
    status: 'completed',
    serviceType: '멘탈코치',
  },
];

/** 역할에 따라 필터링된 일정 반환 */
export function getSchedulesByRole(
  schedules: Schedule[],
  role: string,
  companyId?: string,
  instructorId?: string
): Schedule[] {
  if (role === 'SUPER_ADMIN' || role === 'FAWW_STAFF') {
    return schedules;
  }
  if (role === 'INSTRUCTOR') {
    return schedules.filter((s) => s.instructorIds.includes(instructorId ?? ''));
  }
  if (role === 'CLIENT') {
    return schedules.filter((s) => s.clientCompanyId === companyId);
  }
  if (role === 'CONTRACTOR') {
    return schedules.filter((s) => s.contractorCompanyId === companyId);
  }
  return [];
}
