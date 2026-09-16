import * as XLSX from 'xlsx';
import type { SurveyResponse } from '@/types/survey.types';
import type { Schedule } from '@/types/schedule.types';

/**
 * 만족도 설문 응답 목록을 엑셀(.xlsx) 파일로 내보냅니다.
 */
export function exportSurveyToExcel(
  schedule: Schedule,
  responses: SurveyResponse[]
): void {
  // 1. 개별 응답 데이터 매핑 (사용자 친화적 한국어 컬럼)
  const rows = responses.map((res, index) => ({
    '번호': index + 1,
    '성함': res.respondentName,
    '근무형태': res.workType,
    '직장 지역 및 명칭': res.workLocation,
    '성별': res.gender,
    '연령대': res.ageGroup,
    '전체 만족도 (1~5)': res.ratingOverall,
    '시간 적절성 (1~5)': res.ratingTime,
    '강사 전문성 (1~5)': res.ratingInstructor,
    '추천 의향 (1~5)': res.ratingRecommend,
    '재참여 의향 (1~5)': res.ratingParticipateAgain,
    '전후 개선 체감 (1~5)': res.ratingImprovement,
    '인상깊고 유익했던 점': res.feedbackGood || '-',
    '보완 및 개선점': res.feedbackImprove || '-',
    '추후 참여 희망 프로그램': res.feedbackFutureProgram || '-',
    '만성 관절 통증 부위': res.jointPain.length > 0 ? res.jointPain.join(', ') : '없음',
    '만성 근육 통증 부위': res.musclePain.length > 0 ? res.musclePain.join(', ') : '없음',
    '제출일시': new Date(res.submittedAt).toLocaleString('ko-KR'),
  }));

  // 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // 컬럼 너비 자동 조정
  worksheet['!cols'] = [
    { wch: 6 },  // 번호
    { wch: 10 }, // 성함
    { wch: 12 }, // 근무형태
    { wch: 22 }, // 직장 지역 및 명칭
    { wch: 8 },  // 성별
    { wch: 8 },  // 연령대
    { wch: 16 }, // 전체 만족도
    { wch: 16 }, // 시간 적절성
    { wch: 16 }, // 강사 전문성
    { wch: 16 }, // 추천 의향
    { wch: 16 }, // 재참여 의향
    { wch: 18 }, // 전후 개선 체감
    { wch: 35 }, // 인상깊은점
    { wch: 30 }, // 보완점
    { wch: 25 }, // 추후 희망
    { wch: 25 }, // 관절 통증
    { wch: 25 }, // 근육 통증
    { wch: 20 }, // 제출일시
  ];

  // 워크북 생성
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '만족도 설문 응답');

  // 요약 통계 시트 추가
  if (responses.length > 0) {
    const avg = (arr: number[]) =>
      (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);

    const summaryRows = [
      { '항목': '프로그램명', '값': schedule.title },
      { '항목': '대상 기업', '값': schedule.clientCompanyName },
      { '항목': '일시', '값': schedule.date.toLocaleDateString('ko-KR') },
      { '항목': '장소', '값': schedule.location },
      { '항목': '총 응답 인원', '값': `${responses.length}명` },
      { '항목': '전체 종합 만족도 평균', '값': `${avg(responses.map((r) => r.ratingOverall))} / 5.0` },
      { '항목': '시간 적절성 평균', '값': `${avg(responses.map((r) => r.ratingTime))} / 5.0` },
      { '항목': '강사 전문성 평균', '값': `${avg(responses.map((r) => r.ratingInstructor))} / 5.0` },
      { '항목': '타인 추천 의향 평균', '값': `${avg(responses.map((r) => r.ratingRecommend))} / 5.0` },
      { '항목': '재참여 의향 평균', '값': `${avg(responses.map((r) => r.ratingParticipateAgain))} / 5.0` },
      { '항목': '전후 개선 체감 평균', '값': `${avg(responses.map((r) => r.ratingImprovement))} / 5.0` },
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
    summarySheet['!cols'] = [{ wch: 24 }, { wch: 45 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, '결과 요약 보고');
  }

  // 파일명 포맷: [파우] 만족도결과_기업명_일자.xlsx
  const dateStr = schedule.date.toISOString().split('T')[0];
  const cleanTitle = schedule.clientCompanyName.replace(/[\/\\?%*:|"<>]/g, '_');
  const filename = `[파우] 만족도결과_${cleanTitle}_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
}
