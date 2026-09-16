import { Star, Users, ThumbsUp, Award } from 'lucide-react';
import type { SurveyStats } from '@/types/survey.types';

interface SurveyScoreCardsProps {
  stats: SurveyStats;
}

export function SurveyScoreCards({ stats }: SurveyScoreCardsProps) {
  // 최고 점수 항목 찾기
  const topMetric = stats.metrics.length > 0
    ? [...stats.metrics].sort((a, b) => b.average - a.average)[0]
    : null;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {/* 1. 종합 평점 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-amber-500 mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">종합 만족도</span>
          <Star size={20} className="fill-amber-400 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-gray-900">{stats.overallScore.toFixed(1)}</span>
          <span className="text-sm font-semibold text-gray-400">/ 5.0</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 font-medium">
          <div className="flex gap-0.5 text-[#2d7a4f]">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={12}
                className={s <= Math.round(stats.overallScore) ? 'fill-[#2d7a4f] text-[#2d7a4f]' : 'text-gray-200'}
              />
            ))}
          </div>
          <span className="text-gray-400 ml-1">5점 척도</span>
        </div>
      </div>

      {/* 2. 총 응답수 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-[#2d7a4f] mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">총 응답 인원</span>
          <Users size={20} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-gray-900">{stats.totalResponses}</span>
          <span className="text-sm font-semibold text-gray-400">명</span>
        </div>
        <p className="mt-2 text-xs text-emerald-600 font-medium">응답률 100% 정상 집계</p>
      </div>

      {/* 3. 긍정 평가 비율 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-blue-500 mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">만족 비율</span>
          <ThumbsUp size={20} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-gray-900">{stats.positiveRate}%</span>
        </div>
        <p className="mt-2 text-xs text-blue-600 font-medium">4점 이상(만족·매우만족)</p>
      </div>

      {/* 4. 최우수 평가 항목 */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-purple-500 mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">최우수 항목</span>
          <Award size={20} />
        </div>
        <div className="truncate text-base font-bold text-gray-900 mt-1">
          {topMetric ? topMetric.shortLabel : '-'}
        </div>
        <p className="mt-2 text-xs text-purple-600 font-semibold">
          평균 {topMetric ? topMetric.average.toFixed(2) : '0'}점 달성
        </p>
      </div>
    </div>
  );
}
