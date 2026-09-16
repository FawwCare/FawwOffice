import type { UserRole } from '@/types/user.types';

/**
 * 역할별 접근 권한 매트릭스
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 5,
  FAWW_STAFF: 4,
  INSTRUCTOR: 3,
  CONTRACTOR: 2,
  CLIENT: 1,
};

/**
 * 주어진 역할이 최소 요구 역할 이상의 권한을 가지는지 확인
 */
export function hasMinRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * 파우 내부 구성원 여부 (실무자 이상)
 */
export function isFawwInternal(role: UserRole): boolean {
  return hasMinRole(role, 'FAWW_STAFF');
}

/**
 * 관리자 여부
 */
export function isAdmin(role: UserRole): boolean {
  return hasMinRole(role, 'SUPER_ADMIN');
}

/**
 * 강사 여부
 */
export function isInstructor(role: UserRole): boolean {
  return role === 'INSTRUCTOR';
}

/**
 * 외부 기업 담당자 여부 (원청 or 도급)
 */
export function isExternalClient(role: UserRole): boolean {
  return role === 'CLIENT' || role === 'CONTRACTOR';
}

/**
 * 역할별 한국어 표시명
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: '최고 관리자',
  FAWW_STAFF: '파우 실무자',
  INSTRUCTOR: '강사',
  CONTRACTOR: '도급 담당자',
  CLIENT: '기업 담당자',
};
