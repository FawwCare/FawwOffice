import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import MySchedulesPage from '@/pages/MySchedulesPage';
import SurveyResultPage from '@/pages/SurveyResultPage';

// ─── 플레이스홀더 페이지 ────────────────────────────────────────
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-5xl">🚧</div>
      <h1 className="text-xl font-bold text-gray-700">{title}</h1>
      <p className="text-sm text-gray-400">이 페이지는 다음 Phase에서 구현됩니다.</p>
    </div>
  );
}

// ─── AppRouter ────────────────────────────────────────────────
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 인증 필요 라우트 — AppLayout으로 감쌈 */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-schedules" element={<MySchedulesPage />} />
          <Route path="/schedules/:id" element={<PlaceholderPage title="일정 상세" />} />
          <Route path="/surveys" element={<SurveyResultPage />} />
          <Route path="/surveys/:scheduleId" element={<SurveyResultPage />} />
          <Route path="/profile" element={<PlaceholderPage title="내 프로필" />} />
          <Route path="/admin" element={<PlaceholderPage title="관리자 페이지" />} />
          {/* /app 진입 시 대시보드로 리다이렉트 */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center text-center">
              <div>
                <h1 className="text-7xl font-extrabold text-gray-100">404</h1>
                <p className="mt-4 text-gray-500">페이지를 찾을 수 없습니다.</p>
                <a href="/" className="mt-6 inline-block font-semibold text-[#2d7a4f] hover:underline">
                  ← 홈으로 돌아가기
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
