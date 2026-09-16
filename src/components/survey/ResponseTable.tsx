import { useState, useMemo } from 'react';
import type { SurveyResponse } from '@/types/survey.types';
import type { Schedule } from '@/types/schedule.types';
import { exportSurveyToExcel } from '@/utils/excelExport';
import { Download, Search, Table, Eye, X } from 'lucide-react';

interface ResponseTableProps {
  schedule: Schedule;
  responses: SurveyResponse[];
}

export function ResponseTable({ schedule, responses }: ResponseTableProps) {
  const [search, setSearch] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  const filtered = useMemo(() => {
    if (!search) return responses;
    const q = search.toLowerCase();
    return responses.filter(
      (r) =>
        r.respondentName.toLowerCase().includes(q) ||
        r.workLocation.toLowerCase().includes(q) ||
        r.workType.toLowerCase().includes(q) ||
        r.ageGroup.toLowerCase().includes(q)
    );
  }, [responses, search]);

  const handleExcelDownload = () => {
    exportSurveyToExcel(schedule, responses);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* 상단 액션바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Table size={18} className="text-[#2d7a4f]" />
            <h3 className="text-base font-bold text-gray-900">개별 응답 데이터</h3>
          </div>
          <p className="text-xs text-gray-400">총 {filtered.length}건 / 전체 {responses.length}건</p>
        </div>

        <div className="flex items-center gap-2">
          {/* 검색창 */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 지역, 근무형태..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-gray-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-[#2d7a4f] focus:ring-2 focus:ring-[#2d7a4f]/20 w-48"
            />
          </div>

          {/* 엑셀 다운로드 버튼 */}
          <button
            onClick={handleExcelDownload}
            className="flex items-center gap-1.5 rounded-xl bg-[#2d7a4f] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1a4a2e] transition active:scale-95"
          >
            <Download size={14} />
            엑셀 다운로드
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600 border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-semibold">
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">성함</th>
              <th className="py-2.5 px-3">근무형태</th>
              <th className="py-2.5 px-3">사업장/지역</th>
              <th className="py-2.5 px-3">성별/연령</th>
              <th className="py-2.5 px-3 text-center">종합만족</th>
              <th className="py-2.5 px-3 text-center">시간</th>
              <th className="py-2.5 px-3 text-center">강사</th>
              <th className="py-2.5 px-3 text-center">추천</th>
              <th className="py-2.5 px-3 text-center">재참여</th>
              <th className="py-2.5 px-3 text-center">개선</th>
              <th className="py-2.5 px-3 text-center">상세보기</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((res, index) => (
              <tr key={res.id} className="hover:bg-gray-50/80 transition">
                <td className="py-2.5 px-3 text-gray-400">{index + 1}</td>
                <td className="py-2.5 px-3 font-semibold text-gray-900">{res.respondentName}</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      res.workType === '교대근무자' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {res.workType}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-gray-600 truncate max-w-[140px]">{res.workLocation}</td>
                <td className="py-2.5 px-3 text-gray-500">{res.gender} · {res.ageGroup}</td>
                <td className="py-2.5 px-3 text-center font-bold text-[#2d7a4f]">{res.ratingOverall}</td>
                <td className="py-2.5 px-3 text-center">{res.ratingTime}</td>
                <td className="py-2.5 px-3 text-center">{res.ratingInstructor}</td>
                <td className="py-2.5 px-3 text-center">{res.ratingRecommend}</td>
                <td className="py-2.5 px-3 text-center">{res.ratingParticipateAgain}</td>
                <td className="py-2.5 px-3 text-center">{res.ratingImprovement}</td>
                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={() => setSelectedResponse(res)}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[11px] font-medium text-gray-600 hover:border-[#2d7a4f] hover:text-[#2d7a4f]"
                  >
                    <Eye size={12} />
                    보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 개별 응답 상세 모달 */}
      {selectedResponse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-modal-backdrop backdrop-blur-xs"
          onClick={(e) => e.target === e.currentTarget && setSelectedResponse(null)}
        >
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-modal-card border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h4 className="font-bold text-gray-900 text-base">
                {selectedResponse.respondentName} 님의 설문 응답 상세
              </h4>
              <button
                onClick={() => setSelectedResponse(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* 기본 정보 */}
              <div className="rounded-xl bg-gray-50 p-3 space-y-1.5">
                <p className="font-semibold text-gray-700 text-sm mb-1">[기본 정보]</p>
                <p><span className="text-gray-400">근무형태:</span> {selectedResponse.workType}</p>
                <p><span className="text-gray-400">직장/사업장:</span> {selectedResponse.workLocation}</p>
                <p><span className="text-gray-400">성별 및 연령:</span> {selectedResponse.gender} / {selectedResponse.ageGroup}</p>
              </div>

              {/* 만족도 평가 6항목 */}
              <div className="rounded-xl border border-gray-100 p-3 space-y-1.5">
                <p className="font-semibold text-gray-700 text-sm mb-1">[만족도 평가 - 5점 척도]</p>
                <div className="grid grid-cols-2 gap-2">
                  <p>6. 종합 만족도: <span className="font-bold text-[#2d7a4f]">{selectedResponse.ratingOverall}점</span></p>
                  <p>7. 프로그램 시간: <span className="font-bold">{selectedResponse.ratingTime}점</span></p>
                  <p>8. 강사 전문성: <span className="font-bold">{selectedResponse.ratingInstructor}점</span></p>
                  <p>9. 타인 추천 의향: <span className="font-bold">{selectedResponse.ratingRecommend}점</span></p>
                  <p>10. 향후 재참여: <span className="font-bold">{selectedResponse.ratingParticipateAgain}점</span></p>
                  <p>11. 전후 개선 체감: <span className="font-bold">{selectedResponse.ratingImprovement}점</span></p>
                </div>
              </div>

              {/* 통증 부위 */}
              <div className="rounded-xl bg-rose-50/50 border border-rose-100 p-3 space-y-1.5">
                <p className="font-semibold text-rose-800 text-sm mb-1">[만성 통증 체크 (3개월 이상)]</p>
                <p>
                  <span className="text-gray-500">15. 관절 통증:</span>{' '}
                  <span className="font-medium text-rose-700">
                    {selectedResponse.jointPain.length ? selectedResponse.jointPain.join(', ') : '없음'}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">16. 근육 통증:</span>{' '}
                  <span className="font-medium text-amber-700">
                    {selectedResponse.musclePain.length ? selectedResponse.musclePain.join(', ') : '없음'}
                  </span>
                </p>
              </div>

              {/* 서술형 피드백 */}
              <div className="space-y-2">
                <p className="font-semibold text-gray-700 text-sm">[서술형 피드백]</p>
                <div className="rounded-lg border border-gray-100 p-2.5 bg-gray-50/40">
                  <p className="text-[11px] font-semibold text-gray-500 mb-1">12. 가장 인상 깊거나 유익했던 점</p>
                  <p className="text-gray-800">{selectedResponse.feedbackGood || '(미작성)'}</p>
                </div>
                <div className="rounded-lg border border-gray-100 p-2.5 bg-gray-50/40">
                  <p className="text-[11px] font-semibold text-gray-500 mb-1">13. 보완 혹은 개선점</p>
                  <p className="text-gray-800">{selectedResponse.feedbackImprove || '(미작성)'}</p>
                </div>
                <div className="rounded-lg border border-gray-100 p-2.5 bg-gray-50/40">
                  <p className="text-[11px] font-semibold text-gray-500 mb-1">14. 추후 참여 희망 프로그램</p>
                  <p className="text-gray-800">{selectedResponse.feedbackFutureProgram || '(미작성)'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
