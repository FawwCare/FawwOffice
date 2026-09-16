import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { MOCK_SCHEDULES, getSchedulesByRole } from '@/data/mockSchedules';
import { MOCK_SURVEY_RESPONSES, calculateSurveyStats } from '@/data/mockSurveys';
import { SurveyScoreCards } from '@/components/survey/SurveyScoreCards';
import { RatingRadarChart } from '@/components/survey/RatingRadarChart';
import { DemographicsCharts } from '@/components/survey/DemographicsCharts';
import { HealthPainChart } from '@/components/survey/HealthPainChart';
import { FeedbackList } from '@/components/survey/FeedbackList';
import { ResponseTable } from '@/components/survey/ResponseTable';
import { exportSurveyToExcel } from '@/utils/excelExport';
import {
  Calendar,
  Building2,
  MapPin,
  Download,
  BarChart3,
  MessageSquareText,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { cn } from '@/utils/cn';

type ActiveTab = 'overview' | 'feedback' | 'raw';

export default function SurveyResultPage() {
  const { scheduleId: paramScheduleId } = useParams<{ scheduleId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // 사용자 권한에 따른 일정 목록 필터링
  const availableSchedules = useMemo(() => {
    if (!user) return [];
    return getSchedulesByRole(
      MOCK_SCHEDULES,
      user.role,
      user.companyId,
      user.instructorId
    );
  }, [user]);

  // 현재 선택된 일정 (파라미터 or 설문응답이 있는 첫 번째 일정 or 첫 일정)
  const currentSchedule = useMemo(() => {
    if (paramScheduleId) {
      const found = availableSchedules.find((s) => s.id === paramScheduleId);
      if (found) return found;
    }
    // 설문 응답이 있는 일정 우선 선택
    const withSurvey = availableSchedules.find((s) => MOCK_SURVEY_RESPONSES[s.id]?.length);
    return withSurvey || availableSchedules[0] || null;
  }, [paramScheduleId, availableSchedules]);

  // 현재 일정의 설문 응답 목록 & 통계
  const responses = useMemo(() => {
    if (!currentSchedule) return [];
    return MOCK_SURVEY_RESPONSES[currentSchedule.id] || [];
  }, [currentSchedule]);

  const stats = useMemo(() => {
    if (!currentSchedule) return null;
    return calculateSurveyStats(currentSchedule.id, responses);
  }, [currentSchedule, responses]);

  const handleSelectSchedule = (id: string) => {
    navigate(`/surveys/${id}`);
  };

  const handleExcelExport = () => {
    if (currentSchedule && responses.length > 0) {
      exportSurveyToExcel(currentSchedule, responses);
    }
  };

  if (!currentSchedule) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <div>
          <div className="mb-3 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <BarChart3 size={24} strokeWidth={1.75} />
          </div>
          <h2 className="text-base font-bold text-gray-800">조회 가능한 일정이 없습니다.</h2>
          <p className="text-xs text-gray-400 mt-1">배정된 일정이 등록되면 만족도 조사를 조회할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 pb-12">
      {/* 1. 상단 고정 헤더 & 일정 선택 셀렉터 */}
      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white px-5 py-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-[#e8f5ee] p-1.5 text-[#2d7a4f]">
                <BarChart3 size={20} />
              </span>
              <h1 className="text-lg font-bold text-gray-900">만족도 조사 결과 분석</h1>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              임직원 대상 설문 문항(1~16번) 실시간 취합 및 통계 리포트
            </p>
          </div>

          {/* 일정 선택 드롭다운 & 엑셀 다운로드 */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={currentSchedule.id}
              onChange={(e) => handleSelectSchedule(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 py-2 px-3 text-xs font-semibold text-gray-800 outline-none focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 max-w-xs truncate"
            >
              {availableSchedules.map((s) => {
                const count = MOCK_SURVEY_RESPONSES[s.id]?.length || 0;
                return (
                  <option key={s.id} value={s.id}>
                    [{s.clientCompanyName}] {s.title} ({count}명 응답)
                  </option>
                );
              })}
            </select>

            <button
              onClick={handleExcelExport}
              disabled={responses.length === 0}
              className="flex items-center gap-1.5 rounded-xl bg-[#2d7a4f] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1a4a2e] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={14} />
              엑셀 다운로드
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-5 space-y-5">
        {/* 2. 대상 일정 정보 배너 카드 */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-3">
            <div>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                {currentSchedule.serviceType || '헬스케어 프로그램'}
              </span>
              <h2 className="text-base font-bold text-gray-900 mt-1">{currentSchedule.title}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">총 설문 응답</span>
              <p className="text-xl font-extrabold text-[#2d7a4f]">{responses.length}명</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1.5 truncate">
              <Building2 size={14} className="text-gray-400" />
              <span>{currentSchedule.clientCompanyName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>
                {currentSchedule.date.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin size={14} className="text-gray-400" />
              <span className="truncate">{currentSchedule.location}</span>
            </div>
          </div>
        </div>

        {/* 응답이 없는 경우 안내 */}
        {responses.length === 0 || !stats ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="mb-3 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <FileText size={24} strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-bold text-gray-800">아직 등록된 만족도 설문 응답이 없습니다.</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              프로그램 진행 후 참가자분들이 만족도 조사 링크(QR)를 통해 제출하면 이곳에 실시간 차트와 통계가 분석되어 나타납니다.
            </p>
          </div>
        ) : (
          <>
            {/* 3. 탭 네비게이션 */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon={<BarChart3 size={16} />}
                label="종합 분석 리포트"
              />
              <TabButton
                active={activeTab === 'feedback'}
                onClick={() => setActiveTab('feedback')}
                icon={<MessageSquareText size={16} />}
                label={`서술형 피드백 (${stats.goodFeedbacks.length + stats.improveFeedbacks.length + stats.futureFeedbacks.length})`}
              />
              <TabButton
                active={activeTab === 'raw'}
                onClick={() => setActiveTab('raw')}
                icon={<FileSpreadsheet size={16} />}
                label={`개별 응답 목록 (${responses.length})`}
              />
            </div>

            {/* 4. 탭 콘텐츠 영역 (탭 전환 시 부드러운 블러 페이드) */}
            <div key={activeTab} className="animate-ios-fade">
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  {/* 4-1. KPI 스코어 카드 (총 응답, 평점, 만족율) */}
                  <SurveyScoreCards stats={stats} />

                  {/* 4-2. 레이더 차트 (6개 문항 분석) */}
                  <RatingRadarChart metrics={stats.metrics} />

                  {/* 4-3. 만성 통증 부위 분석 (질문 15, 16) */}
                  <HealthPainChart stats={stats} />

                  {/* 4-4. 응답자 인구통계 (근무형태, 성별, 연령, 지역) */}
                  <DemographicsCharts stats={stats} />
                </div>
              )}

              {activeTab === 'feedback' && (
                <div>
                  <FeedbackList stats={stats} />
                </div>
              )}

              {activeTab === 'raw' && (
                <div>
                  <ResponseTable schedule={currentSchedule} responses={responses} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition',
        active
          ? 'bg-[#2d7a4f] text-white shadow-sm'
          : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-800'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
