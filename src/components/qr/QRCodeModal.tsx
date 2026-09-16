import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, ExternalLink, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { Schedule } from '@/types/schedule.types';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule | null;
}

export function QRCodeModal({ isOpen, onClose, schedule }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !schedule) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(schedule.surveyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = schedule.surveyUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-modal-backdrop backdrop-blur-xs"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden animate-modal-card border border-gray-100">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-bold text-gray-900">만족도 조사 QR 코드</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* 일정 제목 */}
        <div className="px-6 pt-4">
          <p className="text-sm font-semibold text-[#2d7a4f] truncate">{schedule.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {schedule.date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </p>
        </div>

        {/* QR 코드 */}
        <div className="flex justify-center px-6 py-6">
          <div className="rounded-2xl border-4 border-[#e8f5ee] p-4 bg-white shadow-inner">
            <QRCodeSVG
              value={schedule.surveyUrl}
              size={200}
              fgColor="#1a4a2e"
              bgColor="#ffffff"
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* URL 표시 */}
        <div className="mx-6 mb-4 rounded-xl bg-gray-50 px-4 py-3">
          <p className="text-xs text-gray-400 mb-1">설문 링크</p>
          <p className="text-xs text-gray-700 break-all font-mono">{schedule.surveyUrl}</p>
        </div>

        {/* 버튼 그룹 */}
        <div className="grid grid-cols-2 gap-3 px-6 pb-6">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#2d7a4f] py-3 text-sm font-semibold text-[#2d7a4f] transition hover:bg-[#e8f5ee]"
          >
            {copied ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
                복사됨!
              </>
            ) : (
              <>
                <Copy size={16} />
                링크 복사
              </>
            )}
          </button>
          <a
            href={schedule.surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2d7a4f] py-3 text-sm font-semibold text-white transition hover:bg-[#1a4a2e]"
          >
            <ExternalLink size={16} />
            링크 열기
          </a>
        </div>
      </div>
    </div>
  );
}
