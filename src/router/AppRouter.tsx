import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';

// ─── AppRouter ────────────────────────────────────────────────
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 인증 필요 라우트 (Phase 3~에서 ProtectedRoute로 감쌀 예정) */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center text-center">
              <div>
                <h1 className="text-6xl font-extrabold text-gray-200">404</h1>
                <p className="mt-4 text-gray-500">페이지를 찾을 수 없습니다.</p>
                <a href="/" className="mt-6 inline-block text-[#2d7a4f] hover:underline">
                  홈으로 돌아가기
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
