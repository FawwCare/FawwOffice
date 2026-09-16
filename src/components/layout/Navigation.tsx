import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { isFawwInternal, ROLE_LABELS } from '@/utils/permissions';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  CalendarDays,
  BarChart2,
  User,
  Settings,
  Leaf,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import type { UserRole } from '@/types/user.types';

// ─── 네비게이션 아이템 ──────────────────────────────────────────
interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: '홈', icon: <LayoutDashboard size={20} />, to: '/dashboard' },
  { label: '내 일정', icon: <CalendarDays size={20} />, to: '/my-schedules' },
  { label: '만족도 결과', icon: <BarChart2 size={20} />, to: '/surveys' },
  { label: '프로필', icon: <User size={20} />, to: '/profile' },
  { label: '관리', icon: <Settings size={20} />, to: '/admin', adminOnly: true },
];

// ─── Sidebar (PC) ──────────────────────────────────────────────
export function Sidebar() {
  const { user, logout, switchRole } = useAuthStore();
  const location = useLocation();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || (user && isFawwInternal(user.role))
  );

  const DEMO_ROLES: UserRole[] = ['SUPER_ADMIN', 'FAWW_STAFF', 'INSTRUCTOR', 'CLIENT', 'CONTRACTOR'];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-100 bg-white">
      {/* 로고 */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2d7a4f]">
          <Leaf size={18} className="text-white" />
        </div>
        <div>
          <div className="text-base font-bold text-gray-900">파우 오피스</div>
          <div className="text-xs text-gray-400">Faww Office</div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-[#e8f5ee] text-[#2d7a4f]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span className={isActive ? 'text-[#2d7a4f]' : 'text-gray-400'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 하단 유저 정보 */}
      <div className="border-t border-gray-100 px-3 py-4 space-y-2">
        {/* 개발용 역할 전환 */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex w-full items-center justify-between rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-medium text-amber-700"
          >
            <span>🛠 역할: {user ? ROLE_LABELS[user.role] : '-'}</span>
            <ChevronDown size={14} className={cn('transition', roleMenuOpen && 'rotate-180')} />
          </button>
          {roleMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden z-10">
              {DEMO_ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => { switchRole(role); setRoleMenuOpen(false); }}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-xs hover:bg-gray-50 transition',
                    user?.role === role ? 'text-[#2d7a4f] font-bold bg-[#e8f5ee]' : 'text-gray-700'
                  )}
                >
                  {ROLE_LABELS[role]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 유저 카드 */}
        {user && (
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-gray-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2d7a4f] text-white text-xs font-bold flex-shrink-0">
              {user.displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{user.displayName}</p>
              <p className="truncate text-xs text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
              title="로그아웃"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── BottomNav (모바일) ─────────────────────────────────────────
export function BottomNav() {
  const { user } = useAuthStore();
  const location = useLocation();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || (user && isFawwInternal(user.role))
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-gray-200 bg-white/95 backdrop-blur">
      {visibleItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition',
              isActive ? 'text-[#2d7a4f]' : 'text-gray-400 hover:text-gray-700'
            )}
          >
            <span className={cn('transition', isActive && 'scale-110')}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
