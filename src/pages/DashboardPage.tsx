import { Leaf, Calendar, BarChart2, User, Settings } from 'lucide-react';

// ─── DashboardPage (임시 플레이스홀더) ────────────────────────
export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2d7a4f]">
        <Leaf size={32} className="text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">파우 오피스 대시보드</h1>
      <p className="text-gray-500">캘린더 & 일정 관리 화면이 여기에 구현됩니다.</p>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: <Calendar size={24} />, label: '내 일정' },
          { icon: <BarChart2 size={24} />, label: '만족도 결과' },
          { icon: <User size={24} />, label: '프로필' },
          { icon: <Settings size={24} />, label: '관리' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-6 text-gray-600"
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">Phase 3에서 구현 예정</p>
    </div>
  );
}
