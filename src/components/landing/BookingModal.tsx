import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { sendBookingEmail } from '@/services/emailService';
import type { ServiceType } from '@/types/booking.types';
import { cn } from '@/utils/cn';
import { X, CheckCircle, Loader2 } from 'lucide-react';

// ─── 검증 스키마 ───────────────────────────────────────────────
const bookingSchema = z.object({
  name: z.string().min(2, '이름을 2자 이상 입력해 주세요.'),
  phone: z
    .string()
    .regex(/^01[0-9]-?\d{3,4}-?\d{4}$/, '올바른 연락처를 입력해 주세요.'),
  companyName: z.string().min(1, '소속 기업명을 입력해 주세요.'),
  email: z
    .string()
    .email('올바른 이메일을 입력해 주세요.')
    .optional()
    .or(z.literal('')),
  serviceType: z.enum(['근골격케어', '요가/명상', '멘탈코치'] as const),
  preferredDate: z.string().min(1, '희망 날짜를 선택해 주세요.'),
  preferredTime: z.string().min(1, '희망 시간을 입력해 주세요.'),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

// ─── 컴포넌트 Props ────────────────────────────────────────────
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceType;
}

const SERVICE_OPTIONS: ServiceType[] = ['근골격케어', '요가/명상', '멘탈코치'];

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

// ─── BookingModal 컴포넌트 ─────────────────────────────────────
export function BookingModal({ isOpen, onClose, initialService }: BookingModalProps) {
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: initialService ?? '근골격케어',
    },
  });

  const handleClose = () => {
    reset();
    setStatus('idle');
    onClose();
  };

  const onSubmit = async (data: BookingFormValues) => {
    setStatus('loading');
    try {
      await sendBookingEmail({
        ...data,
        email: data.email || undefined,
        message: data.message || undefined,
        submittedAt: new Date().toLocaleString('ko-KR'),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    // 배경 어두운 딤드 오버레이
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-modal-backdrop backdrop-blur-xs"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* 모달 카드 (완전 불투명한 순백색 카드) */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-modal-card border border-gray-100">
        {/* 헤더 */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 z-10">
          <h2 className="text-lg font-bold text-gray-900">서비스 예약 신청</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* 성공 화면 */}
        {status === 'success' ? (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <CheckCircle size={56} className="text-green-500" />
            <h3 className="text-xl font-bold text-gray-900">예약 신청이 완료되었습니다!</h3>
            <p className="text-gray-500">
              담당자가 확인 후 영업일 기준 1~2일 내에 연락드리겠습니다.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 rounded-xl bg-[#2d7a4f] px-8 py-3 font-semibold text-white transition hover:bg-[#1a4a2e]"
            >
              확인
            </button>
          </div>
        ) : (
          /* 폼 */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 py-6">
            {/* 희망 서비스 */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                희망 서비스 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {SERVICE_OPTIONS.map((svc) => (
                  <label key={svc} className="flex-1">
                    <input
                      type="radio"
                      value={svc}
                      {...register('serviceType')}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        'flex cursor-pointer items-center justify-center rounded-xl border-2 px-2 py-2.5 text-sm font-medium transition',
                        'border-gray-200 text-gray-600 hover:border-[#2d7a4f] hover:text-[#2d7a4f]',
                        'peer-checked:border-[#2d7a4f] peer-checked:bg-[#e8f5ee] peer-checked:text-[#2d7a4f]'
                      )}
                    >
                      {svc}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 이름 */}
            <Field label="이름" required error={errors.name?.message}>
              <input
                type="text"
                placeholder="홍길동"
                {...register('name')}
                className={inputClass(!!errors.name)}
              />
            </Field>

            {/* 연락처 */}
            <Field label="연락처" required error={errors.phone?.message}>
              <input
                type="tel"
                placeholder="010-0000-0000"
                {...register('phone')}
                className={inputClass(!!errors.phone)}
              />
            </Field>

            {/* 소속 기업명 */}
            <Field label="소속 기업명" required error={errors.companyName?.message}>
              <input
                type="text"
                placeholder="(주)파우헬스케어"
                {...register('companyName')}
                className={inputClass(!!errors.companyName)}
              />
            </Field>

            {/* 이메일 */}
            <Field label="이메일" error={errors.email?.message}>
              <input
                type="email"
                placeholder="example@company.com (선택)"
                {...register('email')}
                className={inputClass(!!errors.email)}
              />
            </Field>

            {/* 희망 날짜 + 시간 */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="희망 날짜" required error={errors.preferredDate?.message}>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('preferredDate')}
                  className={inputClass(!!errors.preferredDate)}
                />
              </Field>
              <Field label="희망 시간" required error={errors.preferredTime?.message}>
                <input
                  type="time"
                  {...register('preferredTime')}
                  className={inputClass(!!errors.preferredTime)}
                />
              </Field>
            </div>

            {/* 문의 내용 */}
            <Field label="문의 내용" error={errors.message?.message}>
              <textarea
                placeholder="프로그램 인원, 장소, 특이사항 등을 자유롭게 입력해 주세요."
                rows={4}
                {...register('message')}
                className={cn(inputClass(false), 'resize-none')}
              />
            </Field>

            {/* 에러 메시지 */}
            {status === 'error' && (
              <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
              </p>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d7a4f] py-3.5 font-semibold text-white transition hover:bg-[#1a4a2e] disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  전송 중...
                </>
              ) : (
                '예약 신청하기'
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              영업일 기준 1~2일 이내 담당자가 연락드립니다.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── 헬퍼 컴포넌트 ─────────────────────────────────────────────
interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, required, error, children }: FieldProps) {
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

function inputClass(hasError: boolean) {
  return cn(
    'w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition',
    'focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20',
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
  );
}
