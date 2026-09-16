import { useState } from 'react';
import type { SurveyStats } from '@/types/survey.types';
import { MessageSquare, Heart, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FeedbackListProps {
  stats: SurveyStats;
}

type FeedbackTab = 'good' | 'improve' | 'future';

export function FeedbackList({ stats }: FeedbackListProps) {
  const [activeTab, setActiveTab] = useState<FeedbackTab>('good');

  const tabs: { key: FeedbackTab; label: string; icon: React.ReactNode; count: number; badgeColor: string }[] = [
    {
      key: 'good',
      label: '유익했던 점 (Q12)',
      icon: <Heart size={15} className="text-rose-500" />,
      count: stats.goodFeedbacks.length,
      badgeColor: 'bg-rose-50 text-rose-700',
    },
    {
      key: 'improve',
      label: '보완 및 개선점 (Q13)',
      icon: <AlertCircle size={15} className="text-amber-500" />,
      count: stats.improveFeedbacks.length,
      badgeColor: 'bg-amber-50 text-amber-700',
    },
    {
      key: 'future',
      label: '희망 프로그램 (Q14)',
      icon: <Sparkles size={15} className="text-purple-500" />,
      count: stats.futureFeedbacks.length,
      badgeColor: 'bg-purple-50 text-purple-700',
    },
  ];

  const currentList =
    activeTab === 'good'
      ? stats.goodFeedbacks
      : activeTab === 'improve'
      ? stats.improveFeedbacks
      : stats.futureFeedbacks;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={18} className="text-[#2d7a4f]" />
        <div>
          <h3 className="text-base font-bold text-gray-900">임직원 서술형 피드백 의견 모음</h3>
          <p className="text-xs text-gray-400">참여자들의 생생한 목소리와 프로그램 개선 의견</p>
        </div>
      </div>

      {/* 탭 버튼 */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition',
              activeTab === tab.key
                ? 'bg-[#2d7a4f] text-white shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            )}
          >
            {tab.icon}
            {tab.label}
            <span
              className={cn(
                'ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                activeTab === tab.key ? 'bg-white/20 text-white' : tab.badgeColor
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 피드백 카드 그리드 */}
      {currentList.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-400">작성된 의견이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {currentList.map((text, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 transition hover:bg-white hover:border-[#2d7a4f]/30 hover:shadow-sm"
            >
              <div className="flex items-start gap-2">
                <span className="text-base flex-shrink-0">💬</span>
                <p className="text-xs text-gray-700 leading-relaxed break-words">{text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
