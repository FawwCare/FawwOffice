import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SurveyStats } from '@/types/survey.types';

interface DemographicsChartsProps {
  stats: SurveyStats;
}

const PIE_COLORS_WORK = ['#2d7a4f', '#60a5fa', '#f59e0b'];
const PIE_COLORS_GENDER = ['#3b82f6', '#ec4899'];

export function DemographicsCharts({ stats }: DemographicsChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. 근무 형태 분포 (도넛 차트) */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-1">근무 형태 분포</h3>
        <p className="text-xs text-gray-400 mb-3">일근직 vs 교대근무자 비율</p>
        <div className="h-52 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.workTypeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value, percent }) => `${name} ${value}명 (${((percent ?? 0) * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {stats.workTypeDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS_WORK[index % PIE_COLORS_WORK.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value}명`, '응답 인원']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. 성별 분포 (도넛 차트) */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-1">성별 분포</h3>
        <p className="text-xs text-gray-400 mb-3">남성 및 여성 참가자 비율</p>
        <div className="h-52 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.genderDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value, percent }) => `${name} ${value}명 (${((percent ?? 0) * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {stats.genderDistribution.map((_, index) => (
                  <Cell key={`cell-gender-${index}`} fill={PIE_COLORS_GENDER[index % PIE_COLORS_GENDER.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value}명`, '응답 인원']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. 연령대 분포 (수직 바 차트) */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-1">연령대 분포</h3>
        <p className="text-xs text-gray-400 mb-3">연령대별 참여자 구성</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.ageDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: any) => [`${value}명`, '인원']} />
              <Bar dataKey="value" fill="#2d7a4f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. 사업장/지역 분포 (수평 바 차트) */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-1">직장 지역 및 명칭 분포</h3>
        <p className="text-xs text-gray-400 mb-3">소속 지사/사업장별 참가 현황</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={stats.locationDistribution}
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <XAxis type="number" allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fill: '#4b5563', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip formatter={(value: any) => [`${value}명`, '참가 인원']} />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
