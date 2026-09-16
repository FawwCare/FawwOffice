import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Leaf, Eye, EyeOff, Loader2, Calendar, BarChart2, ShieldCheck, Smartphone } from 'lucide-react';
import { cn } from '@/utils/cn';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해 주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── LoginPage ────────────────────────────────────────────────
export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (_data: LoginFormValues) => {
    setIsLoading(true);
    setError('');
    try {
      // TODO: Firebase Auth 연동
      await new Promise((r) => setTimeout(r, 1000));
      // navigate('/dashboard');
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 좌측 브랜드 패널 (데스크탑) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-[#1a4a2e] p-12 text-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <Leaf size={28} className="text-white" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight">파우 오피스</span>
        </div>
        <p className="text-center text-lg text-white/70 max-w-xs leading-relaxed">
          원청·도급·파우 실무자가 하나의 플랫폼에서 일정과 결과를 공유합니다.
        </p>
        <div className="mt-12 w-full max-w-sm rounded-2xl bg-white/10 p-6 backdrop-blur border border-white/10">
          <div className="space-y-3.5 text-sm text-white/85">
            {[
              { icon: <Calendar size={16} className="text-[#4ade80]" />, text: '구글 캘린더 연동 일정 관리' },
              { icon: <BarChart2 size={16} className="text-[#4ade80]" />, text: '실시간 만족도 조사 결과' },
              { icon: <ShieldCheck size={16} className="text-[#4ade80]" />, text: '역할별 권한 분리 및 보안' },
              { icon: <Smartphone size={16} className="text-[#4ade80]" />, text: '모바일 최적화 (PWA 지원)' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2.5">
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 우측 로그인 폼 */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* 모바일 로고 */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2d7a4f]">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">파우 오피스</span>
        </div>

        <div className="w-full max-w-md">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">로그인</h2>
          <p className="mb-8 text-sm text-gray-500">
            계정이 없으신가요?{' '}
            <Link to="/register" className="font-semibold text-[#2d7a4f] hover:underline">
              회원가입
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* 이메일 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">이메일</label>
              <input
                type="email"
                placeholder="example@company.com"
                {...register('email')}
                className={cn(
                  'w-full rounded-xl border px-4 py-3 text-sm outline-none transition',
                  'focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20',
                  errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                )}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">비밀번호</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="비밀번호 입력"
                  {...register('password')}
                  className={cn(
                    'w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition',
                    'focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20',
                    errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* 비밀번호 찾기 */}
            <div className="flex justify-end">
              <button type="button" className="text-xs text-gray-400 hover:text-gray-600">
                비밀번호를 잊으셨나요?
              </button>
            </div>

            {/* 에러 */}
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">{error}</p>
            )}

            {/* 제출 */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d7a4f] py-3.5 font-semibold text-white transition hover:bg-[#1a4a2e] disabled:opacity-60"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : '로그인'}
            </button>
          </form>

          {/* 구분선 */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400">또는</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* 홈으로 */}
          <Link
            to="/"
            className="flex w-full items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
