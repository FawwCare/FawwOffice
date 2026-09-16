import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Leaf, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { UserRole } from '@/types/user.types';

const registerSchema = z
  .object({
    name: z.string().min(2, '이름을 2자 이상 입력해 주세요.'),
    email: z.string().email('올바른 이메일을 입력해 주세요.'),
    phone: z.string().regex(/^01[0-9]-?\d{3,4}-?\d{4}$/, '올바른 연락처를 입력해 주세요.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
    passwordConfirm: z.string(),
    role: z.enum(['INSTRUCTOR', 'CONTRACTOR', 'CLIENT'] as const),
    companyName: z.string().optional(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  })
  .refine(
    (d) => {
      if (d.role === 'CLIENT' || d.role === 'CONTRACTOR') return !!d.companyName;
      return true;
    },
    { message: '소속 기업명을 입력해 주세요.', path: ['companyName'] }
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

const ROLE_OPTIONS: { value: Exclude<UserRole, 'SUPER_ADMIN' | 'FAWW_STAFF'>; label: string; desc: string }[] = [
  { value: 'CLIENT', label: '기업 담당자 (원청)', desc: '헬스케어 프로그램을 신청한 기업의 담당자' },
  { value: 'CONTRACTOR', label: '도급 담당자', desc: '중개업체 소속 담당자' },
  { value: 'INSTRUCTOR', label: '강사', desc: '파우 소속 강사/트레이너' },
];

// ─── RegisterPage ─────────────────────────────────────────────
export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CLIENT' },
  });

  const selectedRole = watch('role');
  const needsCompany = selectedRole === 'CLIENT' || selectedRole === 'CONTRACTOR';

  const onSubmit = async (_data: RegisterFormValues) => {
    setIsLoading(true);
    setError('');
    try {
      // TODO: Firebase Auth 회원가입 연동
      await new Promise((r) => setTimeout(r, 1000));
    } catch {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* 로고 */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2d7a4f]">
            <Leaf size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">파우 오피스 회원가입</h1>
          <p className="text-sm text-gray-500">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-semibold text-[#2d7a4f] hover:underline">
              로그인
            </Link>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 space-y-5"
        >
          {/* 역할 선택 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              가입 유형 <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {ROLE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition',
                    selectedRole === opt.value
                      ? 'border-[#2d7a4f] bg-[#e8f5ee]'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register('role')}
                    className="mt-0.5 accent-[#2d7a4f]"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 이름 */}
          <InputField label="이름" required error={errors.name?.message}>
            <input type="text" placeholder="홍길동" {...register('name')} className={inputCls(!!errors.name)} />
          </InputField>

          {/* 이메일 */}
          <InputField label="이메일" required error={errors.email?.message}>
            <input type="email" placeholder="example@company.com" {...register('email')} className={inputCls(!!errors.email)} />
          </InputField>

          {/* 연락처 */}
          <InputField label="연락처" required error={errors.phone?.message}>
            <input type="tel" placeholder="010-0000-0000" {...register('phone')} className={inputCls(!!errors.phone)} />
          </InputField>

          {/* 소속 기업명 (조건부) */}
          {needsCompany && (
            <InputField label="소속 기업명" required error={errors.companyName?.message}>
              <input type="text" placeholder="(주)회사명" {...register('companyName')} className={inputCls(!!errors.companyName)} />
            </InputField>
          )}

          {/* 비밀번호 */}
          <InputField label="비밀번호" required error={errors.password?.message}>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="8자 이상"
                {...register('password')}
                className={cn(inputCls(!!errors.password), 'pr-11')}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </InputField>

          {/* 비밀번호 확인 */}
          <InputField label="비밀번호 확인" required error={errors.passwordConfirm?.message}>
            <input
              type="password"
              placeholder="비밀번호 재입력"
              {...register('passwordConfirm')}
              className={inputCls(!!errors.passwordConfirm)}
            />
          </InputField>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d7a4f] py-3.5 font-semibold text-white transition hover:bg-[#1a4a2e] disabled:opacity-60"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : '회원가입'}
          </button>

          <p className="text-center text-xs text-gray-400">
            파우 직원(실무자·관리자) 계정은 관리자에게 문의해 주세요.
          </p>
        </form>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    'w-full rounded-xl border px-4 py-3 text-sm outline-none transition',
    'focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20',
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
  );
}
