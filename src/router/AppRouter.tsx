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
    <div className="flex min-h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
        </svg>
      </div>
      <h1 className="text-lg font-bold text-gray-800">{title}</h1>
      <p className="text-xs text-gray-400">준비 중인 기능입니다.</p>
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
