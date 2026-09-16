import emailjs from '@emailjs/browser';
import type { BookingEmailPayload } from '@/types/booking.types';

// EmailJS 설정 (환경변수에서 로드)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

/**
 * 예약 신청 이메일을 관리자에게 발송합니다.
 * EmailJS를 통해 클라이언트에서 직접 Gmail로 전송합니다.
 */
export async function sendBookingEmail(payload: BookingEmailPayload): Promise<void> {
  const templateParams = {
    to_email: 'mail.hon9g@gmail.com',
    from_name: payload.name,
    from_company: payload.companyName,
    from_phone: payload.phone,
    from_email: payload.email || '미입력',
    service_type: payload.serviceType,
    preferred_date: payload.preferredDate,
    preferred_time: payload.preferredTime,
    message: payload.message || '없음',
    submitted_at: payload.submittedAt,
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
}
