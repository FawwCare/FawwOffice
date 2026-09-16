import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SurveyStats } from '@/types/survey.types';
import { Activity } from 'lucide-react';

interface HealthPainChartProps {
  stats: SurveyStats;
}

export function HealthPainChart({ stats }: HealthPainChartProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Activity size={18} className="text-rose-500" />
        <h3 className="text-base font-bold text-gray-900">
          임직원 만성 통증 호소 부위 분석 (3개월 이상)
        </h3>
      </div>
      <p className="text-xs text-gray-400 mb-6">
        설문 질문 15, 16번 중복 응답 기반 — 향후 맞춤형 재활/케어 프로그램 편성 기초 자료
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. 관절 통증 부위 (수평 바) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              15. 만성 관절 통증 부위
            </h4>
            <span className="text-xs text-gray-400">중복 선택 응답</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={stats.jointPainDistribution}
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={70}
                  tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: any, _: any, item: any) => [
                    `${val}명 (${item.payload.percentage}%)`,
                    '호소 인원',
                  ]}
                />
                <Bar dataKey="count" fill="#f43f5e" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. 근육 통증 부위 (수평 바) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              16. 만성 근육 통증 부위
            </h4>
            <span className="text-xs text-gray-400">중복 선택 응답</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={stats.musclePainDistribution}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: any, _: any, item: any) => [
                    `${val}명 (${item.payload.percentage}%)`,
                    '호소 인원',
                  ]}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
