import { Outlet } from 'react-router-dom';
import { Sidebar, BottomNav } from './Navigation';

/**
 * 인증된 사용자를 위한 공통 레이아웃
 * PC: 좌측 사이드바 + 우측 메인 콘텐츠
 * 모바일: 상단 메인 콘텐츠 + 하단 탭 바
 */
export function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* PC 사이드바 */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* 모바일 하단 탭 바 */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
