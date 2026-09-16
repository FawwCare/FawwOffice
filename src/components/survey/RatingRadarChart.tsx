import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { RatingMetric } from '@/types/survey.types';

interface RatingRadarChartProps {
  metrics: RatingMetric[];
}

export function RatingRadarChart({ metrics }: RatingRadarChartProps) {
  const chartData = metrics.map((m) => ({
    subject: m.shortLabel,
    fullName: m.label,
    score: m.average,
    fullMark: 5,
  }));

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">만족도 6개 항목 다각도 분석</h3>
          <p className="text-xs text-gray-400">5점 만점 척도 기준 각 평가 영역별 평균 점수</p>
        </div>
        <span className="rounded-full bg-[#e8f5ee] px-2.5 py-1 text-xs font-semibold text-[#2d7a4f]">
          평균 5.0 만점
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 레이더 차트 영역 */}
        <div className="h-72 w-full lg:col-span-6 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 5]}
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                tickCount={6}
              />
              <Tooltip
                formatter={(value: any) => [`${Number(value).toFixed(2)}점`, '평균 평점']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                }}
              />
              <Radar
                name="평균 평점"
                dataKey="score"
                stroke="#2d7a4f"
                fill="#2d7a4f"
                fillOpacity={0.45}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 우측 항목별 수치 바 리스트 */}
        <div className="lg:col-span-6 space-y-3">
          {metrics.map((m, idx) => {
            const percentage = (m.average / 5) * 100;
            return (
              <div key={m.key} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-700">
                    <span className="text-gray-400 mr-1.5">{idx + 6}번.</span>
                    {m.label}
                  </span>
                  <span className="font-bold text-[#2d7a4f] text-sm">{m.average.toFixed(2)}점</span>
                </div>
                {/* 프로그레스 바 */}
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#4ade80] to-[#2d7a4f] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
