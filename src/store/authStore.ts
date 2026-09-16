import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types/user.types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;

  // 액션
  setUser: (user: User | null) => void;
  setLoading: (v: boolean) => void;
  logout: () => void;

  // 개발용: 역할 전환 (테스트 목적)
  switchRole: (role: UserRole) => void;
}

/** 데모용 기본 유저 (실제 Firebase 연동 전) */
const DEMO_USER: User = {
  uid: 'demo-faww-staff',
  email: 'staff@faww.co.kr',
  displayName: '파우 실무자 (데모)',
  phone: '010-0000-0000',
  role: 'FAWW_STAFF',
  createdAt: new Date(),
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 개발 편의를 위해 기본적으로 로그인 상태로 시작
      user: DEMO_USER,
      isLoading: false,

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),

      switchRole: (role) => {
        const current = get().user;
        if (!current) return;

        const roleProfiles: Partial<Record<UserRole, Partial<User>>> = {
          SUPER_ADMIN: { uid: 'demo-admin', displayName: '최고관리자 (데모)', email: 'admin@faww.co.kr' },
          FAWW_STAFF: { uid: 'demo-faww-staff', displayName: '파우 실무자 (데모)', email: 'staff@faww.co.kr' },
          INSTRUCTOR: { uid: 'inst-001', displayName: '김지훈 트레이너 (데모)', email: 'instructor@faww.co.kr', instructorId: 'inst-001' },
          CLIENT: { uid: 'demo-client', displayName: '이미래 과장 (데모)', email: 'client@company.co.kr', companyId: 'comp-001' },
          CONTRACTOR: { uid: 'demo-contr', displayName: '도급 담당자 (데모)', email: 'contr@partner.co.kr', companyId: 'contr-001' },
        };

        set({
          user: {
            ...current,
            role,
            ...roleProfiles[role],
          } as User,
        });
      },
    }),
    {
      name: 'faww-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
