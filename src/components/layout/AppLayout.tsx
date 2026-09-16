import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, BottomNav } from './Navigation';

/**
 * 인증된 사용자를 위한 공통 레이아웃
 * PC: 좌측 사이드바 + 우측 메인 콘텐츠
 * 모바일: 상단 메인 콘텐츠 + 하단 탭 바
 * 페이지 전환 시 0.3초 iOS 스타일 블러-투-클리어 애니메이션 적용
 */
export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* PC 사이드바 */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* 메인 콘텐츠 영역 (페이지 전환 시 부드러운 블러 페이드) */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <div key={location.pathname} className="min-h-full animate-ios-fade">
          <Outlet />
        </div>
      </main>

      {/* 모바일 하단 탭 바 */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
