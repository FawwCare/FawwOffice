export type WorkType = '일근직' | '교대근무자';
export type Gender = '남자' | '여자';
export type AgeGroup = '20대' | '30대' | '40대' | '50대' | '60대' | '70대';

/** 설문 응답 1건 */
export interface SurveyResponse {
  id: string;
  scheduleId: string;
  submittedAt: string; // ISO string

  // [기본 정보]
  respondentName: string; // 1. 성함 (TEXT)
  workType: WorkType; // 2. 근무형태 (CHECKBOX)
  workLocation: string; // 3. 직장 지역 및 명칭 (SELECT/RADIO)
  gender: Gender; // 4. 성별 (RADIO)
  ageGroup: AgeGroup; // 5. 연령대 (RADIO)

  // [만족도 평가 - RATING_5 (1점~5점)]
  ratingOverall: number; // 6. 전체적 프로그램 만족/유익
  ratingTime: number; // 7. 시간 적절성
  ratingInstructor: number; // 8. 강사 전문성
  ratingRecommend: number; // 9. 타인 추천 의향
  ratingParticipateAgain: number; // 10. 재참여 의향
  ratingImprovement: number; // 11. 전후 개선 체감

  // [서술형 피드백 (선택사항, nullable)]
  feedbackGood?: string; // 12. 가장 인상깊거나 유익했던 점
  feedbackImprove?: string; // 13. 보완/개선점
  feedbackFutureProgram?: string; // 14. 추후 참여 희망 프로그램

  // [건강 상태 체크 (다중 선택)]
  jointPain: string[]; // 15. 3개월 이상 만성 관절 통증 부위 (어깨, 무릎, 목, 손목, 발목, 허리 등)
  musclePain: string[]; // 16. 3개월 이상 만성 근육 통증 부위 (승모근/목뒤, 등, 허리, 둔부, 종아리 등)
}

/** 평가 문항 메타정보 */
export interface RatingMetric {
  key: keyof Pick<
    SurveyResponse,
    | 'ratingOverall'
    | 'ratingTime'
    | 'ratingInstructor'
    | 'ratingRecommend'
    | 'ratingParticipateAgain'
    | 'ratingImprovement'
  >;
  label: string;
  shortLabel: string;
  average: number;
}

/** 집계 통계 모델 */
export interface SurveyStats {
  scheduleId: string;
  totalResponses: number;
  overallScore: number; // 5점 만점 평균
  positiveRate: number; // 4점 이상(만족/매우만족) 비율 (%)

  // 6개 문항 평가 요약
  metrics: RatingMetric[];

  // 기본 정보 통계
  workTypeDistribution: { name: string; value: number }[];
  genderDistribution: { name: string; value: number }[];
  ageDistribution: { name: string; value: number }[];
  locationDistribution: { name: string; value: number }[];

  // 건강 상태 통계 (빈도순)
  jointPainDistribution: { name: string; count: number; percentage: number }[];
  musclePainDistribution: { name: string; count: number; percentage: number }[];

  // 서술형 피드백 모음
  goodFeedbacks: string[];
  improveFeedbacks: string[];
  futureFeedbacks: string[];
}
