// 사용자 권한 레벨
export type UserRole =
  | 'SUPER_ADMIN'   // 파우 최고 관리자
  | 'FAWW_STAFF'    // 파우 내부 실무자
  | 'INSTRUCTOR'    // 강사
  | 'CONTRACTOR'    // 도급 담당자
  | 'CLIENT';       // 원청 기업 담당자

export interface User {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  role: UserRole;
  companyId?: string;     // CLIENT, CONTRACTOR용 소속 기업 ID
  instructorId?: string;  // INSTRUCTOR용 본인 ID
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
